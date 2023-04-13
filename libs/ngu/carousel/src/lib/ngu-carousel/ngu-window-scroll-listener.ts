import { Inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IS_BROWSER } from '../symbols';

@Injectable({ providedIn: 'root' })
export class NguWindowScrollListener extends Subject<Event> implements OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  constructor(@Inject(IS_BROWSER) isBrowser: boolean, ngZone: NgZone) {
    super();

    // Note: this service is shared between multiple `NguCarousel` components and each instance
    //       doesn't add new events listener for the `window`.
    if (isBrowser) {
      ngZone.runOutsideAngular(() =>
        fromEvent(window, 'scroll').pipe(takeUntil(this._destroy$)).subscribe(this)
      );
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
