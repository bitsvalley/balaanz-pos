import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewProductComponent } from '../add-new-product.component';

const routes: Routes = [
  {
    path: '', // Define the route for your component
    component: AddNewProductComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddNewProductRoutingModule { }
