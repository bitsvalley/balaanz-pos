export interface Chair {
  ChairId: string;
  status: string;
}

export interface Table {
  TableId: string;
  AssignedWaiterName: string;
  status: string;
  level: string;
  chairs: Chair[];
  image: string;
}