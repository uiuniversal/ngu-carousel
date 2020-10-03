import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguCarouselModule } from '@ngu/carousel';
import { SampleRoutingModule } from './sample-routing.module';
import { SampleComponent } from './sample.component';


@NgModule({
  declarations: [SampleComponent],
  imports: [
    CommonModule,
    SampleRoutingModule,
    NguCarouselModule
  ]
})
export class SampleModule { }
