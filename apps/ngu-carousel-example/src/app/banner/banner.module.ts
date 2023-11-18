import { AsyncPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguItemComponent
} from '@ngu/carousel';
import { BannerRoutingModule } from './banner-routing.module';
import { BannerComponent } from './banner.component';

@NgModule({
  declarations: [BannerComponent],
  imports: [
    AsyncPipe,
    BannerRoutingModule,
    NguCarousel,
    NguItemComponent,
    NguCarouselDefDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective
  ]
})
export class BannerModule {}
