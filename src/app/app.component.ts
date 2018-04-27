import { Component, ViewChild } from '@angular/core';
import { NguCarousel, NguCarouselStore, NguCarouselConfig } from './carousel';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  storeCarouselData: NguCarouselStore;
  rsts: any;
  stateCtrl: FormControl;
  states: { name: string; img: string }[];
  imgags: string[];
  public carouselBannerItems: Array<any> = [];
  public carouselBanner: NguCarouselConfig;

  public carouselTileItems: Array<any> = [];
  public carouselTile: NguCarouselConfig;

  public carouselTileOneItems: Array<any> = [];
  public carouselTileOne: NguCarouselConfig;

  public carouselTileTwoItems: Array<any> = [];
  public carouselTileTwo: NguCarouselConfig;
  indexr = 0;

  @ViewChild('mybanners') mybanners: NguCarousel;

  constructor() {}

  ngOnInit() {
    // this.mybanners.
    this.imgags = [
      'assets/bg.jpg',
      'assets/car.png',
      'assets/canberra.jpg',
      'assets/holi.jpg'
    ];

    this.carouselBanner = {
      grid: { xs: 1, sm: 2, md: 2, lg: 2, all: 0 },
      slide: 4,
      speed: 500,
      loop: true,
      // interval: 4000,
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
      },
      load: 2,
      custom: 'banner',
      touch: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)',
      RTL: true,
      vertical: { enabled: true, height: 400 }
    };

    this.carouselTile = {
      grid: { xs: 2, sm: 3, md: 3, lg: 4, all: 0 },
      speed: 600,
      interval: 3000,
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
      RTL: true
    };

    this.carouselTile = {
      grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
      slide: 1,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: true,
        pointStyles: `.ngucarouselPoint { list-style-type: none; text-align: center; padding: 12px; margin: 0; white-space: nowrap;
                        overflow: auto; position: absolute; width: 100%; top: 0; box-sizing: border-box; }
                      .ngucarouselPoint li { display: inline-block; border-radius: 999px; background: #444444; width: 10px;
                        height: 10px; padding: 5px; margin: 2.5px 3px; transition: .2s ease all; }
                      .ngucarouselPoint li.active { background: white; width: 15px; height: 15px;
                        margin: 0px 3px; border: 0.5px solid #444444; }`
      },
      load: 2,
      touch: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };

    this.carouselTileOne = {
      grid: { xs: 2, sm: 3, md: 4, lg: 4, all: 0 },
      speed: 600,
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
            background: #6b6b6b;
            padding: 5px;
            margin: 0 3px;
            transition: .4s;
          }
          .ngucarouselPoint li.active {
              border: 2px solid rgba(0, 0, 0, 0.55);
              transform: scale(1.2);
              background: transparent;
            }
        `
      },
      load: 2,
      loop: true,
      touch: true,
      easing: 'ease',
      animation: 'lazy'
    };

    this.carouselTileTwo = {
      grid: { xs: 1, sm: 3, md: 4, lg: 4, all: 0 },
      speed: 600,
      interval: 3000,
      point: {
        visible: true
      },
      load: 2,
      touch: true
    };

    this.carouselBannerLoad();
    this.carouselTileLoad();
    this.carouselTileOneLoad();
    this.carouselTileTwoLoad();

    this.states = [
      {
        name: 'atm',
        img: 'assets/bg.jpg'
      },
      {
        name: 'atr',
        img: 'assets/car.png'
      },
      {
        name: 'atm',
        img: 'assets/canberra.jpg'
      },
      {
        name: 'atr',
        img: 'assets/holi.jpg'
      },
      {
        name: 'att',
        img: 'assets/bg.jpg'
      },
      {
        name: 'atr',
        img: 'assets/car.png'
      },
      {
        name: 'atm',
        img: 'assets/canberra.jpg'
      },
      {
        name: 'atr',
        img: 'assets/holi.jpg'
      },
      {
        name: 'att',
        img: 'assets/bg.jpg'
      },
      {
        name: 'atm',
        img: 'assets/car.png'
      },
      {
        name: 'atm',
        img: 'assets/canberra.jpg'
      },
      {
        name: 'att',
        img: 'assets/holi.jpg'
      },
      {
        name: 'atm',
        img: 'assets/bg.jpg'
      },
      {
        name: 'atr',
        img: 'assets/car.png'
      }
    ];
    this.stateCtrl = new FormControl();
    this.stateCtrl.valueChanges.subscribe(val => {
      console.log(this.storeCarouselData.token);
      // this.carousel.moveToSlide(this.storeCarouselData.classText, 1, false);
    });
    console.log(this.mybanners);
  }

  moveButton1() {
    this.indexr++;
    this.mybanners.moveTo(this.indexr);
  }

  moveButton() {
    this.mybanners.reset();
  }

  onMoveData(data) {
    console.log(data);
  }

  getCarouselData(ent) {
    this.storeCarouselData = ent;
  }

  filterStates(name: string) {
    return this.states.filter(
      state => state.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  public carouselBannerLoad() {
    const len = this.carouselBannerItems.length;
    if (len <= 4) {
      for (let i = len; i < len + 5; i++) {
        this.carouselBannerItems.push(
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        );
      }
    }
  }

  public carouselTileLoad() {
    const len = this.carouselTileItems.length;
    if (len <= 30) {
      for (let i = len; i < len + 15; i++) {
        this.carouselTileItems.push(
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        );
      }
    }
  }

  public carouselTileOneLoad() {
    const len = this.carouselTileOneItems.length;
    if (len <= 30) {
      for (let i = len; i < len + 15; i++) {
        this.carouselTileOneItems.push(
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        );
      }
      console.log('adf');
    }
  }

  public carouselTileTwoLoad() {
    const len = this.carouselTileTwoItems.length;
    if (len <= 30) {
      for (let i = len; i < len + 15; i++) {
        this.carouselTileTwoItems.push(
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        );
      }
    }
  }
}
