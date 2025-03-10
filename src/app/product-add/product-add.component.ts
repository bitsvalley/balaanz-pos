import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular'; 
import { UserService } from '../shared/services/user.service';
import { GlobalService } from '../shared/services/global.service'; 
import { ToastrService } from 'ngx-toastr'; 
import { Subscription } from 'rxjs'; 

import { Category, Product } from './product-add.model'; 
import { AccountService } from '../shared/services/account.service';

import {ProductService} from '../shared/services/product.service'

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit, OnDestroy {
  isNavOpen: boolean = false;
  isAccountOpen: boolean = false;
  cartAnimation: boolean = false;
  categoryList: any[] = [];
  selelctedCategory: any = null;
  searchProductField: any;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  public isAllProducts: boolean = false;

  trendingProducts: Product[] = [];
  loading: boolean = false;
  error: string | null = null;
  private subscriptions: Subscription = new Subscription(); 

  
  private apiSubscription: Subscription = new Subscription();
  
  loginError: boolean;

  public productList: any = [];
  productData: any;
  constructor(
    private navCtrl: NavController,
    private _user: UserService,
    private _global: GlobalService,
    private toastr: ToastrService,
    private _account: AccountService, 
    private _product: ProductService
  ) {}

  ngOnInit() {
    this.selelctedCategory = null;
    this.loadTrendingProducts();
  }

  ionViewWillEnter() {
    this.selelctedCategory = null;
    this.loadTrendingProducts();
  }

  loadTrendingProducts() {

    this._global.setLoader(true);

    const loginApi = this._user.getProductAdmin().subscribe((response: any) => {
      
      const productArrays: Product[][] = Object.values(response.products || {}) as Product[][];
      
      this.trendingProducts = productArrays.reduce((acc: Product[], curr: Product[]) => acc.concat(curr), []);
      this.filteredProducts = [...this.trendingProducts];
      
      const categoryArrays: Category[][] = Object.values(response.categories || {}) as Category[][];
      
      this.categoryList = categoryArrays.reduce((acc: Category[], curr: Category[]) => acc.concat(curr), []);
      this._global.setLoader(false);
    },    
    (error: any) => {      
      this._global.setLoader(false); 
    }
  
  );
    this.subscriptions.add(loginApi);
 
  }
  
  handleRefresh(event: any) {
    this.loadTrendingProducts();
    event.target.complete();
    this.selelctedCategory = null;
  }


  editProduct(product: Product) {

    this._product.setItemData(product);
    this.navCtrl.navigateForward('/editproduct');

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }

  toggleAccount() {
    this.isAccountOpen = !this.isAccountOpen;
  }

  closeNav() {
    this.isNavOpen = false;
  }

  closeAccount() {
    this.isAccountOpen = false;
  }

  openCart() {
    this._product.setCategories(this.categoryList);
    this.navCtrl.navigateForward('/newproductadd');
    
  }

  async logout() {
   
    this._account.logout();
  }


  showAllProducts() {
    this.isAllProducts = true
    this.selelctedCategory = null;
    this.isNavOpen = false;

    this.filteredProducts = this.trendingProducts;
  }

  selectCategory(categoryList: Category) {
    this.isAllProducts = false;
    this.selelctedCategory = categoryList;
    this.isNavOpen = false;

    this.filterProducts();
  }

  processProducts(response) {
    if (this.showAllProducts && !this.categoryList) {
      Object.keys(response.products).forEach((key: any) => {
        this.trendingProducts = [...this.trendingProducts, ...response.products[key]];
      });
    } else {
      this.trendingProducts = response.products[this.selelctedCategory.id];
    }

    Object.keys(response.categories).forEach((key: any) => {
      this.categoryList.push({...response.categories[key], totalProducts: response.products[key]?.length });
    });
  }
  filterProducts() {

    if (!this.showAllProducts && this.categoryList || this.selectCategory) { 

      this.filteredProducts = this.trendingProducts.filter(product => product.category === this.selelctedCategory.id);

    } else {
      this.filteredProducts = [...this.trendingProducts];
    }
  }
  changeSearch() {
    const searchTerm = this.searchProductField.trim().toLowerCase();

    if (!searchTerm) {
      this.filteredProducts = [...this.trendingProducts]; 
      return;
    }

    this.filteredProducts = this.trendingProducts.filter((product) =>
      product.name?.toLowerCase().includes(searchTerm) ||
      product.barcode?.toLowerCase() === searchTerm ||
      product.code?.toLowerCase() === searchTerm
    );
  }
  
}