import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselFormComponent } from './carousel-form.component';

describe('CarouselFormComponent', () => {
  let component: CarouselFormComponent;
  let fixture: ComponentFixture<CarouselFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
