import {
  Touch,
  Vertical,
  CarouselInterval,
  NguButton,
  ItemsControl,
  CarouselType,
  NguCarouselConfig,
  ItemConfig,
  generateID
} from './ngu-carousel';
import { BehaviorSubject, Subject, merge, fromEvent } from 'rxjs';
import { CarouselPoint } from './carousel-point';
import { debounceTime, filter } from 'rxjs/operators';

export class Carousel {
  dataSource = new BehaviorSubject([]);
  points = new BehaviorSubject([]);
  slide = new Subject();
  transformss = new Subject<any>();
  stylesWrite = new Subject<any>();
  carouselPoi = new CarouselPoint(this);

  touch = new Touch();
  vertical = new Vertical();
  interval?: CarouselInterval;
  transform = 0;
  button?: NguButton;
  visibleItems?: ItemsControl;
  type: CarouselType = 'fixed';
  token = '';
  maxSlideItems = 0;
  load = 0;
  deviceWidth = 0;
  carouselWidth = 0;
  itemWidth = 0;
  slideItems = 0;
  itemWidthPer = 0;
  itemLength = 0;
  currentSlideItems = 0;
  resetOnDataChange = false;
  easing = 'cubic-bezier(0.35, 0, 0.25, 1)';
  speed = 200;
  loop = false;
  dexVal = 0;
  touchTransform = 0;
  isEnd = false;
  isFirst = true;
  isLast = false;
  RTL = false;
  point = true;
  velocity = 0;
  directionSym = '';
  carouselTransition = `500ms ${this.easing}`;
  carouselTransform = `translate3d(0,0,0)`;
  carouselOffsetWidth = 100;
  inputs: NguCarouselConfig;
  styleid: string;
  _carouselItemSize: number;
  alternatives = false;
  isBrowser = true;
  _maxSlideWidth: number;
  carouselMain1: any;
  nguItemsContainer: any;
  _extraLoopItemsWidth: number;
  pointIndex: number;
  _withAnim: boolean;
  activePoint: number;
  _resetAferAnimation: any;
  _dataSource: any;
  pointNumbers: any[];
  itemWidthTest = 0;

  constructor() {
    this.dataSource.subscribe(res => console.log(res));
    merge(this.slide).subscribe(res => console.log(res));
    this.carouselPoi.buttonHandler.subscribe(([first, last]) => this._btnBoolean(first, last));
    this.tokenFn();
  }

  extrasForBrowser() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(500),
        filter((e: any) => this.isWidthChanged(e.target.outerWidth))
      )
      .subscribe(event => {
        this._storeCarouselData();
      });
  }

  mergeUserInput(data: NguCarouselConfig) {
    console.log(data);
    if (!data) return;

    this.inputs = data;
    this.type = data.grid.type || 'responsive';
    this.loop = data.loop || false;
    data.easing = data.easing || 'cubic-bezier(0, 0, 0.2, 1)';
    this.carouselTransition = data.easing;
    this.touch.active = data.touch || false;
    this.RTL = data.RTL ? true : false;
    this.interval = data.interval || null;
    this.velocity = typeof data.velocity === 'number' ? data.velocity : this.velocity;
    this.carouselOffsetWidth = 100 - (data.grid.offset || 0);
    this.vertical = new Vertical(data.vertical);

    this.directionSym = this.RTL ? '' : '-';
    this.point =
      data.point && typeof data.point.visible !== 'undefined' ? data.point.visible : true;
  }

  isWidthChanged(e) {
    return this.deviceWidth !== e.target.outerWidth;
  }

  changeGridConfig(grid?: ItemConfig) {
    if (grid) {
      this.inputs.grid = grid;
    }
    this.mergeUserInput(this.inputs);
    this._carouselSize();
    this._storeCarouselData();
    this.calculateExtraItem();
    // grid && this.extraItemsContainer(this._dataSource);
    if (grid) {
      this.moveTo(Math.max(0, Math.ceil(this.currentSlideItems / this.slideItems) - 1), true, true);
    }
  }

  public reset(withOutAnimation?: boolean): void {
    withOutAnimation && (this._withAnim = false);
    // this.carouselCssNode.innerHTML = '';
    this.moveTo(0);
    this.carouselPoi._carouselPoint();
  }

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
          slideremains = this._dataSource.length - this.maxSlideItems;
          break;
        default:
          this._btnBoolean(0, 0);
          slideremains = slide * this.slideItems;
      }
      this._carouselScrollTwo(btns, slideremains, this.speed);
    }
  }

  slidess(Btn: number): void {
    const itemSpeed = this.speed;
    const currentSlide = 0;
    const touchMove = Math.ceil(this.dexVal / this.itemWidth);
    // this._setStyle(this.nguItemsContainer.nativeElement, 'transform', '');
    // this.carouselTransform = '';

    if (this.pointIndex === 1) return;

    if (Btn === 0 && ((!this.loop && !this.isFirst) || this.loop)) {
      console.log('asdf');
      // const slide = this.slideItems * this.pointIndex;
      this.rightScroll(touchMove, currentSlide, itemSpeed, Btn);
    } else if (Btn === 1 && ((!this.loop && !this.isLast) || this.loop)) {
      console.log('asdf1');
      this.leftScroll(currentSlide, touchMove, itemSpeed, Btn);
    } else {
      console.log('no action');
    }
  }

  private rightScroll(touchMove: number, currentSlide: number, itemSpeed: number, Btn: number) {
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
          this.currentSlideItems - this.slideItems - (this.maxSlideItems - this.slideItems);
      }
    } else if (this.currentSlideItems === 0) {
      currentSlide = this._dataSource.length - this.maxSlideItems;
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
    this._carouselScrollTwo(Btn, currentSlide, itemSpeed, this.loop && preLast);
  }

  private leftScroll(currentSlide: number, touchMove: number, itemSpeed: number, Btn: number) {
    let preLast = false;
    const isMaxSilde =
      this._dataSource.length <= this.currentSlideItems + this.maxSlideItems + this.slideItems;
    if (isMaxSilde && !this.isLast) {
      currentSlide = this._dataSource.length - this.maxSlideItems;
      this._btnBoolean(0, 1);
    } else if (this.isLast && this.loop) {
      preLast = true;
      this._btnBoolean(1, 0);
      const s = touchMove > this.slideItems;
      const d = s ? touchMove : this.maxSlideItems;
      currentSlide = this.currentSlideItems + this.slideItems + (d - this.slideItems);
      if (s) {
        itemSpeed = 200;
      }
    } else if (this.isLast) {
      currentSlide = 0;
      itemSpeed = 400;
      this._btnBoolean(1, 0);
    } else {
      this._btnBoolean(0, 0);
      if (touchMove > this.slideItems) {
        currentSlide = this.currentSlideItems + this.slideItems + (touchMove - this.slideItems);
        itemSpeed = 200;
      } else {
        currentSlide = this.currentSlideItems + this.slideItems;
      }
    }
    this._carouselScrollTwo(Btn, currentSlide, itemSpeed, this.loop && preLast);
    return { currentSlide, itemSpeed };
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
      // this.inputs.animation &&
      // this._carouselAnimator(
      //   Btn,
      //   currentSlideItems + 1,
      //   currentSlideItems + this.maxSlideItems,
      //   itemSpeed,
      //   Math.abs(this.currentSlideItems - currentSlideItems)
      // );
    } else {
      this.carouselTransition = '0ms cubic-bezier(0, 0, 0.2, 1)';
    }

    this.itemLength = this._dataSource.length;
    this._transformStyle(currentSlideItems);
    this.currentSlideItems = currentSlideItems;
    // this.onMove.emit(this);
    this._carouselPointActiver();
    this._carouselLoadTrigger();
    this._withAnim = true;
    this._resetAferAnimation = resetAferAnimation ? Btn : null;
    // console.log('animation start', performance.now());
  }

  private _carouselLoadTrigger(): void {
    if (typeof this.inputs.load === 'number') {
      // if (this._dataSource.length - this.load <= this.currentSlideItems + this.maxSlideItems)
      // this.carouselLoad.emit(this.currentSlideItems);
    }
  }

  /** change the active point in carousel */
  private _carouselPointActiver(): void {
    const i = Math.ceil(this.currentSlideItems / this.slideItems);
    this.activePoint = i;
    // this.cdr.markForCheck();
  }

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
    // console.log(this.carouselTransform, this.carouselTransition);
  }

  private _transformString(items: number): string {
    let collect = '';
    collect += `translate3d(`;

    if (this.vertical.enabled) {
      this.transform = this._carouselItemSize * items;
      collect += `0, -${this.transform + this._extraLoopItemsWidth}px, 0`;
    } else {
      this.transform = this._carouselItemSize * items;
      console.log(this._carouselItemSize, items);
      const collectSt = this.transform + this._extraLoopItemsWidth;
      const unit = this.type === 'fixed' ? 'px' : '%';
      collect += `${this._addDirectionSym(collectSt)}${unit}, 0, 0`;
    }
    collect += `)`;
    return collect;
  }

  private _addDirectionSym(val: number) {
    return val > 0 ? `${this.directionSym}${val}` : val;
  }

  /** boolean function for making isFirst and isLast */
  private _btnBoolean(first: number, last: number) {
    this.isFirst = !!first;
    this.isLast = !!last;
  }

  calculateExtraItem() {
    this._extraLoopItemsWidth =
      this._carouselItemSize * (this.maxSlideItems + (this.inputs.grid.offset ? 1 : 0)) -
      this.inputs.grid.offset +
      this.inputs.grid.offset / 2;
  }

  _storeCarouselData(): void {
    this.deviceWidth = this.isBrowser ? window.innerWidth : 1200;

    this.carouselWidth = this.carouselMain1.offsetWidth;
    this.carouselOffsetWidth = this.nguItemsContainer.offsetWidth;

    if (this.type === 'responsive') {
      // this.deviceType = 'xs';
      const offset = this.inputs.grid.offset || 1;
      this.maxSlideItems = this.inputs.grid.size;
      this.itemWidth = this.carouselWidth - this.carouselWidth / offset / this.maxSlideItems;
      this.itemWidthTest = this.carouselWidth / this.maxSlideItems;
    } else {
      this.maxSlideItems = Math.trunc(this.carouselWidth / this.inputs.grid.size);
      this.itemWidth = this.inputs.grid.size;
      const width = this.carouselOffsetWidth - this._carouselItemSize * this.maxSlideItems;
      this._maxSlideWidth = this._carouselItemSize - width;
    }

    this.slideItems = +(this.inputs.grid.slide < this.maxSlideItems
      ? this.inputs.grid.slide
      : this.maxSlideItems);
    this.load = this.inputs.load >= this.slideItems ? this.inputs.load : this.slideItems;
    this.speed = this.inputs.speed && this.inputs.speed > -1 ? this.inputs.speed : 400;

    this.carouselPoi._carouselPoint();
  }

  /** set the style of the carousel based the inputs data */
  private _carouselSize() {
    const dism = '';
    this.verticalFn();

    let itemStyle = '';
    if (this.vertical.enabled) {
      this._carouselItemSize = this.vertical.height / +this.inputs.grid.size;
      itemStyle = `${this.styleid} > .item {height: ${this._carouselItemSize}px}`;
    } else if (this.type === 'responsive') {
      this._carouselItemSize = this.carouselOffsetWidth / +this.inputs.grid.size;
      itemStyle = `${this.styleid} .item {flex: 0 0 ${this._carouselItemSize}%; max-width: ${
        this._carouselItemSize
      }%;}`;
    } else {
      this._carouselItemSize = this.inputs.grid.size;
      itemStyle = `${this.styleid} .item {flex: 0 0 ${this.inputs.grid.size}px; max-width: ${
        this.inputs.grid.size
      }px;}`;
    }
    this.stylesWrite.next(`${dism} ${itemStyle}`);
    // return `${dism} ${itemStyle}`;

    // this._createStyleElem(`${dism} ${itemStyle}`);
  }

  animationCompleted() {
    // console.log('animation end', performance.now());
    if (typeof this._resetAferAnimation === 'number') {
      this.moveTo(this._resetAferAnimation ? 0 : this.pointNumbers.length - 1, true);
    }
  }

  private verticalFn() {
    // if (this.RTL && !this.vertical.enabled)
    // this._renderer.addClass(this.carousel, 'ngurtl');
  }

  private tokenFn() {
    this.token = generateID();
    this.styleid = `.${this.token} > .ngucarousel > .ngu-touch-container > .ngucarousel-items`;
  }

  transformCarousel(transform = this._transformString(0), transition?: string) {
    console.log(transform);
    this.alternatives = !this.alternatives;
    this.carouselTransition = transition || '0ms';
    this.carouselTransform = transform;
    this.transformss.next({
      alternatives: this.alternatives,
      carouselTransform: this.carouselTransform,
      carouselTransition: this.carouselTransition
    });
  }
}
