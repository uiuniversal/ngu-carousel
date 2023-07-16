import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Tile2ImagesComponent } from './tile-2-images.component';

const routes: Routes = [{ path: '', component: Tile2ImagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tile2RoutingModule {}
