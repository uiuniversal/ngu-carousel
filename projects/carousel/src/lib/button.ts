import { Directive, Input, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { slideType } from './interface';

/**
 * This is used to add Carousel Button
 * This directive replaces the Prev and Next buttons
 */
@Directive({
  selector: '[nguCarouselButton]'
})
export class NguCarouselButton {
  @Input() nguCarouselButton: slideType;

  click$ = fromEvent(this.el.nativeElement, 'click').pipe(map(() => this.nguCarouselButton));

  constructor(public el: ElementRef<HTMLButtonElement>) {}
}
