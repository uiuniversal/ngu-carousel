import { Directive, TemplateRef, ViewContainerRef, inject } from '@angular/core';

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

@Directive({
  selector: '[NguCarouselPoint]'
})
export class NguCarouselPointDirective {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[nguCarouselDef]'
})
export class NguCarouselDefDirective<T> {
  template = inject(TemplateRef);
  when?: (index: number, nodeData: T) => boolean;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[nguCarouselOutlet]'
})
export class NguCarouselOutlet {
  viewContainer = inject(ViewContainerRef);
}
