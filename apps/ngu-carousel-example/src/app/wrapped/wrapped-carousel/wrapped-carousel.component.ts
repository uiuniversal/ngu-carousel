import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { slider } from '../../slide-animation';

@Component({
  selector: 'app-wrapped-carousel',
  templateUrl: 'wrapped-carousel.component.html',
  styleUrls: ['./wrapped-carousel.component.scss'],
  animations: [slider],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WrappedCarouselComponent implements OnChanges, AfterViewInit {
  @Input() carouselTileItems: any[];
  public config: NguCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4, all: 0 },
    gridBreakpoints: { sm: 480, md: 768, lg: 1024, xl: 1280 },
    speed: 750,
    point: {
      visible: true
    },
    velocity: 0.1,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };
  @Input() grid: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; all?: number } =
    { xs: 1, sm: 2, md: 3, lg: 4, xl: 4, all: 0 };
  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes?.grid) {
      this.config.grid = changes?.grid?.currentValue || {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 4,
        all: 0
      };
    }
    this.cd.detectChanges();
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }
}
