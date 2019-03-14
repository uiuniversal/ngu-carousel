import { Directive, ElementRef, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, merge, Subscription } from 'rxjs';
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
        this.carousel.transform = -this.xTransform();
      })
    );

    const panInput$ = hammertime1
      .event('hammer.input')
      .pipe(tap(ev => ev.srcEvent.stopPropagation()));

    const panEnd$ = hammertime1.event('panend').pipe(
      tap(e => {
        const x = Math.abs(this.xTransform()) / this.carousel.itemWidth;
        const trans = -Math.round(x) * this.carousel.itemWidth;
        this.carousel.setTransform(`translate3d(${trans}px, 0, 0`, '.3s ease');
      })
    );

    merge(panStart$, panEnd$, panInput$)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {});

    const panup$ = merge(hammertime1.event('panup'), hammertime1.event('pandown'));

    const panleft$ = merge(hammertime1.event('panleft'), hammertime1.event('panright'));

    panleft$
      .pipe(
        filter(e => !(e.center.x === 0)),
        takeUntil(this.destroyed)
      )
      .subscribe(ev => {
        // const dexValPer = this.convertToPer(ev.deltaX);
        let x = ev.deltaX + this.carousel.transform;
        const max = (15 + this.carousel.size) * this.carousel.itemWidth;
        const leftTransform = this.carousel.itemWidth * this.carousel.size;
        const xAbs = Math.abs(x);
        if (xAbs >= max) {
          x = -leftTransform;
          this.carousel.transform = x - ev.deltaX;
        } else if (xAbs <= this.carousel.itemWidth) {
          x = -this.carousel.itemWidth * (this.carousel.itemLength + 1);
          this.carousel.transform = x - ev.deltaX;
        }
        this.carousel.setTransform(`translate3d(${x}px, 0, 0`);
      });
  }

  private xTransform() {
    return getXValue(this.carousel.transformDiv.nativeElement.style.transform).x;
  }

  convertToPer(val: number) {
    return (Math.abs(val) / this.carousel.containerWidth) * 100;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

function getXValue(transform: string) {
  const t = transform.replace(/.*\(|\)| /g, '').split(',');
  const x = +t[0].match(/[0-9]+/)[0];
  const y = +t[1].match(/[0-9]+/)[0];
  const z = +t[2].match(/[0-9]+/)[0];
  return { x, y, z };
}

function whichTransitionEvent(el: HTMLDivElement): string {
  let t: string | number;

  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

// var transitionEvent = whichTransitionEvent();
