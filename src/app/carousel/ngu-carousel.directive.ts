import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  ElementRef
} from '@angular/core';

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
