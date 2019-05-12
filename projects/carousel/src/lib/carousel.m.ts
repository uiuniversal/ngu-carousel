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
  EmbeddedViewRef,
  NgZone
} from '@angular/core';
import {
  NguCarouselDefDirective,
  NguCarouselOutletLeft,
  NguCarouselOutletRight,
  NguCarouselPointDefDirective,
  NguCarouselPointOutlet
} from './carousel.directive';
import {
  Subject,
  Observable,
  merge,
  fromEvent,
  interval,
  EMPTY,
  timer,
  BehaviorSubject
} from 'rxjs';
import {
  NguCarouselConfig,
  NguCarouselOutletContext,
  slideType,
  CarouselInterval
} from './interface';
import { rangeFor, getXValue, whichTransitionEvent } from './utils';
import { takeUntil, startWith, delay, mapTo, switchMap, mergeMap, tap, map } from 'rxjs/operators';
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

  // tslint:disable-next-line:no-input-rename
  @Input() options: NguCarouselConfig;

  private toggleTouchSource = new BehaviorSubject(false);
  toggleTouch = this.toggleTouchSource.asObservable();

  private toggleIntervalSource = new BehaviorSubject(true);
  toggleInterval = this.toggleIntervalSource.asObservable();

  private _dataDiffer: IterableDiffer<{}>;
  _arrayChanges: IterableChanges<{}>;

  itemWidth = 0;
  itemLength = 0;
  containerWidth = 0;
  slideItem = 5;
  slideItemAct = 5;
  // maxSlideSize = 4;
  slideSize = 2;
  transitionStr = 'all .7s ease 0s';
  interval?: CarouselInterval;

  _dataSource: any;
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

  constructor(private _differs: IterableDiffers, private ngZone: NgZone) {}

  ngOnInit() {
    this._dataDiffer = this._differs.find([]).create((_i: number, item: any) => {
      return this.trackBy ? this.trackBy(item.dataIndex, item.data) : item;
    });
  }

  ngAfterContentInit() {
    this.validateInputs(this.options);

    this.carouselBtn.changes
      .pipe(
        startWith(1),
        switchMap(() => merge(...this.carouselBtn.map(btn => btn.click$))),
        takeUntil(this.destroyed$)
      )
      .subscribe(e => this.slide(e));

    this.dataSource.pipe(takeUntil(this.destroyed$)).subscribe(res => {
      this._arrayChanges = this._dataDiffer.diff(res);
      this.itemLength = res.length;

      this.createPoints();
      this.renderNodeChanges(res);
    });

    this.toggleInterval
      .pipe(
        switchMap(enable =>
          enable
            ? nguCarouselInterval(
                this.hoverContainer.nativeElement,
                this.interval.timing,
                this.interval.initialDelay
              )
            : EMPTY
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.slide('next');
      });

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

  toggleDrag(bool: boolean) {
    this.toggleTouchSource.next(bool);
  }

  toggleIntervals(bool: boolean) {
    this.toggleIntervalSource.next(bool);
  }

  validateInputs(data: NguCarouselConfig) {
    console.log(data);
    // this.type = data.grid.type || 'responsive';
    // this.loop = data.loop || false;
    // data.easing = data.easing || 'cubic-bezier(0, 0, 0.2, 1)';
    // this.carouselTransition = data.easing;
    // this.touch.active = data.touch || false;
    // this.RTL = data.RTL ? true : false;
    this.interval = data.interval || null;
    this.setSlideSize(data.grid);
    // this.velocity = typeof data.velocity === 'number' ? data.velocity : this.velocity;
    // this.carouselOffsetWidth = 100 - (data.grid.offset || 0);

    // if (data.vertical && data.vertical.enabled) {
    //   this.vertical.enabled = data.vertical.enabled;
    //   this.vertical.height = data.vertical.height;
    // }
    // this.directionSym = this.RTL ? '' : '-';
    // this.point =
    //   data.point && typeof data.point.visible !== 'undefined' ? data.point.visible : true;
  }

  setSlideSize(grid) {
    this.slideItem = grid.size;
    this.slideItemAct = this.slideItem + this.remainingSlideItem();
    this.slideSize = grid.slide || grid.size;
    this.containerWidth = this.touchContainer.nativeElement.offsetWidth;
    this.itemWidth = +(this.containerWidth / this.slideItem).toFixed(2);
    console.log(this.slideItem, this.slideItemAct);
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
    // merge(
    //   ...this.pointFor((i, _, viewContainer) => viewContainer.get(i).rootNodes[0]).map((e, i) =>
    //     fromEvent(e, 'click').pipe(mapTo(i))
    //   )
    // ).subscribe(i => this.slide(i));
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

  createView(
    viewContainer: ViewContainerRef,
    data: any,
    index: number,
    node: NguCarouselPointDefDirective<T>
  ) {
    const context = { $implicit: data, index };
    viewContainer.createEmbeddedView(node.template, context, index);
  }

  calcPoints() {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  render() {}

  // setInterval() {
  //   if (!this.interval) return;
  // }

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

  private transEnd() {
    return fromEvent<TransitionEvent>(
      this.getTransformDiv,
      whichTransitionEvent(this.getTransformDiv)
    );
  }

  xTransform() {
    return getXValue(this.getTransformDiv.style.transform).x;
  }

  private getWidth() {
    this.containerWidth = this.touchContainer.nativeElement.offsetWidth;
    return (this.itemWidth = +(this.containerWidth / this.slideItem).toFixed(2));
  }

  setTransform({ x = null, y = null, transition = '' }) {
    this.ngZone.runOutsideAngular(() => {
      this.getTransformDiv.style.transform = translate3d(x || 0, y || 0);
      this.getTransformDiv.style.transition = transition;
    });
  }

  get getTransformDiv() {
    return this.transformDiv.nativeElement;
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

  private setSize(viewContainer: ViewContainerRef, index: number) {
    const view = (<EmbeddedViewRef<any>>viewContainer.get(index)).rootNodes[0];
    view.style.flex = `0 0 ${this.itemWidth}px`;
    view.style.maxWidth = `${this.itemWidth}px`;
    return view;
  }

  private remainingSlideItem() {
    const maxSlideItem = this.slideItem - (this.itemLength % this.slideItem);
    const maxSlideItem1 = maxSlideItem % maxSlideItem ? 0 : maxSlideItem;
    return maxSlideItem1 + this.slideItem - 1;
  }

  private getContext(
    index: number,
    viewContainer = this._nodeOutlet.viewContainer
  ): NguCarouselOutletContext<T> {
    return (<EmbeddedViewRef<NguCarouselOutletContext<T>>>viewContainer.get(index)).context;
  }

  private updateItemIndexContext(viewContainer: ViewContainerRef) {
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

function nguCarouselInterval(el: Element, time: number, initialDelay: number) {
  const play$ = fromEvent(el, 'mouseleave').pipe(mapTo(1));
  const pause$ = fromEvent(el, 'mouseenter').pipe(mapTo(0));

  const touchPlay$ = fromEvent(el, 'touchstart').pipe(mapTo(1));
  const touchPause$ = fromEvent(el, 'touchend').pipe(mapTo(0));

  const timer$ = timer(initialDelay);

  return timer$.pipe(
    mergeMap(() =>
      merge(play$, touchPlay$, pause$, touchPause$).pipe(
        startWith(1),
        switchMap(val => (val ? interval(time).pipe(tap(null, null, console.log)) : EMPTY))
      )
    )
  );
}
