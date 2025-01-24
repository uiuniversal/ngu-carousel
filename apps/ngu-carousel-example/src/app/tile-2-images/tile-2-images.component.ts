import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { slider } from '../slide-animation';
import {
  NguTileComponent,
  NguCarouselPrevDirective,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarousel
} from '@ngu/carousel';

@Component({
  selector: 'app-tile-2-images',
  templateUrl: './tile-2-images.component.html',
  styleUrls: ['./tile-2-images.component.css'],
  animations: [slider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NguCarousel,
    NguCarouselPrevDirective,
    NguCarouselDefDirective,
    NguTileComponent,
    NguCarouselNextDirective
  ]
})
export class Tile2ImagesComponent {
  images = ['assets/bg.jpg', 'assets/car.png'];

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
        if (this.carouselItems().length >= 2) {
          clearInterval(id);
        }
      }, 500);
    });
  }

  addItem() {
    const i = Math.floor(Math.random() * this.images.length);
    this.carouselItems.update(items => [...items, this.images[i]]);
  }
}
