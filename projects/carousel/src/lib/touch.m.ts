import { Directive, ElementRef, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { NguCarousel } from './carousel';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable, merge, Subscription } from 'rxjs';
import { tap, filter, takeUntil } from 'rxjs/operators';
import { RxHammer } from './hammer';
import { NguCarouselM } from './carousel.m';

@Directive({
  selector: '[carouselTouchM]'
})
export class NguCarouselTouchM implements OnDestroy {
  destroyed = new Subject();

  touchDirection = '';

  maxTouchTransform = 0;

  isActive = false;

  mergSub: Subscription;
  panSub: Subscription;

  constructor(
    private carousel: NguCarouselM,
    private el: ElementRef<HTMLDivElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // this.isActive = this.c.touch.active;
    this._touch();
  }

  private _touch(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const hammertime1 = new RxHammer(this.el.nativeElement);
    hammertime1.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    const panStart$ = hammertime1.event('panstart').pipe(
      tap(() => {
        // this.touchTransform = this.c.transform;
        // this.c.dexVal = 0;
        // this.maxTouchTransform = this.c.itemWidthTest * this.c.dataSource.length;
        // this.setMaxTouch();
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
        this.carousel.transform += e.deltaX;
        // if (Math.abs(e.velocity) >= this.c.velocity) {
        //   this.c.touch.velocity = e.velocity;
        //   const direction = this.touchDirection === 'panright' ? 0 : 1;
        //   this.c.slide(this.c.RTL ? +!direction : direction);
        // } else {
        //   this.resetTouch();
        // }
      })
    );

    merge(panStart$, panEnd$, panInput$)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {});

    const panup$ = merge(hammertime1.event('panup'), hammertime1.event('pandown'));

    const panleft$ = merge(hammertime1.event('panleft'), hammertime1.event('panright'));

    panleft$
      .pipe(
        filter(e => {
          // vertical touch events seem to cause to panstart event with an odd delta
          // and a center of {x:0,y:0} so this will ignore them
          return !(e.center.x === 0);
        }),
        takeUntil(this.destroyed)
      )
      .subscribe(ev => {
        const dexValPer = this.convertToPer(ev.deltaX);
        let x = ev.deltaX + this.carousel.transform;
        const max = (15 + this.carousel.size) * this.carousel.itemWidth;
        const leftTransform = this.carousel.itemWidth * this.carousel.size;
        const xAbs = Math.abs(x);
        if (xAbs > max) {
          x = -leftTransform;
          this.carousel.transform = x - ev.deltaX;
        } else if (xAbs < this.carousel.itemWidth) {
          x = -this.carousel.itemWidth * (this.carousel.itemLength + 1);
          this.carousel.transform = x - ev.deltaX;
        }
        this.carousel.setTransform(`translate3d(${x}px, 0, 0`);
      });
  }

  convertToPer(val: number) {
    return (Math.abs(val) / this.carousel.containerWidth) * 100;
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
