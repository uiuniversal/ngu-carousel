export class NguCarouselStore {
  touch = new Touch();
  vertical = new Vertical();
  interval?: CarouselInterval;
  transform = 0;
  button?: NguButton;
  visibleItems?: ItemsControl;
  type: CarouselType = 'fixed';
  token = '';
  maxSlideItems = 0;
  load = 0;
  deviceWidth = 0;
  carouselWidth = 0;
  itemWidth = 0;
  slideItems = 0;
  itemWidthPer = 0;
  itemLength = 0;
  currentSlideItems = 0;
  resetOnDataChange = false;
  easing = 'cubic-bezier(0.35, 0, 0.25, 1)';
  speed = 200;
  loop = false;
  dexVal = 0;
  touchTransform = 0;
  isEnd = false;
  isFirst = true;
  isLast = false;
  RTL = false;
  point = true;
  velocity = 0;
  directionSym = '';
  carouselTransition = `500ms ${this.easing}`;
  carouselTransform = `translate3d(0,0,0)`;
  carouselOffsetWidth = 100;

  validateInputs(data: NguCarouselConfig) {
    this.type = data.grid.type || 'responsive';
    this.loop = data.loop || false;
    data.easing = data.easing || 'cubic-bezier(0, 0, 0.2, 1)';
    this.carouselTransition = data.easing;
    this.touch.active = data.touch || false;
    this.RTL = data.RTL ? true : false;
    this.interval = data.interval || null;
    this.velocity = typeof data.velocity === 'number' ? data.velocity : this.velocity;
    this.carouselOffsetWidth = 100 - (data.grid.offset || 0);

    if (data.vertical && data.vertical.enabled) {
      this.vertical.enabled = data.vertical.enabled;
      this.vertical.height = data.vertical.height;
    }
    this.directionSym = this.RTL ? '' : '-';
    this.point =
      data.point && typeof data.point.visible !== 'undefined' ? data.point.visible : true;
  }
}

export type CarouselType = 'fixed' | 'responsive';

export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'all';

export type ButtonVisible = 'disabled' | 'hide';

export class ItemsControl {
  start: number;
  end: number;
}

export class Vertical {
  enabled = false;
  height: number;
  constructor(public data?: { enabled: boolean; height: number }) {
    if (data && data.enabled) {
      this.enabled = data.enabled;
      this.height = data.height;
    }
  }
}

export class NguButton {
  visibility?: ButtonVisible;
  elastic?: number;
}

export class Touch {
  active?: boolean;
  swipe: string;
  velocity: number;
}

export class Transfrom {
  constructor(
    public xs = 0,
    // public sm = 0,
    // public md = 0,
    // public lg = 0,
    public all = 0
  ) {}
}

export interface GridBreakPoint {
  width: number;
  items: number;
}

export class ItemConfig {
  size: number;
  offset?: number;
  type?: CarouselType;
  slide?: number;
}

export class NguCarouselConfig {
  grid: ItemConfig;
  // slide?: number;
  speed?: number;
  interval?: CarouselInterval;
  animation?: Animate;
  point?: Point;
  load?: number;
  custom?: Custom;
  loop?: boolean;
  touch?: boolean;
  easing?: string;
  RTL?: boolean;
  button?: NguButton;
  vertical?: Vertical;
  velocity?: number;
  resetOnDataChange?: boolean;
}

export type Custom = 'banner';
export type Animate = 'lazy' | 'fade';

export interface Point {
  visible: boolean;
  hideOnSingleSlide?: boolean;
}

export interface Animation {
  type?: Animate;
  animateStyles?: AnimationStyles;
}

export interface AnimationStyles {
  style?: string;
  open?: string;
  close?: string;
  stagger?: number;
}

export interface CarouselInterval {
  timing: number;
  initialDelay?: number;
}

export class NguCarouselOutletContext<T> {
  /** Data for the node. */
  $implicit: T;

  /** Depth of the node. */
  level: number;

  /** Index location of the node. */
  index?: number;

  /** Length of the number of total dataNodes. */
  count?: number;

  constructor(data: T) {
    this.$implicit = data;
  }
}

export function generateID(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return `ngucarousel${text}`;
}
