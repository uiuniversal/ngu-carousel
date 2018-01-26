import {
  NguCarouselItemDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective
} from './../ngu-carousel.directive';
import {
  Component,
  ElementRef,
  Renderer2,
  Input,
  Output,
  OnInit,
  OnDestroy,
  HostListener,
  EventEmitter,
  ContentChildren,
  QueryList,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
  ContentChild,
  ViewChildren,
  Inject,
  PLATFORM_ID,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { NguCarousel, NguCarouselStore } from './ngu-carousel.interface';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { NguCarouselService } from './../ngu-carousel.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngu-carousel',
  template: `<div #ngucarousel class="ngucarousel"><div #forTouch class="ngucarousel-inner"><div #nguitems class="ngucarousel-items"><ng-content select="[NguCarouselItem]"></ng-content></div><div style="clear: both"></div></div><ng-content select="[NguCarouselPrev]"></ng-content><ng-content select="[NguCarouselNext]"></ng-content></div><div #points *ngIf="userData.point.visible"><ul class="ngucarouselPoint"><li #pointInner *ngFor="let i of pointNumbers; let i = index" [class.active]="i==pointers" (click)="moveTo(i)"></li></ul></div>`,
  styles: [
    `
    :host {
      display: block;
      position: relative;
    }

    :host.ngurtl {
      direction: rtl;
    }

    .ngucarousel .ngucarousel-inner {
      position: relative;
      overflow: hidden;
    }
    .ngucarousel .ngucarousel-inner .ngucarousel-items {
      white-space: nowrap;
      position: relative;
    }

    .banner .ngucarouselPointDefault .ngucarouselPoint {
      position: absolute;
      width: 100%;
      bottom: 20px;
    }
    .banner .ngucarouselPointDefault .ngucarouselPoint li {
      background: rgba(255, 255, 255, 0.55);
    }
    .banner .ngucarouselPointDefault .ngucarouselPoint li.active {
      background: white;
    }
    .banner .ngucarouselPointDefault .ngucarouselPoint li:hover {
      cursor: pointer;
    }

    .ngucarouselPointDefault .ngucarouselPoint {
      list-style-type: none;
      text-align: center;
      padding: 12px;
      margin: 0;
      white-space: nowrap;
      overflow: auto;
      box-sizing: border-box;
    }
    .ngucarouselPointDefault .ngucarouselPoint li {
      display: inline-block;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      padding: 4px;
      margin: 0 4px;
      transition-timing-function: cubic-bezier(0.17, 0.67, 0.83, 0.67);
      transition: 0.4s;
    }
    .ngucarouselPointDefault .ngucarouselPoint li.active {
      background: #6b6b6b;
      transform: scale(1.8);
    }
    .ngucarouselPointDefault .ngucarouselPoint li:hover {
      cursor: pointer;
    }

  `
  ]
})
export class NguCarouselComponent
  implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, OnChanges {
  withAnim: boolean;
  carouselSerSub: Subscription;
  directionSym: string;
  itemsSubscribe: Subscription;
  carouselCssNode: any;
  pointIndex: number;
  pointers: number;

  // tslint:disable-next-line:no-input-rename
  @Input('inputs') userData: any;
  // @Input('moveToSlide') moveToSlide: number;

  @Output('carouselLoad') carouselLoad = new EventEmitter();
  @Output('onMove') onMove = new EventEmitter();
  @Output('initData') initData = new EventEmitter();

  @ContentChildren(NguCarouselItemDirective, { read: ElementRef })
  private items: QueryList<ElementRef>;
  @ViewChildren('pointInner', { read: ElementRef })
  private points: QueryList<ElementRef>;

  @ContentChild(NguCarouselNextDirective, { read: ElementRef })
  private next: ElementRef;
  @ContentChild(NguCarouselPrevDirective, { read: ElementRef })
  private prev: ElementRef;

  @ViewChild('ngucarousel', { read: ElementRef })
  private carouselMain1: ElementRef;
  @ViewChild('nguitems', { read: ElementRef })
  private carouselInner1: ElementRef;
  @ViewChild('main', { read: ElementRef })
  private carousel1: ElementRef;
  @ViewChild('points', { read: ElementRef })
  private pointMain: ElementRef;
  @ViewChild('forTouch', { read: ElementRef })
  private forTouch: ElementRef;

  private leftBtn: any;
  private rightBtn: any;
  private evtValue: number;
  private pauseCarousel = false;
  private pauseInterval: any;

  private carousel: any;
  private carouselMain: any;
  private carouselInner: any;
  // private carouselItems: any;

  private onResize: any;
  private onScrolling: any;
  private carouselInt: any;

  public Arr1 = Array;
  public pointNumbers: Array<any> = [];
  public data: NguCarouselStore = {
    type: 'fixed',
    token: '',
    deviceType: 'lg',
    items: 0,
    load: 0,
    deviceWidth: 0,
    carouselWidth: 0,
    itemWidth: 0,
    visibleItems: { start: 0, end: 0 },
    slideItems: 0,
    itemWidthPer: 0,
    itemLength: 0,
    currentSlide: 0,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    speed: 400,
    transform: { xs: 0, sm: 0, md: 0, lg: 0, all: 0 },
    loop: false,
    dexVal: 0,
    touchTransform: 0,
    touch: { active: false, swipe: '', velocity: 0 },
    isEnd: false,
    isFirst: true,
    isLast: false,
    RTL: false
  };

  public listener1: any;
  public listener2: any;
  public listener3: any;
  public listener4: any;
  public listener5: any;
  public listener6: any;
  public listener7: any;
  public listener8: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private carouselSer: NguCarouselService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // this.moveToSlide > -1 &&
    //   !changes.moveToSlide.firstChange &&
    //   this.moveTo(changes.moveToSlide.currentValue);
  }

  ngOnInit() {
    this.carousel = this.el.nativeElement;
    this.carouselMain = this.carouselMain1.nativeElement;
    this.carouselInner = this.carouselInner1.nativeElement;
    // this.carouselItems = this.carouselInner.getElementsByClassName('item');

    this.rightBtn = this.next.nativeElement;
    this.leftBtn = this.prev.nativeElement;

    this.data.type = this.userData.grid.all !== 0 ? 'fixed' : 'responsive';
    this.data.loop = this.userData.loop || false;
    this.userData.easing = this.userData.easing || 'cubic-bezier(0, 0, 0.2, 1)';
    this.data.touch.active = this.userData.touch || false;
    this.data.RTL = this.userData.RTL ? true : false;
    this.directionSym = this.data.RTL ? '' : '-';
    this.withAnim = true;

    this.carouselSize();
    // const datas = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
    this.carouselSerSub = this.carouselSer.getData.subscribe(res => {
      if (res.id === this.data.token) {
        if (res.ref === 'moveToSlide') {
          if (this.pointers !== res.index && res.index < this.pointIndex) {
            this.withAnim = res.animation === false ? false : true;
            this.moveTo(res.index);
          }
        } else if (res.ref === 'reset') {
          if (this.pointers !== 0 && 0 < this.pointIndex) {
            this.withAnim = false;
            this.reset();
          }
        }
      }
    });
  }

  ngAfterContentInit() {
    this.listener1 = this.renderer.listen(this.leftBtn, 'click', () =>
      this.carouselScrollOne(0)
    );
    this.listener2 = this.renderer.listen(this.rightBtn, 'click', () =>
      this.carouselScrollOne(1)
    );

    this.carouselCssNode = this.createStyleElem();

    this.storeCarouselData();
    this.buttonControl();

    if (isPlatformBrowser(this.platformId)) {
      this.carouselInterval();
      this.onWindowScrolling();
      this.touch();
      this.listener3 = this.renderer.listen('window', 'resize', event => {
        this.onResizing(event);
      });
    }

    this.items.changes.subscribe(val => {
      this.data.isLast = false;
      this.carouselPoint();
      this.buttonControl();
    });
    // tslint:disable-next-line:no-unused-expression
    // this.moveToSlide > -1 && this.moveTo(this.moveToSlide);
  }

  ngAfterViewInit() {
    if (this.userData.point.pointStyles) {
      const datas = this.userData.point.pointStyles.replace(
        /.ngucarouselPoint/g,
        `.${this.data.token} .ngucarouselPoint`
      );

      this.createStyleElem(datas);
    } else if (this.userData.point && this.userData.point.visible) {
      this.renderer.addClass(
        this.pointMain.nativeElement,
        'ngucarouselPointDefault'
      );
    }
  }

  ngOnDestroy() {
    clearInterval(this.carouselInt);
    // tslint:disable-next-line:no-unused-expression
    this.itemsSubscribe && this.itemsSubscribe.unsubscribe();
    this.carouselSerSub && this.carouselSerSub.unsubscribe();

    // remove listeners
    this.listener1();
    this.listener2();
    if (this.listener3) {
      this.listener3();
    }
    if (this.listener4) {
      this.listener4();
    }
    if (this.listener5) {
      this.listener5();
    }
    if (this.listener6) {
      this.listener6();
    }
    if (this.listener7) {
      this.listener7();
    }
    if (this.listener8) {
      this.listener8();
    }
  }

  private onResizing(event: any) {
    clearTimeout(this.onResize);
    this.onResize = setTimeout(() => {
      // tslint:disable-next-line:no-unused-expression
      this.data.deviceWidth !== event.target.outerWidth &&
        this.storeCarouselData();
    }, 500);
  }

  /* Get Touch input */
  private touch(): void {
    if (this.userData.touch) {
      const hammertime = new Hammer(this.carouselInner);
      hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

      hammertime.on('panstart', (ev: any) => {
        this.data.carouselWidth = this.carouselInner.offsetWidth;
        this.data.touchTransform = this.data.transform[this.data.deviceType];

        this.data.dexVal = 0;
        this.setStyle(this.carouselInner, 'transition', '');
      });
      hammertime.on('panleft', (ev: any) => {
        this.touchHandling('panleft', ev);
      });
      hammertime.on('panright', (ev: any) => {
        this.touchHandling('panright', ev);
      });
      hammertime.on('panend', (ev: any) => {
        // this.setStyle(this.carouselInner, 'transform', '');
        this.data.touch.velocity = ev.velocity;
        let direc = 0;
        if (!this.data.RTL) {
          direc = this.data.touch.swipe === 'panright' ? 0 : 1;
        } else {
          direc = this.data.touch.swipe === 'panright' ? 1 : 0;
        }
        this.carouselScrollOne(direc);
      });
      hammertime.on('hammer.input', function(ev) {
        // allow nested touch events to no propagate, this may have other side affects but works for now.
        // TODO: It is probably better to check the source element of the event and only apply the handle to the correct carousel
        ev.srcEvent.stopPropagation();
      });
    }
  }

  /* handle touch input */
  private touchHandling(e: string, ev: any): void {
    // vertical touch events seem to cause to panstart event with an odd delta
    // and a center of {x:0,y:0} so this will ignore them
    if (ev.center.x === 0) {
      return;
    }

    ev = Math.abs(ev.deltaX);
    let valt = ev - this.data.dexVal;
    valt =
      this.data.type === 'responsive'
        ? Math.abs(ev - this.data.dexVal) / this.data.carouselWidth * 100
        : valt;
    this.data.dexVal = ev;
    this.data.touch.swipe = e;
    if (!this.data.RTL) {
      this.data.touchTransform =
        e === 'panleft'
          ? valt + this.data.touchTransform
          : this.data.touchTransform - valt;
    } else {
      this.data.touchTransform =
        e === 'panright'
          ? valt + this.data.touchTransform
          : this.data.touchTransform - valt;
    }
    if (this.data.touchTransform > 0) {
      this.setStyle(
        this.carouselInner,
        'transform',
        this.data.type === 'responsive'
          ? `translate3d(${this.directionSym}${
              this.data.touchTransform
            }%, 0px, 0px)`
          : `translate3d(${this.directionSym}${
              this.data.touchTransform
            }px, 0px, 0px)`
      );
    } else {
      this.data.touchTransform = 0;
    }
  }

  /* this used to disable the scroll when it is not on the display */
  private onWindowScrolling(): void {
    const top = this.carousel.offsetTop;
    const scrollY = window.scrollY;
    const heightt = window.innerHeight;
    const carouselHeight = this.carousel.offsetHeight;

    if (
      top <= scrollY + heightt - carouselHeight / 4 &&
      top + carouselHeight / 2 >= scrollY
    ) {
      this.carouselIntervalEvent(0);
    } else {
      this.carouselIntervalEvent(1);
    }
  }

  /* store data based on width of the screen for the carousel */
  private storeCarouselData(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.data.deviceWidth = window.innerWidth;
    } else {
      this.data.deviceWidth = 1200;
    }
    this.data.carouselWidth = this.carouselMain.offsetWidth;

    if (this.data.type === 'responsive') {
      this.data.deviceType =
        this.data.deviceWidth >= 1200
          ? 'lg'
          : this.data.deviceWidth >= 992
            ? 'md'
            : this.data.deviceWidth >= 768 ? 'sm' : 'xs';

      this.data.items = this.userData.grid[this.data.deviceType];
      this.data.itemWidth = this.data.carouselWidth / this.data.items;
    } else {
      this.data.items = Math.trunc(
        this.data.carouselWidth / this.userData.grid.all
      );
      this.data.itemWidth = this.userData.grid.all;
      this.data.deviceType = 'all';
    }

    this.data.slideItems = +(this.userData.slide < this.data.items
      ? this.userData.slide
      : this.data.items);
    this.data.load =
      this.userData.load >= this.data.slideItems
        ? this.userData.load
        : this.data.slideItems;
    this.userData.speed =
      this.userData.speed || this.userData.speed > -1
        ? this.userData.speed
        : 400;

    this.initData.emit(this.data);
    this.carouselPoint();
  }

  /* Used to reset the carousel */
  private reset(): void {
    this.carouselCssNode.innerHTML = '';
    this.moveTo(0);
    this.carouselPoint();
  }

  /* Init carousel point */
  private carouselPoint(): void {
    // if (this.userData.point.visible === true) {
    const Nos = this.items.length - (this.data.items - this.data.slideItems);
    this.pointIndex = Math.ceil(Nos / this.data.slideItems);
    const pointers = [];

    if (this.pointIndex > 1 || !this.userData.point.hideOnSingleSlide) {
      for (let i = 0; i < this.pointIndex; i++) {
        pointers.push(i);
      }
    }

    this.pointNumbers = pointers;
    this.carouselPointActiver();
    if (this.pointIndex <= 1) {
      this.btnBoolean(1, 1);
    } else {
      if (this.data.currentSlide === 0 && !this.data.loop) {
        this.btnBoolean(1, 0);
      } else {
        this.btnBoolean(0, 0);
      }
    }
    this.buttonControl();
    // }
  }

  /* change the active point in carousel */
  private carouselPointActiver(): void {
    const i = Math.ceil(this.data.currentSlide / this.data.slideItems);
    this.pointers = i;
  }

  /* this function is used to scoll the carousel when point is clicked */
  public moveTo(index: number) {
    if (this.pointers !== index && index < this.pointIndex) {
      let slideremains = 0;
      const btns = this.data.currentSlide < index ? 1 : 0;

      if (index === 0) {
        this.btnBoolean(1, 0);
        slideremains = index * this.data.slideItems;
      } else if (index === this.pointIndex - 1) {
        this.btnBoolean(0, 1);
        slideremains = this.items.length - this.data.items;
      } else {
        this.btnBoolean(0, 0);
        slideremains = index * this.data.slideItems;
      }
      this.carouselScrollTwo(btns, slideremains, this.data.speed);
    }
  }

  /* set the style of the carousel based the inputs data */
  private carouselSize(): void {
    this.data.token = this.generateID();
    let dism = '';
    const styleid =
      '.' +
      this.data.token +
      ' > .ngucarousel > .ngucarousel-inner > .ngucarousel-items >';

    if (this.userData.custom === 'banner') {
      this.renderer.addClass(this.carousel, 'banner');
    }

    if (this.userData.animation === 'lazy') {
      dism += `${styleid} .item {transition: transform .6s ease;}`;
    }

    let itemStyle = '';
    if (this.data.type === 'responsive') {
      const itemWidth_xs =
        this.userData.type === 'mobile'
          ? `${styleid} .item {width: ${95 / +this.userData.grid.xs}%}`
          : `${styleid} .item {width: ${100 / +this.userData.grid.xs}%}`;

      const itemWidth_sm =
        styleid + ' .item {width: ' + 100 / +this.userData.grid.sm + '%}';
      const itemWidth_md =
        styleid + ' .item {width: ' + 100 / +this.userData.grid.md + '%}';
      const itemWidth_lg =
        styleid + ' .item {width: ' + 100 / +this.userData.grid.lg + '%}';

      itemStyle = `@media (max-width:767px){${itemWidth_xs}}
                    @media (min-width:768px){${itemWidth_sm}}
                    @media (min-width:992px){${itemWidth_md}}
                    @media (min-width:1200px){${itemWidth_lg}}`;
    } else {
      itemStyle = `${styleid} .item {width: ${this.userData.grid.all}px}`;
    }

    this.renderer.addClass(this.carousel, this.data.token);
    this.data.RTL && this.renderer.addClass(this.carousel, 'ngurtl');
    this.createStyleElem(`${dism} ${itemStyle}`);
  }

  /* logic to scroll the carousel step 1 */
  private carouselScrollOne(Btn: number): void {
    let itemSpeed = this.data.speed;
    let translateXval,
      currentSlide = 0;
    const touchMove = Math.ceil(this.data.dexVal / this.data.itemWidth);
    this.setStyle(this.carouselInner, 'transform', '');

    if (this.pointIndex === 1) {
      return;
    } else if (
      Btn === 0 &&
      ((!this.data.loop && !this.data.isFirst) || this.data.loop)
    ) {
      const slide = this.data.slideItems * this.pointIndex;

      const currentSlideD = this.data.currentSlide - this.data.slideItems;
      const MoveSlide = currentSlideD + this.data.slideItems;
      this.btnBoolean(0, 1);
      if (this.data.currentSlide === 0) {
        currentSlide = this.items.length - this.data.items;
        itemSpeed = 400;
        this.btnBoolean(0, 1);
      } else if (this.data.slideItems >= MoveSlide) {
        currentSlide = translateXval = 0;
        this.btnBoolean(1, 0);
      } else {
        this.btnBoolean(0, 0);
        if (touchMove > this.data.slideItems) {
          currentSlide = this.data.currentSlide - touchMove;
          itemSpeed = 200;
        } else {
          currentSlide = this.data.currentSlide - this.data.slideItems;
        }
      }
      this.carouselScrollTwo(Btn, currentSlide, itemSpeed);
    } else if (
      Btn === 1 &&
      ((!this.data.loop && !this.data.isLast) || this.data.loop)
    ) {
      if (
        this.items.length <=
          this.data.currentSlide + this.data.items + this.data.slideItems &&
        !this.data.isLast
      ) {
        currentSlide = this.items.length - this.data.items;
        this.btnBoolean(0, 1);
      } else if (this.data.isLast) {
        currentSlide = translateXval = 0;
        itemSpeed = 400;
        this.btnBoolean(1, 0);
      } else {
        this.btnBoolean(0, 0);
        if (touchMove > this.data.slideItems) {
          currentSlide =
            this.data.currentSlide +
            this.data.slideItems +
            (touchMove - this.data.slideItems);
          itemSpeed = 200;
        } else {
          currentSlide = this.data.currentSlide + this.data.slideItems;
        }
      }
      this.carouselScrollTwo(Btn, currentSlide, itemSpeed);
    }

    // cubic-bezier(0.15, 1.04, 0.54, 1.13)
  }

  /* logic to scroll the carousel step 2 */
  private carouselScrollTwo(
    Btn: number,
    currentSlide: number,
    itemSpeed: number
  ): void {
    // tslint:disable-next-line:no-unused-expression

    if (this.data.dexVal !== 0) {
      const val = Math.abs(this.data.touch.velocity);
      let somt = Math.floor(
        this.data.dexVal /
          val /
          this.data.dexVal *
          (this.data.deviceWidth - this.data.dexVal)
      );
      somt = somt > itemSpeed ? itemSpeed : somt;
      itemSpeed = somt < 200 ? 200 : somt;
      this.data.dexVal = 0;
    }
    console.log(this.withAnim);
    if (this.withAnim) {
      this.setStyle(
        this.carouselInner,
        'transition',
        `transform ${itemSpeed}ms ${this.userData.easing}`
      );
      this.userData.animation &&
        this.carouselAnimator(
          Btn,
          currentSlide + 1,
          currentSlide + this.data.items,
          itemSpeed,
          Math.abs(this.data.currentSlide - currentSlide)
        );
    } else {
      this.setStyle(this.carouselInner, 'transition', ``);
    }
    this.data.itemLength = this.items.length;
    this.transformStyle(currentSlide);
    this.data.currentSlide = currentSlide;
    this.onMove.emit(this.data);
    this.carouselPointActiver();
    this.carouselLoadTrigger();
    this.buttonControl();
    this.withAnim = true;
    console.log(this.withAnim);
  }

  /* boolean function for making isFirst and isLast */
  private btnBoolean(first: number, last: number) {
    this.data.isFirst = first ? true : false;
    this.data.isLast = last ? true : false;
  }

  /* set the transform style to scroll the carousel  */
  private transformStyle(slide: number): void {
    let slideCss = '';
    if (this.data.type === 'responsive') {
      this.data.transform.xs = 100 / this.userData.grid.xs * slide;
      this.data.transform.sm = 100 / this.userData.grid.sm * slide;
      this.data.transform.md = 100 / this.userData.grid.md * slide;
      this.data.transform.lg = 100 / this.userData.grid.lg * slide;
      slideCss = `@media (max-width: 767px) {
              .${
                this.data.token
              } > .ngucarousel > .ngucarousel-inner > .ngucarousel-items { transform: translate3d(${
        this.directionSym
      }${this.data.transform.xs}%, 0, 0); } }
            @media (min-width: 768px) {
              .${
                this.data.token
              } > .ngucarousel > .ngucarousel-inner > .ngucarousel-items { transform: translate3d(${
        this.directionSym
      }${this.data.transform.sm}%, 0, 0); } }
            @media (min-width: 992px) {
              .${
                this.data.token
              } > .ngucarousel > .ngucarousel-inner > .ngucarousel-items { transform: translate3d(${
        this.directionSym
      }${this.data.transform.md}%, 0, 0); } }
            @media (min-width: 1200px) {
              .${
                this.data.token
              } > .ngucarousel > .ngucarousel-inner > .ngucarousel-items { transform: translate3d(${
        this.directionSym
      }${this.data.transform.lg}%, 0, 0); } }`;
    } else {
      this.data.transform.all = this.userData.grid.all * slide;
      slideCss = `.${
        this.data.token
      } > .ngucarousel > .ngucarousel-inner > .ngucarousel-items { transform: translate3d(${
        this.directionSym
      }${this.data.transform.all}px, 0, 0);`;
    }
    // this.renderer.createText(this.carouselCssNode, slideCss);
    this.carouselCssNode.innerHTML = slideCss;
  }

  /* this will trigger the carousel to load the items */
  private carouselLoadTrigger(): void {
    if (typeof this.userData.load === 'number') {
      // tslint:disable-next-line:no-unused-expression
      this.items.length - this.data.load <=
        this.data.currentSlide + this.data.items &&
        this.carouselLoad.emit(this.data.currentSlide);
    }
  }

  /* generate Class for each carousel to set specific style */
  private generateID(): string {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return `ngucarousel${text}`;
  }

  /* handle the auto slide */
  private carouselInterval(): void {
    if (typeof this.userData.interval === 'number' && this.data.loop) {
      this.listener4 = this.renderer.listen(
        this.carouselMain,
        'touchstart',
        () => {
          this.carouselIntervalEvent(1);
        }
      );

      this.listener5 = this.renderer.listen(
        this.carouselMain,
        'touchend',
        () => {
          this.carouselIntervalEvent(0);
        }
      );

      this.listener6 = this.renderer.listen(
        this.carouselMain,
        'mouseenter',
        () => {
          this.carouselIntervalEvent(1);
        }
      );

      this.listener7 = this.renderer.listen(
        this.carouselMain,
        'mouseleave',
        () => {
          this.carouselIntervalEvent(0);
        }
      );

      this.listener8 = this.renderer.listen('window', 'scroll', () => {
        clearTimeout(this.onScrolling);
        this.onScrolling = setTimeout(() => {
          this.onWindowScrolling();
        }, 600);
      });

      this.carouselInt = setInterval(() => {
        // tslint:disable-next-line:no-unused-expression
        !this.pauseCarousel && this.carouselScrollOne(1);
      }, this.userData.interval);
    }
  }

  /* pause interval for specific time */
  private carouselIntervalEvent(ev: number): void {
    this.evtValue = ev;
    if (this.evtValue === 0) {
      clearTimeout(this.pauseInterval);
      this.pauseInterval = setTimeout(() => {
        // tslint:disable-next-line:no-unused-expression
        this.evtValue === 0 && (this.pauseCarousel = false);
      }, this.userData.interval);
    } else {
      this.pauseCarousel = true;
    }
  }

  /* animate the carousel items */
  private carouselAnimator(
    direction: number,
    start: number,
    end: number,
    speed: number,
    length: number
  ): void {
    let val = length < 5 ? length : 5;
    val = val === 1 ? 3 : val;
    const itemList = this.items.toArray();

    if (direction === 1) {
      for (let i = start - 1; i < end; i++) {
        val = val * 2;
        // tslint:disable-next-line:no-unused-expression
        itemList[i] &&
          this.setStyle(
            itemList[i].nativeElement,
            'transform',
            `translate3d(${val}px, 0, 0)`
          );
      }
    } else {
      for (let i = end - 1; i >= start - 1; i--) {
        val = val * 2;
        // tslint:disable-next-line:no-unused-expression
        itemList[i] &&
          this.setStyle(
            itemList[i].nativeElement,
            'transform',
            `translate3d(-${val}px, 0, 0)`
          );
      }
    }
    setTimeout(() => {
      this.items.forEach(elem =>
        this.setStyle(elem.nativeElement, 'transform', `translate3d(0, 0, 0)`)
      );
    }, speed * 0.7);
  }

  /* control button for loop */
  private buttonControl(): void {
    if (!this.data.loop || (this.data.isFirst && this.data.isLast)) {
      this.setStyle(
        this.leftBtn,
        'display',
        this.data.isFirst ? 'none' : 'block'
      );
      this.setStyle(
        this.rightBtn,
        'display',
        this.data.isLast ? 'none' : 'block'
      );
    } else {
      this.setStyle(this.leftBtn, 'display', 'block');
      this.setStyle(this.rightBtn, 'display', 'block');
    }
  }

  /** Short form for setElementStyle */
  private setStyle(el: any, prop: any, val: any): void {
    this.renderer.setStyle(el, prop, val);
  }

  /** For generating style tag */
  private createStyleElem(datas?: string) {
    const styleItem = this.renderer.createElement('style');
    if (datas) {
      const styleText = this.renderer.createText(datas);
      this.renderer.appendChild(styleItem, styleText);
    }
    this.renderer.appendChild(this.carousel, styleItem);
    return styleItem;
  }
}
