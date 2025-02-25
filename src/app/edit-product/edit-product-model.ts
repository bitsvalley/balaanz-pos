export interface EditProduct {
    id: number;
    name: string;
    unitPrice: number;
    image: string;
    createdDate: string; 
    lastUpdatedDate: string;
    categoryId: number;  
    stockAmount: number; 
    barcode: string;  
    shortDescription: string;
    longDescription: string;     
   
  }