import { NguCarouselPointDirective, NguCarouselItemDirective, NguCarouselNextDirective, NguCarouselPrevDirective } from './ngu-carousel.directive';
import { NguItemComponent } from './ngu-item/ngu-item.component';
import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguCarouselComponent } from './ngu-carousel/ngu-carousel.component';
import { NguTileComponent } from './ngu-tile/ngu-tile.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    NguCarouselComponent,
    NguItemComponent,
    NguTileComponent,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective
  ],
  declarations: [
    NguCarouselComponent,
    NguItemComponent,
    NguTileComponent,
    NguCarouselPointDirective,
    NguCarouselItemDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective
  ],
  providers: []
})
export class NguCarouselModule {}
