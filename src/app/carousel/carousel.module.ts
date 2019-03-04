import { NgModule } from '@angular/core';
import { NguCarosuel } from './carousel.component';
import { CommonModule } from '@angular/common';
import {
  NguCarouselDefDirective,
  NguCarouselOutlet
} from './ngu-carousel.directive';

@NgModule({
  imports: [CommonModule],
  exports: [NguCarosuel, NguCarouselDefDirective],
  declarations: [NguCarosuel, NguCarouselDefDirective, NguCarouselOutlet],
  providers: []
})
export class CarouselModule {}
