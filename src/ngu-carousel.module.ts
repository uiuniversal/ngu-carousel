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

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { velocity: 0.4, threshold: 20 }, // override default settings
    pan: { velocity: 0.4, threshold: 20 }
  };
}

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
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }]
})
export class NguCarouselModule {}
