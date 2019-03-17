import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
  Input,
  Renderer2,
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
  NguCarouselOutlet,
  NguCarouselOutletLeft,
  NguCarouselOutletRight
} from './carousel.directive';
import { Subject, Observable, merge, fromEvent } from 'rxjs';
import { NguCarouselConfig, NguCarouselOutletContext, slideType } from './interface';
import { rangeFor, getXValue, whichTransitionEvent } from './utils';
import { takeUntil, startWith, delay, switchMapTo } from 'rxjs/operators';
import { NguCarouselButton } from './button';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngu-carousel-m',
  templateUrl: 'carousel.m.html',
  styleUrls: ['carousel.m.scss']
})
// tslint:disable-next-line:component-class-suffix
export class NguCarouselM<T = any> implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  _dataSource: any;
  slideItem = 5;
  slideItemAct = 5;
  size = 4;
  transitionStr = 'all .7s ease 0s';

  @ViewChild('toucher') private touchContainer: ElementRef<HTMLDivElement>;

  @ContentChild(NguCarouselDefDirective) private _defDirec: NguCarouselDefDirective<T>;

  @ViewChild('transformDiv') transformDiv: ElementRef<HTMLDivElement>;

  @ViewChild(NguCarouselOutlet) private _nodeOutlet: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletLeft) private _nodeOutletLeft: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletRight) private _nodeOutletRight: NguCarouselOutlet;

  @ContentChildren(NguCarouselButton) private carouselBtn: QueryList<NguCarouselButton>;

  @Input() inputs: NguCarouselConfig;

  private _dataDiffer: IterableDiffer<{}>;
  _arrayChanges: IterableChanges<{}>;

  itemWidth = 0;
  itemLength = 15;
  containerWidth = 0;

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

  constructor(private _renderer: Renderer2, private _differs: IterableDiffers) {}

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
        switchMapTo(merge(...this.carouselBtn.map(e => e.click()))),
        takeUntil(this.destroyed$)
      )
      .subscribe(e => this.slide(e));
    this.dataSource.pipe(takeUntil(this.destroyed$)).subscribe(res => {
      this._arrayChanges = this._dataDiffer.diff(res);
      this.renderNodeChanges(res);
    });
    this.transEnd()
      .pipe(
        delay(10),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        let x = this.xTransform();
        const lastItems = (this.itemLength + 2 * this.slideItemAct) * this.itemWidth;
        const lastItmess = Math.round((lastItems - x) / this.itemWidth);
        const remainingItems = lastItmess;
        // const max = (this.itemLength + this.slideItem) * this.itemWidth;
        const xAbs = Math.abs(x);
        // console.log(x, this.slideItemAct % remainingItems, this.remainingSlideItem());
        // if (xAbs >= max) {
        if (this.slideItemAct >= remainingItems) {
          x = -this.itemWidth * (this.slideItemAct + Math.abs(this.slideItemAct - remainingItems));
          this.transform = x;
          this.setTransform({ x: x + 'px' });
        } else if (xAbs <= this.itemWidth) {
          x = -this.itemWidth * (this.itemLength + 1);
          this.transform = x;
          this.setTransform({ x: x + 'px' });
        }
      });
  }

  private remainingSlideItem() {
    const maxSlideItem = this.size - (this.itemLength % this.size);
    const maxSlideItem1 = maxSlideItem % maxSlideItem ? 0 : maxSlideItem;
    return maxSlideItem1 + this.size - 1;
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  initCarousel() {
    this.setStyle();
  }

  slide(type: slideType) {
    const x = Math.round(Math.abs(this.xTransform()) / this.itemWidth);
    if (type === 'next') {
      const d = this.itemWidth * (x + this.size);
      this.setTransform({ x: `-${d}px`, transition: this.transitionStr });
    } else if (type === 'prev') {
      const d = this.itemWidth * (x - this.size);
      this.setTransform({ x: `-${d}px`, transition: this.transitionStr });
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
    this.itemWidth = +(this.containerWidth / this.size).toFixed(2);
  }

  getWidth() {
    this.containerWidth = this.touchContainer.nativeElement.offsetWidth;
    return (this.itemWidth = +(this.containerWidth / this.size).toFixed(2));
  }

  setTransform({ x = null, y = null, transition = '' }) {
    this.getTransformDiv.style.transform = translate3d(x || 0, y || 0);
    this.getTransformDiv.style.transition = transition;
  }

  get getTransformDiv() {
    return this.transformDiv.nativeElement;
  }

  setSize(viewContainer: ViewContainerRef, index: number) {
    const view = viewContainer.get(index) as EmbeddedViewRef<any>;
    const mainEl = view.rootNodes[0] as HTMLDivElement;
    mainEl.style.flex = `0 0 ${this.itemWidth}px`;
    mainEl.style.maxWidth = `${this.itemWidth}px`;
    return mainEl;
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
      this._createNodeItem(data, rightContainer, i, i);
    });

    const leftItems = slideItems;
    const lenght = data.length;

    rangeFor(lenght - leftItems, lenght, (val, i) => {
      this._createNodeItem(data, leftContainer, val, i);
    });
  }

  private _createNodeItem(
    data: T[],
    viewContainer: ViewContainerRef,
    currentIndex: number,
    insertIndex?: number
  ) {
    const node = this._defDirec;
    const context = new NguCarouselOutletContext<T>(data[currentIndex]);
    context.index = currentIndex;
    const indexx = setNumber(insertIndex, currentIndex);
    viewContainer.createEmbeddedView(node.template, context, indexx);
    this.setSize(viewContainer, indexx);
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
