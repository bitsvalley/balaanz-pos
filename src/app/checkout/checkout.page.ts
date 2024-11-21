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

  public statusMaxCycle: any = 3;
  public statusCycle: any = 0;
  public isPaymentTimeout: boolean =  false;
  public paymentRequest: any = null;

  public paymentMethods: any = [
    {
      title: "CASH",
      id: 1,
      userInput: false,
      isSelected: false,
      placeholder: null,
      navVal: 'CASH'
    }, 
    {
      title: "MOMO",
      id: 2,
      userInput: true,
      isSelected: false,
      placeholder: "Enter MOMO Number",
      navVal: 'MOMO'
    },
    {
      title: "BALAANZ ACCOUNT",
      id: 3,
      userInput: true,
      isSelected: false,
      placeholder: "Enter Account Number",
      navVal: 'ACCOUNT'
    }
  ]

  public paymentForm: any = new FormGroup({})
  
  constructor(
    private _nav: NavController,
    private _user: UserService,
    private _toastr: ToastrService,
    private _global: GlobalService,
    private _platform: Platform,
    private _route: Router,
    private _account: AccountService,
    private _fb: FormBuilder
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
      this.checkCart();
    });

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });
  }

  ngOnInit() {
    this.generateForm();
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
    this.generateForm();
    if (this.userDetails.id) {
      this.cartList = this._global.retriveCart(this.userDetails.id).list;
      this.cartSummary =  this._global.getCartSummary();
      this.checkCart();
    }
  }

  ionViewWillLeave() {
    this.apiSubscription.unsubscribe();
    this._global.setServerErr(false);
  }

  generateForm() {
    this.paymentForm = this._fb.group({
      method: ["", [Validators.required]],
      value: ["", []]
    });

    this.validateForm();
  }

  back() {
    this._global.setServerErr(false);
    this._nav.back();
  }

  selectMethod(method)  {
    this.paymentMethods.forEach((item: any)  => {
      item.isSelected = false;
    });
    this.paymentSelected = method;
    method.isSelected = true;
    this.validateForm();
  }

  validateForm() {
    if (this.paymentSelected) {
      this.paymentForm.get('method').setValue(this.paymentSelected.navVal);
      this.paymentForm.get('value').setValue("");
    }
    if (this.paymentForm.get('method').value === 'MOMO' || this.paymentForm.get('method').value === 'ACCOUNT') {
      this.paymentForm.get('value').setValidators([Validators.required, Validators.pattern(/^\d{9}$/)]);
      this.paymentForm.get('value').updateValueAndValidity();
    } else if (this.paymentForm.get('method').value === 'CASH') {
      this.paymentForm.get('value').setValidators(null);
      this.paymentForm.get('value').updateValueAndValidity();
    } else {
      this.paymentForm.get('value').setValidators(null);
      this.paymentForm.get('value').updateValueAndValidity();
    }
  }

  processPayment() {
    const payload = {
      "mode": {
          "type": this.paymentForm.value.method,
          "identifier": this.paymentForm.value.value
      },
      "cartContent": {}
    };
    this.cartList.forEach((itm) => {
      payload.cartContent[itm.id] = {
          "productId": itm.id,
          "productName": itm.name,
          "quantity": itm.quantity,
          "productPrice": itm.unitPrice
      }
    });

    this._global.setLoader(true);
    setTimeout(() => {
      this._user.pay(payload).subscribe((res: any) => {
        if (this.paymentForm.value.method !== 'CASH') {
          this.checkStatus(res);
        } else {
          this._global.setPaymentData(this.paymentForm.value);
          this._nav.navigateForward('receipt/0');
          this._global.setLoader(false);
        }
      }, (error: any) => {
        this._global.setLoader(false);
      })
    }, 1000);
    
    
  }

  checkStatus(res) {
    if (this.statusCycle === this.statusMaxCycle) {
      this.paymentRequest = res;
      this.isPaymentTimeout = true;
      this._global.setLoader(false);
      return;
    }
    this._user.payStatus(res.requestId).subscribe((statusRes: any) => {
      this.statusCycle += 1;
      if (statusRes.status === 'success') {
        this.statusCycle = 0;
        this._global.setPaymentData(this.paymentForm.value);
        this._nav.navigateForward('receipt/' + statusRes.requestId);
        this._global.setLoader(false);
        return;
      } else if (statusRes.status === 'pending') {
        setTimeout(() => {
          this.checkStatus(res);
        }, 10000);
      } else {
        this._toastr.error("Payment has been failed.", "Payment Failed!");
      }
    }, (err: any) => {
      this._global.setLoader(false);
    });
  }

  retryPayment() {
    this.isPaymentTimeout = false;
    this.statusCycle = 0;
    this._global.setLoader(true);
    this.checkStatus(this.paymentRequest);
    this.paymentRequest = null;
  }

  closePayment() {
    this.isPaymentTimeout = false;
    this.statusCycle = 0;
    this.paymentRequest = null;
  }

}
