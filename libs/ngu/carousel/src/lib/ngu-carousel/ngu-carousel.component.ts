import { isPlatformBrowser } from '@angular/common';

import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  isDevMode,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  TrackByFunction,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  EMPTY,
  from,
  fromEvent,
  interval,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
  timer
} from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import {
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselOutlet,
  NguCarouselPrevDirective
} from './../ngu-carousel.directive';
import {
  Transfrom,
  Breakpoints,
  NguCarouselConfig,
  NguCarouselOutletContext,
  NguCarouselStore
} from './ngu-carousel';
import { NguWindowScrollListener } from './ngu-window-scroll-listener';

@Component({
  selector: 'ngu-carousel',
  templateUrl: 'ngu-carousel.component.html',
  styleUrls: ['ngu-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NguCarousel<T>
  extends NguCarouselStore
  implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, DoCheck
{
  _dataSubscription: Subscription;
  _dataSource: any;
  _dataDiffer: IterableDiffer<{}>;
  styleid: string;
  private directionSym: string;
  private carouselCssNode: any;
  private pointIndex: number;
  private withAnim = true;
  activePoint: number;
  isHovered = false;
  @Input() inputs: NguCarouselConfig;
  @Output() carouselLoad = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onMove = new EventEmitter<NguCarousel<T>>();
  // isFirstss = 0;
  arrayChanges: IterableChanges<{}>;
  carouselInt: Subscription;

  listener1: () => void;
  listener2: () => void;
  listener3: () => void;

  @Input('dataSource')
  get dataSource(): any {
    return this._dataSource;
  }
  set dataSource(data: any) {
    if (data) {
      this._switchDataSource(data);
    }
  }

  private _defaultNodeDef: NguCarouselDefDirective<any> | null;

  @ContentChildren(NguCarouselDefDirective)
  private _defDirec: QueryList<NguCarouselDefDirective<any>>;

  @ViewChild(NguCarouselOutlet, { static: true })
  _nodeOutlet: NguCarouselOutlet;

  /** The setter is used to catch the button if the button has ngIf
   * issue id #91
   */
  @ContentChild(NguCarouselNextDirective, /* TODO: add static flag */ { read: ElementRef })
  set nextBtn(btn: ElementRef) {
    this.listener2?.();
    if (btn) {
      this.listener2 = this._renderer.listen(btn.nativeElement, 'click', () =>
        this._carouselScrollOne(1)
      );
    }
  }

  /** The setter is used to catch the button if the button has ngIf
   * issue id #91
   */
  @ContentChild(NguCarouselPrevDirective, /* TODO: add static flag */ { read: ElementRef })
  set prevBtn(btn: ElementRef) {
    this.listener1?.();
    if (btn) {
      this.listener1 = this._renderer.listen(btn.nativeElement, 'click', () =>
        this._carouselScrollOne(0)
      );
    }
  }

  @ViewChild('ngucarousel', { read: ElementRef, static: true })
  private carouselMain1: ElementRef;

  @ViewChild('nguItemsContainer', { read: ElementRef, static: true })
  private nguItemsContainer: ElementRef;

  @ViewChild('touchContainer', { read: ElementRef, static: true })
  private touchContainer: ElementRef;

  private _intervalController$ = new Subject<number>();

  private carousel: any;

  private _hammertime: HammerManager | null = null;

  private _destroy$ = new Subject<void>();

  pointNumbers: Array<any> = [];

  /**
   * Tracking function that will be used to check the differences in data changes. Used similarly
   * to `ngFor` `trackBy` function. Optimize Items operations by identifying a Items based on its data
   * relative to the function to know if a Items should be added/removed/moved.
   * Accepts a function that takes two parameters, `index` and `item`.
   */
  @Input()
  get trackBy(): TrackByFunction<T> {
    return this._trackByFn;
  }
  set trackBy(fn: TrackByFunction<T>) {
    if (isDevMode() && fn != null && typeof fn !== 'function' && console && console.warn) {
      console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}.`);
    }
    this._trackByFn = fn;
  }
  private _trackByFn: TrackByFunction<T>;

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _differs: IterableDiffers,
    @Inject(PLATFORM_ID) private platformId: object,
    private _cdr: ChangeDetectorRef,
    private _ngZone: NgZone,
    private _nguWindowScrollListener: NguWindowScrollListener
  ) {
    super();
  }

  ngOnInit() {
    this._dataDiffer = this._differs.find([]).create((_i: number, item: any) => {
      return this.trackBy ? this.trackBy(_i, item) : item;
    });
  }

  ngDoCheck() {
    this.arrayChanges = this._dataDiffer.diff(this.dataSource)!;
    if (this.arrayChanges && this._defDirec) {
      this._observeRenderChanges();
    }
  }

  private _switchDataSource(dataSource: any): any {
    this._dataSource = dataSource;
    if (this._defDirec) {
      this._observeRenderChanges();
    }
  }

  private _observeRenderChanges() {
    let dataStream: Observable<any[]> | undefined;

    if (this._dataSource instanceof Observable) {
      dataStream = this._dataSource;
    } else if (Array.isArray(this._dataSource)) {
      dataStream = of(this._dataSource);
    }

    if (dataStream) {
      this._dataSubscription = dataStream
        .pipe(takeUntil(this._intervalController$))
        .subscribe(data => {
          this.renderNodeChanges(data);
          this.isLast = this.pointIndex === this.currentSlide;
        });
    }
  }

  private renderNodeChanges(
    data: any[],
    viewContainer: ViewContainerRef = this._nodeOutlet.viewContainer
  ) {
    if (!this.arrayChanges) return;

    this.arrayChanges.forEachOperation(
      (
        item: IterableChangeRecord<any>,
        adjustedPreviousIndex: number | null,
        currentIndex: number | null
      ) => {
        const node = this._getNodeDef(data[currentIndex!], currentIndex!);

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
    );
    this._updateItemIndexContext();

    if (this.carousel) {
      this._storeCarouselData();
    }
  }

  /**
   * Updates the index-related context for each row to reflect any changes in the index of the rows,
   * e.g. first/last/even/odd.
   */
  private _updateItemIndexContext() {
    const viewContainer = this._nodeOutlet.viewContainer;
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

  private _getNodeDef(data: any, i: number): NguCarouselDefDirective<any> {
    if (this._defDirec.length === 1) {
      return this._defDirec.first;
    }

    const nodeDef: NguCarouselDefDirective<any> =
      this._defDirec.find(def => def.when && def.when(i, data)) || this._defaultNodeDef!;

    return nodeDef;
  }

  ngAfterViewInit() {
    this.carousel = this._el.nativeElement;
    this._inputValidation();

    this.carouselCssNode = this._createStyleElem();

    if (isPlatformBrowser(this.platformId)) {
      this._carouselInterval();
      if (!this.vertical.enabled && this.inputs.touch) {
        this._setupHammer();
      }
      this._setupWindowResizeListener();
      this._onWindowScrolling();
    }
  }

  ngAfterContentInit() {
    this._observeRenderChanges();

    this._cdr.markForCheck();
  }

  private _inputValidation() {
    this.inputs.gridBreakpoints = this.inputs.gridBreakpoints
      ? this.inputs.gridBreakpoints
      : new Breakpoints();
    if (this.inputs.grid.xl === undefined) {
      this.inputs.grid.xl = this.inputs.grid.lg;
    }

    this.type = this.inputs.grid.all !== 0 ? 'fixed' : 'responsive';
    this.loop = this.inputs.loop || false;
    this.inputs.easing = this.inputs.easing || 'cubic-bezier(0, 0, 0.2, 1)';
    this.touch.active = this.inputs.touch || false;
    this.RTL = this.inputs.RTL ? true : false;
    this.interval = this.inputs.interval || undefined;
    this.velocity = typeof this.inputs.velocity === 'number' ? this.inputs.velocity : this.velocity;

    if (this.inputs.vertical && this.inputs.vertical.enabled) {
      this.vertical.enabled = this.inputs.vertical.enabled;
      this.vertical.height = this.inputs.vertical.height;
    }
    this.directionSym = this.RTL ? '' : '-';
    this.point =
      this.inputs.point && typeof this.inputs.point.visible !== 'undefined'
        ? this.inputs.point.visible
        : true;

    this._carouselSize();
  }

  ngOnDestroy() {
    this._hammertime?.destroy();
    this._destroy$.next();
    this.carouselInt && this.carouselInt.unsubscribe();
    this._intervalController$.unsubscribe();
    this.carouselLoad.complete();
    this.onMove.complete();

    /** remove listeners */
    for (let i = 1; i <= 3; i++) {
      // TODO: revisit later.
      const str = `listener${i}` as 'listener1' | 'listener2' | 'listener3';
      this[str] && this[str]();
    }
  }

  /** Get Touch input */
  private _setupHammer(): void {
    from(import('hammerjs'))
      // Note: the dynamic import is always a microtask which may run after the view is destroyed.
      //       `takeUntil` is used to prevent setting Hammer up if the view had been destroyed before
      //       the HammerJS is loaded.
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        const hammertime = (this._hammertime = new Hammer(this.touchContainer.nativeElement));
        hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

        hammertime.on('panstart', (ev: any) => {
          this.carouselWidth = this.nguItemsContainer.nativeElement.offsetWidth;
          this.touchTransform = this.transform[this.deviceType!]!;
          this.dexVal = 0;
          this._setStyle(this.nguItemsContainer.nativeElement, 'transition', '');
        });
        if (this.vertical.enabled) {
          hammertime.on('panup', (ev: any) => {
            this._touchHandling('panleft', ev);
          });
          hammertime.on('pandown', (ev: any) => {
            this._touchHandling('panright', ev);
          });
        } else {
          hammertime.on('panleft', (ev: any) => {
            this._touchHandling('panleft', ev);
          });
          hammertime.on('panright', (ev: any) => {
            this._touchHandling('panright', ev);
          });
        }
        hammertime.on('panend pancancel', (ev: any) => {
          if (Math.abs(ev.velocity) >= this.velocity) {
            this.touch.velocity = ev.velocity;
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
              this.nguItemsContainer.nativeElement,
              'transition',
              'transform 324ms cubic-bezier(0, 0, 0.2, 1)'
            );
            this._setStyle(this.nguItemsContainer.nativeElement, 'transform', '');
          }
        });
        hammertime.on('hammer.input', ev => {
          // allow nested touch events to no propagate, this may have other side affects but works for now.
          // TODO: It is probably better to check the source element of the event and only apply the handle to the correct carousel
          ev.srcEvent.stopPropagation();
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
      this.nguItemsContainer.nativeElement,
      'transform',
      this.vertical.enabled
        ? `translate3d(0, ${this.directionSym}${this.touchTransform}${type}, 0)`
        : `translate3d(${this.directionSym}${this.touchTransform}${type}, 0, 0)`
    );
  }

  /** this fn used to disable the interval when it is not on the viewport */
  private _onWindowScrolling(): void {
    const top = this.carousel.offsetTop;
    const scrollY = window.scrollY;
    const heightt = window.innerHeight;
    const carouselHeight = this.carousel.offsetHeight;
    const isCarouselOnScreen =
      top <= scrollY + heightt - carouselHeight / 4 && top + carouselHeight / 2 >= scrollY;

    if (isCarouselOnScreen) {
      this._intervalController$.next(1);
    } else {
      this._intervalController$.next(0);
    }
  }

  /** store data based on width of the screen for the carousel */
  private _storeCarouselData(): void {
    const breakpoints = this.inputs.gridBreakpoints;
    this.deviceWidth = isPlatformBrowser(this.platformId) ? window.innerWidth : breakpoints?.xl!;

    this.carouselWidth = this.carouselMain1.nativeElement.offsetWidth;

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

      this.items = this.inputs.grid[this.deviceType]!;
      this.itemWidth = this.carouselWidth / this.items;
    } else {
      this.items = Math.trunc(this.carouselWidth / this.inputs.grid.all);
      this.itemWidth = this.inputs.grid.all;
      this.deviceType = 'all';
    }

    this.slideItems = +(this.inputs.slide! < this.items ? this.inputs.slide! : this.items);
    this.load = this.inputs.load! >= this.slideItems ? this.inputs.load! : this.slideItems;
    this.speed = this.inputs.speed && this.inputs.speed > -1 ? this.inputs.speed : 400;
    this._carouselPoint();
  }

  /** Used to reset the carousel */
  public reset(withOutAnimation?: boolean): void {
    withOutAnimation && (this.withAnim = false);
    this.carouselCssNode.textContent = '';
    this.moveTo(0);
    this._carouselPoint();
  }

  /** Init carousel point */
  private _carouselPoint(): void {
    const Nos = this.dataSource.length - (this.items - this.slideItems);
    this.pointIndex = Math.ceil(Nos / this.slideItems);
    const pointers: number[] = [];

    if (this.pointIndex > 1 || !this.inputs.point?.hideOnSingleSlide) {
      for (let i = 0; i < this.pointIndex; i++) {
        pointers.push(i);
      }
    }
    this.pointNumbers = pointers;

    this._carouselPointActiver();
    if (this.pointIndex <= 1) {
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
    this.activePoint = i;
    this._cdr.markForCheck();
  }

  /** this function is used to scoll the carousel when point is clicked */
  public moveTo(slide: number, withOutAnimation?: boolean) {
    // slide = slide - 1;
    withOutAnimation && (this.withAnim = false);
    if (this.activePoint !== slide && slide < this.pointIndex) {
      let slideremains;
      const btns = this.currentSlide < slide ? 1 : 0;

      switch (slide) {
        case 0:
          this._btnBoolean(1, 0);
          slideremains = slide * this.slideItems;
          break;
        case this.pointIndex - 1:
          this._btnBoolean(0, 1);
          slideremains = this.dataSource.length - this.items;
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
    this.token = this._generateID();
    let dism = '';
    this.styleid = `.${this.token} > .ngucarousel > .ngu-touch-container > .ngucarousel-items`;

    if (this.inputs.custom === 'banner') {
      this._renderer.addClass(this.carousel, 'banner');
    }

    if (this.inputs.animation === 'lazy') {
      dism += `${this.styleid} > .item {transition: transform .6s ease;}`;
    }

    const breakpoints = this.inputs.gridBreakpoints;

    let itemStyle = '';
    if (this.vertical.enabled) {
      const itemWidthXS = `${this.styleid} > .item {height: ${
        this.vertical.height / +this.inputs.grid.xs
      }px}`;
      const itemWidthSM = `${this.styleid} > .item {height: ${
        this.vertical.height / +this.inputs.grid.sm
      }px}`;
      const itemWidthMD = `${this.styleid} > .item {height: ${
        this.vertical.height / +this.inputs.grid.md
      }px}`;
      const itemWidthLG = `${this.styleid} > .item {height: ${
        this.vertical.height / +this.inputs.grid.lg
      }px}`;
      const itemWidthXL = `${this.styleid} > .item {height: ${
        this.vertical.height / +this.inputs.grid.xl!
      }px}`;

      itemStyle = `@media (max-width:${breakpoints?.sm! - 1}px){${itemWidthXS}}
                    @media (max-width:${breakpoints?.sm}px){${itemWidthSM}}
                    @media (min-width:${breakpoints?.md}px){${itemWidthMD}}
                    @media (min-width:${breakpoints?.lg}px){${itemWidthLG}}
                    @media (min-width:${breakpoints?.xl}px){${itemWidthXL}}`;
    } else if (this.type === 'responsive') {
      const itemWidthXS =
        this.inputs.type === 'mobile'
          ? `${this.styleid} .item {flex: 0 0 ${95 / +this.inputs.grid.xs}%; width: ${
              95 / +this.inputs.grid.xs
            }%;}`
          : `${this.styleid} .item {flex: 0 0 ${100 / +this.inputs.grid.xs}%; width: ${
              100 / +this.inputs.grid.xs
            }%;}`;

      const itemWidthSM = `${this.styleid} > .item {flex: 0 0 ${
        100 / +this.inputs.grid.sm
      }%; width: ${100 / +this.inputs.grid.sm}%}`;
      const itemWidthMD = `${this.styleid} > .item {flex: 0 0 ${
        100 / +this.inputs.grid.md
      }%; width: ${100 / +this.inputs.grid.md}%}`;
      const itemWidthLG = `${this.styleid} > .item {flex: 0 0 ${
        100 / +this.inputs.grid.lg
      }%; width: ${100 / +this.inputs.grid.lg}%}`;
      const itemWidthXL = `${this.styleid} > .item {flex: 0 0 ${
        100 / +this.inputs.grid.xl!
      }%; width: ${100 / +this.inputs.grid.xl!}%}`;

      itemStyle = `@media (max-width:${breakpoints?.sm! - 1}px){${itemWidthXS}}
                    @media (min-width:${breakpoints?.sm}px){${itemWidthSM}}
                    @media (min-width:${breakpoints?.md}px){${itemWidthMD}}
                    @media (min-width:${breakpoints?.lg}px){${itemWidthLG}}
                    @media (min-width:${breakpoints?.xl}px){${itemWidthXL}}`;
    } else {
      itemStyle = `${this.styleid} .item {flex: 0 0 ${this.inputs.grid.all}px; width: ${this.inputs.grid.all}px;}`;
    }

    this._renderer.addClass(this.carousel, this.token);
    if (this.vertical.enabled) {
      this._renderer.addClass(this.nguItemsContainer.nativeElement, 'nguvertical');
      this._renderer.setStyle(
        this.carouselMain1.nativeElement,
        'height',
        `${this.vertical.height}px`
      );
    }

    this.RTL && !this.vertical.enabled && this._renderer.addClass(this.carousel, 'ngurtl');
    this._createStyleElem(`${dism} ${itemStyle}`);
    this._storeCarouselData();
  }

  /** logic to scroll the carousel step 1 */
  private _carouselScrollOne(Btn: number): void {
    let itemSpeed = this.speed;
    let currentSlide = 0;
    let touchMove = Math.ceil(this.dexVal / this.itemWidth);
    touchMove = isFinite(touchMove) ? touchMove : 0;
    this._setStyle(this.nguItemsContainer.nativeElement, 'transform', '');

    if (this.pointIndex === 1) {
      return;
    } else if (Btn === 0 && ((!this.loop && !this.isFirst) || this.loop)) {
      const currentSlideD = this.currentSlide - this.slideItems;
      const MoveSlide = currentSlideD + this.slideItems;
      this._btnBoolean(0, 1);
      if (this.currentSlide === 0) {
        currentSlide = this.dataSource.length - this.items;
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
    } else if (Btn === 1 && ((!this.loop && !this.isLast) || this.loop)) {
      if (
        this.dataSource.length <= this.currentSlide + this.items + this.slideItems &&
        !this.isLast
      ) {
        currentSlide = this.dataSource.length - this.items;
        this._btnBoolean(0, 1);
      } else if (this.isLast) {
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
    if (this.withAnim) {
      this._setStyle(
        this.nguItemsContainer.nativeElement,
        'transition',
        `transform ${itemSpeed}ms ${this.inputs.easing}`
      );
      this.inputs.animation &&
        this._carouselAnimator(
          Btn,
          currentSlide + 1,
          currentSlide + this.items,
          itemSpeed,
          Math.abs(this.currentSlide - currentSlide)
        );
    } else {
      this._setStyle(this.nguItemsContainer.nativeElement, 'transition', ``);
    }

    this.itemLength = this.dataSource.length;
    this._transformStyle(currentSlide);
    this.currentSlide = currentSlide;
    this.onMove.emit(this);
    this._carouselPointActiver();
    this._carouselLoadTrigger();
    this.withAnim = true;
  }

  /** boolean function for making isFirst and isLast */
  private _btnBoolean(first: number, last: number) {
    this.isFirst = !!first;
    this.isLast = !!last;
  }

  private _transformString(grid: keyof Transfrom, slide: number): string {
    let collect = '';
    collect += `${this.styleid} { transform: translate3d(`;

    if (this.vertical.enabled) {
      this.transform[grid] = (this.vertical.height / this.inputs.grid[grid]!) * slide;
      collect += `0, -${this.transform[grid]}px, 0`;
    } else {
      this.transform[grid] = (100 / this.inputs.grid[grid]!) * slide;
      collect += `${this.directionSym}${this.transform[grid]}%, 0, 0`;
    }
    collect += `); }`;
    return collect;
  }

  /** set the transform style to scroll the carousel  */
  private _transformStyle(slide: number): void {
    let slideCss = '';
    if (this.type === 'responsive') {
      const breakpoints = this.inputs.gridBreakpoints;
      slideCss = `@media (max-width: ${breakpoints?.sm! - 1}px) {${this._transformString(
        'xs',
        slide
      )}}
      @media (min-width: ${breakpoints?.sm}px) {${this._transformString('sm', slide)} }
      @media (min-width: ${breakpoints?.md}px) {${this._transformString('md', slide)} }
      @media (min-width: ${breakpoints?.lg}px) {${this._transformString('lg', slide)} }
      @media (min-width: ${breakpoints?.xl}px) {${this._transformString('xl', slide)} }`;
    } else {
      this.transform.all = this.inputs.grid.all * slide;
      slideCss = `${this.styleid} { transform: translate3d(${this.directionSym}${this.transform.all}px, 0, 0);`;
    }
    this.carouselCssNode.textContent = slideCss;
  }

  /** this will trigger the carousel to load the items */
  private _carouselLoadTrigger(): void {
    if (typeof this.inputs.load === 'number') {
      this.dataSource.length - this.load <= this.currentSlide + this.items &&
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
    const container = this.carouselMain1.nativeElement;
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

      const interval$ = interval(this.inputs.interval?.timing!).pipe(mapToOne);

      setTimeout(() => {
        this.carouselInt = merge(play$, touchPlay$, pause$, touchPause$, this._intervalController$)
          .pipe(
            startWith(1),
            switchMap(val => {
              this.isHovered = !val;
              this._cdr.markForCheck();
              return val ? interval$ : EMPTY;
            })
          )
          .subscribe(() => {
            this._carouselScrollOne(1);
          });
      }, this.interval.initialDelay);
    }
  }

  /** animate the carousel items */
  private _carouselAnimator(
    direction: number,
    start: number,
    end: number,
    speed: number,
    length: number,
    viewContainer = this._nodeOutlet.viewContainer
  ): void {
    let val = length < 5 ? length : 5;
    val = val === 1 ? 3 : val;
    const collectIndex: number[] = [];

    if (direction === 1) {
      for (let i = start - 1; i < end; i++) {
        collectIndex.push(i);
        val = val * 2;
        const viewRef = viewContainer.get(i) as any;
        const context = viewRef.context as any;
        context.animate = { value: true, params: { distance: val } };
      }
    } else {
      for (let i = end - 1; i >= start - 1; i--) {
        collectIndex.push(i);
        val = val * 2;
        const viewRef = viewContainer.get(i) as any;
        const context = viewRef.context as any;
        context.animate = { value: true, params: { distance: -val } };
      }
    }
    this._cdr.markForCheck();
    setTimeout(() => {
      this._removeAnimations(collectIndex);
    }, speed * 0.7);
  }

  private _removeAnimations(indexs: number[]) {
    const viewContainer = this._nodeOutlet.viewContainer;
    indexs.forEach(i => {
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
  private _createStyleElem(datas?: string) {
    const styleItem = this._renderer.createElement('style');
    if (datas) {
      const styleText = this._renderer.createText(datas);
      this._renderer.appendChild(styleItem, styleText);
    }
    this._renderer.appendChild(this.carousel, styleItem);
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
          this._setStyle(this.nguItemsContainer.nativeElement, 'transition', ``);
          // Re-enter the Angular zone only after `resize` events have been dispatched
          // and the timer has run (in `debounceTime`).
          this._ngZone.run(() => {
            this._storeCarouselData();
            this._cdr.markForCheck();
          });
        })
    );
  }
}
