import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chair, Table } from './table.model';
import { ToastController } from '@ionic/angular';
import { TableService } from '../shared/services/table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent  {
  public tables: Table[] = [];
  public selectedTable: Table | null = null;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private _table : TableService
  ) {

    this.tables = this._table.getAllTables();
    const table  = this._table.getCurrentTable();
    if(table !== null){
      this.selectedTable = table;
    }
  }



  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }



  getChairColor(status: string): string {
    return status === 'reserved' ? 'danger' : 'success';
  }



  closeTableDetails() {
    this.selectedTable = null;
    // localStorage.removeItem('selectedTable');
  }

  selectCurrentTable(table: Table){
    this._table.storeCurrentTable(table);
    this.selectedTable = table
  }

  selectChairAndNavigate(chair: Chair, table: Table) {
    this._table.storeCurrentChair(chair)

    this.router.navigateByUrl('/dashboard').then(() => {
      window.location.reload();
    });
  }


}
