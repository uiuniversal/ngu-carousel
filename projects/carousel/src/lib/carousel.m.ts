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
  ElementRef
} from '@angular/core';
import {
  NguCarouselDefDirective,
  NguCarouselOutlet,
  NguCarouselOutletLeft,
  NguCarouselOutletRight
} from './carousel.directive';
import { Subject, Observable } from 'rxjs';
import { NguCarouselConfig, NguCarouselOutletContext } from './interface';
import { rangeFor } from './utils';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngu-carousel-m',
  templateUrl: 'carousel.m.html',
  styleUrls: ['carousel.m.scss']
})
// tslint:disable-next-line:component-class-suffix
export class NguCarouselM<T = any> implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  _dataSource: any;

  @ContentChild(NguCarouselDefDirective)
  private _defDirec: NguCarouselDefDirective<T>;

  @ViewChild('transformDiv')
  private transformDiv: ElementRef<HTMLDivElement>;

  @ViewChild(NguCarouselOutlet)
  private _nodeOutlet: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletLeft)
  private _nodeOutletLeft: NguCarouselOutlet;

  @ViewChild(NguCarouselOutletRight)
  private _nodeOutletRight: NguCarouselOutlet;

  @Input() inputs: NguCarouselConfig;

  private _dataDiffer: IterableDiffer<{}>;
  _arrayChanges: IterableChanges<{}>;

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

  constructor(private _renderer: Renderer2, private _differs: IterableDiffers) {}

  ngOnInit() {
    this._dataDiffer = this._differs.find([]).create((_i: number, item: any) => {
      return this.trackBy ? this.trackBy(item.dataIndex, item.data) : item;
    });
  }

  ngAfterContentInit() {
    this.dataSource.pipe(takeUntil(this.destroyed$)).subscribe(res => {
      this._arrayChanges = this._dataDiffer.diff(res);
      this.renderNodeChanges(res);
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  setTransform(transform: string, transition = '') {
    this.transformDiv.nativeElement.style.transform = transform;
    this.transformDiv.nativeElement.style.transition = transition;
  }

  renderNodeChanges(data: T[], viewContainer = this._nodeOutlet.viewContainer) {
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
    updateItemIndexContext(this._nodeOutlet.viewContainer);
  }

  private _createNodeItem(
    data: T[],
    viewContainer: ViewContainerRef,
    currentIndex: number,
    tempItem = false,
    insertIndex?: number
  ) {
    const node = this._defDirec;
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
}
//
//
//
//
//
//
//
//
//
//
//
//
//
function updateItemIndexContext(viewContainer: ViewContainerRef) {
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
