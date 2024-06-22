import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NguCarousel } from '@ngu/carousel';
import { Tile2ImagesComponent } from './tile-2-images.component';

describe('Tile2ImagesComponent', () => {
  let component: Tile2ImagesComponent;
  let fixture: ComponentFixture<Tile2ImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NguCarousel, Tile2ImagesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(Tile2ImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
