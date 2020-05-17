import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerVerticalComponent } from './banner-vertical.component';

describe('BannerVerticalComponent', () => {
  let component: BannerVerticalComponent;
  let fixture: ComponentFixture<BannerVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerVerticalComponent ]
    })
    .compileComponents();
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
