import { Component, Optional, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { subscribeOn, Subscription } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnDestroy {

  public userDetails: any = null;
  public runTimeProps: any = null;
  public currency: any = environment.currency.toLowerCase();
  private apiSubscription: Subscription = new Subscription();

  
  public isNavOpen: any = false;
  public isAccountOpen: any = false;

  public productData: any = null;
  public productList: any = [];
  public categoryList: any = [];
  public cartList: any = [];
  public cartData: any = {};
  public isAllProducts: boolean = false;
  public selelctedCategory: any = null;
  public searchProductField: any = "";

  constructor( 
    private _nav: NavController, 
    private _user: UserService, 
    private _global: GlobalService, 
    private toaster: ToastrService, 
    private _account: AccountService, 
    private _platform: Platform, 
    private _route: Router, 
    @Optional() private _routerOutlet?: IonRouterOutlet
  ) 
    { 
    this._platform.backButton.subscribeWithPriority(-1, () => {
      if (this._route.url && this._route.url.search('dashboard') > 0 && localStorage.getItem('token')) {
        App.exitApp();
      }
    });
    
    this._account.userDetailsObservable.subscribe((response: any) => {
      this.userDetails = response;
      console.log(this.userDetails);
      this.retriveCart();
      if (!this.cartData[this.userDetails.id]) {
        this.cartData[this.userDetails.id] = {};
        this.storeCart();
      }
    });

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });
    
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

  async logout() {
    this._global.setLoader(true);
    const logoutApi = this._user.logout(this.userDetails.id).subscribe((response: any) => {
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
            this._global.setServerErr(true);
          }
        });
      } else {
        this.toaster.error('Error while processing your request.', 'Error While Processing',{
          timeOut: 5000,
        });
        this._global.setServerErr(true);
      }
    });
    this.apiSubscription.add(logoutApi);
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
    this.isAllProducts = true;
    this.getProductList();

    this.isNavOpen = false;
    this.isAccountOpen = false;
    this.selelctedCategory = null;
  }

  ionViewWillLeave() {
    this.apiSubscription.unsubscribe();
    this._global.setServerErr(false);
    this.isNavOpen = false;
    this.isAccountOpen = false;
  }

  back() {
    this._global.setServerErr(false);
    this._nav.back();
  }

  handleRefresh(event: any) {
    
  }


  getProductList() {
    this.productList = [];
    this.categoryList = [];
    this._user.productList().subscribe((response: any) => {
      console.log(response);
      this.productData = response;
      if (this.isAllProducts && !this.selelctedCategory) {
        Object.keys(response.products).forEach((key: any) => {
          this.productList = [...this.productList, ...response.products[key]];
        });
      } else {
        this.productList = response.products[this.selelctedCategory.id];
      }

      Object.keys(response.categories).forEach((key: any) => {
        this.categoryList.push({...response.categories[key], totalProducts: response.products[key]?.length });
      });
    });
  }

  selectCategory(category: any) {
    this.isAllProducts = false;
    this.selelctedCategory = category;
    this.isNavOpen = false;
    this.filterProducts();
  }

  filterProducts() {
    if (!this.isAllProducts && this.selelctedCategory) { 
      this.productList = this.productData.products[this.selelctedCategory.id];
    }
  }

  changeSearch() {
    
  }

  searchProducts() {

  }

  storeCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartData));
    this.retriveCart();
  }

  retriveCart() {
    this.cartList = [];
    this.cartData = JSON.parse(localStorage.getItem('cart'));
    if (this.cartData[this.userDetails.id]) {
      Object.keys(this.cartData[this.userDetails.id]).forEach((key: any) => {
        this.cartList.push(this.cartData[this.userDetails.id][key]);
      })
    }
  }

  addToCart(product) {
    console.log(product);
    if (!this.cartData[this.userDetails.id][product.code]) {
      this.cartData[this.userDetails.id][product.code] = {...product, quantity: 1}
    } else {
      this.cartData[this.userDetails.id][product.code].quantity += 1;
    }
    this.storeCart();
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();    
  }

}
