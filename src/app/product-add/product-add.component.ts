import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular'; 
import { UserService } from '../shared/services/user.service';
import { GlobalService } from '../shared/services/global.service'; 
import { ToastrService } from 'ngx-toastr'; 
import { Subscription } from 'rxjs'; 

import { Category, Product } from './product-add.model'; 
import { AccountService } from '../shared/services/account.service';
import { FormGroup } from '@angular/forms';

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

  trendingProducts: Product[] = [];
  loading: boolean = false;
  error: string | null = null;
  private subscriptions: Subscription = new Subscription(); 
  public loginFrm: FormGroup = new FormGroup({});
  
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
    private toaster: ToastrService,
  ) {}

  ngOnInit() {
    this.loadTrendingProducts();
  }

  ionViewWillEnter() {
    this.loadTrendingProducts();
  }

  loadTrendingProducts() {
    console.log("Hii");
    const loginApi = this._user.getProductAdmin().subscribe((response: any) => {
      console.log(response)
      const productArrays: Product[][] = Object.values(response.products || {}) as Product[][];

    this.trendingProducts = productArrays.reduce((acc: Product[], curr: Product[]) => acc.concat(curr), []);
    this.filteredProducts = [...this.trendingProducts];
      // this.trendingProducts = response.products,
      // this.categoryList = response.categories
      const categoryArrays: Category[][] = Object.values(response.products || {}) as Category[][];

      this.categoryList = categoryArrays.reduce((acc: Category[], curr: Category[]) => acc.concat(curr), []);
      console.log(response.products);
    },);
    this.subscriptions.add(loginApi);
  }

  handleRefresh(event: any) {
    this.loadTrendingProducts();
    event.target.complete();
  }

  // goToProductDetail(product: Product) {
  //   this.navCtrl.navigateForward(`/product-detail/${product.id}`);
  // }

  editProduct(product: Product, event: Event) {
    this.navCtrl.navigateForward('/editproduct');
    event.stopPropagation(); 
    this._global.addToCart(product, this._user.getCurrentUserId());
    this.toastr.success(`${product.name} added to cart`);
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
    this.navCtrl.navigateForward('/newproductadd');
  }

  async logout() {
    
    localStorage.removeItem('tables');
    localStorage.removeItem('selectedTable');
  
  this._global.setLoader(true);
  const logoutApi = this._user.logout(this.loginFrm.value).subscribe((response: any) => {
    this._global.setLoader(false);
    this._account.logout();
  }, (error: any) => {
    this._global.setLoader(false);
    if(error.error.statusCode === 401) {
      this._user.getToken().subscribe((resToken: any) => {
        this._global.token = resToken.token.access.token;
      }, (error: any) => {
        if(error.error.statusCode === 401) {
          this.toaster.error('Kindly re-login using username and password to continue.', 'Not Authorized',{
            timeOut: 5000,
          });
          this._account.logout();
        } else {
          this.toaster.error('Error while processing your request.', 'Error While Processing',{
            timeOut: 5000,
          });
          this._account.logout();
          this._global.setServerErr(true);
        }
      });
    } else {
      this.toaster.error('Error while processing your request.', 'Error While Processing',{
        timeOut: 5000,
      });
      this._account.logout();
      this._global.setServerErr(true);
    }
  });
  this.apiSubscription.add(logoutApi);
}

  showAllProducts() {
    this.selelctedCategory = null;
    this.isNavOpen = false;
    console.log('Showing all products');
    this.filterProducts();
  }

  selectCategory(categoryList: Category) {
    this.selelctedCategory = categoryList;
    this.isNavOpen = false;
    console.log(`Selected category: ${categoryList.name}`);
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
      this.filteredProducts = this.trendingProducts.filter(product => product === this.selelctedCategory.id);

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