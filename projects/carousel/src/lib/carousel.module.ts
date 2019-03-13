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
import { NguCarouselM } from './carousel.m';
import { NguCarouselTouchM } from './touch.m';

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
    NguCarouselTouchM,
    NguCarouselM,
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
    NguCarouselOutletRight,
    NguCarouselM
  ]
})
export class NguCarouselModule {}
