import { AsyncPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NguCarousel,
  NguCarouselDefDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective,
  NguItemComponent,
  NguTileComponent
} from '@ngu/carousel';

import { Tile2ImagesComponent } from './tile-2-images.component';
import { Tile2RoutingModule } from './tile-routing.module';

@NgModule({
  declarations: [Tile2ImagesComponent],
  imports: [
    AsyncPipe,
    Tile2RoutingModule,
    NguCarousel,
    NguCarouselDefDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguItemComponent,
    NguTileComponent
  ]
})
export class Tile2ImagesModule {}
