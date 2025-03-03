import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesDashboardComponent } from './sales-dashboard.component';
import { SalesDashboardRoutingModule } from './sales-dashboard-routing.module';



@NgModule({
  declarations: [SalesDashboardComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    SalesDashboardRoutingModule,
    
  ]
})
export class SalesDashboardModule { }
