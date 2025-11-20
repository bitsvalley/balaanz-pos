import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chair, Table } from './table.model';
import { ToastController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { AccountService } from '../shared/services/account.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {
  public apiSubscription: any = new Subscription();
  public runTimeProps: any = null;
  public tableData: any = null;
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
    private toastController: ToastController,
    private _user: UserService,
    private _account: AccountService, 
  ) {

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
      console.log(response);
      const bid: any = this.runTimeProps.find(item => item.property_name === 'bid');
      if (bid && !this.tableData) {
        this.getTablesFromServer(bid.property_value);
      }
    });
  }

  ngOnInit() {
    // this.loadTableDataFromLocalStorage();
    // if (this.runTimeProps) {
    //   this.getTablesFromServer();
    // }
  }

  ionViewWillEnter() {
    // this.loadTableDataFromLocalStorage();
    // if (this.runTimeProps) {
    //   this.getTablesFromServer();
    // }
  };

  getTablesFromServer(bid: any) {
    const tablesApi = this._user.getTables(bid).subscribe((response: any) => {
      console.log('Tables from server:', response);
      this.tableData = response;
      // Process and update this.tables as needed
    });
    this.apiSubscription.add(tablesApi);
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
    this.selectedTable = table;
    localStorage.setItem('selectedTable', JSON.stringify(table));
  }

  closeTableDetails() {
    this.selectedTable = null;
    localStorage.removeItem('selectedTable');
  }

  selectChairAndNavigate(chair: Chair, table: Table) {
    chair.status = 'reserved';
    this.saveTableDataToLocalStorage();

    localStorage.setItem('selectedTable', JSON.stringify(table));
    localStorage.setItem('selectedChair', JSON.stringify(chair));
    this.router.navigateByUrl('/dashboard').then(() => {
      window.location.reload();
    });
  }

  checkIfAnyChairSelected(table: Table): boolean {
    // return table.chairs.some((chair) => chair.status === 'reserved');
    return false
  }

  ngOnDestroy() {
    this.apiSubscription.unsubscribe();
  }

  ionViewWillLeave() {
    this.apiSubscription.unsubscribe();
  }
}
