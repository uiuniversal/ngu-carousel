import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { slider } from '../../slide-animation';
import { NgTemplateOutlet } from '@angular/common';
import {
  NguTileComponent,
  NguCarouselPrevDirective,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarousel
} from '@ngu/carousel';

@Component({
  standalone: true,
  selector: 'app-wrapped-carousel',
  templateUrl: 'wrapped-carousel.component.html',
  styleUrls: ['./wrapped-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slider],
  imports: [
    NguCarousel,
    NguCarouselPrevDirective,
    NguCarouselDefDirective,
    NguTileComponent,
    NgTemplateOutlet,
    NguCarouselNextDirective
  ]
})
export class WrappedCarouselComponent {
  items = input<string[]>([]);
  public config: NguCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4, all: 0 },
    gridBreakpoints: { sm: 480, md: 768, lg: 1024, xl: 1280 },
    speed: 750,
    point: {
      visible: true
    },
    velocity: 0.1,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };

  default = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
    all: 0
  };

  grid = input(this.default, {
    transform: (value: Partial<typeof this.default>) => {
      return value || this.default;
    }
  });
}
