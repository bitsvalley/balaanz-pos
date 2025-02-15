import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckPageRoutingModule } from './check-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CheckComponent } from './check.component';



@NgModule({
  declarations: [CheckComponent],
  imports: [
    CommonModule,
    CheckPageRoutingModule,
    IonicModule,
    FormsModule,
  ]
})
export class CheckModule { }
