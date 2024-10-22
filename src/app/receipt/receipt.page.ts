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
  public currentDate: any = moment().format('DD/MMM/YYYY');
  public receiptCartList: any = [];
  public receiptCartSummary: any = [];
  public requestId: any = null;

  constructor(
    private _nav: NavController,
    private _user: UserService,
    private _toastr: ToastrService,
    private _global: GlobalService,
    private _platform: Platform,
    private _route: Router,
    private _account: AccountService,
    private _sunmi: SunmiPrinterService,
    private _actRoute: ActivatedRoute
  ) { 
    this._platform.backButton.subscribeWithPriority(-1, () => {
      if (this._route.url && this._route.url.search('dashboard') > 0 && localStorage.getItem('token')) {
        App.exitApp();
      }
    });
    this.requestId = this._actRoute.snapshot.params['requestId'];
    
    this._account.userDetailsObservable.subscribe((response: any) => {
      this.userDetails = response;
      this._global.initCart(this.userDetails.id);
      this.cartList = this._global.retriveCart(this.userDetails.id).list;
      this.cartSummary =  this._global.getCartSummary();
    });

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });
  }

  ngOnInit() {
    
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
    this._nav.back();
  }

  printReceipt() {
    this._sunmi.print({cartList: this.receiptCartList, cartSummary: this.receiptCartSummary, currentData: this.currentDate, userDetails: this.userDetails});
  }

}
