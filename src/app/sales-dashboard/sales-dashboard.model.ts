export interface Products {
    id: number;
    name: string;
    createdDate: string | null;
    lastUpdatedDate: string | null;
    category: number;
    unitPrice: number;
    bulkPrice: number;
    purchasePrice: number;
    stockAmount: number;
    image1: string | null;
    image2: string | null;
    image3: string | null;
    image4: string | null;
    code: string;
    barcode: string;
    expiry: string | null;
    shortDescription: string;
    longDescription: string;
    online: boolean;
    active: boolean;
    msrp: number;
  }
  