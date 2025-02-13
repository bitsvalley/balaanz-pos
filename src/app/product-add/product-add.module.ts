import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductRoutingModule } from './product-add-routing.module';
import { ProductAddComponent } from './product-add.component';



@NgModule({
  declarations: [ProductAddComponent],
  imports: [
    CommonModule,
    IonicModule,
    ProductRoutingModule
  ]
})
export class ProductAddModule { }
