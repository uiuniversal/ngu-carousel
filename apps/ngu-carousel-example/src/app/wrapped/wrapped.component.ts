import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import data from '../../assets/mock/images.json';
import { AsyncPipe } from '@angular/common';
import { WrappedCarouselComponent } from './wrapped-carousel/wrapped-carousel.component';

@Component({
  standalone: true,
  selector: 'app-wrapped',
  template: `<app-wrapped-carousel
    [carouselTileItems]="data$ | async"
    [grid]="grid"
  ></app-wrapped-carousel>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WrappedCarouselComponent, AsyncPipe]
})
export class WrappedComponent {
  public grid: { xs: 1; sm: 1; md: 1; lg: 5; all: 0 };
  data: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  data$: Observable<any[]>;
  constructor(private cd: ChangeDetectorRef) {
    this.data$ = this.data.asObservable();
    of(data)
      .pipe(delay(1000))
      .subscribe(data => {
        console.log(data.images);
        this.data.next(data.images);
        cd.detectChanges();
      });
  }
}
