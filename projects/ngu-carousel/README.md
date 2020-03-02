# ngu-carousel

Angular Universal carousel

`Note: This carousel doesn't include any css. go and customize css for buttons, items except ngucarousel and ngucarousel-inner`

## changelog [![npm version](https://badge.fury.io/js/%40ngu%2Fcarousel.svg)](https://badge.fury.io/js/%40ngu%2Fcarousel)

for ChangeLog go to [CHANGELOG.md](https://github.com/sheikalthaf/ngu-carousel/blob/master/CHANGELOG.md)

## Demo

Demo available in Stackblitz [Here](https://stackblitz.com/edit/ngu-carousel-ng6)

Demo available [Here](https://ngu-carousel.firebaseapp.com)

## Installation

`npm install @ngu/carousel --save`

Include CarouselModule in your app module:

```javascript
import { NguCarouselModule } from '@ngu/carousel';

@NgModule({
  imports: [NguCarouselModule]
})
export class AppModule {}
```

Now ngu-carousel supports touch with the help of hammerjs

`npm install hammerjs --save`

Import hammerjs in `main.ts` file

```javascript
import 'hammerjs';
```

Then use in your component:

```javascript
import { Component, OnInit } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'sample',
  template: `
    <ngu-carousel #myCarousel [inputs]="carouselTile" [dataSource]="carouselTileItems">
  <ngu-tile *nguCarouselDef="let item; let i = index">

    <ngu-carousel #myCarousel [inputs]="carouselTile" (carouselLoad)="carouselTileLoad(i)" [dataSource]="carouselTiles[i]">
      <ngu-tile *nguCarouselDef="let item; let j = index">
        <div class="tile" [style.background]="'url(' + item + ')'" style="min-height: 200px">
          <h1>{{j}}</h1>
        </div>
      </ngu-tile>
      <button NguCarouselPrev class="leftRs" [style.opacity]="myCarousel.isFirst ? 0.5:1">&lt;</button>
      <button NguCarouselNext class="rightRs" [style.opacity]="myCarousel.isLast ? 0.5:1">&gt;</button>
      <ul class="myPoint" NguCarouselPoint>
        <li *ngFor="let j of myCarousel.pointNumbers; let j = index" [class.active]="j==myCarousel.activePoint" (click)="myCarousel.moveTo(j)"
          [style.background]="'url(' + carouselTileItems[j] + ')'"></li>
      </ul>
    </ngu-carousel>

  </ngu-tile>
  <button NguCarouselPrev class="leftRs" [style.opacity]="myCarousel.isFirst ? 0.5:1">&lt;</button>
  <button NguCarouselNext class="rightRs" [style.opacity]="myCarousel.isLast ? 0.5:1">&gt;</button>
  <ul class="myPoint" NguCarouselPoint>
    <li *ngFor="let i of myCarousel.pointNumbers; let i = index" [class.active]="i==myCarousel.activePoint" (click)="myCarousel.moveTo(i)"
      [style.background]="'url(' + carouselTileItems[i] + ')'"></li>
  </ul>
</ngu-carousel>

  `,
})
export class SampleComponent implements OnInit {
  imgags = [
    'assets/bg.jpg',
    'assets/car.png',
    'assets/canberra.jpg',
    'assets/holi.jpg'
  ];
  public carouselTileItems: Array<any> = [0, 1, 2, 3, 4, 5];
  public carouselTiles = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };
  public carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
    slide: 3,
    speed: 250,
    point: {
      visible: true
    },
    load: 2,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };
  constructor() {}

  ngOnInit() {
    this.carouselTileItems.forEach(el => {
      this.carouselTileLoad(el);
    });
  }

  public carouselTileLoad(j) {
    // console.log(this.carouselTiles[j]);
    const len = this.carouselTiles[j].length;
    if (len <= 30) {
      for (let i = len; i < len + 15; i++) {
        this.carouselTiles[j].push(
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        );
      }
    }
  }
}
```

## Input Interface

```javascript
export class NguCarouselStore {
  type: string;
  deviceType: DeviceType;
  token: string;
  items: number;
  load: number;
  deviceWidth: number;
  carouselWidth: number;
  itemWidth: number;
  visibleItems: ItemsControl;
  slideItems: number;
  itemWidthPer: number;
  itemLength: number;
  currentSlide: number;
  easing: string;
  speed: number;
  transform: Transfrom;
  loop: boolean;
  dexVal: number;
  touchTransform: number;
  touch: Touch;
  isEnd: boolean;
  isFirst: boolean;
  isLast: boolean;
  RTL: boolean;
  vertical: Vertical;
}
export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'all';

export class ItemsControl {
  start: number;
  end: number;
}

export class Vertical {
  enabled: boolean;
  height: number;
}

export class Touch {
  active?: boolean;
  swipe: string;
  velocity: number;
}

export class NguCarouselConfig {
  grid: Transfrom;
  slide?: number;
  speed?: number;
  interval?: CarouselInterval;
  animation?: Animate;
  point?: Point;
  type?: string;
  load?: number;
  custom?: Custom;
  loop?: boolean;
  touch?: boolean;
  easing?: string;
  RTL?: boolean;
  button?: NguButton;
  vertical?: Vertical;
  velocity?: number;
}

export class Grid {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  all: number;
}

export interface Point {
  visible: boolean;
  hideOnSingleSlide?: boolean;
}

export type Custom = 'banner';
export type Animate = 'lazy';
```

| Command                   | Type          | Required | Description                                                                                                                                                                                                                   |
| ------------------------- | ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grid`                    | Object        | Yes      | **xs** - mobile, **sm** - tablet, **md** - desktop, **lg** - large desktops, **all** - fixed width (When you use **all** make others 0 and vise versa)                                                                        |
| `slide`                   | number        | optional | It is used to slide the number items on click                                                                                                                                                                                 |
| `speed`                   | milli seconds | optional | It is used for time taken to slide the number items                                                                                                                                                                           |
| `interval`                | milli seconds | optional | It is used to make carousel auto slide with given value. interval defines the interval between slides                                                                                                                         |
| `load`                    | number        | optional | is used to load the items similar to pagination. the carousel will tigger the carouslLoad function to load another set of items. it will help you to improve the performance of the app.**`(carouselLoad)="myfunc($event)"`** |
| `point.visible`           | boolean       | optional | It is used to indicate no. of slides and also shows the current active slide.                                                                                                                                                 |
| `point.hideOnSingleSlide` | boolean       | optional | It is used to hide the point indicator when slide is less than one.                                                                                                                                                           |
| `touch`                   | boolean       | optional | It is used to active touch support to the carousel.                                                                                                                                                                           |
| `easing`                  | string        | optional | It is used to define the easing style of the carousel. Only define the ease name without any timing like `ease`,`ease-in`                                                                                                     |
| `loop`                    | boolean       | optional | It is used to loop the `ngu-item | ngu-tile`. It must be true for `interval`                                                                                                                                                  |
| `animation`               | string        | optional | It is used to animate the sliding items. currently it only supports `lazy`. more coming soon and also with custom css animation option                                                                                        |
| `custom`                  | string        | optional | It is you to define the purpose of the carousel. currently it only supports `banner`. more coming soon and also with custom css animation option                                                                              |
| `RTL`                     | boolean       | optional | This option enable the `rtl` direction and act as rtl. By default it is `ltr`                                                                                                                                                 |
| `vertical.enabled`        | boolean       | optional | This option enable the `vertical` direction                                                                                                                                                                                   |
| `vertical.height`         | boolean       | optional | This option is used to set the height of the carousel                                                                                                                                                                         |

### Custom css for Point

```html
<ul class="ngucarouselPoint">
    <li *ngFor="let i of pointNumbers; let i = index" [class.active]="i==pointers"></li>
</ul>
```

This is HTML I'm using in the carousel. Add your own css according to this elements in `pointStyles`. check below guide for more details.

```html
<ngu-carousel
      [inputs]="carouselBanner"
      (onMove)="onmoveFn($event)"
      (carouselLoad)="loadItemsFn()">
</ngu-carousel>
```

- `inputs` is an `Input` and It accepts `NguCarouselConfig`.
- `onMove` is an `Output` which triggered on every slide before start and it will emit `$event` as `NguCarouselStore` object.
- `carouselLoad` is an `Output` which triggered when slide reaches the end on items based on inputs `load`.

# Getstarted guide

## Banner with Custom point style

```javascript
import { Component } from '@angular/core';
import { NguCarousel, NguCarouselStore } from '@ngu/carousel';

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
  `
  ]
})
export class Sample implements OnInit {
  ngOnInit() {
    this.carouselBanner = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
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
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
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
      grid: {xs: 2, sm: 3, md: 3, lg: 5, all: 0},
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
      grid: {xs: 2, sm: 3, md: 3, lg: 5, all: 0},
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

## License

[MIT](LICENSE) license.
