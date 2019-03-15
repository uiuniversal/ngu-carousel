import {
  Directive,
  ElementRef,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, merge, Subscription } from 'rxjs';
import { tap, filter, takeUntil } from 'rxjs/operators';
import { RxHammer } from './hammer';
import { NguCarouselM } from './carousel.m';

@Directive({
  selector: '[carouselTouchM]'
})
export class NguCarouselTouchM implements OnDestroy, AfterViewInit {
  destroyed = new Subject();

  touchDirection = '';

  maxTouchTransform = 0;

  isActive = false;

  mergSub: Subscription;
  panSub: Subscription;

  constructor(
    private carousel: NguCarouselM,
    private el: ElementRef<HTMLDivElement>,
    private renderer: Renderer2,
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
        this.carousel.transform = -this.carousel.xTransform();
      })
    );

    const panInput$ = hammertime1
      .event('hammer.input')
      .pipe(tap(ev => ev.srcEvent.stopPropagation()));

    const panEnd$ = hammertime1.event('panend').pipe(
      tap(e => {
        const x = Math.round(Math.abs(this.carousel.xTransform()) / this.carousel.itemWidth);
        const trans = -x * this.carousel.itemWidth;
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
        const max = (this.carousel.itemLength + this.carousel.slideItem) * this.carousel.itemWidth;
        const leftTransform = this.carousel.itemWidth * this.carousel.slideItemAct;
        const xAbs = Math.abs(x);
        if (xAbs >= max) {
          x = -leftTransform;
          this.carousel.transform = x - ev.deltaX;
        } else if (xAbs <= this.carousel.itemWidth) {
          x = -this.carousel.itemWidth * (this.carousel.itemLength + 1);
          this.carousel.transform = x - ev.deltaX;
        }
        this.carousel.setTransform(`translate3d(${x}px, 0, 0`, '');
      });
  }

  ngAfterViewInit() {}

  convertToPer(val: number) {
    return (Math.abs(val) / this.carousel.containerWidth) * 100;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

// var transitionEvent = whichTransitionEvent();
