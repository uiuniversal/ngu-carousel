---
sidebar_position: 2
---

# Input Interface

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
export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'all';

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
  gridBreakpoints?: Breakpoints;
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
  xl: number;
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
| `grid`                    | Object        | Yes      | **xs** - mobile, **sm** - tablet, **md** - desktop, **lg** - large desktops, **xl** - extra large desktops, **all** - fixed width (When you use **all** make others 0 and vise versa)                                         |
| `gridBreakpoints`         | Object        | optional | Determines the browser width in pixels that the grid displays the intended number of tiles.<br/><br/> default: `{sm: 768, md: 992, lg: 1200, xl: 1200}`                                                                       |
| `slide`                   | number        | optional | It is used to slide the number items on click                                                                                                                                                                                 |
| `speed`                   | milli seconds | optional | It is used for time taken to slide the number items                                                                                                                                                                           |
| `interval`                | milli seconds | optional | It is used to make carousel auto slide with given value. interval defines the interval between slides                                                                                                                         |
| `load`                    | number        | optional | is used to load the items similar to pagination. the carousel will tigger the carouslLoad function to load another set of items. it will help you to improve the performance of the app.**`(carouselLoad)="myfunc($event)"`** |
| `point.visible`           | boolean       | optional | It is used to indicate no. of slides and also shows the current active slide.                                                                                                                                                 |
| `point.hideOnSingleSlide` | boolean       | optional | It is used to hide the point indicator when slide is less than one.                                                                                                                                                           |
| `touch`                   | boolean       | optional | It is used to active touch support to the carousel.                                                                                                                                                                           |
| `easing`                  | string        | optional | It is used to define the easing style of the carousel. Only define the ease name without any timing like `ease`,`ease-in`                                                                                                     |
| `loop`                    | boolean       | optional | It is used to loop the `ngu-item ngu-tile`. It must be true for `interval`                                                                                                                                                    |
| `animation`               | string        | optional | It is used to animate the sliding items. currently it only supports `lazy`. more coming soon and also with custom css animation option                                                                                        |
| `custom`                  | string        | optional | It is you to define the purpose of the carousel. currently it only supports `banner`. more coming soon and also with custom css animation option                                                                              |
| `RTL`                     | boolean       | optional | This option enable the `rtl` direction and act as rtl. By default it is `ltr`                                                                                                                                                 |
| `vertical.enabled`        | boolean       | optional | This option enable the `vertical` direction                                                                                                                                                                                   |
| `vertical.height`         | boolean       | optional | This option is used to set the height of the carousel                                                                                                               