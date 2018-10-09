import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[NguCarouselItem]'
})
export class NguCarouselItemDirective {}

@Directive({
  selector: '[NguCarouselNext]'
})
export class NguCarouselNextDirective {}

@Directive({
  selector: '[NguCarouselPrev]'
})
export class NguCarouselPrevDirective {}

/**
 * This is used to add Carousel Button
 * This directive replaces the Prev and Next buttons
 */
@Directive({
  selector: '[NguCarouselButton]'
})
export class NguCarouselButton {}

/**
 * This Directive is used to add Custom carousel points
 * This just used as a selector
 */
@Directive({
  selector: '[NguCarouselPoint]'
})
export class NguCarouselPointDirective {}

/**
 * This Directive is used as a carousel Def selector
 */
@Directive({
  selector: '[nguCarouselDef]'
})
export class NguCarouselDefDirective<T> {
  when: (index: number, nodeData: T) => boolean;

  constructor(public template: TemplateRef<any>) {}
}

@Directive({
  selector: '[nguCarouselOutlet]'
})
// tslint:disable-next-line:directive-class-suffix
export class NguCarouselOutlet {
  constructor(public viewContainer: ViewContainerRef) {}
}

@Directive({
  selector: '[nguCarouselOutletLeft]'
})
// tslint:disable-next-line:directive-class-suffix
export class NguCarouselOutletLeft {
  constructor(public viewContainer: ViewContainerRef) {}
}
@Directive({
  selector: '[nguCarouselOutletRight]'
})
// tslint:disable-next-line:directive-class-suffix
export class NguCarouselOutletRight {
  constructor(public viewContainer: ViewContainerRef) {}
}
