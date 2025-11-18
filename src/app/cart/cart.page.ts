import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Platform } from '@ionic/angular';
import { AccountService } from 'src/app/shared/services/account.service';
import { Router } from '@angular/router'; 
import { App } from '@capacitor/app';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  public userDetails: any = null;
  public cartList: any = [];
  public runTimeProps: any = null;
  public cartSummary: any =  {};
  public apiSubscription: any = new Subscription();
  public tables: any = [];
  public selectedChair: any = null;
  public restauMode: number = environment.restauMode;

  constructor(
    private _nav: NavController,
    private _global: GlobalService,
    private _platform: Platform,
    private _route: Router,
    private _account: AccountService,
    private toastController: ToastController,
    
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
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];
      const selectedChair = JSON.parse(localStorage.getItem('selectedChair')) || {};
      if (billChair.length > 1 && this.restauMode === 1) {
        this.cartList = this._global.mergeCart(billChair || [selectedChair], this.userDetails.id);
        this.cartSummary =  this._global.getCartSummary(this.cartList);
      } else {
        this.cartList = this._global.retriveCart(this.userDetails.id).list;
        this.cartSummary =  this._global.getCartSummary();
      }
    });

    this._account.runTimePropObservable.subscribe((response: any) => {
      this.runTimeProps = response;
    });

    this.selectedChair = JSON.parse(localStorage.getItem('selectedChair') || 'null');
  }

  ngOnInit() {
    const storedTable = localStorage.getItem('selectedTable');
    if (storedTable) {
      const table = JSON.parse(storedTable);
      console.log('Selected Table:', table); 
      console.log(table);
      this.tables = [table];
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];
      this.tables[0].chairs.forEach((item: any) => {
        item.isSelected = false;
        if (item.ChairId === this.selectedChair?.ChairId) {
          item.isSelected = true;
        }
        if (billChair?.find((itm) => itm.ChairId === item.ChairId)) {
          item.isSelected = true;
        }
      });
    } else {
      console.log('No table found in localStorage');
    }
  }

  mergeCart(selectedChair: any) {
    if (selectedChair.ChairId === this.selectedChair?.ChairId) {
      return;
    } else {
      const cart = JSON.parse(localStorage.getItem('cart')) || null;
      const selectedTable = JSON.parse(localStorage.getItem('selectedTable')) || null;
      if (!cart[this.userDetails.id]?.[selectedTable.TableId]?.[selectedChair.ChairId] || Object.keys(cart[this.userDetails.id]?.[selectedTable.TableId]?.[selectedChair.ChairId]).length === 0) { 
        this.presentToast(`No Cart Item added to Chair ${selectedChair.ChairId}.`);
        return;
      }
      selectedChair.isSelected = !selectedChair.isSelected;
      const allChair = this.tables[0].chairs.filter((item: any) => item.isSelected);
      this.cartList = this._global.mergeCart(allChair, this.userDetails.id);
      localStorage.setItem('billChair', JSON.stringify(allChair));
      this.cartSummary =  this._global.getCartSummary(this.cartList);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }
  

  checkIfAnyChairOpen(table: any): boolean {
    return table.chairs.some(chair => chair.status === 'open');
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
    if (this.userDetails.id) {
      const billChair = JSON.parse(localStorage.getItem('billChair')) || [];
      const selectedChair = JSON.parse(localStorage.getItem('selectedChair')) || {};
      if (billChair.length > 1) {
        this.cartList = this._global.mergeCart(billChair || [selectedChair], this.userDetails.id);
        this.cartSummary =  this._global.getCartSummary(this.cartList);
      } else {
        this.cartList = this._global.retriveCart(this.userDetails.id).list;
        this.cartSummary =  this._global.getCartSummary();  
      }
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
