export interface AddNewProduct {
    id: number;
    name: string;
    createdDate?: string | null;
    lastUpdatedDate?: string | null;
    category: number;
    price: number;
    stockAmount: number;
    image: string;
    code: string;
    barcode?: string;
    expiry?: string | null;
    shortDescription: string;
    longDescription?: string;
    online: boolean;
    active: boolean;
    msrp: number;
  }