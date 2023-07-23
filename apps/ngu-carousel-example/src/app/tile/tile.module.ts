import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguTileComponent,
  NguCarouselPointDirective
} from '@ngu/carousel';

import { TileRoutingModule } from './tile-routing.module';
import { TileComponent } from './tile.component';

@NgModule({
  declarations: [TileComponent],
  imports: [
    CommonModule,
    TileRoutingModule,
    NguCarousel,
    NguTileComponent,
    NguCarouselDefDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguCarouselPointDirective
  ]
})
export class TileModule {}
