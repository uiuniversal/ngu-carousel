import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NguCarouselModule } from './carousel';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NguCarouselModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
