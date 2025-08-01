import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  NgIterable,
  NgZone,
  OnDestroy,
  Renderer2,
  TrackByFunction,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  output,
  viewChild,
  signal,
  untracked,
  ChangeDetectorRef,
  afterNextRender
} from '@angular/core';
import { EMPTY, Subject, fromEvent, interval, merge, timer } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { IS_BROWSER } from '../symbols';
import {
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselOutlet,
  NguCarouselPrevDirective
} from '../ngu-carousel.directive';
import {
  Breakpoints,
  NguCarouselConfig,
  NguCarouselOutletContext,
  NguCarouselStore,
  Transfrom
} from './ngu-carousel';
import { NguCarouselHammerManager } from './ngu-carousel-hammer-manager';
import { NguWindowScrollListener } from './ngu-window-scroll-listener';

type DirectionSymbol = '' | '-';

type NguCarouselDataSource<T, U> = (U & NgIterable<T>) | null | undefined;

// This will be provided through Terser global definitions by Angular CLI.
// This is how Angular does tree-shaking internally.
declare const ngDevMode: boolean;

const NG_DEV_MODE = typeof ngDevMode === 'undefined' || ngDevMode;

@Component({
  selector: 'ngu-carousel',
  templateUrl: 'ngu-carousel.component.html',
  styleUrls: ['ngu-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NguCarouselHammerManager],
  imports: [NguCarouselOutlet]
})
export class NguCarousel<T, U extends NgIterable<T> = NgIterable<T>>
  extends NguCarouselStore
  implements OnDestroy
{
  private _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _renderer = inject(Renderer2);
  private _differs = inject(IterableDiffers);
  private _isBrowser = inject(IS_BROWSER);
  private _ngZone = inject(NgZone);
  private _nguWindowScrollListener = inject(NguWindowScrollListener);
  private _nguCarouselHammerManager = inject(NguCarouselHammerManager);
  private _cdr = inject(ChangeDetectorRef);
  /** Public property that may be accessed outside of the component. */
  readonly activePoint = signal(0);
  readonly pointNumbers = signal<number[]>([]);

  readonly inputs = input.required<NguCarouselConfig>();
  readonly carouselLoad = output<number>();
  readonly onMove = output<this>();

  private _defDirectives = contentChildren(NguCarouselDefDirective);

  private _nodeOutlet = viewChild.required(NguCarouselOutlet);

  readonly nextButton = contentChild(NguCarouselNextDirective, { read: ElementRef });
  readonly prevButton = contentChild(NguCarouselPrevDirective, { read: ElementRef });

  readonly carouselMain1 = viewChild.required('ngucarousel', { read: ElementRef });
  readonly _nguItemsContainer = viewChild.required('nguItemsContainer', { read: ElementRef });
  readonly _touchContainer = viewChild.required('touchContainer', { read: ElementRef });

  private _arrayChanges: IterableChanges<T> | null = null;

  readonly dataSource = input.required({
    transform: (v: NguCarouselDataSource<T, U>) => v || ([] as never)
  });

  private _intervalController$ = new Subject<number>();

  private _hammer: HammerManager | null = null;

  private _withAnimation = true;

  private _directionSymbol: DirectionSymbol;

  private _carouselCssNode: HTMLStyleElement;

  private _dataDiffer: IterableDiffer<T>;

  private _styleid: string;

  private _pointIndex: number;

  private _destroy$ = new Subject<void>();

  /**
   * Tracking function that will be used to check the differences in data changes. Used similarly
   * to `ngFor` `trackBy` function. Optimize Items operations by identifying a Items based on its data
   * relative to the function to know if a Items should be added/removed/moved.
   * Accepts a function that takes two parameters, `index` and `item`.
   */
  readonly trackBy = input<TrackByFunction<T>>();
  readonly _trackByFn = computed(() => {
    const fn = this.trackBy();
    if (NG_DEV_MODE && fn != null && typeof fn !== 'function' && console?.warn) {
      console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}.`);
    }
    return fn || ((index: number, item: T) => item);
  });

  constructor() {
    super();
    this._dataDiffer = this._differs.find([]).create(this._trackByFn())!;

    afterNextRender({
      earlyRead: () => true,
      write: () => {
        this._inputValidation();

        this._carouselCssNode = this._createStyleElem();

        if (this._isBrowser) {
          this._carouselInterval();
          if (!this.vertical.enabled && this.inputs()?.touch) {
            this._setupHammer();
          }
          this._setupWindowResizeListener();
          this._onWindowScrolling();
        }
      }
    });

    effect(() => {
      const _ = this._defDirectives();
      const data = this.dataSource();
      untracked(() => this._checkChanges(data));
    });

    effect(cleanup => {
      const prevButton = this.prevButton();
      untracked(() => {
        if (prevButton) {
          const preSub = fromEvent(prevButton.nativeElement, 'click')
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => this._carouselScrollOne(0));
          cleanup(() => preSub.unsubscribe());
        }
      });
    });

    effect(cleanup => {
      const nextButton = this.nextButton();
      untracked(() => {
        if (nextButton) {
          const nextSub = fromEvent(nextButton.nativeElement, 'click')
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => this._carouselScrollOne(1));
          cleanup(() => nextSub.unsubscribe());
        }
      });
    });
  }

  private _checkChanges(data: NguCarouselDataSource<T, U>) {
    // if (this.ngu_dirty) {
    //   this.ngu_dirty = false;
    //   const dataStream = this.dataSource;
    //   if (!this._arrayChanges && !!dataStream) {
    //     this._dataDiffer = this._differs
    //       .find(dataStream)
    //       .create((index: number, item: any) => this._trackByFn()(index, item))!;
    //   }
    // }
    // if (this._dataDiffer) {
    //   this._arrayChanges =
    //     this._markedForCheck && this._arrayChanges
    //       ? this._arrayChanges
    //       : this._dataDiffer.diff(this.dataSource)!;
    //   if (this._arrayChanges) {
    //     this.renderNodeChanges(Array.from(this.dataSource()));
    //   }
    // }
    this._arrayChanges = this._dataDiffer.diff(data);
    if (this._arrayChanges) {
      this.renderNodeChanges(Array.from(data as any));
    }
  }

  private renderNodeChanges(data: any[]) {
    if (!this._arrayChanges) return;
    this.isLast.set(this._pointIndex === this.currentSlide);
    const viewContainer = this._nodeOutlet().viewContainer;
    // this._markedForCheck = false;
    this._arrayChanges.forEachOperation(
      (
        item: IterableChangeRecord<any>,
        adjustedPreviousIndex: number | null,
        currentIndex: number | null
      ) => {
        const node = this._getNodeDef(data[currentIndex!], currentIndex!);
        if (node?.template) {
          if (item.previousIndex == null) {
            const context = new NguCarouselOutletContext<any>(data[currentIndex!]);
            context.index = currentIndex!;
            viewContainer.createEmbeddedView(node.template, context, currentIndex!);
          } else if (currentIndex == null) {
            viewContainer.remove(adjustedPreviousIndex!);
          } else {
            const view = viewContainer.get(adjustedPreviousIndex!);
            viewContainer.move(view!, currentIndex);
          }
        }
      }
    );
    this._updateItemIndexContext();

    if (this._host.nativeElement) {
      this._storeCarouselData();
    }
  }

  /**
   * Updates the index-related context for each row to reflect any changes in the index of the rows,
   * e.g. first/last/even/odd.
   */
  private _updateItemIndexContext() {
    const viewContainer = this._nodeOutlet().viewContainer;
    for (let renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
      const viewRef = viewContainer.get(renderIndex) as any;
      const context = viewRef.context as any;
      context.count = count;
      context.first = renderIndex === 0;
      context.last = renderIndex === count - 1;
      context.even = renderIndex % 2 === 0;
      context.odd = !context.even;
      context.index = renderIndex;
    }
  }

  private _getNodeDef(data: any, i: number): NguCarouselDefDirective<any> | undefined {
    if (this._defDirectives()?.length === 1) {
      return this._defDirectives()[0];
    }

    const nodeDef: NguCarouselDefDirective<any> | undefined = (this._defDirectives() || []).find(
      def => !!def.when?.(i, data)
    );

    return nodeDef;
  }

  private _inputValidation() {
    const inputs = this.inputs();
    inputs.gridBreakpoints = inputs.gridBreakpoints ? inputs.gridBreakpoints : new Breakpoints();
    if (inputs.grid.xl === undefined) {
      inputs.grid.xl = inputs.grid.lg;
    }

    this.type = inputs.grid.all !== 0 ? 'fixed' : 'responsive';
    this.loop = inputs.loop || false;
    inputs.easing = inputs.easing || 'cubic-bezier(0, 0, 0.2, 1)';
    this.touch.active = inputs.touch || false;
    this.RTL = inputs.RTL ? true : false;
    this.interval = inputs.interval || undefined;
    this.velocity = typeof inputs.velocity === 'number' ? inputs.velocity : this.velocity;

    if (inputs.vertical && inputs.vertical.enabled) {
      this.vertical.enabled = inputs.vertical.enabled;
      this.vertical.height = inputs.vertical.height;
    }
    this._directionSymbol = this.RTL ? '' : '-';
    this.point =
      inputs.point && typeof inputs.point.visible !== 'undefined' ? inputs.point.visible : true;

    this._carouselSize();
  }

  ngOnDestroy() {
    this._hammer?.destroy();
    this._destroy$.next();
  }

  /** Get Touch input */
  private _setupHammer(): void {
    // Note: doesn't need to unsubscribe because streams are piped with `takeUntil` already.
    this._nguCarouselHammerManager
      .createHammer(this._touchContainer().nativeElement)
      .subscribe(hammer => {
        this._hammer = hammer;

        hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

        this._nguCarouselHammerManager.on(hammer, 'panstart').subscribe(() => {
          this.carouselWidth = this._nguItemsContainer().nativeElement.offsetWidth;
          this.touchTransform = this.transform[this.deviceType!]!;
          this.dexVal = 0;
          this._setStyle(this._nguItemsContainer().nativeElement, 'transition', '');
        });

        if (this.vertical.enabled) {
          this._nguCarouselHammerManager.on(hammer, 'panup').subscribe((ev: any) => {
            this._touchHandling('panleft', ev);
          });

          this._nguCarouselHammerManager.on(hammer, 'pandown').subscribe((ev: any) => {
            this._touchHandling('panright', ev);
          });
        } else {
          this._nguCarouselHammerManager.on(hammer, 'panleft').subscribe((ev: any) => {
            this._touchHandling('panleft', ev);
          });

          this._nguCarouselHammerManager.on(hammer, 'panright').subscribe((ev: any) => {
            this._touchHandling('panright', ev);
          });
        }

        this._nguCarouselHammerManager.on(hammer, 'panend pancancel').subscribe(({ velocity }) => {
          if (Math.abs(velocity) >= this.velocity) {
            this.touch.velocity = velocity;
            let direc = 0;
            if (!this.RTL) {
              direc = this.touch.swipe === 'panright' ? 0 : 1;
            } else {
              direc = this.touch.swipe === 'panright' ? 1 : 0;
            }
            this._carouselScrollOne(direc);
          } else {
            this.dexVal = 0;
            this._setStyle(
              this._nguItemsContainer().nativeElement,
              'transition',
              'transform 324ms cubic-bezier(0, 0, 0.2, 1)'
            );
            this._setStyle(this._nguItemsContainer().nativeElement, 'transform', '');
          }
        });

        this._nguCarouselHammerManager.on(hammer, 'hammer.input').subscribe(({ srcEvent }) => {
          // allow nested touch events to no propagate, this may have other side affects but works for now.
          // TODO: It is probably better to check the source element of the event and only apply the handle to the correct carousel
          srcEvent.stopPropagation();
        });
      });
  }

  /** handle touch input */
  private _touchHandling(e: string, ev: any): void {
    // vertical touch events seem to cause to panstart event with an odd delta
    // and a center of {x:0,y:0} so this will ignore them
    if (ev.center.x === 0) {
      return;
    }

    ev = Math.abs(this.vertical.enabled ? ev.deltaY : ev.deltaX);
    let valt = ev - this.dexVal;
    valt =
      this.type === 'responsive'
        ? (Math.abs(ev - this.dexVal) /
            (this.vertical.enabled ? this.vertical.height : this.carouselWidth)) *
          100
        : valt;
    this.dexVal = ev;
    this.touch.swipe = e;
    this._setTouchTransfrom(e, valt);
    this._setTransformFromTouch();
  }

  private _setTouchTransfrom(e: string, valt: number) {
    const condition = this.RTL ? 'panright' : 'panleft';
    this.touchTransform = e === condition ? valt + this.touchTransform : this.touchTransform - valt;
  }

  private _setTransformFromTouch() {
    if (this.touchTransform < 0) {
      this.touchTransform = 0;
    }
    const type = this.type === 'responsive' ? '%' : 'px';
    this._setStyle(
      this._nguItemsContainer().nativeElement,
      'transform',
      this.vertical.enabled
        ? `translate3d(0, ${this._directionSymbol}${this.touchTransform}${type}, 0)`
        : `translate3d(${this._directionSymbol}${this.touchTransform}${type}, 0, 0)`
    );
  }

  /** this fn used to disable the interval when it is not on the viewport */
  private _onWindowScrolling(): void {
    const { offsetTop, offsetHeight } = this._host.nativeElement;
    const { scrollY: windowScrollY, innerHeight: windowInnerHeight } = window;

    const isCarouselOnScreen =
      offsetTop <= windowScrollY + windowInnerHeight - offsetHeight / 4 &&
      offsetHeight + offsetHeight / 2 >= windowScrollY;

    if (isCarouselOnScreen) {
      this._intervalController$.next(1);
    } else {
      this._intervalController$.next(0);
    }
  }

  /** store data based on width of the screen for the carousel */
  private _storeCarouselData(): void {
    const inputs = this.inputs();
    const breakpoints = this.inputs().gridBreakpoints;
    this.deviceWidth = this._isBrowser ? window.innerWidth : breakpoints?.xl!;

    this.carouselWidth = this.carouselMain1().nativeElement.offsetWidth;

    if (this.type === 'responsive') {
      this.deviceType =
        this.deviceWidth >= breakpoints?.xl!
          ? 'xl'
          : this.deviceWidth >= breakpoints?.lg!
            ? 'lg'
            : this.deviceWidth >= breakpoints?.md!
              ? 'md'
              : this.deviceWidth >= breakpoints?.sm!
                ? 'sm'
                : 'xs';

      this.items = inputs.grid[this.deviceType]!;
      this.itemWidth = this.carouselWidth / this.items;
    } else {
      this.items = Math.trunc(this.carouselWidth / inputs.grid.all);
      this.itemWidth = inputs.grid.all;
      this.deviceType = 'all';
    }

    this.slideItems = +(inputs.slide! < this.items ? inputs.slide! : this.items);
    this.load = inputs.load! >= this.slideItems ? inputs.load! : this.slideItems;
    this.speed = inputs.speed && inputs.speed > -1 ? inputs.speed : 400;
    this._carouselPoint();
  }

  /** Used to reset the carousel */
  public reset(withoutAnimation?: boolean): void {
    withoutAnimation && (this._withAnimation = false);
    this._carouselCssNode.textContent = '';
    this.moveTo(0);
    this._carouselPoint();
  }

  /** Init carousel point */
  private _carouselPoint(): void {
    const Nos = Array.from(this.dataSource()).length - (this.items - this.slideItems);
    this._pointIndex = Math.ceil(Nos / this.slideItems);
    const pointers: number[] = [];

    if (this._pointIndex > 1 || !this.inputs().point?.hideOnSingleSlide) {
      for (let i = 0; i < this._pointIndex; i++) {
        pointers.push(i);
      }
    }
    this.pointNumbers.set(pointers);

    this._carouselPointActiver();
    if (this._pointIndex <= 1) {
      this._btnBoolean(1, 1);
    } else {
      if (this.currentSlide === 0 && !this.loop) {
        this._btnBoolean(1, 0);
      } else {
        this._btnBoolean(0, 0);
      }
    }
  }

  /** change the active point in carousel */
  private _carouselPointActiver(): void {
    const i = Math.ceil(this.currentSlide / this.slideItems);
    this.activePoint.set(i);
  }

  /** this function is used to scoll the carousel when point is clicked */
  public moveTo(slide: number, withoutAnimation?: boolean) {
    // slide = slide - 1;
    withoutAnimation && (this._withAnimation = false);
    if (this.activePoint() !== slide && slide < this._pointIndex) {
      let slideremains;
      const btns = this.currentSlide < slide ? 1 : 0;

      switch (slide) {
        case 0:
          this._btnBoolean(1, 0);
          slideremains = slide * this.slideItems;
          break;
        case this._pointIndex - 1:
          this._btnBoolean(0, 1);
          slideremains = Array.from(this.dataSource()).length - this.items;
          break;
        default:
          this._btnBoolean(0, 0);
          slideremains = slide * this.slideItems;
      }
      this._carouselScrollTwo(btns, slideremains, this.speed);
    }
  }

  /** set the style of the carousel based the inputs data */
  private _carouselSize(): void {
    const inputs = this.inputs();
    this.token = this._generateID();
    let dism = '';
    this._styleid = `.${this.token} > .ngucarousel > .ngu-container > .ngu-touch-container > .ngucarousel-items`;

    if (inputs.custom === 'banner') {
      this._renderer.addClass(this._host.nativeElement, 'banner');
    }

    if (inputs.animation === 'lazy') {
      dism += `${this._styleid} > .item {transition: transform .6s ease;}`;
    }

    const breakpoints = inputs.gridBreakpoints;

    let itemStyle = '';
    if (this.vertical.enabled) {
      const itemWidthXS = `${this._styleid} > .item {height: ${
        this.vertical.height / +inputs.grid.xs
      }px}`;
      const itemWidthSM = `${this._styleid} > .item {height: ${
        this.vertical.height / +inputs.grid.sm
      }px}`;
      const itemWidthMD = `${this._styleid} > .item {height: ${
        this.vertical.height / +inputs.grid.md
      }px}`;
      const itemWidthLG = `${this._styleid} > .item {height: ${
        this.vertical.height / +inputs.grid.lg
      }px}`;
      const itemWidthXL = `${this._styleid} > .item {height: ${
        this.vertical.height / +inputs.grid.xl!
      }px}`;

      itemStyle = `@media (max-width:${breakpoints?.sm! - 1}px){${itemWidthXS}}
                    @media (max-width:${breakpoints?.sm}px){${itemWidthSM}}
                    @media (min-width:${breakpoints?.md}px){${itemWidthMD}}
                    @media (min-width:${breakpoints?.lg}px){${itemWidthLG}}
                    @media (min-width:${breakpoints?.xl}px){${itemWidthXL}}`;
    } else if (this.type === 'responsive') {
      const itemWidthXS =
        inputs.type === 'mobile'
          ? `${this._styleid} .item {flex: 0 0 ${95 / +inputs.grid.xs}%; width: ${
              95 / +inputs.grid.xs
            }%;}`
          : `${this._styleid} .item {flex: 0 0 ${100 / +inputs.grid.xs}%; width: ${
              100 / +inputs.grid.xs
            }%;}`;

      const itemWidthSM = `${this._styleid} > .item {flex: 0 0 ${100 / +inputs.grid.sm}%; width: ${
        100 / +inputs.grid.sm
      }%}`;
      const itemWidthMD = `${this._styleid} > .item {flex: 0 0 ${100 / +inputs.grid.md}%; width: ${
        100 / +inputs.grid.md
      }%}`;
      const itemWidthLG = `${this._styleid} > .item {flex: 0 0 ${100 / +inputs.grid.lg}%; width: ${
        100 / +inputs.grid.lg
      }%}`;
      const itemWidthXL = `${this._styleid} > .item {flex: 0 0 ${100 / +inputs.grid.xl!}%; width: ${
        100 / +inputs.grid.xl!
      }%}`;

      itemStyle = `@media (max-width:${breakpoints?.sm! - 1}px){${itemWidthXS}}
                    @media (min-width:${breakpoints?.sm}px){${itemWidthSM}}
                    @media (min-width:${breakpoints?.md}px){${itemWidthMD}}
                    @media (min-width:${breakpoints?.lg}px){${itemWidthLG}}
                    @media (min-width:${breakpoints?.xl}px){${itemWidthXL}}`;
    } else {
      itemStyle = `${this._styleid} .item {flex: 0 0 ${inputs.grid.all}px; width: ${inputs.grid.all}px;}`;
    }

    this._renderer.addClass(this._host.nativeElement, this.token);
    if (this.vertical.enabled) {
      this._renderer.addClass(this._nguItemsContainer().nativeElement, 'nguvertical');
      this._renderer.setStyle(
        this.carouselMain1().nativeElement,
        'height',
        `${this.vertical.height}px`
      );
    }

    this.RTL &&
      !this.vertical.enabled &&
      this._renderer.addClass(this._host.nativeElement, 'ngurtl');
    this._createStyleElem(`${dism} ${itemStyle}`);
    this._storeCarouselData();
  }

  /** logic to scroll the carousel step 1 */
  private _carouselScrollOne(Btn: number): void {
    let itemSpeed = this.speed;
    let currentSlide = 0;
    let touchMove = Math.ceil(this.dexVal / this.itemWidth);
    touchMove = isFinite(touchMove) ? touchMove : 0;
    this._setStyle(this._nguItemsContainer().nativeElement, 'transform', '');

    if (this._pointIndex === 1) {
      return;
    } else if (Btn === 0 && ((!this.loop && !this.isFirst()) || this.loop)) {
      const currentSlideD = this.currentSlide - this.slideItems;
      const MoveSlide = currentSlideD + this.slideItems;
      this._btnBoolean(0, 1);
      if (this.currentSlide === 0) {
        currentSlide = Array.from(this.dataSource()).length - this.items;
        itemSpeed = 400;
        this._btnBoolean(0, 1);
      } else if (this.slideItems >= MoveSlide) {
        currentSlide = 0;
        this._btnBoolean(1, 0);
      } else {
        this._btnBoolean(0, 0);
        if (touchMove > this.slideItems) {
          currentSlide = this.currentSlide - touchMove;
          itemSpeed = 200;
        } else {
          currentSlide = this.currentSlide - this.slideItems;
        }
      }
      this._carouselScrollTwo(Btn, currentSlide, itemSpeed);
    } else if (Btn === 1 && ((!this.loop && !this.isLast()) || this.loop)) {
      if (
        Array.from(this.dataSource()).length <= this.currentSlide + this.items + this.slideItems &&
        !this.isLast()
      ) {
        currentSlide = Array.from(this.dataSource()).length - this.items;
        this._btnBoolean(0, 1);
      } else if (this.isLast()) {
        currentSlide = 0;
        itemSpeed = 400;
        this._btnBoolean(1, 0);
      } else {
        this._btnBoolean(0, 0);
        if (touchMove > this.slideItems) {
          currentSlide = this.currentSlide + this.slideItems + (touchMove - this.slideItems);
          itemSpeed = 200;
        } else {
          currentSlide = this.currentSlide + this.slideItems;
        }
      }
      this._carouselScrollTwo(Btn, currentSlide, itemSpeed);
    }
  }

  /** logic to scroll the carousel step 2 */
  private _carouselScrollTwo(Btn: number, currentSlide: number, itemSpeed: number): void {
    if (this.dexVal !== 0) {
      const val = Math.abs(this.touch.velocity);
      let somt = Math.floor((this.dexVal / val / this.dexVal) * (this.deviceWidth - this.dexVal));
      somt = somt > itemSpeed ? itemSpeed : somt;
      itemSpeed = somt < 200 ? 200 : somt;
      this.dexVal = 0;
    }
    if (this._withAnimation) {
      this._setStyle(
        this._nguItemsContainer().nativeElement,
        'transition',
        `transform ${itemSpeed}ms ${this.inputs().easing}`
      );
      this.inputs().animation &&
        this._carouselAnimator(
          Btn,
          currentSlide + 1,
          currentSlide + this.items,
          itemSpeed,
          Math.abs(this.currentSlide - currentSlide)
        );
    } else {
      this._setStyle(this._nguItemsContainer().nativeElement, 'transition', ``);
    }

    this.itemLength = Array.from(this.dataSource()).length;
    this._transformStyle(currentSlide);
    this.currentSlide = currentSlide;
    this.onMove.emit(this);
    this._carouselPointActiver();
    this._carouselLoadTrigger();
    this._withAnimation = true;
  }

  /** boolean function for making isFirst and isLast */
  private _btnBoolean(first: number, last: number) {
    this.isFirst.set(!!first);
    this.isLast.set(!!last);
  }

  private _transformString(grid: keyof Transfrom, slide: number): string {
    let collect = '';
    collect += `${this._styleid} { transform: translate3d(`;

    if (this.vertical.enabled) {
      this.transform[grid] = (this.vertical.height / this.inputs().grid[grid]!) * slide;
      collect += `0, -${this.transform[grid]}px, 0`;
    } else {
      this.transform[grid] = (100 / this.inputs().grid[grid]!) * slide;
      collect += `${this._directionSymbol}${this.transform[grid]}%, 0, 0`;
    }
    collect += `); }`;
    return collect;
  }

  /** set the transform style to scroll the carousel  */
  private _transformStyle(slide: number): void {
    let slideCss = '';
    if (this.type === 'responsive') {
      const breakpoints = this.inputs().gridBreakpoints;
      slideCss = `@media (max-width: ${breakpoints?.sm! - 1}px) {${this._transformString(
        'xs',
        slide
      )}}
      @media (min-width: ${breakpoints?.sm}px) {${this._transformString('sm', slide)} }
      @media (min-width: ${breakpoints?.md}px) {${this._transformString('md', slide)} }
      @media (min-width: ${breakpoints?.lg}px) {${this._transformString('lg', slide)} }
      @media (min-width: ${breakpoints?.xl}px) {${this._transformString('xl', slide)} }`;
    } else {
      this.transform.all = this.inputs().grid.all * slide;
      slideCss = `${this._styleid} { transform: translate3d(${this._directionSymbol}${this.transform.all}px, 0, 0);`;
    }
    this._carouselCssNode.textContent = slideCss;
  }

  /** this will trigger the carousel to load the items */
  private _carouselLoadTrigger(): void {
    if (typeof this.inputs().load === 'number') {
      Array.from(this.dataSource()).length - this.load <= this.currentSlide + this.items &&
        this.carouselLoad.emit(this.currentSlide);
    }
  }

  /** generate Class for each carousel to set specific style */
  private _generateID(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return `ngucarousel${text}`;
  }

  /** handle the auto slide */
  private _carouselInterval(): void {
    const container = this.carouselMain1().nativeElement;
    if (this.interval && this.loop) {
      this._nguWindowScrollListener
        .pipe(
          // Note: do not use `debounceTime` since it may flush queued actions within the Angular zone.
          switchMap(() => timer(600)),
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          // Note: we don't run change detection on each `scroll` event, but we re-enter the
          //       Angular zone once the DOM timer fires to be backwards compatible.
          //       TODO: revisit later since we may not run change detection at all on this task.
          this._ngZone.run(() => this._onWindowScrolling());
        });

      const mapToZero = map(() => 0);
      const mapToOne = map(() => 1);

      const play$ = fromEvent(container, 'mouseleave').pipe(mapToOne);
      const pause$ = fromEvent(container, 'mouseenter').pipe(mapToZero);

      const touchPlay$ = fromEvent(container, 'touchstart').pipe(mapToOne);
      const touchPause$ = fromEvent(container, 'touchend').pipe(mapToZero);

      const interval$ = interval(this.inputs().interval?.timing!).pipe(mapToOne);

      const initialDelay = this.interval.initialDelay || 0;

      const carouselInterval$ = merge(
        play$,
        touchPlay$,
        pause$,
        touchPause$,
        this._intervalController$
      ).pipe(
        startWith(1),
        switchMap(val => {
          this._cdr.markForCheck();
          return val ? interval$ : EMPTY;
        })
      );

      timer(initialDelay)
        .pipe(
          switchMap(() => carouselInterval$),
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          this._carouselScrollOne(1);
        });
    }
  }

  /** animate the carousel items */
  private _carouselAnimator(
    direction: number,
    start: number,
    end: number,
    speed: number,
    length: number
  ): void {
    const viewContainer = this._nodeOutlet().viewContainer;

    let val = length < 5 ? length : 5;
    val = val === 1 ? 3 : val;
    const collectedIndexes: number[] = [];

    if (direction === 1) {
      for (let i = start - 1; i < end; i++) {
        collectedIndexes.push(i);
        val = val * 2;
        const viewRef = viewContainer.get(i) as any;
        const context = viewRef.context as any;
        context.animate = { value: true, params: { distance: val } };
      }
    } else {
      for (let i = end - 1; i >= start - 1; i--) {
        collectedIndexes.push(i);
        val = val * 2;
        const viewRef = viewContainer.get(i) as any;
        const context = viewRef.context as any;
        context.animate = { value: true, params: { distance: -val } };
      }
    }

    timer(speed * 0.7)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._removeAnimations(collectedIndexes));
  }

  private _removeAnimations(collectedIndexes: number[]) {
    const viewContainer = this._nodeOutlet().viewContainer;
    collectedIndexes.forEach(i => {
      const viewRef = viewContainer.get(i) as any;
      const context = viewRef.context as any;
      context.animate = { value: false, params: { distance: 0 } };
    });
    this._cdr.markForCheck();
  }

  /** Short form for setElementStyle */
  private _setStyle(el: any, prop: any, val: any): void {
    this._renderer.setStyle(el, prop, val);
  }

  /** For generating style tag */
  private _createStyleElem(datas?: string): HTMLStyleElement {
    const styleItem = this._renderer.createElement('style');
    if (datas) {
      const styleText = this._renderer.createText(datas);
      this._renderer.appendChild(styleItem, styleText);
    }
    this._renderer.appendChild(this._host.nativeElement, styleItem);
    return styleItem;
  }

  private _setupWindowResizeListener(): void {
    this._ngZone.runOutsideAngular(() =>
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(500),
          filter(() => this.deviceWidth !== window.outerWidth),
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          this._setStyle(this._nguItemsContainer().nativeElement, 'transition', ``);
          // Re-enter the Angular zone only after `resize` events have been dispatched
          // and the timer has run (in `debounceTime`).
          this._ngZone.run(() => {
            this._storeCarouselData();
            // this._cdr.markForCheck();
          });
        })
    );
  }

  static ngAcceptInputType_dataSource: NguCarouselDataSource<any, any>;
}
