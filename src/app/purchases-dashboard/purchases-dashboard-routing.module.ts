import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesDashboardComponent } from './purchases-dashboard.component';

const routes: Routes = [
  {
    path: '', 
    component: PurchasesDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesDashboardRoutingModule { }
