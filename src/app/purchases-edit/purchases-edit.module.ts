import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchasesEditComponent } from './purchases-edit.component';
import { PurchasesEditRoutingModule } from './purchases-edit-routing.modele';



@NgModule({
  declarations: [PurchasesEditComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    PurchasesEditRoutingModule
  ]
})
export class PurchasesEditModule { }
