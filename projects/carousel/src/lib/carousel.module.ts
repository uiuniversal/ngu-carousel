import {
  NguCarouselPointDirective,
  NguCarouselItemDirective,
  NguCarouselDefDirective,
  NguCarouselOutletLeft,
  NguCarouselOutletRight,
  NguCarouselPointDefDirective,
  NguCarouselPointOutlet,
  NguCarouselOutlet
} from './carousel.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguCarousel } from './carousel';
import { NguCarouselTouch } from './touch';
import { NguCarouselButton } from './button';
import { CarouselItems } from './items';
import { NguCarouselM } from './carousel.m';
import { NguCarouselTouchM } from './touch.m';
import { NguCarouselOutletM } from './point.m';

@NgModule({
  imports: [CommonModule],
  declarations: [
    NguCarousel,
    NguCarouselTouch,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselButton,
    NguCarouselDefDirective,
    NguCarouselPointDefDirective,
    NguCarouselOutletM,
    NguCarouselOutlet,
    NguCarouselOutletLeft,
    NguCarouselOutletRight,
    NguCarouselPointOutlet,
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
    NguCarouselPointDefDirective,
    NguCarouselOutlet,
    NguCarouselOutletLeft,
    NguCarouselOutletRight,
    NguCarouselPointOutlet,
    NguCarouselM
  ]
})
export class NguCarouselModule {}
