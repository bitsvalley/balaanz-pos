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

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.page.html',
  styleUrls: ['./payment-status.page.scss'],
})
export class PaymentStatusPage implements OnInit {

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
  public tranStatus: any = null;
  public totalPayment : number;

  constructor(
    private _nav: NavController,
    private _user: UserService,
    private _toastr: ToastrService,
    private _global: GlobalService,
    private _platform: Platform,
    private _route: Router,
    private _account: AccountService,
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

    this.totalPayment = this.cartSummary.totalAmount - this.paymentData.discount;
 
    console.log(this.cartSummary.totalAmount - this.paymentData.discount)

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
    this.checkStatus();
  }

  ionViewWillLeave() {
    this.apiSubscription.unsubscribe();
    this._global.setServerErr(false);
  }

  back() {
    this._global.setServerErr(false);
    this._nav.back();
  }

  checkStatus() {
    this._global.setLoader(true);
    if (!this.tranStatus) {
      this.tranStatus = 'PENDING';
    }
    const statusApi = this._user.payStatus(this.requestId).subscribe((statusRes: any) => {
      if (statusRes.status === 'success') {
        this.tranStatus = 'SUCCESS';
        this._global.setLoader(false);
        this._nav.navigateForward('receipt/' + statusRes.requestId);
      } else if (statusRes.status === 'pending') {
        this.tranStatus = 'PENDING';
        this._global.setLoader(false);
      } else {
        this.tranStatus = 'FAILED';
        this._global.setLoader(false);
        this._toastr.error("Payment has been failed.", "Payment Failed!");
      }
    }, (err: any) => {
      this._global.setLoader(false);
      this._nav.navigateBack('dashboard');
    });

    this.apiSubscription.add(statusApi);
  }

  verifyPayment() {
    this.checkStatus();
  }

}
