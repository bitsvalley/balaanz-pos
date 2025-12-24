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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { each } from 'chart.js/dist/helpers/helpers.core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage implements OnInit {

  public userDetails: any = null;
  public cartList: any = [];
  public runTimeProps: any = null;
  public cartSummary: any =  {};
  public apiSubscription: any = new Subscription();
  public paymentSelected: any = null;
  public discount: any = 0;
  public subtotalAmount: any = 0;
  public totalAmount: any = 0;
  public modeOfPayment: any = null;
  public amountPaid: any = 0;
  public changeReturned: any = 0;

  public statusMaxCycle: any = 3;
  public statusCycle: any = 0;
  public isPaymentTimeout: boolean =  false;
  public paymentRequest: any = null;
  public restauMode: number = environment.restauMode;
  
  constructor(
    private _nav: NavController,
    private _user: UserService,
    private _toastr: ToastrService,
    private _global: GlobalService,
    private _platform: Platform,
    private _route: Router,
    private _account: AccountService,
    private _fb: FormBuilder,
    private alertController: AlertController
  ) { 
    this._platform.backButton.subscribeWithPriority(-1, () => {
      if (this._route.url && this._route.url.search('dashboard') > 0 && localStorage.getItem('token')) {
        App.exitApp();
      }
    });
    
    this._account.userDetailsObservable.subscribe((response: any) => {
      this.userDetails = response;
      this._global.initCart(this.userDetails.id);
    });

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });
  }

  ngOnInit() {
  }

  checkCart() {
    setTimeout(() => {
      if (!this.cartList.length) {
        this._nav.navigateBack('dashboard');
      }
    }, 1000);
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
  
    if (this.userDetails.id) {
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];
      const selectedChair = JSON.parse(localStorage.getItem('selectedChair')) || {};

      let selectChairIds: number[] = [selectedChair.id];

      if (billChair.length > 1 && this.restauMode === 1) {
        selectChairIds = billChair.map(item => item.id);
        this.cartList = this._global.mergeCart(billChair || [selectedChair], this.userDetails.id);        
      } else {
        this.cartList = this._global.retriveCart(this.userDetails.id).list;
      }

      this._user.getActiveOrderPaymentDetails(this.userDetails.org_id, this.userDetails.branch_id, selectChairIds)          
      .subscribe(
        (response: any) => {
          this.subtotalAmount = response.subtotal;
          this.discount = response.discount;
          this.totalAmount = response.total;
          this.modeOfPayment = response.modeOfPayment;
          this.amountPaid = response.amountPaid;
          this.changeReturned = response.changeReturned;
        },
        (error: any) => {
          this._toastr.error("Payment details cannot be retrieved");
        }
      );

      this.checkCart();
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

  finishCheckoutWithoutReceipt() {
    this.clearCart();

    this._toastr.success("Checkout completed successfully");

    if (this.restauMode === 1) {
      this._nav.navigateBack('tablemodule');
    } else {
      this._nav.navigateBack('dashboard');
    }    
  }

  clearCart() {
    if (this.cartList.length) {
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];
      const selectedChair = JSON.parse(localStorage.getItem('selectedChair')) || {};

      if (billChair.length > 1 && this.restauMode === 1) {
        this._global.emptyCart(this.userDetails.id, billChair);

        billChair.forEach((chair) => {
          this.deleteOrder(chair.id);
        });
      } else {
        this._global.emptyCart(this.userDetails.id);
        this.deleteOrder(selectedChair.id);
      }
    }
  }

  deleteOrder(chairId) {
    this._user.deleteOrder(this.userDetails.org_id, this.userDetails.branch_id, chairId).subscribe((response: any) => {
      console.log(response);
    });
  }

  navigateToReceipt() {
    const paymentData: any = {};      
    paymentData.subtotalAmount = this.subtotalAmount;
    paymentData.discount = this.discount;
    paymentData.totalAmount = this.totalAmount;
    paymentData.modeOfPayment = this.modeOfPayment;
    paymentData.amountPaid = this.amountPaid;
    paymentData.changeReturned = this.changeReturned;

    this._global.setPaymentData(paymentData);
    this._nav.navigateForward('receipt/0');
  }
}
