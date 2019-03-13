import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren as ContentChild,
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
  ViewContainerRef
} from '@angular/core';
import {
  EMPTY,
  fromEvent,
  interval,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
  fromEventPattern
} from 'rxjs';
import { mapTo, startWith, switchMap, takeUntil, debounceTime, throttleTime } from 'rxjs/operators';
import {
  NguCarouselDefDirective,
  NguCarouselOutlet,
  NguCarouselOutletLeft,
  NguCarouselOutletRight
} from './carousel.directive';
import {
  NguCarouselConfig,
  NguCarouselOutletContext,
  NguCarouselStore,
  ItemConfig
} from './interface';
import { slider } from './animation';
import { CarouselPoint } from './point';
import { generateID, rangeFor, isOnScreen } from './utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngu-carousel',
  templateUrl: 'carousel.html',
  styleUrls: ['carousel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slider]
})
// tslint:disable-next-line:component-class-suffix
export class NguCarousel<T = any> extends NguCarouselStore
  implements OnInit, AfterViewInit, OnDestroy, DoCheck {
  private _dataSubscription: Subscription;
  private _dataSource: T[];
  private _dataDiffer: IterableDiffer<{}>;
  token = generateID();

  // pointIndex: number;
  private _withAnim = true;
  isHovered = false;
  alternatives = false;

  @Input() inputs: NguCarouselConfig;
  @Output('carouselLoad') private carouselLoad = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output('onMove') private onMove = new EventEmitter<NguCarousel<T>>();
  _arrayChanges: IterableChanges<{}>;
  carouselInt: Subscription;

  // @HostBinding('class.ngurtl')
  // isRTL: boolean;
  // @HostBinding('class.nguvertical')
  // isVertical = this.vertical.enabled;
  // @HostBinding('class')
  // token: string;

  private listener3: () => void;
  // private listener4: () => void;

  _extraLoopItemsWidth: number;
  private _resetAfterAnimation: any;
  private _carouselItemSize: number;
  private _maxSlideWidth: number;
  itemWidthTest: number;
  // carouselPoi: CarouselPoint;
  windowResizeSub: Subscription;
  windowScrollSub: Subscription;
  dynamicElements = [];
  intitialDelayTimeout: any;

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

  @ContentChild(NguCarouselDefDirective)
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
  nguItemsContainer: ElementRef;

  // @ViewChild('touchContainer', { read: ElementRef })
  // private touchContainer: ElementRef;

  private _intervalController$ = new Subject<number>();

  private carousel: any;

  private onScrolling: any;

  // pointNumbers: Array<any> = [];

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
      console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}.`);
    }
    this._trackByFn = fn;
  }
  private _trackByFn: TrackByFunction<T>;
  points = new CarouselPoint(this);
  activePoint = this.points.activePoint;

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _differs: IterableDiffers,
    @Inject(PLATFORM_ID) private platformId: Object,
    public cdr: ChangeDetectorRef
  ) {
    super();
    this._renderer.addClass(this._el.nativeElement, this.token);
    this.points.buttonHandler.subscribe(([first, last]) => this._btnBoolean(first, last));
    // this.points.carouselPoints.subscribe(res => (this.pointNumbers = res));
  }

  ngOnInit() {
    this._dataDiffer = this._differs.find([]).create((_i: number, item: any) => {
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
      (item: IterableChangeRecord<T>, adjustedPreviousIndex: number, currentIndex: number) => {
        if (item.previousIndex == null) {
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
      const leftContainer = this._nodeOutletLeft.viewContainer;
      const rightContainer = this._nodeOutletRight.viewContainer;
      leftContainer.clear();
      rightContainer.clear();
      const slideItems = this.maxSlideItems;
      const rightItems = this.inputs.grid.offset ? slideItems + 1 : slideItems;

      rangeFor(0, rightItems, i => {
        // rightContainer.insert(this._nodeOutlet.viewContainer.get(i));
        this._createNodeItem(data, rightContainer, i, true);
      });

      const leftItems = this.inputs.grid.offset ? slideItems + 1 : slideItems;
      const lenght = data.length;

      rangeFor(lenght - leftItems, lenght, (val, i) => {
        this._createNodeItem(data, leftContainer, val, false, i);
      });

      this.calculateExtraItem();

      if (this.points.activePoint === 0) {
        this.transformCarousel(this._transformString(0));
        console.log('asdfsdafsdafasd', this.transform);
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
    const count = viewContainer.length;
    rangeFor(0, count, renderIndex => {
      const viewRef = viewContainer.get(renderIndex) as any;
      const context = viewRef.context as any;
      context.count = count;
      context.first = renderIndex === 0;
      context.last = renderIndex === count - 1;
      context.even = renderIndex % 2 === 0;
      context.odd = !context.even;
      context.index = renderIndex;
    });
  }

  private _getNodeDef(data: T, i: number): NguCarouselDefDirective<T> {
    if (this._defDirec.length === 1) {
      return this._defDirec.first;
    }

    const nodeDef =
      this._defDirec.find(def => def.when && def.when(i, data)) || this._defaultNodeDef;

    return nodeDef;
  }

  ngAfterViewInit() {
    this.carousel = this._el.nativeElement;
    this.changeGridConfig();
    this._observeRenderChanges();

    if (isPlatformBrowser(this.platformId)) {
      this._carouselInterval();
      this.windowResizeSub = fromEventPattern(
        (handler: any) => this._renderer.listen('window', 'resize', handler),
        (handler, token) => handler()
      )
        .pipe(debounceTime(500))
        .subscribe(res => this._onResizing(res));

      this._onWindowScrolling();
    }
    this.cdr.markForCheck();
  }

  changeGridConfig(grid?: ItemConfig) {
    if (grid) {
      this.inputs.grid = grid;
    }
    this.validateInputs(this.inputs);
    this._carouselSize();
    this._storeCarouselData();
    this.calculateExtraItem();

    if (grid) {
      this.extraItemsContainer(this._dataSource);
      this.moveTo(Math.max(0, Math.ceil(this.currentSlideItems / this.slideItems) - 1), true, true);
    }
  }

  ngOnDestroy() {
    this.carouselInt && this.carouselInt.unsubscribe();
    this._dataSubscription.unsubscribe();
    this._intervalController$.complete();
    this.carouselLoad.complete();
    this.onMove.complete();
    this.windowScrollSub && this.windowScrollSub.unsubscribe();
    this.windowResizeSub && this.windowResizeSub.unsubscribe();
    this._removeElements();
    clearTimeout(this.intitialDelayTimeout);

    /** remove listeners */
    rangeFor(1, 5, i => {
      const listener = `listener${i}`;
      this[listener] && this[listener]();
    });
  }

  private _onResizing(event: any): void {
    if (this.deviceWidth !== event.target.outerWidth) {
      this._storeCarouselData();
    }
  }

  transformCarousel(transform: string, transition = '') {
    console.log('asdfsdafsdafsda');
    // this.alternatives = !this.alternatives;
    // this.carouselTransition = transition || '0ms';
    // this.carouselTransform = transform;
    this.setTransform(transform, transition);
    // this.cdr.detectChanges();
  }

  /** this fn used to disable the interval when it is not on the viewport */
  private _onWindowScrolling(): void {
    const { offsetTop, offsetHeight } = this.carousel;
    this._intervalController$.next(+isOnScreen(offsetTop, offsetHeight));
  }

  /** store data based on width of the screen for the carousel */
  private _storeCarouselData(): void {
    this.deviceWidth = isPlatformBrowser(this.platformId) ? window.innerWidth : 1200;

    this.carouselWidth = this.carouselMain1.nativeElement.offsetWidth;
    this.carouselOffsetWidth = this.nguItemsContainer.nativeElement.offsetWidth;
    const grid = this.inputs.grid;

    if (this.type === 'responsive') {
      const offset = grid.offset || 1;
      this.maxSlideItems = grid.size;
      this.itemWidth = (this.carouselWidth - this.carouselWidth / offset) / this.maxSlideItems;
      this.itemWidthTest = this.carouselWidth / this.maxSlideItems;
    } else {
      this.maxSlideItems = Math.trunc(this.carouselWidth / grid.size);
      this.itemWidth = grid.size;
      const width = this.carouselOffsetWidth - this._carouselItemSize * this.maxSlideItems;
      this._maxSlideWidth = this._carouselItemSize - width;
    }

    this.slideItems = +(grid.slide < this.maxSlideItems ? grid.slide : this.maxSlideItems);
    this.load = this.inputs.load >= this.slideItems ? this.inputs.load : this.slideItems;
    this.speed = this.inputs.speed && this.inputs.speed > -1 ? this.inputs.speed : 400;
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
    this.points._carouselPoint();
  }

  /** this function is used to scoll the carousel when point is clicked */
  public moveTo(slide: number, withoutAnimation?: boolean, force = false) {
    // slide = slide - 1;
    withoutAnimation && (this._withAnim = false);
    if ((this.points.activePoint !== slide || force) && slide < this.points.pointIndex) {
      this._resetAfterAnimation = null;
      let slideremains: number;

      switch (slide) {
        case 0:
          this._btnBoolean(1, 0);
          slideremains = slide * this.slideItems;
          break;
        case this.points.pointIndex - 1:
          this._btnBoolean(0, 1);
          slideremains = this.dataSource.length - this.maxSlideItems;
          break;
        default:
          this._btnBoolean(0, 0);
          slideremains = slide * this.slideItems;
      }

      const btns = this.currentSlideItems < slide ? 1 : 0;
      this._carouselScrollTwo(btns, slideremains, this.speed);
    }
  }

  /** set the style of the carousel based the inputs data */
  private _carouselSize(): void {
    const styleid = `.${this.token} > .ngucarousel > .ngu-touch-container > .ngucarousel-items`;

    // const dism = '';
    if (this.RTL && !this.vertical.enabled) this._renderer.addClass(this.carousel, 'ngurtl');

    let itemStyle = '';
    if (this.vertical.enabled) {
      this._carouselItemSize = this.vertical.height / +this.inputs.grid.size;
      itemStyle = `${styleid} > .item {height: ${this._carouselItemSize}px}`;
    } else if (this.type === 'responsive') {
      this._carouselItemSize = this.carouselOffsetWidth / +this.inputs.grid.size;
      itemStyle = this.getStyleStr(styleid, this._carouselItemSize, '%');
    } else {
      this._carouselItemSize = this.inputs.grid.size;
      itemStyle = this.getStyleStr(styleid, this.inputs.grid.size, 'px');
    }

    this._createStyleElem(itemStyle);
    this.cdr.markForCheck();
  }

  private getStyleStr(styleid: string, size: number, sym: string) {
    return `${styleid} .item {flex: 0 0 ${size + sym}; max-width: ${size + sym};}`;
  }

  calculateExtraItem() {
    const offset = this.inputs.grid.offset;
    this._extraLoopItemsWidth =
      this._carouselItemSize * (this.maxSlideItems + (offset ? 1 : 0)) - offset + offset / 2;
  }

  /** logic to scroll the carousel step 1 */
  slide(Btn: number): void {
    let itemSpeed = this.speed;
    let currentSlide = 0;
    const touchMove = Math.ceil(this.dexVal / this.itemWidth);

    if (this.points.pointIndex === 1) {
      console.log('lkj');
      return;
    }

    if (Btn === 0 && ((!this.loop && !this.isFirst) || this.loop)) {
      let preLast = false;

      const prevSlide = this.currentSlideItems - this.slideItems;
      const MoveSlide = prevSlide;
      this._btnBoolean(0, 1);
      if (this.currentSlideItems === 0 && this.loop) {
        preLast = true;
        this._btnBoolean(0, 0);
        if (touchMove > this.slideItems) {
          currentSlide = this.currentSlideItems - touchMove;
          itemSpeed = 200;
        } else {
          currentSlide = prevSlide - (this.maxSlideItems - this.slideItems);
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
          currentSlide = prevSlide;
        }
      }
      this._carouselScrollTwo(Btn, currentSlide, itemSpeed, this.loop && preLast);
    } else if (Btn === 1 && ((!this.loop && !this.isLast) || this.loop)) {
      let preLast = false;
      const nextSlide = this.currentSlideItems + this.slideItems;
      const isMaxSilde =
        this.dataSource.length <= this.currentSlideItems + this.maxSlideItems + this.slideItems;
      if (isMaxSilde && !this.isLast) {
        currentSlide = this.dataSource.length - this.maxSlideItems;
        this._btnBoolean(0, 1);
      } else if (this.isLast && this.loop) {
        preLast = true;
        this._btnBoolean(1, 0);
        if (touchMove > this.slideItems) {
          currentSlide = nextSlide + (touchMove - this.slideItems);
          itemSpeed = 200;
        } else {
          currentSlide = nextSlide + (this.maxSlideItems - this.slideItems);
        }
      } else if (this.isLast) {
        currentSlide = 0;
        itemSpeed = 400;
        this._btnBoolean(1, 0);
      } else {
        this._btnBoolean(0, 0);
        if (touchMove > this.slideItems) {
          currentSlide = nextSlide + (touchMove - this.slideItems);
          itemSpeed = 200;
        } else {
          currentSlide = nextSlide;
        }
      }
      this._carouselScrollTwo(Btn, currentSlide, itemSpeed, this.loop && preLast);
    } else {
      console.log('no action');
    }
  }

  setTransform(transform: string, transition = '') {
    const cssBox = this.nguItemsContainer.nativeElement.style;
    cssBox.transition = transition;
    cssBox.transform = transform;
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
      let somt = Math.floor((this.dexVal / val / this.dexVal) * (this.deviceWidth - this.dexVal));
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
    this.points.carouselPointActiver();
    this._carouselLoadTrigger();
    this._withAnim = true;
    this._resetAfterAnimation = resetAferAnimation ? Btn : null;
  }

  animationCompleted() {
    if (typeof this._resetAfterAnimation === 'number') {
      this.moveTo(this._resetAfterAnimation ? 0 : this.points.pointIndex - 1, true);
    }
  }

  /** boolean function for making isFirst and isLast */
  private _btnBoolean(first: number, last: number) {
    this.isFirst = !!first;
    this.isLast = !!last;
  }

  _transformString(items: number): string {
    let collect = '';

    if (this.vertical.enabled) {
      this.transform = this._carouselItemSize * items + this._extraLoopItemsWidth;
      collect += `0, -${this.transform}px, 0`;
    } else {
      const transform = this._carouselItemSize * items;

      this.transform = transform + this._extraLoopItemsWidth;
      const unit = this.type === 'fixed' ? 'px' : '%';
      collect += `${this._addDirectionSym(this.transform)}${unit}, 0, 0`;
    }

    return `translate3d(${collect})`;
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
        transVal = this._maxSlideWidth > transVal ? transVal : this._maxSlideWidth;
      }
      slideCss = `translate3d(${this._addDirectionSym(transVal)}px, 0, 0)`;
    }
    this.transformCarousel(slideCss, this.carouselTransition);
  }

  private _addDirectionSym(val: number) {
    return val > 0 ? `${this.directionSym}${val}` : val;
  }

  /** this will trigger the carousel to load the items */
  private _carouselLoadTrigger(): void {
    if (typeof this.inputs.load === 'number') {
      this.dataSource.length - this.load <= this.currentSlideItems + this.maxSlideItems &&
        this.carouselLoad.emit(this.currentSlideItems);
    }
  }

  /** handle the auto slide */
  private _carouselInterval(): void {
    const container = this.carouselMain1.nativeElement;
    if (this.interval && this.loop) {
      this.windowScrollSub = fromEvent(window, 'scroll')
        .pipe(throttleTime(600))
        .subscribe(() => this._onWindowScrolling());

      const play$ = fromEvent(container, 'mouseleave').pipe(mapTo(1));
      const pause$ = fromEvent(container, 'mouseenter').pipe(mapTo(0));

      const touchPlay$ = fromEvent(container, 'touchstart').pipe(mapTo(1));
      const touchPause$ = fromEvent(container, 'touchend').pipe(mapTo(0));

      const interval$ = interval(this.inputs.interval.timing).pipe(mapTo(1));

      this.intitialDelayTimeout = setTimeout(() => {
        this.carouselInt = merge(play$, touchPlay$, pause$, touchPause$, this._intervalController$)
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
        this.testanim(viewContainer, i, collectIndex, val);
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

  private testanim(viewContainer: ViewContainerRef, i: number, collectIndex: any[], val: number) {
    const viewRef = viewContainer.get(i) as any;
    if (viewRef) {
      collectIndex.push(i);
      const context = viewRef.context as any;
      context.animate = { value: true, params: { distance: val } };
    }
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

  /** For generating style tag */
  private _createStyleElem(datas?: string) {
    const styleItem = this._renderer.createElement('style');
    if (datas) {
      const styleText = this._renderer.createText(datas);
      this._renderer.appendChild(styleItem, styleText);
    }
    this._renderer.appendChild(this.carousel, styleItem);
    this.dynamicElements.push(styleItem);
    return styleItem;
  }

  private _removeElements() {
    this.dynamicElements.forEach(e => {
      this._renderer.removeChild(this.carousel, e);
      this._renderer.destroyNode(e);
    });
  }
}
