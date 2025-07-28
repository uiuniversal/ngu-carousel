import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Observable, Subject, defer, fromEvent, map, shareReplay, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NguHammerLoader {
  private _hammer$ = defer(() => import('hammerjs')).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  load() {
    return this._hammer$;
  }
}

@Injectable()
export class NguCarouselHammerManager implements OnDestroy {
  private _destroy$ = new Subject<void>();

  constructor(
    private _ngZone: NgZone,
    private _nguHammerLoader: NguHammerLoader
  ) {}

  ngOnDestroy(): void {
    this._destroy$.next();
  }

  createHammer(element: HTMLElement): Observable<HammerManager> {
    return this._nguHammerLoader.load().pipe(
      map(() =>
        // Note: The Hammer manager should be created outside of the Angular zone since it sets up
        //       `pointermove` event listener which triggers change detection every time the pointer is moved.
        this._ngZone.runOutsideAngular(() => new Hammer(element))
      ),
      // Note: the dynamic import is always a microtask which may run after the view is destroyed.
      //       `takeUntil` is used to prevent setting Hammer up if the view had been destroyed before
      //       the HammerJS is loaded.
      takeUntil(this._destroy$)
    );
  }

  on(hammer: HammerManager, event: string) {
    return fromEvent(hammer, event).pipe(
      // Note: We have to re-enter the Angular zone because Hammer would trigger events outside of the
      //       Angular zone (since we set it up with `runOutsideAngular`).
      enterNgZone(this._ngZone),
      takeUntil(this._destroy$)
    );
  }
}

function enterNgZone<T>(ngZone: NgZone) {
  return (source: Observable<T>) =>
    new Observable<T>(subscriber =>
      source.subscribe({
        next: value => ngZone.run(() => subscriber.next(value)),
        error: error => ngZone.run(() => subscriber.error(error)),
        complete: () => ngZone.run(() => subscriber.complete())
      })
    );
}
