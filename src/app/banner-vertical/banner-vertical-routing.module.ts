import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BannerVerticalComponent } from './banner-vertical.component';

const routes: Routes = [{ path: '', component: BannerVerticalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerVerticalRoutingModule { }
