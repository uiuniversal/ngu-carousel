---
sidebar_position: 5
---

# Getstarted guide

## Banner with Custom point style

```javascript
import { Component } from '@angular/core';
import { NguCarousel, NguCarouselStore } from '@ngu/carousel';

@Component({
  selector: 'app-carousel',
  template: `
    <ngu-carousel [inputs]="carouselBanner" (onMove)="onmoveFn($event)" [trackBy]="trackCarousel">
      <ngu-item NguCarouselItem class="bannerStyle">
        <h1>1</h1>
      </ngu-item>

      <ngu-item NguCarouselItem class="bannerStyle">
        <h1>2</h1>
      </ngu-item>

      <ngu-item NguCarouselItem class="bannerStyle">
        <h1>3</h1>
      </ngu-item>

      <button NguCarouselPrev class="leftRs">&lt;</button>
      <button NguCarouselNext class="rightRs">&gt;</button>
    </ngu-carousel>
  `,
  styles: [
    `
      .bannerStyle h1 {
        background-color: #ccc;
        min-height: 300px;
        text-align: center;
        line-height: 300px;
      }
      .leftRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, 0.3);
        border-radius: 999px;
        left: 0;
      }

      .rightRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, 0.3);
        border-radius: 999px;
        right: 0;
      }
    `
  ]
})
export class Sample implements OnInit {
  ngOnInit() {
    this.carouselBanner = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, all: 0 },
      slide: 1,
      speed: 400,
      interval: {
        timing: 3000,
        initialDelay: 1000
      },
      point: {
        visible: true
      },
      load: 2,
      loop: true,
      touch: true
    };
  }

  /* It will be triggered on every slide*/
  onmoveFn(data: NguCarouselStore) {
    console.log(data);
  }

  trackCarousel(_, item) {
    return item;
  }
}
```

## Banner with Vertical carousel

```javascript
import { Component } from '@angular/core';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'app-carousel',
  template: `
    <ngu-carousel
      [inputs]="carouselBanner"
      (onMove)="onmoveFn($event)">

          <ngu-item NguCarouselItem class="bannerStyle">
              <h1>1</h1>
          </ngu-item>

          <ngu-item NguCarouselItem class="bannerStyle">
              <h1>2</h1>
          </ngu-item>

          <ngu-item NguCarouselItem class="bannerStyle">
              <h1>3</h1>
          </ngu-item>

          <button NguCarouselPrev class='leftRs'>&lt;</button>
          <button NguCarouselNext class='rightRs'>&gt;</button>
    </ngu-carousel>
  `,
  styles: [
    `
    .bannerStyle h1 {
        background-color: #ccc;
        min-height: 300px;
        text-align: center;
        line-height: 300px;
    }
    .leftRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        left: 0;
    }

    .rightRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        right: 0;
    }

    .ngucarouselPoint {
      list-style-type: none;
      text-align: center;
      padding: 12px;
      margin: 0;
      white-space: nowrap;
      overflow: auto;
      position: absolute;
      width: 100%;
      bottom: 20px;
      left: 0;
      box-sizing: border-box;
    }
    .ngucarouselPoint li {
      display: inline-block;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.55);
      padding: 5px;
      margin: 0 3px;
      transition: .4s ease all;
    }
    .ngucarouselPoint li.active {
        background: white;
        width: 10px;
    }
  `
  ]
})
export class Sample implements OnInit {
  ngOnInit() {
    this.carouselBanner = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, xl:1, all: 0 },
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      loop: true,
      touch: true, // touch is not currently in active for vertical carousel, will enable it in future build
      vertical {
        enabled: true,
        height: 400
      }
    };
  }

  /* It will be triggered on every slide*/
  onmoveFn(data: NguCarousel) {
    console.log(data);
  }
}
```

## Tile with Carousel Control

```javascript
import { Component } from '@angular/core';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'app-carousel',
  template: `
    <ngu-carousel #carousel
      [inputs]="carouselTile"
      (carouselLoad)="carouselTileLoad($event)">

            <ngu-tile NguCarouselItem *ngFor="let Tile of carouselTileItems">
                <h1>{{Tile + 1}}</h1>
            </ngu-tile>

          <button NguCarouselPrev class='leftRs'>&lt;</button>
          <button NguCarouselNext class='rightRs'>&gt;</button>
    </ngu-carousel>
    <button (click)="resetFn()">Reset</button>
  `,
  styles: [`

    h1{
      min-height: 200px;
      background-color: #ccc;
      text-align: center;
      line-height: 200px;
    }
    .leftRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        left: 0;
    }

    .rightRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        right: 0;
    }
  `]
})
export class Sample implements OnInit {
  private carouselToken: string;

  public carouselTileItems: Array<any>;
  public carouselTile: NguCarouselConfig;
  @ViewChild('carousel') carousel: NguCarousel;

  constructor() {  }

  ngOnInit(){
    this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    this.carouselTile = {
      grid: {xs: 2, sm: 3, md: 3, lg: 5, xl:5, all: 0},
      slide: 2,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      easing: 'ease'
    }
  }

  initDataFn(key: NguCarouselStore) {
    this.carouselToken = key.token;
  }

  resetFn() {
    this.carousel.reset(this.carouselToken);
  }

  moveToSlide() {
    this.carousel.moveToSlide(this.carouselToken, 2, false);
  }

  public carouselTileLoad(evt: any) {

    const len = this.carouselTileItems.length
    if (len <= 30) {
      for (let i = len; i < len + 10; i++) {
        this.carouselTileItems.push(i);
      }
    }

  }

     // carouselLoad will trigger this funnction when your load value reaches
     // it is helps to load the data by parts to increase the performance of the app
     // must use feature to all carousel

}
```

## Tile with custom point style

```javascript
import { Component } from '@angular/core';
import { NguCarousel } from '@ngu/carousel';

@Component({
  selector: 'app-carousel',
  template: `
    <ngu-carousel
      [inputs]="carouselTile"
      (carouselLoad)="carouselTileLoad($event)">

            <ngu-tile NguCarouselItem *ngFor="let Tile of carouselTileItems">
                <h1>{{Tile + 1}}</h1>
            </ngu-tile>

          <button NguCarouselPrev class='leftRs'>&lt;</button>
          <button NguCarouselNext class='rightRs'>&gt;</button>
    </ngu-carousel>
  `,
  styles: [`

    h1{
      min-height: 200px;
      background-color: #ccc;
      text-align: center;
      line-height: 200px;
    }
    .leftRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        left: 0;
    }

    .rightRs {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        width: 50px;
        height: 50px;
        box-shadow: 1px 2px 10px -1px rgba(0, 0, 0, .3);
        border-radius: 999px;
        right: 0;
    }
  `]
})
export class Sample implements OnInit {

  public carouselTileItems: Array<any>;
  public carouselTile: NguCarousel;

  ngOnInit(){
    this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    this.carouselTile = {
      grid: {xs: 2, sm: 3, md: 3, lg: 5, xl:5, all: 0},
      slide: 2,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: true,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            box-sizing: border-box;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border-radius: 50%;
            border: 2px solid rgba(0, 0, 0, 0.55);
            padding: 4px;
            margin: 0 3px;
            transition-timing-function: cubic-bezier(.17, .67, .83, .67);
            transition: .4s;
          }
          .ngucarouselPoint li.active {
              background: #6b6b6b;
              transform: scale(1.2);
          }
        `
      },
      load: 2,
      touch: true,
      easing: 'ease'
    }
  }

  public carouselTileLoad(evt: any) {

    const len = this.carouselTileItems.length
    if (len <= 30) {
      for (let i = len; i < len + 10; i++) {
        this.carouselTileItems.push(i);
      }
    }

  }

     // carouselLoad will trigger this funnction when your load value reaches
     // it is helps to load the data by parts to increase the performance of the app
     // must use feature to all carousel

}
```