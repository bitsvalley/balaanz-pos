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
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  public userDetails: any = null;
  public cartList: any = [];
  public runTimeProps: any = null;
  public cartSummary: any =  {};
  public apiSubscription: any = new Subscription();
  public paymentSelected: boolean = false;
  
  public paymentMethods: any = [
    {
      title: "CASH",
      id: 1,
      value: null,
      userInput: false,
      isSelected: false,
      placeholder: null
    }, 
    {
      title: "MOMO",
      id: 2,
      value: null,
      userInput: true,
      isSelected: false,
      placeholder: "Enter MOMO Number"
    },
    {
      title: "BALAANZ ACCOUNT",
      id: 3,
      value: null,
      userInput: true,
      isSelected: false,
      placeholder: "Enter Account Number"
    }
  ]
  
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
      console.log(this.userDetails);
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

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
  }

  ionViewWillLeave() {
    this.apiSubscription.unsubscribe();
    this._global.setServerErr(false);
  }

  back() {
    this._global.setServerErr(false);
    this._nav.back();
  }

  selectMethod(method)  {
    this.paymentMethods.forEach((item: any)  => {
      item.isSelected = false;
    });
    this.paymentSelected = true;
    method.isSelected = true;
  }

  processPayment() {
    console.log("HItt");
    if (this.paymentSelected) {
      this._nav.navigateForward('receipt');
    }
  }

}
