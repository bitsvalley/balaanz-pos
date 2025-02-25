// export interface AddNewProduct {
//     id: number;
//     name: string;
//     createdDate?: string | null;
//     lastUpdatedDate?: string | null;
//     category: number;
//     price: number;
//     stockAmount: number;
//     image: string;
//     code: string;
//     barcode?: string;
//     expiry?: string | null;
//     shortDescription: string;
//     longDescription?: string;
//     online: boolean;
//     active: boolean;
//     msrp: number;
//   }

// export interface AddNewProduct {
//   id: number;
//   orgId: number;
//   name: string;
//   createdBy?: string;
//   lastUpdatedBy?: string;
//   createdDate?: string | null;
//   lastUpdatedDate?: string | null;
//   productCategory: {
//     id: number;
//     orgId: number;
//     name: string;
//     description?: string;
//     parentID?: string;
//     childID?: string;
//     category?: boolean;
//     active?: boolean;
//   };
//   warehouseLocation?: {
//     id: number;
//     orgId: number;
//     name: string;
//     binNumber?: string;
//     description?: string;
//     parentID?: string;
//   };
//   unitPrice: number;
//   bulkPrice?: number;
//   purchasePrice?: number;
//   mrsp: number;
//   requisitionLevel?: number;
//   stockAmount: number;
//   imageUrl1: string; 
//   imageUrl2?: string;
//   imageUrl3?: string;
//   imageUrl4?: string;
//   productCode: string;
//   barcode?: string;
//   sku?: string;
//   supplier?: string;
//   expiry?: string | null;
//   shortDescription: string;
//   longDescription?: string;
//   online: boolean;
//   active: boolean;
// }

export interface AddNewProduct {
  name: string;
  unitPrice: number;
  barcode: string;
  categoryId: number;
  image: string;
  stockAmount: number;
  shortDescription: string;
  longDescription: string;
  createdDate: string;
  lastUpdatedDate: string;
}