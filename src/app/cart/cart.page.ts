import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { AccountService } from 'src/app/shared/services/account.service';
import { Router } from '@angular/router'; 
import { App } from '@capacitor/app';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  public userDetails: any = null;
  public cartList: any = [];
  public runTimeProps: any = null;
  public cartSummary: any =  {};
  public apiSubscription: any = new Subscription();
  public tables: any[] = [];

  constructor(
    private _nav: NavController,
    private _user: UserService,
    private _toastr: ToastrService,
    private _global: GlobalService,
    private _platform: Platform,
    private _route: Router,
    private _account: AccountService
    
  ) { 
    this._platform.backButton.subscribeWithPriority(-1, () => {
      if (this._route.url && this._route.url.search('dashboard') > 0 && localStorage.getItem('token')) {
        App.exitApp();
      }
    });
    
    this._account.userDetailsObservable.subscribe((response: any) => {
      this.userDetails = response;
      // console.log(this.userDetails);
      this._global.initCart(this.userDetails.id);
      this.cartList = this._global.retriveCart(this.userDetails.id).list;
      this.cartSummary =  this._global.getCartSummary();
    });

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });
  }

  ngOnInit() {
    const storedTable = localStorage.getItem('selectedTable');
    if (storedTable) {
      const table = JSON.parse(storedTable);
      console.log('Selected Table:', table); 
      this.tables = [table]; 
    } else {
      console.log('No table found in localStorage');
    }
  }
  

  checkIfAnyChairOpen(table: any): boolean {
    return table.chairs.some(chair => chair.status === 'open');
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
    if (this.userDetails.id) {
      this.cartList = this._global.retriveCart(this.userDetails.id).list;
      this.cartSummary =  this._global.getCartSummary();
    }
    
  }

  openCheckout(){
    if (this.cartList.length) {
      this._nav.navigateForward("checkout");
    }
  }

  ionViewWillLeave() {
    this.apiSubscription.unsubscribe();
    this._global.setServerErr(false);
  }

  back() {
    this._global.setServerErr(false);
    this._nav.back();
  }

  remove(product: any) {
    this.cartList = this._global.removeQuantity(product, this.userDetails.id).list;
    this.cartSummary =  this._global.getCartSummary();
  }

  add(product: any) {
    this.cartList = this._global.addQuantity(product, this.userDetails.id).list;
    this.cartSummary =  this._global.getCartSummary();
  }

  handleRefresh(event: any) {
    
  }

}
