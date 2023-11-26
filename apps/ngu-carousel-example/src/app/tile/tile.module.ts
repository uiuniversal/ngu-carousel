import { NgModule } from '@angular/core';
import {
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPointDirective,
  NguCarouselPrevDirective,
  NguTileComponent
} from '@ngu/carousel';

import { AsyncPipe } from '@angular/common';
import { TileRoutingModule } from './tile-routing.module';
import { TileComponent } from './tile.component';

@NgModule({
  declarations: [TileComponent],
  imports: [
    AsyncPipe,
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
