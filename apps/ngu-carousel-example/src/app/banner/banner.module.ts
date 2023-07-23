import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BannerRoutingModule } from './banner-routing.module';
import { BannerComponent } from './banner.component';
import {
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguItemComponent
} from '@ngu/carousel';

@NgModule({
  declarations: [BannerComponent],
  imports: [
    CommonModule,
    BannerRoutingModule,
    NguCarousel,
    NguItemComponent,
    NguCarouselDefDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective
  ]
})
export class BannerModule {}
