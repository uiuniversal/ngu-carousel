import { Directive, ElementRef, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { NguCarousel } from './ngu-carousel.component';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable, merge, Subscription } from 'rxjs';
import { tap, filter, takeUntil } from 'rxjs/operators';
import { RxHammer } from './hammer';

@Directive({
  selector: '[carouselTouch]'
})
export class NguCarouselTouch implements OnDestroy {
  touchEnd = new Subject();

  touchStart = new Subject();

  touchMove = new Subject();

  destroyed = new Subject();

  touchDirection = '';

  touchTransform = 0;

  maxTouchTransform = 0;

  isActive = false;

  mergSub: Subscription;
  panSub: Subscription;

  constructor(
    private c: NguCarousel,
    private el: ElementRef<HTMLDivElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isActive = this.c.touch.active;
    this._touch();
  }

  private _touch(): void {
    if (!isPlatformBrowser(this.platformId) && !this.isActive && this.c.vertical.enabled) return;

    const hammertime1 = new RxHammer(this.el.nativeElement);
    hammertime1.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    const panStart$ = hammertime1.event('panstart').pipe(
      tap(() => {
        this.touchStart.next();
        this.touchTransform = this.c.transform;
        this.c.dexVal = 0;
        this.maxTouchTransform = this.c.itemWidthTest * this.c.dataSource.length;
        this.setMaxTouch();
      })
    );

    const panInput$ = hammertime1.event('hammer.input').pipe(
      tap(ev => {
        // allow nested touch events to no propagate, this may have other side affects but works for now.
        // TODO: It is probably better to check the source element of the event and only apply the handle to the correct carousel
        ev.srcEvent.stopPropagation();
      })
    );

    const panEnd$ = hammertime1.event('panend').pipe(
      tap(e => {
        if (Math.abs(e.velocity) >= this.c.velocity) {
          this.c.touch.velocity = e.velocity;
          const direction = this.touchDirection === 'panright' ? 0 : 1;

          this.c.slide(this.c.RTL ? +!direction : direction);
        } else {
          this.resetTouch();
        }
      })
    );

    merge(panStart$, panEnd$, panInput$)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {});

    const panup$ = merge(hammertime1.event('panup'), hammertime1.event('pandown'));

    const panleft$ = merge(hammertime1.event('panleft'), hammertime1.event('panright'));

    (this.c.vertical.enabled ? panup$ : panleft$)
      .pipe(
        filter(e => {
          // vertical touch events seem to cause to panstart event with an odd delta
          // and a center of {x:0,y:0} so this will ignore them
          return !(e.center.x === 0 || !this.c.touch.active);
        }),
        takeUntil(this.destroyed)
      )
      .subscribe(ev => this._touchHandling(ev));
  }

  /** handle touch input */
  private _touchHandling(hammerEvt: HammerInput): void {
    const draged = Math.abs(this.c.vertical.enabled ? hammerEvt.deltaY : hammerEvt.deltaX);
    let valt = draged - this.c.dexVal;
    valt =
      this.c.type === 'responsive'
        ? (Math.abs(draged - this.c.dexVal) /
            (this.c.vertical.enabled ? this.c.vertical.height : this.c.carouselWidth)) *
          100
        : valt;
    this.c.dexVal = draged;
    this.touchDirection = eventType(hammerEvt.type);
    const condition = this.c.RTL ? 'panright' : 'panleft';
    this.touchTransform =
      this.touchDirection === condition ? valt + this.touchTransform : this.touchTransform - valt;
    this._setTransformFromTouch();
  }

  private _setTransformFromTouch() {
    if (this.touchTransform < 0 && !this.c.loop) {
      this.touchTransform = 0;
    } else if (this.maxTouchTransform === this.touchTransform) {
      return;
    } else if (this.maxTouchTransform <= this.touchTransform) {
      this.touchTransform = this.maxTouchTransform;
    }
    // console.log(this.touchTransform, this.maxTouchTransform);
    const type = this.c.type === 'responsive' ? '%' : 'px';

    const transform = this.c.vertical.enabled
      ? getTransform(0, this.touchTransform, type, this.c.directionSym)
      : getTransform(
          this.touchTransform + this.c._extraLoopItemsWidth,
          0,
          type,
          this.c.directionSym
        );

    // this.touchMove.next({ transform });
    this.c.setTransform(transform);
  }

  setMaxTouch() {
    this.maxTouchTransform =
      (100 / this.c.maxSlideItems) * (this.c.dataSource.length - this.c.maxSlideItems);
  }

  resetTouch() {
    this.c.dexVal = 0;
    const transition = '300ms cubic-bezier(0, 0, 0.2, 1)';
    const transform = getTransform(this.c.transform + this.c._extraLoopItemsWidth, 0, '%', '-');
    this.touchMove.next({ transform, transition });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

function eventType(name: string) {
  const d = {
    panup: 'panleft',
    pandown: 'panright',
    panleft: 'panleft',
    panright: 'panright'
  };
  return d[name];
}

function getTransform(x: number, y: number, type: string, sym: string) {
  const xx = sym + x.toFixed(2) + type;
  const yy = sym + y.toFixed(2) + type;
  return `translate3d(${xx}, ${yy}, 0)`;
}
