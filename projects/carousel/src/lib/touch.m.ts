import {
  Directive,
  ElementRef,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  AfterViewInit,
  NgZone
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, merge, Subscription, BehaviorSubject, EMPTY } from 'rxjs';
import { tap, filter, takeUntil, switchMap } from 'rxjs/operators';
import { RxHammer } from './hammer';
import { NguCarouselM } from './carousel.m';

@Directive({
  selector: '[carouselTouchM]'
})
export class NguCarouselTouchM implements OnDestroy, AfterViewInit {
  private destroyed = new Subject();

  private touchDirection = '';

  private maxTouchTransform = 0;

  private isActive = false;

  // private mergSub: Subscription;
  // private panSub: Subscription;

  constructor(
    private carousel: NguCarouselM,
    private el: ElementRef<HTMLDivElement>,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {
    // this.isActive = this.c.touch.active;
    // this.ngZone.runOutsideAngular(() => this._touch());
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
      tap(() => {
        const x = Math.round(Math.abs(this.carousel.xTransform()) / this.carousel.itemWidth);
        const trans = -x * this.carousel.itemWidth;
        this.carousel.setTransform({ x: trans + 'px', transition: '.3s ease' });
      })
    );

    const initiator$ = merge(panStart$, panEnd$, panInput$).pipe(filter(() => false));

    const panup$ = merge(hammertime1.event('panup'), hammertime1.event('pandown'));

    const panleft$ = merge(hammertime1.event('panleft'), hammertime1.event('panright'));

    this.carousel.toggleTouch
      .pipe(
        switchMap(enable => (enable ? merge(initiator$, panleft$) : EMPTY)),
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
        this.carousel.setTransform({ x: x + 'px' });
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
