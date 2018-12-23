import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  TrackByFunction,
  ViewChild,
  ViewContainerRef,
  EmbeddedViewRef,
  HostBinding
} from '@angular/core';
import {
  EMPTY,
  fromEvent,
  interval,
  merge,
  Observable,
  of,
  Subject,
  Subscription
} from 'rxjs';
import {
  mapTo,
  startWith,
  switchMap,
  takeUntil,
  debounceTime
} from 'rxjs/operators';
import {
  NguCarouselDefDirective,
  NguCarouselOutlet,
  NguCarouselOutletLeft,
  NguCarouselOutletRight
} from './ngu-carousel.directive';
import {
  NguCarouselConfig,
  NguCarouselOutletContext,
  NguCarouselStore
} from './ngu-carousel';
import { slider } from './carousel-animation';
import { CarouselPoint } from './carousel-point';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngu-carousel',
  templateUrl: 'ngu-carousel.component.html',
  styleUrls: ['ngu-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slider]
})
// tslint:disable-next-line:component-class-suffix
export class NguCarousel<T = any> extends NguCarouselStore
  implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, DoCheck {
  private _dataSubscription: Subscription;
  private _dataSource: T[];
  private _dataDiffer: IterableDiffer<{}>;
  styleid: string;

  pointIndex: number;
  private _withAnim = true;
  activePoint: number;
  isHovered = false;
  alternatives = false;

  @Input() private inputs: NguCarouselConfig;
  @Output('carouselLoad') private carouselLoad = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onMove') private onMove = new EventEmitter<NguCarousel<T>>();
  private _arrayChanges: IterableChanges<{}>;
  carouselInt: Subscription;

  // @HostBinding('class.ngurtl')
  // isRTL: boolean;
  // @HostBinding('class.nguvertical')
  // isVertical = this.vertical.enabled;
  // @HostBinding('class')
  // token: string;

  private listener3: () => void;
  private listener4: () => void;

  _extraLoopItemsWidth: number;
  private _resetAferAnimation: any;
  private _carouselItemSize: number;
  private _maxSlideWidth: number;
  itemWidthTest: number;
  carouselPoi: CarouselPoint;

  @Input('dataSource')
  get dataSource(): T[] {
    return this._dataSource;
  }
  set dataSource(data: T[]) {
    if (data) {
      this._switchDataSource(data);
    }
  }

  private _defaultNodeDef: NguCarouselDefDirective<T> | null;

  @ContentChildren(NguCarouselDefDirective)
  private _defDirec: QueryList<NguCarouselDefDirective<T>>;

  @ViewChild(NguCarouselOutlet)
  private _nodeOutlet: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletLeft)
  private _nodeOutletLeft: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletRight)
  private _nodeOutletRight: NguCarouselOutlet;

  @ViewChild('ngucarousel', { read: ElementRef })
  private carouselMain1: ElementRef;

  @ViewChild('nguItemsContainer', { read: ElementRef })
  private nguItemsContainer: ElementRef;

  // @ViewChild('touchContainer', { read: ElementRef })
  // private touchContainer: ElementRef;

  private _intervalController$ = new Subject<number>();

  private carousel: any;

  private onResize: any;
  private onScrolling: any;

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
    if (
      isDevMode() &&
      fn != null &&
      typeof fn !== 'function' &&
      <any>console &&
      <any>console.warn
    ) {
      console.warn(
        `trackBy must be a function, but received ${JSON.stringify(fn)}.`
      );
    }
    this._trackByFn = fn;
  }
  private _trackByFn: TrackByFunction<T>;

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _differs: IterableDiffers,
    @Inject(PLATFORM_ID) private platformId: Object,
    public cdr: ChangeDetectorRef
  ) {
    super();
    this.carouselPoi = new CarouselPoint(this);
    this.carouselPoi.buttonHandler.subscribe(([first, last]) =>
      this._btnBoolean(first, last)
    );
  }

  ngOnInit() {
    this._dataDiffer = this._differs
      .find([])
      .create((_i: number, item: any) => {
        return this.trackBy ? this.trackBy(item.dataIndex, item.data) : item;
      });
  }

  ngDoCheck() {
    this._arrayChanges = this._dataDiffer.diff(this.dataSource);
    if (this._arrayChanges && this._defDirec) {
      // console.log('Changes detected!');
      this._observeRenderChanges();
    }
  }

  private _switchDataSource(dataSource: T[]): any {
    this._dataSource = dataSource;
    if (this._defDirec && this.slideItems) {
      this._observeRenderChanges();
    }
  }

  private _observeRenderChanges() {
    let dataStream: Observable<T[]> | undefined;

    if (this._dataSource instanceof Observable) {
      dataStream = this._dataSource;
    } else if (Array.isArray(this._dataSource)) {
      dataStream = of(this._dataSource);
    }

    if (dataStream) {
      this._dataSubscription = dataStream
        .pipe(
          takeUntil(this._intervalController$),
          debounceTime(10)
        )
        .subscribe(data => {
          this.renderNodeChanges(data);
          this.isLast = false;
        });
    }
  }

  private renderNodeChanges(
    data: T[],
    viewContainer: ViewContainerRef = this._nodeOutlet.viewContainer
  ) {
    if (!this._arrayChanges) return;

    this._arrayChanges.forEachOperation(
      (
        item: IterableChangeRecord<T>,
        adjustedPreviousIndex: number,
        currentIndex: number
      ) => {
        if (item.previousIndex == null) {
          // console.log(data[currentIndex], item);

          this._createNodeItem(data, viewContainer, currentIndex);
        } else if (currentIndex == null) {
          viewContainer.remove(adjustedPreviousIndex);
        } else {
          const view = viewContainer.get(adjustedPreviousIndex);
          viewContainer.move(view, currentIndex);
        }
      }
    );
    this._updateItemIndexContext();
    this.extraItemsContainer(data);
  }

  private extraItemsContainer(data: T[]) {
    this._extraLoopItemsWidth = 0;
    if (this.loop) {
      // console.log(0, this.slideItems);
      const leftContainer = this._nodeOutletLeft.viewContainer;
      const rightContainer = this._nodeOutletRight.viewContainer;
      leftContainer.clear();
      rightContainer.clear();
      const slideItems = this.maxSlideItems;
      const rightItems = this.inputs.grid.offset ? slideItems + 1 : slideItems;
      // console.log('rightItems', rightItems, this.slideItems);
      for (let it = 0; it < rightItems; it++) {
        // console.log(it, rightItems, this.slideItems);
        this._createNodeItem(data, rightContainer, it, true);
        // console.log(this.collectExtractItemIndex);
      }

      const leftItems = this.inputs.grid.offset ? slideItems + 1 : slideItems;
      // console.log('leftItems', leftItems, this.slideItems);
      const ln = data.length;
      // console.log('forcondition', ln - 1, ln - leftItems - 1);
      let test = 0;
      for (let it = ln - leftItems; ln - 1 >= it; it++) {
        this._createNodeItem(data, leftContainer, it, false, test);
        test++;
      }
      // console.log('device from renderer', this.deviceType);
      this.calculateExtraItem();
      // console.table(
      //   'test',
      //   this.activePoint,
      //   this.currentSlideItems,
      //   this.slideItems
      // );
      if (this.activePoint === 0) {
        this.transformCarousel(this._transformString(0));
      }
    }
    this._carouselPoint();
  }

  private _createNodeItem(
    data: T[],
    viewContainer: ViewContainerRef,
    currentIndex: number,
    tempItem = false,
    insertIndex?: number
  ) {
    const node = this._getNodeDef(data[currentIndex], currentIndex);
    const context = new NguCarouselOutletContext<T>(data[currentIndex]);
    context.index = currentIndex;
    const indexx =
      !tempItem && typeof insertIndex !== 'number'
        ? currentIndex
        : typeof insertIndex === 'number'
        ? insertIndex
        : null;
    return viewContainer.createEmbeddedView(node.template, context, indexx);
  }

  /**
   * Updates the index-related context for each row to reflect any changes in the index of the rows,
   * e.g. first/last/even/odd.
   */
  private _updateItemIndexContext() {
    const viewContainer = this._nodeOutlet.viewContainer;
    for (
      let renderIndex = 0, count = viewContainer.length;
      renderIndex < count;
      renderIndex++
    ) {
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

  private _getNodeDef(data: T, i: number): NguCarouselDefDirective<T> {
    if (this._defDirec.length === 1) {
      return this._defDirec.first;
    }

    const nodeDef =
      this._defDirec.find(def => def.when && def.when(i, data)) ||
      this._defaultNodeDef;

    return nodeDef;
  }

  ngAfterViewInit() {
    // console.log('ngAfterViewInit');
    this.carousel = this._el.nativeElement;
    this.changeGridConfig();
    this._observeRenderChanges();

    // this.carouselCssNode = this._createStyleElem();

    if (isPlatformBrowser(this.platformId)) {
      this._carouselInterval();
      // if (!this.vertical.enabled) {
      //   this._touch();
      // }
      this.listener3 = this._renderer.listen('window', 'resize', event =>
        this._onResizing(event)
      );
      this._onWindowScrolling();
    }
    this.cdr.markForCheck();
  }

  changeGridConfig(grid?) {
    if (grid) {
      this.inputs.grid = grid;
    }
    this.validateInputs(this.inputs);
    this._carouselSize();
    this._storeCarouselData();
    this.calculateExtraItem();
    grid && this.positionTheItem();
    // console.log(
    //   this.currentSlideItems,
    //   this.activePoint,
    //   this.slideItems,
    //   this.dataSource.length,
    //   this.pointNumbers
    // );
    if (grid) {
      this.moveTo(
        Math.max(0, Math.ceil(this.currentSlideItems / this.slideItems) - 1),
        true,
        true
      );
    }
  }

  positionTheItem() {
    this.extraItemsContainer(this._dataSource);
    // console.log(this);
  }

  ngAfterContentInit() {
    // console.log('ngAfterContentInit');
    // this._observeRenderChanges();
    // this.cdr.markForCheck();
  }

  ngOnDestroy() {
    // clearInterval(this.carouselInt);
    this.carouselInt && this.carouselInt.unsubscribe();
    this._dataSubscription.unsubscribe();
    this._intervalController$.complete();
    this.carouselLoad.complete();
    this.onMove.complete();

    /** remove listeners */
    for (let i = 1; i <= 4; i++) {
      const str = `listener${i}`;
      this[str] && this[str]();
    }
  }

  private _onResizing(event: any): void {
    clearTimeout(this.onResize);
    this.onResize = setTimeout(() => {
      if (this.deviceWidth !== event.target.outerWidth) {
        // this._setStyle(this.nguItemsContainer.nativeElement, 'transition', ``);
        this._storeCarouselData();
      }
    }, 500);
  }

  /** Get Touch input */
  // private _touch(): void {
  //   if (this.inputs.touch) {
  //     const hammertime = new Hammer(this.touchContainer.nativeElement);
  //     hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

  //     hammertime.on('panstart', (ev: any) => {
  //       this.carouselWidth = this.nguItemsContainer.nativeElement.offsetWidth;
  //       this.touchTransform = this.transform;
  //       this.dexVal = 0;
  //       // this._setStyle(this.nguItemsContainer.nativeElement, 'transition', '');
  //       // this.carouselTransition = '';
  //     });
  //     if (this.vertical.enabled) {
  //       hammertime.on('panup', (ev: any) => {
  //         this._touchHandling('panleft', ev);
  //       });
  //       hammertime.on('pandown', (ev: any) => {
  //         this._touchHandling('panright', ev);
  //       });
  //     } else {
  //       hammertime.on('panleft', (ev: any) => {
  //         this._touchHandling('panleft', ev);
  //       });
  //       hammertime.on('panright', (ev: any) => {
  //         this._touchHandling('panright', ev);
  //       });
  //     }
  //     hammertime.on('panend', (ev: any) => {
  //       if (Math.abs(ev.velocity) >= this.velocity) {
  //         this.touch.velocity = ev.velocity;
  //         let direc = 0;
  //         if (!this.RTL) {
  //           direc = this.touch.swipe === 'panright' ? 0 : 1;
  //         } else {
  //           direc = this.touch.swipe === 'panright' ? 1 : 0;
  //         }
  //         // console.log('panend');
  //         this.slide(direc);
  //       } else {
  //         this.resetTouch();
  //       }
  //     });
  //     hammertime.on('hammer.input', function(ev) {
  //       // allow nested touch events to no propagate, this may have other side affects but works for now.
  //       // TODO: It is probably better to check the source element of the event and only apply the handle to the correct carousel
  //       ev.srcEvent.stopPropagation();
  //     });
  //   }
  // }

  // private resetTouch() {
  //   this.dexVal = 0;
  //   const transition = '300ms cubic-bezier(0, 0, 0.2, 1)';
  //   const transform = `translate3d(-${this.transform +
  //     this._extraLoopItemsWidth}%,0,0)`;
  //   this.transformCarousel(transform, transition);
  // }

  /** handle touch input */
  // private _touchHandling(e: string, ev: any): void {
  //   // if (!this.inputs.touch) return;
  //   // vertical touch events seem to cause to panstart event with an odd delta
  //   // and a center of {x:0,y:0} so this will ignore them
  //   if (ev.center.x === 0 || !this.inputs.touch) {
  //     return;
  //   }

  //   ev = Math.abs(this.vertical.enabled ? ev.deltaY : ev.deltaX);
  //   let valt = ev - this.dexVal;
  //   valt =
  //     this.type === 'responsive'
  //       ? (Math.abs(ev - this.dexVal) /
  //           (this.vertical.enabled
  //             ? this.vertical.height
  //             : this.carouselWidth)) *
  //         100
  //       : valt;
  //   this.dexVal = ev;
  //   this.touch.swipe = e;
  //   this._setTouchTransfrom(e, valt);
  //   this._setTransformFromTouch();
  // }

  // private _setTouchTransfrom(e: string, valt: number) {
  //   const condition = this.RTL ? 'panright' : 'panleft';
  //   this.touchTransform =
  //     e === condition ? valt + this.touchTransform : this.touchTransform - valt;
  // }

  // private _setTransformFromTouch() {
  //   if (this.touchTransform < 0 && !this.loop) {
  //     this.touchTransform = 0;
  //   }
  //   const type = this.type === 'responsive' ? '%' : 'px';

  //   const transform = this.vertical.enabled
  //     ? `translate3d(0, ${this.directionSym}${this.touchTransform}${type}, 0)`
  //     : `translate3d(${this.directionSym}${this.touchTransform +
  //         this._extraLoopItemsWidth}${type}, 0, 0)`;

  //   this.transformCarousel(transform);
  // }

  transformCarousel(transform: string, transition?: string) {
    // console.log(transform);
    // console.log(this.currentSlideItems);
    this.alternatives = !this.alternatives;
    this.carouselTransition = transition || '0ms';
    this.carouselTransform = transform;
    this.cdr.detectChanges();
  }

  /** this fn used to disable the interval when it is not on the viewport */
  private _onWindowScrolling(): void {
    const top = this.carousel.offsetTop;
    const scrollY = window.scrollY;
    const heightt = window.innerHeight;
    const carouselHeight = this.carousel.offsetHeight;
    const isCarouselOnScreen =
      top <= scrollY + heightt - carouselHeight / 4 &&
      top + carouselHeight / 2 >= scrollY;

    if (isCarouselOnScreen) {
      this._intervalController$.next(1);
    } else {
      this._intervalController$.next(0);
    }
  }

  // enableTouch() {
  //   this.inputs.touch = true;
  // }

  // disableTouch() {
  //   this.inputs.touch = false;
  // }

  /** store data based on width of the screen for the carousel */
  private _storeCarouselData(): void {
    this.deviceWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 1200;

    this.carouselWidth = this.carouselMain1.nativeElement.offsetWidth;
    this.carouselOffsetWidth = this.nguItemsContainer.nativeElement.offsetWidth;

    if (this.type === 'responsive') {
      // this.deviceType = 'xs';
      const offset = this.inputs.grid.offset || 1;
      this.maxSlideItems = this.inputs.grid.size;
      this.itemWidth =
        this.carouselWidth - this.carouselWidth / offset / this.maxSlideItems;
      this.itemWidthTest = this.carouselWidth / this.maxSlideItems;
      // console.log(this.carouselWidth, this.inputs.grid.offset);
    } else {
      this.maxSlideItems = Math.trunc(
        this.carouselWidth / this.inputs.grid.size
      );
      this.itemWidth = this.inputs.grid.size;
      const width =
        this.carouselOffsetWidth - this._carouselItemSize * this.maxSlideItems;
      this._maxSlideWidth = this._carouselItemSize - width;
      // this.deviceType = 'all';
    }
    console.log(this.itemWidthTest);

    this.slideItems = +(this.inputs.grid.slide < this.maxSlideItems
      ? this.inputs.grid.slide
      : this.maxSlideItems);
    this.load =
      this.inputs.load >= this.slideItems ? this.inputs.load : this.slideItems;
    this.speed =
      this.inputs.speed && this.inputs.speed > -1 ? this.inputs.speed : 400;
    // console.log('device type', this.type);
    this._carouselPoint();
  }

  /** Used to reset the carousel */
  public reset(withOutAnimation?: boolean): void {
    withOutAnimation && (this._withAnim = false);
    // this.carouselCssNode.innerHTML = '';
    this.moveTo(0);
    this._carouselPoint();
  }

  /** Init carousel point */
  private _carouselPoint(): void {
    this.carouselPoi._carouselPoint();
    // const Nos = this.dataSource.length - (this.maxSlideItems - this.slideItems);
    // this.pointIndex = Math.ceil(Nos / this.slideItems);
    // const pointers = [];

    // if (this.pointIndex > 1 || !this.inputs.point.hideOnSingleSlide) {
    //   for (let i = 0; i < this.pointIndex; i++) {
    //     pointers.push(i);
    //   }
    // }
    // this.pointNumbers = pointers;
    // this._carouselPointActiver();
    // if (this.pointIndex <= 1) {
    //   this._btnBoolean(1, 1);
    // } else {
    //   if (this.currentSlideItems === 0 && !this.loop) {
    //     this._btnBoolean(1, 0);
    //   } else {
    //     this._btnBoolean(0, 0);
    //   }
    // }
  }

  /** change the active point in carousel */
  private _carouselPointActiver(): void {
    const i = Math.ceil(this.currentSlideItems / this.slideItems);
    this.activePoint = i;
    this.cdr.markForCheck();
  }

  /** this function is used to scoll the carousel when point is clicked */
  public moveTo(slide: number, withOutAnimation?: boolean, force = false) {
    // slide = slide - 1;
    withOutAnimation && (this._withAnim = false);
    if ((this.activePoint !== slide || force) && slide < this.pointIndex) {
      this._resetAferAnimation = null;
      let slideremains;
      const btns = this.currentSlideItems < slide ? 1 : 0;

      switch (slide) {
        case 0:
          this._btnBoolean(1, 0);
          slideremains = slide * this.slideItems;
          break;
        case this.pointIndex - 1:
          this._btnBoolean(0, 1);
          slideremains = this.dataSource.length - this.maxSlideItems;
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
    if (!this.token) {
      this.token = this._generateID();
      this.styleid = `.${
        this.token
      } > .ngucarousel > .ngu-touch-container > .ngucarousel-items`;
      this._renderer.addClass(this.carousel, this.token);
    }
    const dism = '';
    this.RTL &&
      !this.vertical.enabled &&
      this._renderer.addClass(this.carousel, 'ngurtl');
    // if (this.inputs.custom === 'banner') {
    //   this._renderer.addClass(this.carousel, 'banner');
    // }

    // if (this.inputs.animation === 'lazy') {
    //   dism += `${this.styleid} > .item {transition: transform .6s ease;}`;
    // }

    let itemStyle = '';
    if (this.vertical.enabled) {
      this._carouselItemSize = this.vertical.height / +this.inputs.grid.size;
      itemStyle = `${this.styleid} > .item {height: ${
        this._carouselItemSize
      }px}`;

      // itemStyle = `${itemWidth_xs}`;
    } else if (this.type === 'responsive') {
      this._carouselItemSize =
        this.carouselOffsetWidth / +this.inputs.grid.size;
      itemStyle = `${this.styleid} .item {flex: 0 0 ${
        this._carouselItemSize
      }%; max-width: ${this._carouselItemSize}%;}`;
      // itemStyle = `${itemWidth_xs}`;
    } else {
      this._carouselItemSize = this.inputs.grid.size;
      itemStyle = `${this.styleid} .item {flex: 0 0 ${
        this.inputs.grid.size
      }px; max-width: ${this.inputs.grid.size}px;}`;
    }
    // console.log(this);

    this._createStyleElem(`${dism} ${itemStyle}`);
    this.cdr.markForCheck();
  }

  private calculateExtraItem() {
    // console.log(
    //   'carouselItemSize',
    //   this.carouselItemSize,
    //   this.slideItems,
    //   this.inputs.grid.offset
    // );
    this._extraLoopItemsWidth =
      this._carouselItemSize *
        (this.maxSlideItems + (this.inputs.grid.offset ? 1 : 0)) -
      this.inputs.grid.offset +
      this.inputs.grid.offset / 2;
  }

  /** logic to scroll the carousel step 1 */
  slide(Btn: number): void {
    let itemSpeed = this.speed;
    let currentSlide = 0;
    const touchMove = Math.ceil(this.dexVal / this.itemWidth);
    // this._setStyle(this.nguItemsContainer.nativeElement, 'transform', '');
    // this.carouselTransform = '';

    if (this.pointIndex === 1) {
      console.log('lkj');
      return;
    }

    if (Btn === 0 && ((!this.loop && !this.isFirst) || this.loop)) {
      console.log('asdf');
      // const slide = this.slideItems * this.pointIndex;
      let preLast = false;

      const currentSlideD = this.currentSlideItems - this.slideItems;
      const MoveSlide = currentSlideD + this.slideItems;
      this._btnBoolean(0, 1);
      if (this.currentSlideItems === 0 && this.loop) {
        preLast = true;
        this._btnBoolean(0, 0);
        if (touchMove > this.slideItems) {
          currentSlide = this.currentSlideItems - touchMove;
          itemSpeed = 200;
        } else {
          currentSlide =
            this.currentSlideItems -
            this.slideItems -
            (this.maxSlideItems - this.slideItems);
        }
      } else if (this.currentSlideItems === 0) {
        currentSlide = this.dataSource.length - this.maxSlideItems;
        itemSpeed = 400;
        this._btnBoolean(0, 1);
      } else if (this.slideItems >= MoveSlide) {
        currentSlide = 0;
        this._btnBoolean(1, 0);
      } else {
        this._btnBoolean(0, 0);
        if (touchMove > this.slideItems) {
          currentSlide = this.currentSlideItems - touchMove;
          itemSpeed = 200;
        } else {
          currentSlide = this.currentSlideItems - this.slideItems;
        }
      }
      this._carouselScrollTwo(
        Btn,
        currentSlide,
        itemSpeed,
        this.loop && preLast
      );
    } else if (Btn === 1 && ((!this.loop && !this.isLast) || this.loop)) {
      console.log('asdf1');
      let preLast = false;
      if (
        this.dataSource.length <=
          this.currentSlideItems + this.maxSlideItems + this.slideItems &&
        !this.isLast
      ) {
        currentSlide = this.dataSource.length - this.maxSlideItems;
        this._btnBoolean(0, 1);
      } else if (this.isLast && this.loop) {
        preLast = true;
        this._btnBoolean(1, 0);
        if (touchMove > this.slideItems) {
          currentSlide =
            this.currentSlideItems +
            this.slideItems +
            (touchMove - this.slideItems);
          itemSpeed = 200;
        } else {
          currentSlide =
            this.currentSlideItems +
            this.slideItems +
            (this.maxSlideItems - this.slideItems);
        }
      } else if (this.isLast) {
        currentSlide = 0;
        itemSpeed = 400;
        this._btnBoolean(1, 0);
      } else {
        this._btnBoolean(0, 0);
        if (touchMove > this.slideItems) {
          currentSlide =
            this.currentSlideItems +
            this.slideItems +
            (touchMove - this.slideItems);
          itemSpeed = 200;
        } else {
          currentSlide = this.currentSlideItems + this.slideItems;
        }
      }
      this._carouselScrollTwo(
        Btn,
        currentSlide,
        itemSpeed,
        this.loop && preLast
      );
    } else {
      console.log('no action');
    }
  }

  /** logic to scroll the carousel step 2 */
  private _carouselScrollTwo(
    Btn: number,
    currentSlideItems: number,
    itemSpeed: number,
    resetAferAnimation = false
  ): void {
    if (this.dexVal !== 0) {
      const val = Math.abs(this.touch.velocity);
      let somt = Math.floor(
        (this.dexVal / val / this.dexVal) * (this.deviceWidth - this.dexVal)
      );
      somt = somt > itemSpeed ? itemSpeed : somt;
      itemSpeed = somt < 200 ? 200 : somt;
      this.dexVal = 0;
    }

    if (this._withAnim) {
      this.carouselTransition = `${itemSpeed}ms ${this.inputs.easing}`;
      this.inputs.animation &&
        this._carouselAnimator(
          Btn,
          currentSlideItems + 1,
          currentSlideItems + this.maxSlideItems,
          itemSpeed,
          Math.abs(this.currentSlideItems - currentSlideItems)
        );
    } else {
      this.carouselTransition = '0ms cubic-bezier(0, 0, 0.2, 1)';
    }

    this.itemLength = this.dataSource.length;
    this._transformStyle(currentSlideItems);
    this.currentSlideItems = currentSlideItems;
    this.onMove.emit(this);
    this._carouselPointActiver();
    this._carouselLoadTrigger();
    this._withAnim = true;
    this._resetAferAnimation = resetAferAnimation ? Btn : null;
    // console.log('animation start', performance.now());
  }

  animationCompleted() {
    // console.log('animation end', performance.now());
    if (typeof this._resetAferAnimation === 'number') {
      this.moveTo(
        this._resetAferAnimation ? 0 : this.pointNumbers.length - 1,
        true
      );
    }
  }

  /** boolean function for making isFirst and isLast */
  private _btnBoolean(first: number, last: number) {
    this.isFirst = !!first;
    this.isLast = !!last;
  }

  private _transformString(items: number): string {
    let collect = '';
    collect += `translate3d(`;

    if (this.vertical.enabled) {
      this.transform = this._carouselItemSize * items;
      collect += `0, -${this.transform + this._extraLoopItemsWidth}px, 0`;
    } else {
      this.transform = this._carouselItemSize * items;
      const collectSt = this.transform + this._extraLoopItemsWidth;
      const unit = this.inputs.grid.isFixed ? 'px' : '%';
      collect += `${this._addDirectionSym(collectSt)}${unit}, 0, 0`;
    }
    collect += `)`;
    return collect;
  }

  /** set the transform style to scroll the carousel  */
  private _transformStyle(items: number): void {
    let slideCss = '';
    if (this.type === 'responsive') {
      slideCss = `${this._transformString(items)}`;
    } else {
      this.transform = this._carouselItemSize * items;
      let transVal = this.transform + this._extraLoopItemsWidth;
      if (!this.loop) {
        transVal =
          this._maxSlideWidth > transVal ? transVal : this._maxSlideWidth;
      }
      slideCss = `translate3d(${this._addDirectionSym(transVal)}px, 0, 0)`;
    }
    this.transformCarousel(slideCss, this.carouselTransition);
    // console.log(this.carouselTransform, this.carouselTransition);
  }

  private _addDirectionSym(val) {
    return val > 0 ? `${this.directionSym}${val}` : val;
  }

  /** this will trigger the carousel to load the items */
  private _carouselLoadTrigger(): void {
    if (typeof this.inputs.load === 'number') {
      this.dataSource.length - this.load <=
        this.currentSlideItems + this.maxSlideItems &&
        this.carouselLoad.emit(this.currentSlideItems);
    }
  }

  /** generate Class for each carousel to set specific style */
  private _generateID(): string {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return `ngucarousel${text}`;
  }

  /** handle the auto slide */
  private _carouselInterval(): void {
    const container = this.carouselMain1.nativeElement;
    if (this.interval && this.loop) {
      this.listener4 = this._renderer.listen('window', 'scroll', () => {
        clearTimeout(this.onScrolling);
        this.onScrolling = setTimeout(() => {
          this._onWindowScrolling();
        }, 600);
      });

      const play$ = fromEvent(container, 'mouseleave').pipe(mapTo(1));
      const pause$ = fromEvent(container, 'mouseenter').pipe(mapTo(0));

      const touchPlay$ = fromEvent(container, 'touchstart').pipe(mapTo(1));
      const touchPause$ = fromEvent(container, 'touchend').pipe(mapTo(0));

      const interval$ = interval(this.inputs.interval.timing).pipe(mapTo(1));

      setTimeout(() => {
        this.carouselInt = merge(
          play$,
          touchPlay$,
          pause$,
          touchPause$,
          this._intervalController$
        )
          .pipe(
            startWith(1),
            switchMap(val => {
              this.isHovered = !val;
              this.cdr.markForCheck();
              return val ? interval$ : EMPTY;
            })
          )
          .subscribe(res => {
            this.slide(1);
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
    const collectIndex = [];

    if (direction === 1) {
      for (let i = start - 1; i < end; i++) {
        val = val * 2;
        const viewRef = viewContainer.get(i) as any;
        if (viewRef) {
          collectIndex.push(i);
          const context = viewRef.context as any;
          context.animate = { value: true, params: { distance: val } };
        }
      }
    } else {
      for (let i = end - 1; i >= start - 1; i--) {
        val = val * 2;
        const viewRef = viewContainer.get(i) as any;
        if (viewRef) {
          collectIndex.push(i);
          const context = viewRef.context as any;
          context.animate = { value: true, params: { distance: -val } };
        }
      }
    }
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
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
}
