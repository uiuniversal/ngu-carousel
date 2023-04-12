import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NguCarousel } from '@ngu/carousel';

import { BannerVerticalComponent } from './banner-vertical.component';

describe('BannerVerticalComponent', () => {
  let component: BannerVerticalComponent;
  let fixture: ComponentFixture<BannerVerticalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BannerVerticalComponent, NguCarousel]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
