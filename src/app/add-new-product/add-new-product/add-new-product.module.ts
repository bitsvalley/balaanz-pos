import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewProductRoutingModule } from './add-new-product-routing.module';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AddNewProductComponent } from '../add-new-product.component';


@NgModule({
  declarations: [
    AddNewProductComponent
  ],
  imports: [
    CommonModule,
    AddNewProductRoutingModule,
    IonicModule,
    ReactiveFormsModule
  
  ]
})
export class AddNewProductModule { }
