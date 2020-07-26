import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NguCarouselModule } from '@ngu/carousel';

import { TileRoutingModule } from './tile-routing.module';
import { TileComponent } from './tile.component';

@NgModule({
  declarations: [TileComponent],
  imports: [
    CommonModule,
    TileRoutingModule,
    NguCarouselModule
  ]
})
export class TileModule { }
