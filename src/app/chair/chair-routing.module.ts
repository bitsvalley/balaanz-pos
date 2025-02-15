import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChairComponent } from './chair.component';

const routes: Routes = [
  {
    path: '',
    component: ChairComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChairRoutingModule {}
