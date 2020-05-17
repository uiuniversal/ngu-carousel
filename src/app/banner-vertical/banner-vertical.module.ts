import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguCarouselModule } from '@ngu/carousel';

import { BannerVerticalRoutingModule } from './banner-vertical-routing.module';
import { BannerVerticalComponent } from './banner-vertical.component';


@NgModule({
  declarations: [BannerVerticalComponent],
  imports: [
    CommonModule,
    BannerVerticalRoutingModule,
    NguCarouselModule
  ]
})
export class BannerVerticalModule { }
