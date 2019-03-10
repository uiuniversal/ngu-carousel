import { NguCarousel } from './carousel';
import { Directive } from '@angular/core';

/**
 * This is used to add Carousel Button
 * This directive replaces the Prev and Next buttons
 */
@Directive({
  selector: '[NguCarouselButton]'
})
export class NguCarouselButton {}

export class CarouselButtons {
  constructor(private c: NguCarousel) {}
}
