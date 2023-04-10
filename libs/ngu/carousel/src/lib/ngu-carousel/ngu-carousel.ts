export class NguCarouselStore {
  constructor(
    public touch = new Touch(),
    public vertical = new Vertical(),
    public interval?: CarouselInterval,
    public transform = new Transfrom(),
    public button?: NguButton,
    public visibleItems?: ItemsControl,
    public deviceType?: DeviceType,
    public type = 'fixed',
    public token = '',
    public items = 0,
    public load = 0,
    public deviceWidth = 0,
    public carouselWidth = 0,
    public itemWidth = 0,
    public slideItems = 0,
    public itemWidthPer = 0,
    public itemLength = 0,
    public currentSlide = 0,
    public easing = 'cubic-bezier(0, 0, 0.2, 1)',
    public speed = 200,
    public loop = false,
    public dexVal = 0,
    public touchTransform = 0,
    public isEnd = false,
    public isFirst = true,
    public isLast = false,
    public RTL = false,
    public point = true,
    public velocity = 1
  ) {}
}
export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'all';

export type ButtonVisible = 'disabled' | 'hide';

export class ItemsControl {
  start: number;
  end: number;
}

export class Vertical {
  enabled: boolean;
  height: number;
  // numHeight?: number;
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

// Interface is declared to prevent property-minification
// See: https://github.com/uiuniversal/ngu-carousel/issues/322
declare interface TransformInterface {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl?: number;
  all: number;
}

// This is misspelled. Must be changed to `Transform`.
export class Transfrom implements TransformInterface {
  public xl? = 0;
  constructor(public xs = 0, public sm = 0, public md = 0, public lg = 0, public all = 0) {}
}

// Interface is declared to prevent property-minification
// See: https://github.com/uiuniversal/ngu-carousel/issues/322
declare interface BreakpointsInterface {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

/**
 * Default values
 * {sm: 768, md: 992, lg: 1200, xl: 1200}
 *
 * Bootstrap values:
 * {sm: 576, md: 768, lg: 992, xl: 1200}
 */
export class Breakpoints implements BreakpointsInterface {
  constructor(public sm = 768, public md = 992, public lg = 1200, public xl = 1200) {}
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

export type Custom = 'banner';
export type Animate = 'lazy';

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
