import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { interval, Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { slider } from '../slide-animation';

// type data = {
//   [index: number] : string[]
// }
@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  animations: [slider],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent implements OnInit {

  images = ['assets/bg.jpg', 'assets/car.png', 'assets/canberra.jpg', 'assets/holi.jpg'];

  public carouselTileItems$: Observable<(string | number)[]>;
  public carouselTileConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 5, all: 0 },
    speed: 250,
    point: {
      visible: true
    },
    touch: true,
    loop: true,
    interval: { timing: 1500 },
    animation: 'lazy'
  };

  tempData: (string | number)[];

  constructor() { }

  ngOnInit() {
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

}
