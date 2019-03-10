import { NguCarousel } from './carousel';
import { Subject, BehaviorSubject } from 'rxjs';
import { createRange } from './utils';

export class CarouselPoint {
  buttonHandler = new Subject<[number, number]>();

  private _carouselPointsSouce = new BehaviorSubject([]);
  carouselPoints = this._carouselPointsSouce.asObservable();

  pointIndex: number;

  hideOnSingleSlide: boolean;

  activePoint = 0;

  constructor(private c: NguCarousel) {}

  _carouselPoint(): void {
    const Nos = this.c.dataSource.length - (this.c.maxSlideItems - this.c.slideItems);
    this.pointIndex = Math.ceil(Nos / this.c.slideItems);

    const pointers =
      this.pointIndex > 1 || !this.hideOnSingleSlide ? createRange(this.pointIndex) : [];

    // this.pointNumbers.next(pointers);
    this._carouselPointsSouce.next(pointers);
    this.carouselPointActiver();
    if (this.pointIndex <= 1) {
      this.buttonHandler.next([1, 1]);
    } else {
      if (this.c.currentSlideItems === 0 && !this.c.loop) {
        this.buttonHandler.next([1, 0]);
      } else {
        this.buttonHandler.next([0, 0]);
      }
    }
  }

  /** change the active point in carousel */
  carouselPointActiver(): void {
    const i = Math.ceil(this.c.currentSlideItems / this.c.slideItems);
    this.activePoint = i;
    this.c.cdr.markForCheck();
  }
}
