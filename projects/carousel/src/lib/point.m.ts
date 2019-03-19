import { NguCarouselPointDefDirective, NguCarouselPointOutlet } from './carousel.directive';
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[nguCarouselOutlet]'
})
export class NguCarouselOutletM {
  points = new Map();

  constructor(public viewContainer: ViewContainerRef) {}

  // constructor(
  //   public defPointDirec: NguCarouselPointDefDirective<T>,
  //   public _nodePointOutlet: NguCarouselPointOutlet
  // ) {}

  setActive() {}
}
