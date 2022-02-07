import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GettingStartedComponent } from './getting-started/getting-started.component';

const routes: Routes = [
  {
    path: 'banner',
    loadChildren: () => import('./banner/banner.module').then(m => m.BannerModule)
  },
  {
    path: 'tile',
    loadChildren: () => import('./tile/tile.module').then(m => m.TileModule)
  },
  {
    path: 'banner-vertical',
    loadChildren: () =>
      import('./banner-vertical/banner-vertical.module').then(m => m.BannerVerticalModule)
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
