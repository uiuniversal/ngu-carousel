import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { slider } from '../slide-animation';
import {
  NguTileComponent,
  NguCarouselPrevDirective,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPointDirective,
  NguCarousel
} from '@ngu/carousel';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slider],
  imports: [
    NguCarousel,
    NguCarouselPrevDirective,
    NguCarouselDefDirective,
    NguTileComponent,
    NguCarouselNextDirective,
    NguCarouselPointDirective
  ]
})
export class TileComponent {
  images = ['assets/bg.jpg', 'assets/car.png', 'assets/canberra.jpg', 'assets/holi.jpg'];

  public carouselItems = signal<string[]>([]);
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

  constructor() {
    this.addItem();
    afterNextRender(() => {
      const id = setInterval(() => {
        this.addItem();
        if (this.carouselItems().length >= 30) {
          clearInterval(id);
        }
      }, 500);
    });
  }

  private addItem() {
    const i = Math.floor(Math.random() * this.images.length);
    this.carouselItems.update(items => [...items, this.images[i]]);
  }
}
