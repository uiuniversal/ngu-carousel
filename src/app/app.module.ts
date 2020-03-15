import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NguCarouselModule } from '@ngu/carousel';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NguCarouselModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
