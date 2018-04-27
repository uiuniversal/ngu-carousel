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
  button: NguButton;
  point: boolean;
  vertical: Vertical;
}
export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'all';

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

export class Transfrom {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  all: number;
}

export class NguCarouselConfig {
  grid: Transfrom;
  slide?: number;
  speed?: number;
  interval?: number;
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
}

export type Custom = 'banner';
export type Animate = 'lazy';

export interface Point {
  visible: boolean;
  pointStyles?: string;
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
