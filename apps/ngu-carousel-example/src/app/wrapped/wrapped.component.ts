import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import data from '../../assets/mock/images.json';
import { WrappedCarouselComponent } from './wrapped-carousel/wrapped-carousel.component';

@Component({
  standalone: true,
  selector: 'app-wrapped',
  template: `<app-wrapped-carousel [items]="items()" [grid]="grid"></app-wrapped-carousel>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WrappedCarouselComponent]
})
export class WrappedComponent {
  public grid: { xs: 1; sm: 1; md: 1; lg: 5; all: 0 };
  data = signal<string[]>([]);
  items = this.data.asReadonly();

  constructor() {
    setTimeout(() => {
      console.log(data.images);
      this.data.set(data.images);
    }, 1000);
  }
}
