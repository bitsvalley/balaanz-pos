import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chair, Table } from './table.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  tables: Table[] = [
    {
      TableId: 'T001',
      AssignedWaiterName: 'John Doe',
      status: 'open',
      level: 'VIP',
      chairs: [
        { ChairId: 'C001', status: 'open' },
        { ChairId: 'C002', status: 'open' },
        { ChairId: 'C003', status: 'open' },
        { ChairId: 'C004', status: 'open' },
      ],
      image:
        'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
    },
    {
      TableId: 'T002',
      AssignedWaiterName: 'Jane Smith',
      status: 'open',
      level: 'Classic',
      chairs: [
        { ChairId: 'C001', status: 'open' },
        { ChairId: 'C002', status: 'open' },
        { ChairId: 'C003', status: 'open' },
        { ChairId: 'C004', status: 'open' },
      ],
      image:
        'https://img.freepik.com/free-psd/kitchen-table-isolated-transparent-background_191095-13975.jpg',
    },
    {
      TableId: 'T003',
      AssignedWaiterName: 'Alice Cooper',
      status: 'open',
      level: 'Premium',
      chairs: [
        { ChairId: 'C001', status: 'open' },
        { ChairId: 'C002', status: 'open' },
        { ChairId: 'C003', status: 'open' },
        { ChairId: 'C004', status: 'open' },
      ],
      image:
        'https://png.pngtree.com/element_our/20190528/ourmid/pngtree-modern-solid-wood-dining-table-chair-image_1161648.jpg',
    },
  ];

  selectedTable: Table | null = null;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadTableDataFromLocalStorage();
  }

  loadTableDataFromLocalStorage() {
    const storedTables = localStorage.getItem('tables');
    if (storedTables) {
      this.tables = JSON.parse(storedTables);
    } else {
      this.resetToOpenStatus();
    }
  }

  resetToOpenStatus() {
    this.tables.forEach((table) => {
      table.status = 'open';
      table.chairs.forEach((chair) => (chair.status = 'open'));
    });
    this.saveTableDataToLocalStorage();
  }

  saveTableDataToLocalStorage() {
    localStorage.setItem('tables', JSON.stringify(this.tables));
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  checkIfAllChairsReserved(table: Table): boolean {
    return table.chairs.every((chair) => chair.status === 'reserved');
  }

  checkIfAnyChairOpen(table: Table): boolean {
    return table.chairs.some((chair) => chair.status === 'open');
  }

  toggleChairStatus(chair: Chair, table: Table) {
    chair.status = chair.status === 'open' ? 'reserved' : 'open';
    console.log(table.chairs);

    if (this.checkIfAllChairsReserved(table)) {
      console.log('All chairs reserved, setting table to reserved.');
      table.status = 'reserved';
    } else {
      console.log('Some chairs are still open, table stays open.');
      table.status = 'open';
    }

    this.saveTableDataToLocalStorage();
  }

  getChairColor(status: string): string {
    return status === 'reserved' ? 'danger' : 'success';
  }

  selectTable(table: Table) {
    if (this.checkIfAllChairsReserved(table)) {
      this.selectedTable = null;
      alert('This table is fully reserved and cannot be opened.');
    } else {
      this.selectedTable = table;
      localStorage.setItem('selectedTable', JSON.stringify(table));
    }
  }

  closeTableDetails() {
    this.selectedTable = null;
    localStorage.removeItem('selectedTable');
  }

  selectChairAndNavigate(chair: Chair, table: Table) {
    if (chair.status === 'reserved') {
      this.presentToast(`Chair ${chair.ChairId} is already reserved.`);
      return;
    }

    chair.status = 'reserved';

    this.saveTableDataToLocalStorage();

    localStorage.setItem('selectedTable', JSON.stringify(table));
    localStorage.setItem('selectedChair', JSON.stringify(chair));
    this.router.navigateByUrl('/dashboard').then(() => {
      window.location.reload();
    });
  }

  checkIfAnyChairSelected(table: Table): boolean {
    return table.chairs.some((chair) => chair.status === 'reserved');
  }
}
