import { Injectable } from '@angular/core';
import { Category, Product } from 'src/app/product-add/product-add.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productData:  Product;
  private categoryList : Category[];

  setItemData(Product: any): void {
    this.productData = Product;
  }

  getItemData(): Product {
    return this.productData;
  }

  clearItemData(): void {
    this.productData = null;
  }

  setCategories(list : Category[]){
    this.categoryList = list
  }

  getCategories():Category[]{
    return this.categoryList;
  }

  cleanCategoryList():void{
    this.categoryList = null;
  }

  constructor() { }
}
