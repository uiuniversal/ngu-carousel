import { TemplateRef, ViewContainerRef } from '@angular/core';
export declare class NguCarouselItemDirective {
}
export declare class NguCarouselNextDirective {
}
export declare class NguCarouselPrevDirective {
}
export declare class NguCarouselPointDirective {
}
export declare class NguCarouselDefDirective<T> {
    template: TemplateRef<any>;
    when: (index: number, nodeData: T) => boolean;
    constructor(template: TemplateRef<any>);
}
export declare class NguCarouselOutlet {
    viewContainer: ViewContainerRef;
    constructor(viewContainer: ViewContainerRef);
}
