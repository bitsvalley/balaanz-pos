// export interface Product {
//     id: number;
//     price: number;
//     name: string;
//     image: string;
//     code: string;
//     barcode: string;
//   }
  
  export interface NewProduct {
    id: number;
    price: number;
    name: string;
    image: string;
    code: string;
    barcode: string;
  }
  
  export interface EditProduct {
    name: string;
    price: string;
    image: string;
  }



  export interface Category {
    id: number;
    name: string;
    description: string | null;
    parentID: string;
    childID: number | null;
    active: boolean;
  }

  
  export interface Product {
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