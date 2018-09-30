import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  IterableChangeRecord,
  ChangeDetectorRef,
  DoCheck,
  IterableChanges
} from '@angular/core';
import {
  NguCarouselItemDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguCarouselDefDirective,
  NguCarouselOutlet
} from './../ngu-carousel.directive';
import {
  NguCarouselConfig,
  NguCarouselStore,
  NguCarouselOutletContext
} from './ngu-carousel';
import {
  Observable,
  Subscription,
  of,
  fromEvent,
  interval,
  merge,
  empty,
  Subject
} from 'rxjs';
import { mapTo, startWith, switchMap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngu-carousel',
  templateUrl: 'ngu-carousel.component.html',
  styleUrls: ['ngu-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// tslint:disable-next-line:component-class-suffix
export class NguCarousel extends NguCarouselStore
  implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, DoCheck {
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

  @Input('inputs')
  private inputs: NguCarouselConfig;
  @Output('carouselLoad')
  private carouselLoad = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output('onMove')
  private onMove = new EventEmitter<NguCarousel>();
  // isFirstss = 0;
  arrayChanges: IterableChanges<{}>;
  carouselInt: Subscription;

  listener1: () => void;
  listener2: () => void;
  listener3: () => void;
  listener8: () => void;

  @Input('dataSource')
  get dataSource(): any {
    return this._dataSource;
  }
  set dataSource(data: any) {
    if (data) {
      // console.log(data, this.dataSource);
      // this.isFirstss++;
      this._switchDataSource(data);
    }
  }

  private _defaultNodeDef: NguCarouselDefDirective<any> | null;

  @ContentChildren(NguCarouselDefDirective)
  private _defDirec: QueryList<NguCarouselDefDirective<any>>;

  @ViewChild(NguCarouselOutlet)
  _nodeOutlet: NguCarouselOutlet;

  /** The setter is used to catch the button if the button has ngIf
   * issue id #91
   */
  @ContentChild(NguCarouselNextDirective, { read: ElementRef })
  set nextBtn(btn: ElementRef) {
    this.listener2 && this.listener2();
    if (btn) {
      this.listener2 = this._renderer.listen(btn.nativeElement, 'click', () =>
        this._carouselScrollOne(1)
      );
    }
  }

  /** The setter is used to catch the button if the button has ngIf
   * issue id #91
   */
  @ContentChild(NguCarouselPrevDirective, { read: ElementRef })
  set prevBtn(btn: ElementRef) {
    this.listener1 && this.listener1();
    if (btn) {
      this.listener1 = this._renderer.listen(btn.nativeElement, 'click', () =>
        this._carouselScrollOne(0)
      );
    }
  }

  @ViewChild('ngucarousel', { read: ElementRef })
  private carouselMain1: ElementRef;

  @ViewChild('nguItemsContainer', { read: ElementRef })
  private nguItemsContainer: ElementRef;

  @ViewChild('touchContainer', { read: ElementRef })
  private touchContainer: ElementRef;

  private _intervalController$ = new Subject<number>();

  private carousel: any;

  private onResize: any;
  private onScrolling: any;

  pointNumbers: Array<any> = [];

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _differs: IterableDiffers,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this._dataDiffer = this._differs.find([]).create(null);
  }

  ngDoCheck() {
    this.arrayChanges = this._dataDiffer.diff(this.dataSource);
    if (this.arrayChanges && this._defDirec) {
      // console.log('Changes detected!');
      this._observeRenderChanges();
    }
  }

  _switchDataSource(dataSource: any): any {
    this._dataSource = dataSource;
    // console.log('carouselSwitch', this._defDirec);
    // if (this._defDirec && this.isFirstss > 1) {
    if (this._defDirec) {
      // console.log('carouselobser', this._defDirec);
      this._observeRenderChanges();
    }
  }

  private _observeRenderChanges() {
    let dataStream: Observable<any[]> | undefined;

    if (Array.isArray(this._dataSource)) {
      dataStream = of(this._dataSource);
    }

    if (dataStream) {
      this._dataSubscription = dataStream.subscribe(data => {
        this.renderNodeChanges(data);
        this.isLast = false;
        // console.log('observerRender', !!this.carousel);
        // console.log(this.carouselMain1.nativeElement.offsetWidth);
        // this._storeCarouselData();
        // this._buttonControl();
      });
    }
  }

  renderNodeChanges(
    data: any[],
    dataDiffer: IterableDiffer<any> = this._dataDiffer,
    viewContainer: ViewContainerRef = this._nodeOutlet.viewContainer,
    parentData?: any
  ) {
    // console.log(data);
    // const changes = dataDiffer.diff(data);
    // console.log(this.arrayChanges);
    if (!this.arrayChanges) {
      return;
    }
    // console.log(this.arrayChanges);
    this.arrayChanges.forEachOperation(
      (
        item: IterableChangeRecord<any>,
        adjustedPreviousIndex: number,
        currentIndex: number
      ) => {
        // const node = this._defDirec.find(items => item.item);
        const node = this._getNodeDef(data[currentIndex], currentIndex);
        const context = new NguCarouselOutletContext<any>(data[currentIndex]);
        // console.log(context);
        context.index = currentIndex;
        // if (item.previousIndex == null) {
        viewContainer.createEmbeddedView(node.template, context, currentIndex);
        // } else if (currentIndex == null) {
        //   viewContainer.remove(adjustedPreviousIndex);
        //   this._levels.delete(item.item);
        // } else {
        //   const view = viewContainer.get(adjustedPreviousIndex);
        //   viewContainer.move(view!, currentIndex);
        // }
      }
    );
    if (this.carousel) {
      this._storeCarouselData();
    }
    // console.log(this.dataSource);
  }

  _getNodeDef(data: any, i: number): NguCarouselDefDirective<any> {
    // console.log(this._defDirec);
    if (this._defDirec.length === 1) {
      return this._defDirec.first;
    }

    const nodeDef =
      this._defDirec.find(def => def.when && def.when(i, data)) ||
      this._defaultNodeDef;

    return nodeDef;
  }

  ngAfterViewInit() {
    this.carousel = this._el.nativeElement;
    this._inputValidation();

    this.carouselCssNode = this._createStyleElem();

    this._buttonControl();

    if (window) {
      this._carouselInterval();
      if (!this.vertical.enabled) {
        this._touch();
      }
      this.listener3 = this._renderer.listen('window', 'resize', event => {
        this._onResizing(event);
      });
      this._onWindowScrolling();
    }
  }

  ngAfterContentInit() {
    this._observeRenderChanges();

    this.cdr.markForCheck();
  }

  private _inputValidation() {
    this.type = this.inputs.grid.all !== 0 ? 'fixed' : 'responsive';
    this.loop = this.inputs.loop || false;
    this.inputs.easing = this.inputs.easing || 'cubic-bezier(0, 0, 0.2, 1)';
    this.touch.active = this.inputs.touch || false;
    this.RTL = this.inputs.RTL ? true : false;
    this.interval = this.inputs.interval || null;
    this.velocity =
      typeof this.inputs.velocity === 'number'
        ? this.inputs.velocity
        : this.velocity;

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
    // clearInterval(this.carouselInt);
    this.carouselInt && this.carouselInt.unsubscribe();
    this._intervalController$.unsubscribe();
    this.carouselLoad.complete();
    this.onMove.complete();

    /** remove listeners */
    for (let i = 1; i <= 8; i++) {
      this[`listener${i}`] && this[`listener${i}`]();
    }
  }

  private _onResizing(event: any): void {
    clearTimeout(this.onResize);
    this.onResize = setTimeout(() => {
      if (this.deviceWidth !== event.target.outerWidth) {
        this._setStyle(this.nguItemsContainer.nativeElement, 'transition', ``);
        this._storeCarouselData();
      }
    }, 500);
  }

  /** Get Touch input */
  private _touch(): void {
    if (this.inputs.touch) {
      const hammertime = new Hammer(this.touchContainer.nativeElement);
      hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

      hammertime.on('panstart', (ev: any) => {
        this.carouselWidth = this.nguItemsContainer.nativeElement.offsetWidth;
        this.touchTransform = this.transform[this.deviceType];
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
      hammertime.on('panend', (ev: any) => {
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
      hammertime.on('hammer.input', function(ev) {
        // allow nested touch events to no propagate, this may have other side affects but works for now.
        // TODO: It is probably better to check the source element of the event and only apply the handle to the correct carousel
        ev.srcEvent.stopPropagation();
      });
    }
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
            (this.vertical.enabled
              ? this.vertical.height
              : this.carouselWidth)) *
          100
        : valt;
    this.dexVal = ev;
    this.touch.swipe = e;
    this._setTouchTransfrom(e, valt);
    this._setTransformFromTouch();
  }

  private _setTouchTransfrom(e: string, valt: number) {
    const condition = this.RTL ? 'panright' : 'panleft';
    this.touchTransform =
      e === condition ? valt + this.touchTransform : this.touchTransform - valt;
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
      top <= scrollY + heightt - carouselHeight / 4 &&
      top + carouselHeight / 2 >= scrollY;

    if (isCarouselOnScreen) {
      // this._carouselIntervalEvent(0);
      this._intervalController$.next(1);
    } else {
      this._intervalController$.next(0);
      // this._carouselIntervalEvent(1);
    }
  }

  /** store data based on width of the screen for the carousel */
  private _storeCarouselData(): void {
    this.deviceWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 1200;

    this.carouselWidth = this.carouselMain1.nativeElement.offsetWidth;

    if (this.type === 'responsive') {
      this.deviceType =
        this.deviceWidth >= 1200
          ? 'lg'
          : this.deviceWidth >= 992
            ? 'md'
            : this.deviceWidth >= 768
              ? 'sm'
              : 'xs';

      this.items = this.inputs.grid[this.deviceType];
      this.itemWidth = this.carouselWidth / this.items;
    } else {
      this.items = Math.trunc(this.carouselWidth / this.inputs.grid.all);
      this.itemWidth = this.inputs.grid.all;
      this.deviceType = 'all';
    }

    this.slideItems = +(this.inputs.slide < this.items
      ? this.inputs.slide
      : this.items);
    this.load =
      this.inputs.load >= this.slideItems ? this.inputs.load : this.slideItems;
    this.speed =
      this.inputs.speed && this.inputs.speed > -1 ? this.inputs.speed : 400;
    this._carouselPoint();
  }

  /** Used to reset the carousel */
  public reset(withOutAnimation?: boolean): void {
    withOutAnimation && (this.withAnim = false);
    this.carouselCssNode.innerHTML = '';
    this.moveTo(0);
    this._carouselPoint();
  }

  /** Init carousel point */
  private _carouselPoint(): void {
    // debugger;
    // if (this.userData.point.visible === true) {
    const Nos = this.dataSource.length - (this.items - this.slideItems);
    this.pointIndex = Math.ceil(Nos / this.slideItems);
    const pointers = [];

    if (this.pointIndex > 1 || !this.inputs.point.hideOnSingleSlide) {
      for (let i = 0; i < this.pointIndex; i++) {
        pointers.push(i);
      }
    }
    this.pointNumbers = pointers;
    // console.log(this.pointNumbers);
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
    this._buttonControl();
    // }
  }

  /** change the active point in carousel */
  private _carouselPointActiver(): void {
    const i = Math.ceil(this.currentSlide / this.slideItems);
    this.activePoint = i;
    // console.log(this.data);
    this.cdr.markForCheck();
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
    this.styleid = `.${
      this.token
    } > .ngucarousel > .ngu-touch-container > .ngucarousel-items`;

    if (this.inputs.custom === 'banner') {
      this._renderer.addClass(this.carousel, 'banner');
    }

    if (this.inputs.animation === 'lazy') {
      dism += `${this.styleid} > .item {transition: transform .6s ease;}`;
    }

    let itemStyle = '';
    if (this.vertical.enabled) {
      const itemWidth_xs = `${this.styleid} > .item {height: ${this.vertical
        .height / +this.inputs.grid.xs}px}`;
      const itemWidth_sm = `${this.styleid} > .item {height: ${this.vertical
        .height / +this.inputs.grid.sm}px}`;
      const itemWidth_md = `${this.styleid} > .item {height: ${this.vertical
        .height / +this.inputs.grid.md}px}`;
      const itemWidth_lg = `${this.styleid} > .item {height: ${this.vertical
        .height / +this.inputs.grid.lg}px}`;

      itemStyle = `@media (max-width:767px){${itemWidth_xs}}
                    @media (min-width:768px){${itemWidth_sm}}
                    @media (min-width:992px){${itemWidth_md}}
                    @media (min-width:1200px){${itemWidth_lg}}`;
    } else if (this.type === 'responsive') {
      const itemWidth_xs =
        this.inputs.type === 'mobile'
          ? `${this.styleid} .item {flex: 0 0 ${95 /
              +this.inputs.grid.xs}%; width: ${95 / +this.inputs.grid.xs}%;}`
          : `${this.styleid} .item {flex: 0 0 ${100 /
              +this.inputs.grid.xs}%; width: ${100 / +this.inputs.grid.xs}%;}`;

      const itemWidth_sm = `${this.styleid} > .item {flex: 0 0 ${100 /
        +this.inputs.grid.sm}%; width: ${100 / +this.inputs.grid.sm}%}`;
      const itemWidth_md = `${this.styleid} > .item {flex: 0 0 ${100 /
        +this.inputs.grid.md}%; width: ${100 / +this.inputs.grid.md}%}`;
      const itemWidth_lg = `${this.styleid} > .item {flex: 0 0 ${100 /
        +this.inputs.grid.lg}%; width: ${100 / +this.inputs.grid.lg}%}`;

      itemStyle = `@media (max-width:767px){${itemWidth_xs}}
                    @media (min-width:768px){${itemWidth_sm}}
                    @media (min-width:992px){${itemWidth_md}}
                    @media (min-width:1200px){${itemWidth_lg}}`;
    } else {
      itemStyle = `${this.styleid} .item {flex: 0 0 ${
        this.inputs.grid.all
      }px; width: ${this.inputs.grid.all}px;}`;
    }

    this._renderer.addClass(this.carousel, this.token);
    if (this.vertical.enabled) {
      this._renderer.addClass(
        this.nguItemsContainer.nativeElement,
        'nguvertical'
      );
      this._renderer.setStyle(
        this.carouselMain1.nativeElement,
        'height',
        `${this.vertical.height}px`
      );
    }

    // tslint:disable-next-line:no-unused-expression
    this.RTL &&
      !this.vertical.enabled &&
      this._renderer.addClass(this.carousel, 'ngurtl');
    this._createStyleElem(`${dism} ${itemStyle}`);
    this._storeCarouselData();
  }

  /** logic to scroll the carousel step 1 */
  private _carouselScrollOne(Btn: number): void {
    let itemSpeed = this.speed;
    let translateXval,
      currentSlide = 0;
    const touchMove = Math.ceil(this.dexVal / this.itemWidth);
    this._setStyle(this.nguItemsContainer.nativeElement, 'transform', '');

    if (this.pointIndex === 1) {
      return;
    } else if (Btn === 0 && ((!this.loop && !this.isFirst) || this.loop)) {
      const slide = this.slideItems * this.pointIndex;

      const currentSlideD = this.currentSlide - this.slideItems;
      const MoveSlide = currentSlideD + this.slideItems;
      this._btnBoolean(0, 1);
      if (this.currentSlide === 0) {
        currentSlide = this.dataSource.length - this.items;
        itemSpeed = 400;
        this._btnBoolean(0, 1);
      } else if (this.slideItems >= MoveSlide) {
        currentSlide = translateXval = 0;
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
        this.dataSource.length <=
          this.currentSlide + this.items + this.slideItems &&
        !this.isLast
      ) {
        currentSlide = this.dataSource.length - this.items;
        this._btnBoolean(0, 1);
      } else if (this.isLast) {
        currentSlide = translateXval = 0;
        itemSpeed = 400;
        this._btnBoolean(1, 0);
      } else {
        this._btnBoolean(0, 0);
        if (touchMove > this.slideItems) {
          currentSlide =
            this.currentSlide + this.slideItems + (touchMove - this.slideItems);
          itemSpeed = 200;
        } else {
          currentSlide = this.currentSlide + this.slideItems;
        }
      }
      this._carouselScrollTwo(Btn, currentSlide, itemSpeed);
    }

    // cubic-bezier(0.15, 1.04, 0.54, 1.13)
  }

  /** logic to scroll the carousel step 2 */
  private _carouselScrollTwo(
    Btn: number,
    currentSlide: number,
    itemSpeed: number
  ): void {
    // tslint:disable-next-line:no-unused-expression

    if (this.dexVal !== 0) {
      const val = Math.abs(this.touch.velocity);
      let somt = Math.floor(
        (this.dexVal / val / this.dexVal) * (this.deviceWidth - this.dexVal)
      );
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
      // this.inputs.animation &&
      //   this._carouselAnimator(
      //     Btn,
      //     currentSlide + 1,
      //     currentSlide + this.items,
      //     itemSpeed,
      //     Math.abs(this.currentSlide - currentSlide)
      //   );
    } else {
      this._setStyle(this.nguItemsContainer.nativeElement, 'transition', ``);
    }
    // console.log(this.dataSource);
    this.itemLength = this.dataSource.length;
    this._transformStyle(currentSlide);
    this.currentSlide = currentSlide;
    this.onMove.emit(this);
    this._carouselPointActiver();
    this._carouselLoadTrigger();
    this._buttonControl();
    this.withAnim = true;
    // if (currentSlide === 12) {
    //   this._switchDataSource(this.dataSource);
    // }
  }

  /** boolean function for making isFirst and isLast */
  private _btnBoolean(first: number, last: number) {
    this.isFirst = !!first;
    this.isLast = !!last;
  }

  private _transformString(grid: string, slide: number): string {
    let collect = '';
    collect += `${this.styleid} { transform: translate3d(`;

    if (this.vertical.enabled) {
      this.transform[grid] =
        (this.vertical.height / this.inputs.grid[grid]) * slide;
      collect += `0, -${this.transform[grid]}px, 0`;
    } else {
      this.transform[grid] = (100 / this.inputs.grid[grid]) * slide;
      collect += `${this.directionSym}${this.transform[grid]}%, 0, 0`;
    }
    collect += `); }`;
    return collect;
  }

  /** set the transform style to scroll the carousel  */
  private _transformStyle(slide: number): void {
    let slideCss = '';
    if (this.type === 'responsive') {
      slideCss = `@media (max-width: 767px) {${this._transformString(
        'xs',
        slide
      )}}
      @media (min-width: 768px) {${this._transformString('sm', slide)} }
      @media (min-width: 992px) {${this._transformString('md', slide)} }
      @media (min-width: 1200px) {${this._transformString('lg', slide)} }`;
    } else {
      this.transform.all = this.inputs.grid.all * slide;
      slideCss = `${this.styleid} { transform: translate3d(${
        this.directionSym
      }${this.transform.all}px, 0, 0);`;
    }
    this.carouselCssNode.innerHTML = slideCss;
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
      // this.listener4 = this._renderer.listen(container, 'touchstart', () => {
      //   this._carouselIntervalEvent(1);
      // });

      // this.listener5 = this._renderer.listen(container, 'touchend', () => {
      //   this._carouselIntervalEvent(0);
      // });

      // this.listener6 = this._renderer.listen(container, 'mouseenter', () => {
      //   this._carouselIntervalEvent(1);
      //   this.isHovered = true;
      // });

      // this.listener7 = this._renderer.listen(container, 'mouseleave', () => {
      //   this._carouselIntervalEvent(0);
      //   this.isHovered = false;
      // });

      this.listener8 = this._renderer.listen('window', 'scroll', () => {
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
        // this.carouselInt = setInterval(() => {
        //   !this.pauseCarousel && this._carouselScrollOne(1);
        // }, this.inputs.interval.timing);

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
              return val ? interval$ : empty();
            })
          )
          .subscribe(res => {
            this._carouselScrollOne(1);
          });
      }, this.interval.initialDelay);
    }
  }

  /** pause interval for specific time */
  // private _carouselIntervalEvent(ev: number): void {
  //   this.evtValue = ev;
  //   if (this.evtValue === 0) {
  //     clearTimeout(this.pauseInterval);
  //     this.pauseInterval = setTimeout(() => {
  //       // tslint:disable-next-line:no-unused-expression
  //       this.evtValue === 0 && (this.pauseCarousel = false);
  //     }, this.inputs.interval);
  //   } else {
  //     this.pauseCarousel = true;
  //   }
  // }

  /** animate the carousel items */
  private _carouselAnimator(
    direction: number,
    start: number,
    end: number,
    speed: number,
    length: number
  ): void {
    let val = length < 5 ? length : 5;
    val = val === 1 ? 3 : val;
    console.log(this._defDirec);
    const itemList = this._defDirec.toArray();

    if (direction === 1) {
      for (let i = start - 1; i < end; i++) {
        val = val * 2;
        itemList[i].template.elementRef.nativeElement &&
          this._setStyle(
            itemList[i].template.elementRef.nativeElement,
            'transform',
            `translate3d(${val}px, 0, 0)`
          );
      }
    } else {
      for (let i = end - 1; i >= start - 1; i--) {
        val = val * 2;
        itemList[i] &&
          this._setStyle(
            itemList[i],
            'transform',
            `translate3d(-${val}px, 0, 0)`
          );
      }
    }
    setTimeout(() => {
      this._defDirec.forEach(elem =>
        this._setStyle(
          elem.template.elementRef.nativeElement,
          'transform',
          `translate3d(0, 0, 0)`
        )
      );
    }, speed * 0.7);
  }

  /** control button for loop */
  private _buttonControl(): void {
    let arr = [];
    if (!this.loop || (this.isFirst && this.isLast)) {
      arr = [this.isFirst ? 'none' : 'block', this.isLast ? 'none' : 'block'];
    } else {
      arr = ['block', 'block'];
    }
    // this._setStyle(this.prev.nativeElement, 'display', arr[0]);
    // this._setStyle(this.next.nativeElement, 'display', arr[1]);
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
