import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NguCarousel } from '../../../dist/ngu/carousel';

import { GettingStartedComponent } from './getting-started.component';

describe('GettingStartedComponent', () => {
  let component: GettingStartedComponent;
  let fixture: ComponentFixture<GettingStartedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GettingStartedComponent, NguCarousel]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
