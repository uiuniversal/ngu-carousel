import {
  NguCarouselPointDirective,
  NguCarouselItemDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguCarouselDefDirective,
  NguCarouselOutlet,
  NguCarouselButton,
  NguCarouselOutletLeft,
  NguCarouselOutletRight
} from './ngu-carousel.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguCarousel } from './ngu-carousel.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    NguCarousel,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguCarouselButton,
    NguCarouselDefDirective,
    NguCarouselOutlet,
    NguCarouselOutletLeft,
    NguCarouselOutletRight
  ],
  declarations: [
    NguCarousel,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguCarouselButton,
    NguCarouselDefDirective,
    NguCarouselOutlet,
    NguCarouselOutletLeft,
    NguCarouselOutletRight
  ]
})
export class NguCarouselModule {}
