import { Injectable } from '@angular/core';
import { Product } from 'src/app/product-add/product-add.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productData:  Product;

  setItemData(Product: any): void {
    this.productData = Product;
  }

  getItemData(): Product {
    return this.productData;
  }

  clearItemData(): void {
    this.productData = null;
  }

  constructor() { }
}
