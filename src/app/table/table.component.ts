import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chair, Table } from './table.model';
import { ToastController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { AccountService } from '../shared/services/account.service';
import { GlobalService } from '../shared/services/global.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {
  public apiSubscription: any = new Subscription();
  public runTimeProps: any = null;
  public tableData: any = null;
  public calDebounch
  // tables: Table[] = [
  //   {
  //     TableId: 'T001',
  //     AssignedWaiterName: 'John Doe',
  //     status: 'open',
  //     level: 'VIP',
  //     chairs: [
  //       { ChairId: 'C001', status: 'open' },
  //       { ChairId: 'C002', status: 'open' },
  //       { ChairId: 'C003', status: 'open' },
  //       { ChairId: 'C004', status: 'open' },
  //     ],
  //     image:
  //       'https://png.pngtree.com/element_our/20200609/ourmid/pngtree-simulation-restaurant-table-image_2233375.jpg',
  //   },
  //   {
  //     TableId: 'T002',
  //     AssignedWaiterName: 'Jane Smith',
  //     status: 'open',
  //     level: 'Classic',
  //     chairs: [
  //       { ChairId: 'C001', status: 'open' },
  //       { ChairId: 'C002', status: 'open' },
  //       { ChairId: 'C003', status: 'open' },
  //       { ChairId: 'C004', status: 'open' },
  //     ],
  //     image:
  //       'https://img.freepik.com/free-psd/kitchen-table-isolated-transparent-background_191095-13975.jpg',
  //   },
  //   {
  //     TableId: 'T003',
  //     AssignedWaiterName: 'Alice Cooper',
  //     status: 'open',
  //     level: 'Premium',
  //     chairs: [
  //       { ChairId: 'C001', status: 'open' },
  //       { ChairId: 'C002', status: 'open' },
  //       { ChairId: 'C003', status: 'open' },
  //       { ChairId: 'C004', status: 'open' },
  //     ],
  //     image:
  //       'https://png.pngtree.com/element_our/20190528/ourmid/pngtree-modern-solid-wood-dining-table-chair-image_1161648.jpg',
  //   },
  // ];

  selectedTable: any = null;
  public userDetails: any = null;
  public loadTable: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private _user: UserService,
    private _account: AccountService, 
    private _global: GlobalService
  ) {
  }

  ngOnInit() {
    // this.loadTableDataFromLocalStorage();
    // if (this.runTimeProps) {
    //   this.getTablesFromServer();
    // }
  }

  ionViewWillEnter() {
    const userSub = this._account.userDetailsObservable.subscribe((response: any) => {
      this.userDetails = response;
    });

    this.apiSubscription.add(userSub);
    
    const runtimeSub = this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
      if (this.runTimeProps.length > 0) {
        const bid: any = this.runTimeProps.find(item => item.property_name === 'bid');
        const tableD = JSON.parse(localStorage.getItem('tables') || 'null');
        if (bid && !tableD) {
          this.getTablesFromServer(bid.property_value);
        } else {
          this.tableData = tableD;
          this._global.debounce(this.calculateChairTableTotal(), 500);
        }
      }
    });
    this.apiSubscription.add(runtimeSub);
  };

  getTablesFromServer(bid: any) {
    this.loadTable = true;
    const tablesApi = this._user.getTables(bid).subscribe((response: any) => {
      response.forEach((table: any) => {
        table.status = 'open';
        table.total = 0;
        table.chairs.forEach((chair: any) => (chair.status = 'open', chair.total = 0));
      });
      this.tableData = response;
      localStorage.setItem('tables', JSON.stringify(this.tableData));
      this._global.debounce(this.calculateChairTableTotal(), 500);
      setTimeout(() => {
        this.loadTable = false;
      }, 1000);
      // Process and update this.tables as needed
    });
    this.apiSubscription.add(tablesApi);
  }

  getServerCart() {
    this._user.getAllOrder(this.userDetails.org_id, this.userDetails.branch_id).subscribe((response: any) => {
      console.log(response);
    })
  }

  calculateChairTableTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || 'null');
    console.log(cart);
    this.tableData.forEach((tbl: any) => {
      tbl.total = 0;
      tbl.chairs.forEach((chair: any) => {
        chair.total  = 0;
        if (cart?.[this.userDetails.id]?.[tbl.uuid]?.[chair.uuid] && Object.keys(cart?.[this.userDetails.id]?.[tbl.uuid]?.[chair.uuid]).length > 0) {
          Object.keys(cart?.[this.userDetails.id]?.[tbl.uuid]?.[chair.uuid]).forEach((key: any) => {
            const cartItem = cart?.[this.userDetails.id]?.[tbl.uuid]?.[chair.uuid][key];
            chair.total += cartItem.quantity * cartItem.unitPrice;
          });
          tbl.total += chair.total
        }
      });
    });
    this.getServerCart();
  }
  // loadTableDataFromLocalStorage() {
  //   const storedTables = localStorage.getItem('tables');
  //   if (storedTables) {
  //     this.tables = JSON.parse(storedTables);
  //   } else {
  //     this.resetToOpenStatus();
  //   }
  // }

  resetToOpenStatus() {
    this.tableData.forEach((table) => {
      table.status = 'open';
      table.chairs.forEach((chair) => (chair.status = 'open'));
    });
    this.saveTableDataToLocalStorage();
  }

  saveTableDataToLocalStorage() {
    localStorage.setItem('tables', JSON.stringify(this.tableData));
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
    // localStorage.setItem('selectedTable', JSON.stringify(table));
  }

  closeTableDetails() {
    this.selectedTable = null;
    // localStorage.removeItem('selectedTable');
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
