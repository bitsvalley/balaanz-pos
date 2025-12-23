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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {

  public userDetails: any = null;
  public restauMode: number = environment.restauMode;
  public cartList: any = [];
  public runTimeProps: any = null;
  public apiSubscription: any = new Subscription();
  public currentDate: any = moment().format('DD/MMM/YYYY HH:mm:ss');
  public receiptCartList: any = [];
  public requestId: any = null;
  public paymentData: any = this._global.getPaymentData();
  public businessName: string = '';
  public telephone: string = '';
  public selectedTable: any = JSON.parse(localStorage.getItem('selectedTable'));
  public selectedChair: any = JSON.parse(localStorage.getItem('selectedChair'));

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
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];
      const selectedChair = this.selectedChair || {};

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
          // enriching the payment data
          this.paymentData.subtotalAmount = response.subtotal;
          this.paymentData.discount = response.discount;
          this.paymentData.totalAmount = response.total;
          this.paymentData.modeOfPayment = response.modeOfPayment;
        },
        (error: any) => {
          this._toastr.error("Payment details cannot be retrieved");
        }
      );
    });

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });

    this._account.runTimePropObservable.subscribe((response: any[]) => {
      this.runTimeProps = response;
    
      // Get Business Name
      const nameProp = response.find(item => item.property_name === 'Business Name');
      this.businessName = nameProp?.property_value || '';
    
      // Get telephone1
      const telProp = response.find(item => item.property_name === 'telephone1');
      this.telephone = telProp?.property_value || '';
    });
  }

  ngOnInit() {

  }

  clearCart() {
    if (this.cartList.length) {
      this.receiptCartList = [...this.cartList];
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];

      if (billChair.length > 1 && this.restauMode === 1) {
        this._global.emptyCart(this.userDetails.id, billChair);

        billChair.forEach((chair) => {
          this.deleteOrder(chair.id);
        });
      } else {
        this._global.emptyCart(this.userDetails.id);
        this.deleteOrder(this.selectedChair.id);
      }
    } else {
      if (this.restauMode === 1) {
        this._nav.navigateBack('tablemodule');
      } else {
        this._nav.navigateBack('dashboard');
      }
    }
  }

  deleteOrder(chairId) {
    this._user.deleteOrder(this.userDetails.org_id, this.userDetails.branch_id, chairId).subscribe((response: any) => {
      console.log(response);
    });
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
    this.clearCart();

      this._account.runTimePropObservable.subscribe((response: any) => {
        this.runTimeProps = response;
      });
  }

  ionViewWillLeave() {
    this.apiSubscription.unsubscribe();
    this._global.setServerErr(false);
  }

  back() {
    this._global.setServerErr(false);

    if (this.restauMode === 1) {
      this._nav.navigateBack('tablemodule');
    } else {
      this._nav.navigateBack('dashboard');
    }
  }

  printReceipt() {
    let ownerInfo ={
      Name: this.runTimeProps[0].property_value,
      Location : this.runTimeProps[3].property_value,
      Tel : this.telephone,
      Slogan : this.runTimeProps[2].property_value

    }
    this._sunmi.print({ownerInfo:ownerInfo,cartList: this.receiptCartList, currentDate: this.currentDate, userDetails: this.userDetails, paymentData: this.paymentData});

    if (this.restauMode === 1) {
      this._nav.navigateBack('tablemodule');
    } else {
      this._nav.navigateBack('dashboard');
    }
  }
}