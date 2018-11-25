import {
  NguCarouselPointDirective,
  NguCarouselItemDirective,
  NguCarouselDefDirective,
  NguCarouselOutlet,
  NguCarouselButton,
  NguCarouselOutletLeft,
  NguCarouselOutletRight
} from './ngu-carousel.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguCarousel } from './ngu-carousel.component';
import { NguCarouselTouch } from './carousel-touch';

@NgModule({
  imports: [CommonModule],
  exports: [
    NguCarousel,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselButton,
    NguCarouselDefDirective,
    NguCarouselOutlet,
    NguCarouselOutletLeft,
    NguCarouselOutletRight
  ],
  declarations: [
    NguCarousel,
    NguCarouselTouch,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselButton,
    NguCarouselDefDirective,
    NguCarouselOutlet,
    NguCarouselOutletLeft,
    NguCarouselOutletRight
  ]
})
export class NguCarouselModule {}
