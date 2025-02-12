import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { IonicModule } from '@ionic/angular';
import { TableRoutingModule } from './table/table-routing.module';



@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    IonicModule,
    TableRoutingModule
  ]
})
export class TableModule { }
