import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
  Input,
  ContentChild,
  IterableDiffers,
  IterableDiffer,
  TrackByFunction,
  isDevMode,
  IterableChanges,
  IterableChangeRecord,
  ViewContainerRef,
  ElementRef,
  ContentChildren,
  QueryList,
  EmbeddedViewRef
} from '@angular/core';
import {
  NguCarouselDefDirective,
  NguCarouselOutletLeft,
  NguCarouselOutletRight,
  NguCarouselPointDefDirective,
  NguCarouselPointOutlet
} from './carousel.directive';
import { Subject, Observable, merge, fromEvent, interval, EMPTY } from 'rxjs';
import { NguCarouselConfig, NguCarouselOutletContext, slideType } from './interface';
import { rangeFor, getXValue, whichTransitionEvent } from './utils';
import { takeUntil, startWith, delay, switchMapTo, mapTo, switchMap } from 'rxjs/operators';
import { NguCarouselButton } from './button';
import { NguCarouselOutletM } from './point.m';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngu-carousel-m',
  templateUrl: 'carousel.m.html',
  styleUrls: ['carousel.m.scss']
})
// tslint:disable-next-line:component-class-suffix
export class NguCarouselM<T = any> implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  _dataSource: any;

  @ViewChild('toucher') private touchContainer: ElementRef<HTMLDivElement>;

  @ViewChild('hoverContainer') private hoverContainer: ElementRef<HTMLDivElement>;

  @ContentChild(NguCarouselDefDirective)
  private _defDirec: NguCarouselDefDirective<T>;

  @ContentChild(NguCarouselPointDefDirective)
  private _defPointDirec: NguCarouselPointDefDirective<T>;

  @ViewChild('transformDiv') transformDiv: ElementRef<HTMLDivElement>;

  @ViewChild(NguCarouselOutletM) private _nodeOutlet: NguCarouselOutletM;

  @ViewChild(NguCarouselOutletLeft) private _nodeOutletLeft: NguCarouselOutletLeft;

  @ViewChild(NguCarouselOutletRight) private _nodeOutletRight: NguCarouselOutletRight;

  @ViewChild(NguCarouselPointOutlet) private _nodePointOutlet: NguCarouselPointOutlet;

  @ContentChildren(NguCarouselButton) private carouselBtn: QueryList<NguCarouselButton>;

  // @Input() inputs: NguCarouselConfig;

  private _dataDiffer: IterableDiffer<{}>;
  _arrayChanges: IterableChanges<{}>;

  itemWidth = 0;
  itemLength = 0;
  containerWidth = 0;
  slideItem = 5;
  slideItemAct = 5;
  maxSlideSize = 4;
  slideSize = 2;
  transitionStr = 'all .7s ease 0s';

  @Input('dataSource')
  get dataSource(): Observable<T[]> {
    return this._dataSource;
  }
  set dataSource(data: Observable<T[]>) {
    if (data) {
      this._dataSource = data;
      // this._switchDataSource(data);
    }
  }

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

  destroyed$ = new Subject();

  transform = 0;

  constructor(private _differs: IterableDiffers) {}

  ngOnInit() {
    this._dataDiffer = this._differs.find([]).create((_i: number, item: any) => {
      return this.trackBy ? this.trackBy(item.dataIndex, item.data) : item;
    });
  }

  ngAfterContentInit() {
    this.initCarousel();

    this.carouselBtn.changes
      .pipe(
        startWith(1),
        switchMapTo(merge(...this.carouselBtn.map(btn => btn.click()))),
        takeUntil(this.destroyed$)
      )
      .subscribe(e => this.slide(e));

    this.dataSource.pipe(takeUntil(this.destroyed$)).subscribe(res => {
      this._arrayChanges = this._dataDiffer.diff(res);
      this.itemLength = res.length;

      this.createPoints();
      this.renderNodeChanges(res);
    });

    // this.setInterval();

    this.transEnd()
      .pipe(
        delay(10),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        const transform = this.xTransform();
        const xItems = Math.round(transform / this.itemWidth);

        const lastItems = this.itemLength + this.slideItemAct;

        const startItems = this.slideItemAct - (this.slideItem - 1);

        if (xItems >= lastItems) {
          const items = this.slideItemAct + Math.abs(xItems - lastItems);
          this.transform = -this.itemWidth * items;
          this.setTransform({ x: this.transform + 'px' });
        } else if (xItems <= startItems) {
          const items = lastItems - (this.slideItemAct - xItems);
          this.transform = -this.itemWidth * items;
          this.setTransform({ x: this.transform + 'px' });
        }
        const setActive = Math.round((xItems - this.slideItemAct) / this.slideSize);
        this.setActive(setActive);

        console.log(setActive);
      });
  }

  private createPoints() {
    const point = Math.ceil(this.itemLength / this.slideSize);
    rangeFor(0, point, i => {
      this.createView(
        this._nodePointOutlet.viewContainer,
        { active: false },
        i,
        this._defPointDirec
      );
    });
    this.setActive(2);
    merge(
      ...this.pointFor((i, _, viewContainer) => viewContainer.get(i).rootNodes[0]).map((e, i) =>
        fromEvent(e, 'click').pipe(mapTo(i))
      )
    ).subscribe(i => this.slide(i));
  }

  setActive(index: number) {
    this.pointFor((i, _, viewContainer) => {
      this.getContext(i, viewContainer).$implicit['active'] = i === index;
    });
  }

  pointFor(predicate) {
    const viewContainer = this._nodePointOutlet.viewContainer;
    return rangeFor(0, viewContainer.length, (val, i) => predicate(val, i, viewContainer));
  }

  createView(viewContainer, data, index, node) {
    const context = { $implicit: data, index };
    viewContainer.createEmbeddedView(node.template, context, index);
  }
  calcPoints() {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  initCarousel() {
    this.setStyle();
    // console.log(this._nodePointOutlet, this._defPointDirec);
  }

  setInterval() {
    const play$ = fromEvent(this.hoverContainer.nativeElement, 'mouseleave').pipe(mapTo(1));
    const pause$ = fromEvent(this.hoverContainer.nativeElement, 'mouseenter').pipe(mapTo(0));

    const touchPlay$ = fromEvent(this.hoverContainer.nativeElement, 'touchstart').pipe(mapTo(1));
    const touchPause$ = fromEvent(this.hoverContainer.nativeElement, 'touchend').pipe(mapTo(0));

    const interval$ = interval(1000).pipe(mapTo(1));

    merge(play$, touchPlay$, pause$, touchPause$)
      .pipe(
        startWith(1),
        switchMap(val => (val ? interval$ : EMPTY)),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => this.slide('next'));
  }

  slide(type: slideType) {
    const x = Math.round(Math.abs(this.xTransform()) / this.itemWidth);
    if (type === 'next') {
      const d = -this.itemWidth * (x + this.slideSize);
      this.setTransform({ x: d + 'px', transition: this.transitionStr });
    } else if (type === 'prev') {
      const d = -this.itemWidth * (x - this.slideSize);
      this.setTransform({ x: d + 'px', transition: this.transitionStr });
    } else if (typeof type === 'number') {
      const d = -this.itemWidth * (type * this.slideSize + this.slideItemAct);
      this.setTransform({ x: d + 'px', transition: this.transitionStr });
    }
  }

  transEnd() {
    return fromEvent<TransitionEvent>(
      this.getTransformDiv,
      whichTransitionEvent(this.getTransformDiv)
    );
  }

  xTransform() {
    return getXValue(this.getTransformDiv.style.transform).x;
  }

  private setStyle() {
    this.containerWidth = this.touchContainer.nativeElement.offsetWidth;
    this.itemWidth = +(this.containerWidth / this.maxSlideSize).toFixed(2);
  }

  getWidth() {
    this.containerWidth = this.touchContainer.nativeElement.offsetWidth;
    return (this.itemWidth = +(this.containerWidth / this.maxSlideSize).toFixed(2));
  }

  setTransform({ x = null, y = null, transition = '' }) {
    this.getTransformDiv.style.transform = translate3d(x || 0, y || 0);
    this.getTransformDiv.style.transition = transition;
  }

  get getTransformDiv() {
    return this.transformDiv.nativeElement;
  }

  setSize(viewContainer: ViewContainerRef, index: number) {
    const view = (<EmbeddedViewRef<any>>viewContainer.get(index)).rootNodes[0];
    view.style.flex = `0 0 ${this.itemWidth}px`;
    view.style.maxWidth = `${this.itemWidth}px`;
    return view;
  }

  private renderNodeChanges(data: T[], viewContainer = this._nodeOutlet.viewContainer) {
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
    this.updateItemIndexContext(this._nodeOutlet.viewContainer);
    this.extraItemsContainer(data);
    this.transform = -this.itemWidth * this.slideItemAct;
    this.setTransform({ x: this.transform + 'px' });
  }

  private extraItemsContainer(data: T[]) {
    const leftContainer = this._nodeOutletLeft.viewContainer;
    const rightContainer = this._nodeOutletRight.viewContainer;
    leftContainer.clear();
    rightContainer.clear();
    this.slideItemAct = this.slideItem + this.remainingSlideItem();
    const slideItems = this.slideItemAct;
    const rightItems = slideItems;

    rangeFor(0, rightItems, i => {
      this._createNodeItem(data, rightContainer, i, i, true);
    });

    const leftItems = slideItems;
    const length = data.length;

    rangeFor(length - leftItems, length, (val, i) => {
      this._createNodeItem(data, leftContainer, val, i, true);
    });
  }

  private _createNodeItem(
    data: T[],
    viewContainer: ViewContainerRef,
    currentIndex: number,
    insertIndex?: number,
    isClone = false,
    setSize = true,
    node = this._defDirec
  ) {
    const context = isClone
      ? this.getContext(currentIndex)
      : new NguCarouselOutletContext<T>(data[currentIndex]);
    context.index = currentIndex;
    const indexx = setNumber(insertIndex, currentIndex);
    viewContainer.createEmbeddedView(node.template, context, indexx);
    setSize && this.setSize(viewContainer, indexx);
  }

  private remainingSlideItem() {
    const maxSlideItem = this.maxSlideSize - (this.itemLength % this.maxSlideSize);
    const maxSlideItem1 = maxSlideItem % maxSlideItem ? 0 : maxSlideItem;
    return maxSlideItem1 + this.maxSlideSize - 1;
  }

  getContext(
    index: number,
    viewContainer = this._nodeOutlet.viewContainer
  ): NguCarouselOutletContext<T> {
    return (<EmbeddedViewRef<NguCarouselOutletContext<T>>>viewContainer.get(index)).context;
  }

  updateItemIndexContext(viewContainer: ViewContainerRef) {
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
}
//
//
//
//
//
// External functions
//
//
//
//
//
//

function translate3d(x: string | number, y: string | number = 0) {
  return `translate3d(${x}, ${y}, 0)`;
}

function setNumber(...args: number[]) {
  return args.find(num => typeof num === 'number');
}
