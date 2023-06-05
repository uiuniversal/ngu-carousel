---
sidebar_position: 3
---

# Custom css for Point

```html
<ul class="ngucarouselPoint">
  <li *ngFor="let i of pointNumbers; let i = index" [class.active]="i==pointers"></li>
</ul>
```

This is HTML I'm using in the carousel. Add your own css according to this elements in `pointStyles`. check below guide for more details.

```html
<ngu-carousel [inputs]="carouselBanner" (onMove)="onmoveFn($event)" (carouselLoad)="loadItemsFn()">
</ngu-carousel>
```

- `inputs` is an `Input` and It accepts `NguCarouselConfig`.
- `onMove` is an `Output` which triggered on every slide before start and it will emit `$event` as `NguCarouselStore` object.
- `carouselLoad` is an `Output` which triggered when slide reaches the end on items based on inputs `load`.
