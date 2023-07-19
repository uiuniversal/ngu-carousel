import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WrappedComponent } from './wrapped.component';

const routes: Routes = [{ path: '', component: WrappedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WrappedRoutingModule {}
