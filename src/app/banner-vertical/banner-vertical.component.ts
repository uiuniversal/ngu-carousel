import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { interval, Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { slider } from '../slide-animation';

@Component({
  selector: 'app-banner-vertical',
  templateUrl: './banner-vertical.component.html',
  styleUrls: ['./banner-vertical.component.scss'],
  animations: [slider],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerVerticalComponent implements OnInit {
  images = ['assets/bg.jpg', 'assets/car.png', 'assets/canberra.jpg', 'assets/holi.jpg'];
  carouselBanner: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 400,
    interval: {
      timing: 3000,
      initialDelay: 1000
    },
    point: {
      visible: true
    },
    load: 2,
    custom: 'banner',
    loop: true,
    touch: true, // touch is not currently in active for vertical carousel, will enable it in future build
    vertical: {
      enabled: true,
      height: 400
    }
  };
  tempData: any[];

  public carouselTileItems$: Observable<number[]>;

  constructor() {
    this.tempData = [];

    this.carouselTileItems$ = interval(500).pipe(
      startWith(-1),
      take(30),
      map(val => {
        const data = (this.tempData = [
          ...this.tempData,
          this.images[Math.floor(Math.random() * this.images.length)]
        ]);
        return data;
      })
    );
  }

  ngOnInit() {}

  /* It will be triggered on every slide*/
  onmoveFn(data: any) {
    console.log(data);
  }
}
