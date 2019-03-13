import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NguCarouselModule } from '../../projects/carousel/src/public_api';
import { NextComponent } from './next/next.component';
import { CurrentComponent } from './current/current.component';
// import { NguCarouselModule } from 'carousel';

@NgModule({
  declarations: [AppComponent, NextComponent, CurrentComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NguCarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
