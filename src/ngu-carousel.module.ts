import {
  NguCarouselPointDirective,
  NguCarouselItemDirective,
  NguCarouselNextDirective,
  NguCarouselPrevDirective
} from './ngu-carousel.directive';
import { NguItemComponent } from './ngu-item/ngu-item.component';
import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguCarouselComponent } from './ngu-carousel/ngu-carousel.component';
import { NguTileComponent } from './ngu-tile/ngu-tile.component';
import { NguCarouselService } from './ngu-carousel.service';

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
  providers: [NguCarouselService]
})
export class NguCarouselModule {}
