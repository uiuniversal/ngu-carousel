import { Directive, TemplateRef, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[NguCarouselItem], [nguCarouselItem]',
  standalone: true
})
export class NguCarouselItemDirective {}

@Directive({
  standalone: true,
  selector: '[NguCarouselNext]'
})
export class NguCarouselNextDirective {}

@Directive({
  standalone: true,
  selector: '[NguCarouselPrev]'
})
export class NguCarouselPrevDirective {}

@Directive({
  selector: '[NguCarouselPoint], [nguCarouselPoint]',
  standalone: true
})
export class NguCarouselPointDirective {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[nguCarouselDef]',
  standalone: true
})
export class NguCarouselDefDirective<T> {
  template = inject(TemplateRef);
  when?: (index: number, nodeData: T) => boolean;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[nguCarouselOutlet]',
  standalone: true
})
export class NguCarouselOutlet {
  viewContainer = inject(ViewContainerRef);
}
