import { Component, OnInit, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { NguCarouselConfig } from 'projects/carousel/src/public_api';
import { NguCarouselM } from 'projects/carousel/src/lib/carousel.m';

@Component({
  selector: 'app-next',
  templateUrl: './next.component.html',
  styleUrls: ['./next.component.scss']
})
export class NextComponent implements OnInit {
  items = of(
    Array(15)
      .fill('')
      .map((_, i) => i + 1)
  );

  showMe = true;
  _carousel: NguCarouselM<number>;

  @ViewChild(NguCarouselM)
  set carousel(d: NguCarouselM<number>) {
    this._carousel = d;
  }

  public carouselTileConfig: NguCarouselConfig = {
    grid: { size: 5, offset: 0, type: 'responsive', slide: 2 },
    speed: 700,
    point: {
      visible: true,
      hideOnSingleSlide: true
    },
    touch: true,
    loop: true,
    load: 2,
    interval: { timing: 850, initialDelay: 4000 },
    // vertical: { enabled: true, height: 200 },
    velocity: 0,
    animation: 'lazy',
    easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
    RTL: false
  };

  constructor() {}

  ngOnInit() {}

  touch(enable: boolean) {
    this._carousel.toggleDrag(enable);
  }

  interval(enable: boolean) {
    this._carousel.toggleIntervals(enable);
  }

  test() {
    console.log('change detection happened');
  }
}
