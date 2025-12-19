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

  public statusMaxCycle: any = 3;
  public statusCycle: any = 0;
  public isPaymentTimeout: boolean =  false;
  public paymentRequest: any = null;
  public restauMode: number = environment.restauMode;

  public paymentMethods: any = [
    {
      title: "CASH",
      id: 1,
      userInput: false,
      isSelected: false,
      placeholder: null,
      navVal: 'CASH'
    } 

    //TODO: enable when other payment methods are supported
    // {
    //   title: "MOMO",
    //   id: 2,
    //   userInput: true,
    //   isSelected: false,
    //   placeholder: "Enter MOMO Number",
    //   navVal: 'MOMO'
    // },
    // {
    //   title: "BALAANZ ACCOUNT",
    //   id: 3,
    //   userInput: true,
    //   isSelected: false,
    //   placeholder: "Enter Account Number",
    //   navVal: 'ACCOUNT'
    // }
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

  generateForm() {
    this.paymentForm = this._fb.group({
      method: ["", [Validators.required]],
      value: ["", []],
      discount: [0, []]
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
      this.paymentForm.get('value').setValidators([Validators.required, Validators.pattern(/^\d{3,22}$/)]);
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
    if (this.paymentForm.value.method == "") {
      this._toastr.error("Please select a valid payment method");

      return;
    }
    
    if (this.discount > this.totalAmount)  {
      return;
    }
    const payload = {
      "mode": {
          "type": this.paymentForm.value.method,
          "identifier": this.paymentForm.value.value
      },
      "discount": this.discount,
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
    this._user.pay(payload).subscribe((res: any) => {
      if (this.paymentForm.value.method !== 'CASH') {
        this._global.setLoader(false);
        this._global.setPaymentData(this.paymentForm.value);
        this._nav.navigateForward('paymentStatus/' + res.requestId);
      } else {
        this._global.setLoader(false);
        this._global.setPaymentData(this.paymentForm.value);
        this._nav.navigateForward('receipt/0');
      }
    }, (error: any) => {
      this._global.setLoader(false);
      this._toastr.error("Invalid Session", "Authorization!");
      this._account.logout();
    }) 
  }
}
