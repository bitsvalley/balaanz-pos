import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/shared/services/user.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Platform } from '@ionic/angular';
import { AccountService } from 'src/app/shared/services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { App } from '@capacitor/app';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { SunmiPrinterService } from 'src/app/shared/services/sunmi.printer';
import { Chair, Table } from '../table/table.model';
import { TableService } from '../shared/services/table.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {

  public userDetails: any = null;
  public cartList: any = [];
  public runTimeProps: any = null;
  public cartSummary: any =  {};
  public apiSubscription: any = new Subscription();
  public currentDate: any = moment().format('DD/MMM/YYYY HH:mm:ss');
  public receiptCartList: any = [];
  public receiptCartSummary: any = [];
  public requestId: any = null;
  public paymentData: any = this._global.getPaymentData();
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
    private _sunmi: SunmiPrinterService,
    private _actRoute: ActivatedRoute,
    private _table : TableService
  ) {
    this._platform.backButton.subscribeWithPriority(-1, () => {
      if (this._route.url && this._route.url.search('dashboard') > 0 && localStorage.getItem('token')) {
        App.exitApp();
      }
    });
    this.requestId = this._actRoute.snapshot.params['requestId'];
    this.GetCurrentTableAndChair();
    this._account.userDetailsObservable.subscribe((response: any) => {
      this.userDetails = response;
      this._global.initCart(this.userDetails.id);
      if(this.currentChair == null && this.currentTable == null){
        this.cartList = this._global.retriveCart(this.userDetails.id).list;
      this.cartSummary =  this._global.getCartSummary();
      }
      else{
        this.cartList = this._global.retriveCartChair(this.userDetails.id,this.currentTable.TableId, this.currentChair.ChairId).list;
      this.cartSummary =  this._global.getCartSummaryChair(this.currentTable.TableId, this.currentChair.ChairId);

      }
    });

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });
  }

  ngOnInit() {

  }

  GetCurrentTableAndChair(){
    this.currentChair = this._table.getCurrentChair();
    this.currentTable = this._table.getCurrentTable();
  }

  clearCart() {
    if (this.cartList.length) {
      this._toastr.success("Payment has been successfully done.", "Payment Successful");
      this.receiptCartList = [...this.cartList];
      this.receiptCartSummary = {...this.cartSummary};
      this._global.emptyCart(this.userDetails.id);
    } else {
      this._nav.navigateBack('dashboard');
    }
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
    this.clearCart();
  }

  ionViewWillLeave() {
    this.apiSubscription.unsubscribe();
    this._global.setServerErr(false);
  }

  back() {
    this._global.setServerErr(false);
    this._nav.navigateBack('dashboard');
  }

  printReceipt() {
    this._sunmi.print({cartList: this.receiptCartList, cartSummary: this.receiptCartSummary, currentDate: this.currentDate, userDetails: this.userDetails, paymentData: this.paymentData});
  }

}
