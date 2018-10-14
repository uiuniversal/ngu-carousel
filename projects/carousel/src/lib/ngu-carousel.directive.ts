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
  selector: '[nguCarouselOutlet]',
  host: {
    '[style.maxWidth]': 'width',
    '[style.flexBasis]': 'width'
  }
})
// tslint:disable-next-line:directive-class-suffix
export class NguCarouselOutlet {
  width = '33.33%';
  constructor(public viewContainer: ViewContainerRef, private el: ElementRef) {
    console.log(viewContainer.length);
  }
}

@Directive({
  selector: '[nguCarouselOutletLeft]',
  host: {
    '[style.width]': 'width'
  }
})
// tslint:disable-next-line:directive-class-suffix
export class NguCarouselOutletLeft {
  width: string;
  constructor(public viewContainer: ViewContainerRef) {}
}
@Directive({
  selector: '[nguCarouselOutletRight]',
  host: {
    '[style.width]': 'width'
  }
})
// tslint:disable-next-line:directive-class-suffix
export class NguCarouselOutletRight {
  width: string;
  constructor(public viewContainer: ViewContainerRef) {}
}
