import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';

import {
  NguCarouselDefDirective,
  NguCarouselItemDirective,
  NguCarouselNextDirective,
  NguCarouselOutlet,
  NguCarouselPointDirective,
  NguCarouselPrevDirective
} from './ngu-carousel.directive';
import { NguCarousel } from './ngu-carousel/ngu-carousel.component';
import { NguItemComponent } from './ngu-item/ngu-item.component';
import { NguTileComponent } from './ngu-tile/ngu-tile.component';

@NgModule({
  imports: [BidiModule, CommonModule],
  exports: [
    NguCarousel,
    NguItemComponent,
    NguTileComponent,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguCarouselDefDirective,
    NguCarouselOutlet
  ],
  declarations: [
    NguCarousel,
    NguItemComponent,
    NguTileComponent,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguCarouselDefDirective,
    NguCarouselOutlet
  ]
})
export class NguCarouselModule {}
