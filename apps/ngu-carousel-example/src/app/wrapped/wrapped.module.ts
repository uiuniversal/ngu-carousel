import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguItemComponent,
  NguTileComponent
} from '@ngu/carousel';
import { WrappedCarouselComponent } from './wrapped-carousel/wrapped-carousel.component';
import { WrappedRoutingModule } from './wrapped-routing.module';
import { WrappedComponent } from './wrapped.component';

@NgModule({
  imports: [
    WrappedRoutingModule,
    AsyncPipe,
    NgTemplateOutlet,
    NguCarousel,
    NguCarouselDefDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguItemComponent,
    NguTileComponent,
    HttpClientModule
  ],
  exports: [],
  declarations: [WrappedComponent, WrappedCarouselComponent],
  providers: []
})
export class WrappedModule {}
