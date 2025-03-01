import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesDashboardComponent } from './purchases-dashboard.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchasesDashboardRoutingModule } from './purchases-dashboard-routing.module';



@NgModule({
  declarations: [PurchasesDashboardComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    PurchasesDashboardRoutingModule
  ]
})
export class PurchasesDashboardModule { }
