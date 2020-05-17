import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NguCarouselModule } from '@ngu/carousel';
import { BannerRoutingModule } from './banner-routing.module';
import { BannerComponent } from './banner.component';


@NgModule({
  declarations: [BannerComponent],
  imports: [
    CommonModule,
    BannerRoutingModule,
    NguCarouselModule
  ]
})
export class BannerModule { }
