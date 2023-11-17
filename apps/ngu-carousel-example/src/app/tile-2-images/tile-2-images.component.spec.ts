import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NguCarousel } from '@ngu/carousel';
import { Tile2ImagesComponent } from './tile-2-images.component';

describe('Tile2ImagesComponent', () => {
  let component: Tile2ImagesComponent;
  let fixture: ComponentFixture<Tile2ImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tile2ImagesComponent],
      imports: [NguCarousel]
    }).compileComponents();

    fixture = TestBed.createComponent(Tile2ImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
