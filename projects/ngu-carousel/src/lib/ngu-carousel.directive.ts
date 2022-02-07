import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[NguCarouselItem]'
})
export class NguCarouselItemDirective {}

@Directive({
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
  selector: '[NguCarouselPrev]'
})
export class NguCarouselPrevDirective {
  // @HostBinding('disabled') disabled: boolean;
  // @HostBinding('style.display') display = 'block';
}

@Directive({
  selector: '[NguCarouselPoint]'
})
export class NguCarouselPointDirective {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[nguCarouselDef]'
})
export class NguCarouselDefDirective<T> {
  when: (index: number, nodeData: T) => boolean;

  constructor(public template: TemplateRef<any>) {}
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[nguCarouselOutlet]'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NguCarouselOutlet {
  constructor(public viewContainer: ViewContainerRef) {}
}
