import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { transactionsRoutingModule } from './transactions-routing.module';
import { IonicModule } from '@ionic/angular';
import { TransactionsComponent } from './transactions.component';



@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
        IonicModule, 
    transactionsRoutingModule
  ]
})
export class TransactionsModule { }
