import { Directive } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NguCarouselItem]'
})
export class NguCarouselItemDirective {}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NguCarouselNext]'
})
export class NguCarouselNextDirective {
  // @HostBinding('disabled') disabled: boolean;
  // @HostBinding('style.display') display = 'block';
  // @HostListener('click')
  // onClick() {
  // }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NguCarouselPrev]'
})
export class NguCarouselPrevDirective {
  // @HostBinding('disabled') disabled: boolean;
  // @HostBinding('style.display') display = 'block';
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NguCarouselPoint]'
})
export class NguCarouselPointDirective {}
