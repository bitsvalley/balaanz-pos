import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesEditComponent } from './purchases-edit.component';

const routes: Routes = [
  {
    path: '', 
    component: PurchasesEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesEditRoutingModule { }
