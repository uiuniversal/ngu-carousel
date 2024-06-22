import { Routes } from '@angular/router';
import { GettingStartedComponent } from './getting-started/getting-started.component';

export const APP_ROUTES: Routes = [
  {
    path: 'banner',
    loadComponent: () => import('./banner/banner.component').then(m => m.BannerComponent)
  },
  {
    path: 'tile',
    loadComponent: () => import('./tile/tile.component').then(m => m.TileComponent)
  },
  {
    path: 'tile-2-images',
    loadComponent: () =>
      import('./tile-2-images/tile-2-images.component').then(m => m.Tile2ImagesComponent)
  },
  {
    path: 'banner-vertical',
    loadComponent: () =>
      import('./banner-vertical/banner-vertical.component').then(m => m.BannerVerticalComponent)
  },
  {
    path: 'wrapped',
    loadComponent: () => import('./wrapped/wrapped.component').then(m => m.WrappedComponent)
  },
  {
    path: 'getting-started',
    component: GettingStartedComponent
  },
  {
    path: '',
    redirectTo: 'tile',
    pathMatch: 'full'
  }
];
