import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisbursementComponent } from './disbursement.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { disbursementRoutingModule } from './disbursement-routing.module';



@NgModule({
  declarations: [DisbursementComponent],
  imports: [
    CommonModule,
    IonicModule,       
    FormsModule,
    disbursementRoutingModule
  ]
})
export class DisbursementModule { }
