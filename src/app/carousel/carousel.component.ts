import {
  Component,
  OnInit,
  ViewChild,
  IterableDiffers,
  IterableDiffer,
  Input,
  TrackByFunction,
  isDevMode,
  ContentChildren,
  QueryList,
  IterableChanges,
  AfterContentInit
} from '@angular/core';
import {
  NguCarouselOutlet,
  NguCarouselDefDirective
} from './ngu-carousel.directive';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngu-carousel',
  templateUrl: 'carousel.component.html',
  styleUrls: ['carousel.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class NguCarosuel<T = any> implements OnInit, AfterContentInit {
  @ViewChild(NguCarouselOutlet)
  private _nodeOutlet: NguCarouselOutlet;

  @ContentChildren(NguCarouselDefDirective)
  private _defDirec: QueryList<NguCarouselDefDirective<T>>;

  _dataDiffer: IterableDiffer<T>;
  _dataSubscription: Subscription;
  _dataSource: T[];
  _arrayChanges: IterableChanges<T>;

  @Input('dataSource')
  get dataSource(): T[] {
    return this._dataSource;
  }
  set dataSource(data: T[]) {
    console.log(data);
    if (data) {
      this._switchDataSource(data);
    }
  }

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

  constructor(private _differs: IterableDiffers) {}

  ngOnInit() {
    this._dataDiffer = this._differs
      .find([])
      .create((_i: number, item: any) => {
        return this.trackBy ? this.trackBy(item.dataIndex, item.data) : item;
      });
  }

  ngAfterContentInit() {
    this._observeRenderChanges();
  }

  createItems() {}

  private _switchDataSource(dataSource: T[]): any {
    this._dataSource = dataSource;
    if (this._defDirec) {
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
        .pipe(debounceTime(10))
        .subscribe(data => {
          console.log(data);
          this.renderNodeChanges(data);
        });
    }
  }

  private renderNodeChanges(
    data: T[],
    viewContainer = this._nodeOutlet.viewContainer
  ) {
    console.log(data);
    this._arrayChanges = this._dataDiffer.diff(data);
  }
}
