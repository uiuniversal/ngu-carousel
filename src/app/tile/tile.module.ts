import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
