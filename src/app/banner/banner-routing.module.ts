import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BannerComponent } from './banner.component';

const routes: Routes = [{ path: '', component: BannerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerRoutingModule { }
