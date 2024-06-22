import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServerRendering } from '@angular/platform-server';
import { APP_ROUTES } from './app.routes';

export const appServerConfig: ApplicationConfig = {
  providers: [provideRouter(APP_ROUTES), provideAnimations(), provideServerRendering()]
};
