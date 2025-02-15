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
import { Chair, Table } from '../table/table.model';
import { TableService } from '../shared/services/table.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {

  public userDetails: any = null;
  public cartList: any = [];
  public runTimeProps: any = null;
  public cartSummary: any =  {};
  public apiSubscription: any = new Subscription();
  public currentTable : Table = null;
  public currentChair : Chair = null;

  constructor(
    private _nav: NavController,
    private _user: UserService,
    private _toastr: ToastrService,
    private _global: GlobalService,
    private _platform: Platform,
    private _route: Router,
    private _account: AccountService,
    private _table : TableService

  ) {
    this._platform.backButton.subscribeWithPriority(-1, () => {
      if (this._route.url && this._route.url.search('dashboard') > 0 && localStorage.getItem('token,selectedReservation')) {
        App.exitApp();
      }
    });
    this.GetCurrentTableAndChair()
    this._account.userDetailsObservable.subscribe((response: any) => {
      this.userDetails = response;
      // console.log(this.userDetails);
      this._global.initCart(this.userDetails.id);
      if(this.currentTable == null && this.currentChair == null){
        this.cartList = this._global.retriveCart(this.userDetails.id).list;

      }
      else{
        this.cartList = this._global.retriveCartChair(this.userDetails.id,this.currentTable.TableId, this.currentChair.ChairId).list;

      }

      this.cartSummary =  this._global.getCartSummary();


    });




    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });
  }

  GetCurrentTableAndChair() {
    console.log("Working" ,this.currentTable);
    this.currentTable = this._table.getCurrentTable();
    this.currentChair = this._table.getCurrentChair();
  }



  checkIfAnyChairOpen(table: any): boolean {
    return table.chairs.some(chair => chair.status === 'open');
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
    if (this.userDetails.id) {
      if(this.currentChair == null && this.currentTable == null){
        this.cartList = this._global.retriveCart(this.userDetails.id).list;

      }
      else{
        this.cartList = this._global.retriveCartChair(this.userDetails.id,this.currentTable.TableId, this.currentChair.ChairId).list;

      }
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
