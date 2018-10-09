# ngu-carousel [![npm version](https://badge.fury.io/js/%40ngu%2Fcarousel.svg)](https://badge.fury.io/js/%40ngu%2Fcarousel)

Angular Universal carousel

`Note: This carousel doesn't include any css`

## Demo

Demo available in Stackblitz [Here](https://stackblitz.com/edit/ngu-carousel-ng6)

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

ngu-carousel supports touch with the help of **hammerjs**

`npm install hammerjs --save`

Import hammerjs in `main.ts` file

```javascript
import 'hammerjs';
```

## Usage

```html
<ngu-carousel #myCarousel [inputs]="carouselConfig" [dataSource]="carouselTiles" (carouselLoad)="loadMore($event)" (onMove)="onMove($event)">
  <div *nguCarouselDef="let tile; let j = index">
    {{tile.text}}
  </div>
  
  <button NguCarouselPrev [disabled]="isFirst && !carouselConf.loop" *ngIf="myCarousel.pointNumbers.length > 1"></button>
  <button NguCarouselNext [disabled]="isLast && !carouselConf.loop" *ngIf="myCarousel.pointNumbers.length > 1"></button>
  
  <ul NguCarouselPoint>
    <li *ngFor="let point of myCarousel.pointNumbers; let j = index" [class.active]="j === myCarousel.activePoint" (click)="myCarousel.moveTo(j)">{{point}}</li>
  </ul>
</ngu-carousel>
```

```typescript
import { Component, OnInit } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'sample'
})
export class SampleComponent {
  
  public carouselConfig: NguCarouselConfig;
  public carouselTiles: any[] = [
    {
      text: 'first tile'
    },
    {
      text: 'second tile'
    },
    {
      text: 'third tile'
    }
  ];
  
  constructor() {
    // See NguCarouselConfig below for available options
    this.carouselConfig = {
      grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
      slide: 3,
      speed: 250,
      interval: {
        timing: 2000
      },
      point: {
        visible: true
      },
      load: 2,
      velocity: 0,
      touch: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    }
  }
  
  onMove() {
    // Carousel moved, do something
  }
  
  loadMore() {
    // Load more tiles
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
| `load`                    | number        | optional | is used to load the items similar to pagination. the carousel will trigger the carouslLoad function to load another set of items. it will help you to improve the performance of the app.**`(carouselLoad)="myfunc($event)"`** |
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

## License

[MIT](LICENSE) license.
