import { Observable } from 'rxjs';

export type hammerEvent =
  | 'panstart'
  | 'panend'
  | 'panup'
  | 'pandown'
  | 'panleft'
  | 'panright'
  | 'hammer.input';

export class RxHammer {
  hammertime: HammerManager;

  constructor(private el: HTMLDivElement) {
    this.hammertime = new Hammer(this.el);
  }

  event(ev: hammerEvent): Observable<HammerInput> {
    return new Observable(observer => {
      this.hammertime.on(ev, s => observer.next(s));
      return {
        unsubscribe: () => this.hammertime.off(ev)
      };
    });
  }

  get(recogniser: string) {
    return this.hammertime.get(recogniser);
  }
}
