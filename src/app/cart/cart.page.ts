import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Platform } from '@ionic/angular';
import { AccountService } from 'src/app/shared/services/account.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { environment } from 'src/environments/environment';
import { Subscription, forkJoin } from 'rxjs';
import { SunmiPrinterService } from '../shared/services/sunmi.printer';
import { UserService } from 'src/app/shared/services/user.service';
import * as moment from 'moment';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  public userDetails: any = null;
  public cartList: any = [];
  public runTimeProps: any = null;
  public cartSummary: any = {};
  public apiSubscription: any = new Subscription();
  public tables: any = [];
  public selectedChair: any = null;
  public selectedTable: any = null;
  public restauMode: number = environment.restauMode;
  public currentDate: any = moment().format('DD/MMM/YYYY HH:mm:ss');
  public isMultiChairSelected: boolean = false;

  constructor(
    private _nav: NavController,
    private _global: GlobalService,
    private _platform: Platform,
    private _route: Router,
    private _account: AccountService,
    private toastController: ToastController,
    private _sunmi: SunmiPrinterService,
    private _user: UserService
  ) {
    this._platform.backButton.subscribeWithPriority(-1, () => {
      if (
        this._route.url &&
        this._route.url.search('dashboard') > 0 &&
        localStorage.getItem('token')
      ) {
        App.exitApp();
      }
    });

    this._account.userDetailsObservable.subscribe((response: any) => {
      this.userDetails = response;
      // console.log(this.userDetails);
      this._global.initCart(this.userDetails.id);
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];
      const selectedChair =
        JSON.parse(localStorage.getItem('selectedChair')) || {};
      if (billChair.length > 1 && this.restauMode === 1) {
        this.cartList = this._global.mergeCart(
          billChair || [selectedChair],
          this.userDetails.id
        );
        this.cartSummary = this._global.getCartSummary(this.cartList);
      } else {
        this.cartList = this._global.retriveCart(this.userDetails.id).list;
        this.cartSummary = this._global.getCartSummary();
      }
    });

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });

    this.selectedChair = JSON.parse(
      localStorage.getItem('selectedChair') || 'null'
    );
  }

  ngOnInit() {
    const storedTable = localStorage.getItem('selectedTable');
    this.selectedTable = JSON.parse(storedTable);
    if (storedTable) {
      const table = JSON.parse(storedTable);
      this.tables = [table];
      this.calculateChairTableTotal();
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];
      this.tables[0].chairs.forEach((item: any) => {
        item.isSelected = false;
        if (item.uuid === this.selectedChair?.uuid) {
          item.isSelected = true;
        }
        if (billChair?.find((itm) => itm.uuid === item.uuid)) {
          item.isSelected = true;
        }
      });
    } else {
      console.log('No table found in localStorage');
    }
  }

  mergeCart(selectedChair: any) {
    if (selectedChair.uuid === this.selectedChair?.uuid) {
      return;
    } else {
      const cart = JSON.parse(localStorage.getItem('cart')) || null;
      const selectedTable =
        JSON.parse(localStorage.getItem('selectedTable')) || null;
      if (
        !cart[this.userDetails.id]?.[selectedTable.uuid]?.[
          selectedChair.uuid
        ] ||
        Object.keys(
          cart[this.userDetails.id]?.[selectedTable.uuid]?.[selectedChair.uuid]
        ).length === 0
      ) {
        this.presentErrorToast(`No Cart Item added to ${selectedChair.name}.`);
        return;
      }
      selectedChair.isSelected = !selectedChair.isSelected;
      const allChair = this.tables[0].chairs.filter(
        (item: any) => item.isSelected
      );
      if (allChair.length > 1) {
        this.isMultiChairSelected = true;
      } else {
        this.isMultiChairSelected = false;
      }
      this.cartList = this._global.mergeCart(allChair, this.userDetails.id);
      localStorage.setItem('billChair', JSON.stringify(allChair));
      this.cartSummary = this._global.getCartSummary(this.cartList);
    }
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
    });
  
    toast.present();
  }

    async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
    });
   
    toast.present();
  }

  checkIfAnyChairOpen(table: any): boolean {
    return table.chairs.some((chair) => chair.status === 'open');
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
    if (this.userDetails.id) {
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];
      const selectedChair =
        JSON.parse(localStorage.getItem('selectedChair')) || {};
      if (billChair.length > 1) {
        this.cartList = this._global.mergeCart(
          billChair || [selectedChair],
          this.userDetails.id
        );
        this.cartSummary = this._global.getCartSummary(this.cartList);
      } else {
        this.cartList = this._global.retriveCart(this.userDetails.id).list;
        this.cartSummary = this._global.getCartSummary();
      }
    }
  }

  calculateChairTableTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || 'null');
    this.tables.forEach((tbl: any) => {
      tbl.total = 0;
      tbl.chairs.forEach((chair: any) => {
        chair.total = 0;
        if (
          cart?.[this.userDetails.id]?.[tbl.uuid]?.[chair.uuid] &&
          Object.keys(cart?.[this.userDetails.id]?.[tbl.uuid]?.[chair.uuid])
            .length > 0
        ) {
          Object.keys(
            cart?.[this.userDetails.id]?.[tbl.uuid]?.[chair.uuid]
          ).forEach((key: any) => {
            const cartItem =
              cart?.[this.userDetails.id]?.[tbl.uuid]?.[chair.uuid][key];
            chair.total += cartItem.quantity * cartItem.unitPrice;
          });
          tbl.total += chair.total;
        }
      });
    });
  }

  openCheckout() {
    if (this.cartList.length) {
      this._nav.navigateForward('checkout');
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
    this.cartList = this._global.removeQuantity(
      product,
      this.userDetails.id
    ).list;
    this.cartSummary = this._global.getCartSummary();
    this.calculateChairTableTotal();
  }

  add(product: any) {
    this.cartList = this._global.addQuantity(product, this.userDetails.id).list;
    this.cartSummary = this._global.getCartSummary();
    this.calculateChairTableTotal();
  }

  handleRefresh(event: any) {}

  printCart() {
    const telProp = this.runTimeProps.find(
      (item) => item.property_name === 'telephone1'
    );
    let ownerInfo = {
      Name: this.runTimeProps[0].property_value,
      Location: this.runTimeProps[3].property_value,
      Tel: telProp?.property_value || '',
      Slogan: this.runTimeProps[2].property_value,
    };
    this._sunmi.print({
      ownerInfo: ownerInfo,
      cartList: this.cartList,
      cartSummary: this.cartSummary,
      currentDate: this.currentDate,
      userDetails: this.userDetails,
    });
  }

saveCart() {
  if (!this.cartList || this.cartList.length === 0) {
    this.presentErrorToast('No items in cart to save.');

    return;
  }

  this._user.getOrderStatuses(this.userDetails.org_id, this.userDetails.branch_id, this.selectedChair.id)
  .subscribe(
    (response: any) => {
      console.log("getOrderStatus response:", response);

      if (response.includes('CASHIER')) {
        this.presentErrorToast(`Order(s) already sent to the cashier. Proceed with the payment.`);
        
        return;
      }

      if (response.includes('SIGNED')) {
        this.presentErrorToast(`Order(s) already signed by cashier. Please print receipt and checkout.`);
        
        return;
      }

      if (response.includes('PLACED')) {
        // Safe to update existing order
        console.log('Order(s) already placed, updating...');
        this.doSaveCart();
        
        return;
      }

      // Unknown status fallback
      this.presentErrorToast(`Unknown status detected`);
    },
    (error: any) => {
      if (error.status === 404) {
        // No order found → safe to create new one
        console.log('No existing order found, creating new one');
        this.doSaveCart();
      } else {
        console.error('getOrderStatus error', error);
        this.presentErrorToast('Unknown error has occurred while checking the status');
      }
    }
  );
}

private doSaveCart() {
  const requests = this.cartList.map((product: any) => {
    const payload = {
      orgId: this.userDetails.org_id,
      branchId: this.userDetails.branch_id,
      tableChairUserId: this.selectedChair.id,
      shopProductId: product.id,
      unitPrice: product.unitPrice,
      quantity: product.quantity,
      createdById: this.userDetails.id,
      lastUpdatedById: this.userDetails.id,
    };

    console.log('saving cart item payload', payload);
    return this._user.saveCart(payload);
  });

  forkJoin(requests).subscribe(
    (responses: any[]) => {
      console.log('All saveCart responses', responses);
      this.presentSuccessToast('All cart order(s) saved successfully');
    },
    (error: any) => {
      console.error('Error saving cart', error);
      this.presentErrorToast('Unknown error has occurred while saving the cart items');
    }
  );
}

sendToCashier() {
  this._user.getOrderStatuses(this.userDetails.org_id, this.userDetails.branch_id, this.selectedChair.id)
    .subscribe(
      (response: any) => {
        console.log("getOrder response:", response);

        if (response.includes('PLACED')) {
          this._user.sendToCashier(this.userDetails.org_id, this.userDetails.branch_id, this.selectedChair.id, this.userDetails.id)
            .subscribe(
              (cashierResponse: any) => {
                console.log(cashierResponse);
                this.presentSuccessToast('Order(s) sent to cashier. Proceed with payment.');
              },
              (error: any) => {
                console.error('sendToCashier error', error);
                this.presentErrorToast('Error sending order(s) to Cashier');
              }
            );
        } else if (response.includes('CASHIER')) {
          this.presentErrorToast(`Order(s) already sent to the cashier. Proceed with the payment.`);
        } else if (response.includes('SIGNED')) {
          this.presentErrorToast(`Order(s) already signed by cashier. Please print receipt and checkout.`);
        } else {
          console.log("Unknown status detected - " + response);
          this.presentErrorToast(`Unknown status detected.`);
        }
      },
      (error: any) => {
        if (error.status === 404) {
          this.presentErrorToast('No order(s) found to send to cashier');
        } else {
          console.error('getOrder error', error);
          this.presentErrorToast('Error checking order(s) status');
        }
      }
    );
  }
}
