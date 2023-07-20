import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NguCarouselModule } from '@ngu/carousel';

import { Tile2RoutingModule } from './tile-routing.module';
import { Tile2ImagesComponent } from './tile-2-images.component';

@NgModule({
  declarations: [Tile2ImagesComponent],
  imports: [CommonModule, Tile2RoutingModule, NguCarouselModule]
})
export class Tile2ImagesModule {}
