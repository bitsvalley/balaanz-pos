import { Injectable } from '@angular/core';
import { Chair, Table } from 'src/app/table/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private currentTable: Table | null = null;
  private currentChair: Chair | null = null;
  private tables: Table[] = [];
  getAllTables(): Table[] {
    return this.tables;
  }
  constructor() {

    this.tables = [
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
          '../../../assets/images/table.png',
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
          '../../../assets/images/table.png',
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
          '../../../assets/images/table.png',
      },
      {
        TableId: 'T004',
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
          '../../../assets/images/table.png',
      },
      {
        TableId: 'T005',
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
          '../../../assets/images/table.png',
      },
      {
        TableId: 'T006',
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
          '../../../assets/images/table.png',
      },
      {
        TableId: 'T007',
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
          '../../../assets/images/table.png',
      },
      {
        TableId: 'T008',
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
          '../../../assets/images/table.png',
      },
      {
        TableId: 'T009',
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
          '../../../assets/images/table.png',
      },
      {
        TableId: 'T010',
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
          '../../../assets/images/table.png',
      },
      {
        TableId: 'T011',
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
          '../../../assets/images/table.png',
      },
      {
        TableId: 'T012',
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
          '../../../assets/images/table.png',
      },
    ];
  }


  storeCurrentTable(table: Table): void {

    localStorage.setItem('currentTable', JSON.stringify(table));
    this.currentTable = this.getCurrentTable()
  }


  getCurrentTable(): Table | null {
    const storedTable = localStorage.getItem('currentTable');
    if (storedTable) {
      return JSON.parse(storedTable) as Table;
    }
    return null;
  }



  storeCurrentChair(chair: Chair): void {

    localStorage.setItem('currentChair', JSON.stringify(chair));
    this.currentChair = this.getCurrentChair();
  }

  getCurrentChair(): Chair | null {
    const storedChair = localStorage.getItem('currentChair');
    if (storedChair) {
      return JSON.parse(storedChair) as Chair;
    }
    return null;
  }

  removeCurrentTable(){
    localStorage.removeItem('currentTable');
  }
  removeCurrentChair(){
    localStorage.removeItem('currentChair');
  }

}
