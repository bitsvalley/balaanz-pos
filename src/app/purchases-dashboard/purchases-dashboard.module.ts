import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesDashboardComponent } from './purchases-dashboard.component';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchasesDashboardRoutingModule } from './purchases-dashboard-routing.module';
import { GlobalService } from '../shared/services/global.service';



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
export class PurchasesDashboardModule { 

  
}
