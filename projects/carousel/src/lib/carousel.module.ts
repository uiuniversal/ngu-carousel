import {
  NguCarouselPointDirective,
  NguCarouselItemDirective,
  NguCarouselDefDirective,
  NguCarouselOutlet,
  NguCarouselOutletLeft,
  NguCarouselOutletRight
} from './carousel.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguCarousel } from './carousel';
import { NguCarouselTouch } from './touch';
import { NguCarouselButton } from './button';
import { CarouselItems } from './items';

@NgModule({
  imports: [CommonModule],
  declarations: [
    NguCarousel,
    NguCarouselTouch,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselButton,
    NguCarouselDefDirective,
    NguCarouselOutlet,
    NguCarouselOutletLeft,
    NguCarouselOutletRight,
    CarouselItems
  ],
  exports: [
    NguCarousel,
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
