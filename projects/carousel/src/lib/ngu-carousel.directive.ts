import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[NguCarouselItem]'
})
export class NguCarouselItemDirective {}

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

/**
 * This Directive is used as a ViewContainerRef for main items
 */
@Directive({
  selector: '[nguCarouselOutlet]'
})
export class NguCarouselOutlet {
  constructor(public viewContainer: ViewContainerRef, private el: ElementRef) {}
}

/**
 * This Directive is used as a ViewContainerRef for extra left items for loop
 */
@Directive({
  selector: '[nguCarouselOutletLeft]'
})
export class NguCarouselOutletLeft {
  constructor(public viewContainer: ViewContainerRef) {}
}

/**
 * This Directive is used as a ViewContainerRef for extra right items for loop
 */
@Directive({
  selector: '[nguCarouselOutletRight]'
})
export class NguCarouselOutletRight {
  constructor(public viewContainer: ViewContainerRef) {}
}
