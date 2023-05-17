---
sidebar_position: 1
---

# Usage

1. Include CarouselModule in your app module:

```typescript
import { NguCarouselModule } from '@ngu/carousel';

@NgModule({
  imports: [NguCarouselModule]
})
export class AppModule {}
```

2. Then use in your component:

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