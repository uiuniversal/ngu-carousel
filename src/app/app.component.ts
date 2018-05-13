import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { btnAnim } from './app-animation';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from './carousel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [btnAnim]
})
export class AppComponent implements OnInit, AfterViewInit {
  carouselBanner1: NguCarouselConfig;
  Arr = Array; // Array type captured in a variable
  num = 0;
  storeCarouselData: NguCarouselStore;
  rsts: any;
  stateCtrl: FormControl;
  states: { name: string; img: string }[];
  imgags: string[];
  myBannerVisible = true;
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
      interval: {
        timing: 4000
      },
      point: {
        visible: true,
        hideOnSingleSlide: true
      },
      load: 2,
      custom: 'banner',
      touch: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)',
      velocity: 0.8
    };
    this.carouselBanner1 = {
      grid: { xs: 1, sm: 2, md: 2, lg: 2, all: 0 },
      slide: 4,
      speed: 500,
      loop: true,
      interval: {
        timing: 4000,
        initialDelay: 1000
      },
      point: {
        visible: true,
        hideOnSingleSlide: true
      },
      load: 2,
      custom: 'banner',
      touch: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };

    // this.carouselTile = {
    //   grid: { xs: 2, sm: 3, md: 3, lg: 4, all: 0 },
    //   speed: 600,
    //   slide: 3,
    //   interval: 3000,
    //   point: {
    //     visible: true
    //   },
    //   load: 2,
    //   touch: true,
    //   RTL: true
    // };

    this.carouselTile = {
      grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
      slide: 3,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };

    this.carouselTileOne = {
      grid: { xs: 2, sm: 3, md: 4, lg: 4, all: 0 },
      speed: 600,
      point: {
        visible: true
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
      interval: {
        timing: 3000
      },
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

  ngAfterViewInit() {
    this.mybanners.moveTo(2, true);
  }

  moveButton1() {
    this.indexr++;
    this.mybanners.moveTo(this.indexr);
  }

  onMoveData(data) {
    // console.log(data);
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
