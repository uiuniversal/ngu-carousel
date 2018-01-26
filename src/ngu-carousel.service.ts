import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NguCarouselService {
  getData: Subject<any> = new Subject<any>();

  constructor() {}

  reset(token: any) {
    this.getData.next({ id: token, ref: 'reset' });
  }

  moveToSlide(token: any, index: number, animate?: boolean) {
    this.getData.next({
      id: token,
      ref: 'moveToSlide',
      index: index,
      animation: animate
    });
  }

  private destroy(token: any) {
    this.getData.next({ id: token, ref: 'destroy' });
  }
}
