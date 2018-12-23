import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { NguCarousel } from './ngu-carousel.component';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[carouselTouch]'
})
export class NguCarouselTouch {
  // @Input() inputs;
  @Output() touchEnd = new EventEmitter();
  @Output() touchStart = new EventEmitter();
  @Output() touchMove = new EventEmitter();
  touchTransform = 0;
  maxTouchTransform = 0;

  constructor(
    private c: NguCarousel,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this._touch();
  }

  private _touch(): void {
    if (
      !isPlatformBrowser(this.platformId) &&
      !this.c.touch.active &&
      this.c.vertical.enabled
    )
      return;

    const hammertime = new Hammer(this.el.nativeElement);
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammertime.on('panstart', (ev: any) => {
      // this.carouselWidth = this.nguItemsContainer.nativeElement.offsetWidth;
      this.touchStart.emit();
      this.touchTransform = this.c.transform;
      this.c.dexVal = 0;
      this.maxTouchTransform = this.c.itemWidthTest * this.c.dataSource.length;
      this.setMaxTouch();
    });
    if (this.c.vertical.enabled) {
      hammertime.on('panup', (ev: any) => {
        this._touchHandling('panleft', ev);
      });
      hammertime.on('pandown', (ev: any) => {
        this._touchHandling('panright', ev);
      });
    } else {
      hammertime.on('panleft', (ev: any) => {
        this._touchHandling('panleft', ev, this.maxTouchTransform);
      });
      hammertime.on('panright', (ev: any) => {
        this._touchHandling('panright', ev, this.maxTouchTransform);
      });
    }
    hammertime.on('panend', (ev: any) => {
      if (Math.abs(ev.velocity) >= this.c.velocity) {
        this.c.touch.velocity = ev.velocity;
        let direc = 0;
        if (!this.c.RTL) {
          direc = this.c.touch.swipe === 'panright' ? 0 : 1;
        } else {
          direc = this.c.touch.swipe === 'panright' ? 1 : 0;
        }
        // console.log('panend');
        // this.c.slide(direc);
        // if (this.c.pointIndex === 1) this.resetTouch();
        // else
        this.touchEnd.emit(direc);
      } else {
        this.resetTouch();
      }
    });
    hammertime.on('hammer.input', function(ev) {
      // allow nested touch events to no propagate, this may have other side affects but works for now.
      // TODO: It is probably better to check the source element of the event and only apply the handle to the correct carousel
      ev.srcEvent.stopPropagation();
    });
  }

  /** handle touch input */
  private _touchHandling(e: string, ev: any, maxSize?: number): void {
    // if (!this.inputs.touch) return;
    // vertical touch events seem to cause to panstart event with an odd delta
    // and a center of {x:0,y:0} so this will ignore them
    if (ev.center.x === 0 || !this.c.touch.active) {
      return;
    }

    ev = Math.abs(this.c.vertical.enabled ? ev.deltaY : ev.deltaX);
    let valt = ev - this.c.dexVal;
    valt =
      this.c.type === 'responsive'
        ? (Math.abs(ev - this.c.dexVal) /
            (this.c.vertical.enabled
              ? this.c.vertical.height
              : this.c.carouselWidth)) *
          100
        : valt;
    this.c.dexVal = ev;
    this.c.touch.swipe = e;
    this._setTouchTransfrom(e, valt);
    this._setTransformFromTouch();
  }

  private _setTouchTransfrom(e: string, valt: number) {
    const condition = this.c.RTL ? 'panright' : 'panleft';
    this.touchTransform =
      e === condition ? valt + this.touchTransform : this.touchTransform - valt;
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
      ? `translate3d(0, ${this.c.directionSym}${this.touchTransform}${type}, 0)`
      : `translate3d(${this.c.directionSym}${this.touchTransform +
          this.c._extraLoopItemsWidth}${type}, 0, 0)`;

    // this.transformCarousel(transform);
    this.touchMove.emit({ transform });
  }

  setMaxTouch() {
    this.maxTouchTransform =
      (100 / this.c.maxSlideItems) *
      (this.c.dataSource.length - this.c.maxSlideItems);
  }

  resetTouch() {
    this.c.dexVal = 0;
    const transition = '300ms cubic-bezier(0, 0, 0.2, 1)';
    const transform = `translate3d(-${this.c.transform +
      this.c._extraLoopItemsWidth}%,0,0)`;
    // this.transformCarousel(transform, transition);
    this.touchMove.emit({ transform, transition });
  }
}
