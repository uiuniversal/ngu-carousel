import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguItemComponent
} from '@ngu/carousel';

import { BannerVerticalRoutingModule } from './banner-vertical-routing.module';
import { BannerVerticalComponent } from './banner-vertical.component';

@NgModule({
  declarations: [BannerVerticalComponent],
  imports: [
    CommonModule,
    BannerVerticalRoutingModule,
    NguCarousel,
    NguItemComponent,
    NguCarouselDefDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective
  ]
})
export class BannerVerticalModule {}
