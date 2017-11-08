import { Directive } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NguCarouselItem]'
})
export class NguCarouselItemDirective { }


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NguCarouselNext]'
})
export class NguCarouselNextDirective { }

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NguCarouselPrev]'
})
export class NguCarouselPrevDirective { }

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[NguCarouselPoint]'
})
export class NguCarouselPointDirective { }
