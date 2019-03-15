import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { slideType } from './interface';

/**
 * This is used to add Carousel Button
 * This directive replaces the Prev and Next buttons
 */
@Directive({
  selector: '[NguCarouselButton]'
})
export class NguCarouselButton implements OnInit {
  @Input() NguCarouselButton: slideType;

  constructor(public el: ElementRef<HTMLButtonElement>) {}

  click() {
    return fromEvent<MouseEvent>(this.el.nativeElement, 'click').pipe(
      mapTo(this.NguCarouselButton)
    );
  }

  ngOnInit() {}
}
