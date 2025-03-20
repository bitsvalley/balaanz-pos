import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisbursementComponent } from './disbursement.component';


const routes: Routes = [
  {
    path: '',
    component: DisbursementComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class disbursementRoutingModule {}
