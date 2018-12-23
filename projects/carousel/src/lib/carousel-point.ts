import { NguCarousel } from './ngu-carousel.component';
import { Subject } from 'rxjs';

export class CarouselPoint {
  buttonHandler = new Subject<[number, number]>();
  // pointIndex: number;
  hideOnSingleSlide: boolean;
  // pointNumbers: number[];
  // activePoint: number;

  constructor(private c: NguCarousel) {}

  _carouselPoint(): void {
    const Nos =
      this.c.dataSource.length - (this.c.maxSlideItems - this.c.slideItems);
    this.c.pointIndex = Math.ceil(Nos / this.c.slideItems);
    const pointers = [];

    if (this.c.pointIndex > 1 || !this.hideOnSingleSlide) {
      for (let i = 0; i < this.c.pointIndex; i++) {
        pointers.push(i);
      }
    }
    this.c.pointNumbers = pointers;
    this._carouselPointActiver();
    if (this.c.pointIndex <= 1) {
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
  private _carouselPointActiver(): void {
    const i = Math.ceil(this.c.currentSlideItems / this.c.slideItems);
    this.c.activePoint = i;
    this.c.cdr.markForCheck();
  }
}
