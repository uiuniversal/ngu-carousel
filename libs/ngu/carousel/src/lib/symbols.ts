import { isPlatformBrowser } from '@angular/common';
import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';

export const IS_BROWSER = new InjectionToken<boolean>('IS_BROWSER', {
  providedIn: 'root',
  factory: () => isPlatformBrowser(inject(PLATFORM_ID))
});
