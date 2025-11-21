import { Injectable } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { BehaviorSubject } from 'rxjs';
// import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Geolocation } from '@capacitor/geolocation';
import { ToastrService } from 'ngx-toastr';
// import * as crypto from 'crypto'

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  getCurrentUserId() {
    throw new Error('Method not implemented.');
  }

  // private secretKey = 'e1f8ee654dbf4e7bb4a0c235e4f0bed3';

  public token: String = "";
  private loaderFlag: boolean = false;
  private serverFlag: boolean = false;

  private _loader: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loader: any = this._loader.asObservable();

  private _serverErr: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public serverErr: any = this._serverErr.asObservable();

  private _internetStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public internetStatus: any = this._internetStatus.asObservable();
  cartUpdates: any;

  public restauMode: number = environment.restauMode;
  public selectedTable: any = {};
  public selectedChair: any = {};

  constructor(private _user: UserService, private _toast: ToastrService) { }

  private cartList: any = [];
  private cartData: any = {};
  public productData: any = null;
  private paymentData: any = null;

  // getToken() {
  //   return new Promise((resolve, reject) => {
  //     if (this.token) {
  //       resolve(this.token);
  //     } else {
  //       const refreshToken = localStorage.getItem("token");
  //       this._user.getToken(refreshToken).subscribe((response: any) => {
  //         this.token = response.token.access.token;
  //         resolve(this.token);
  //       });
  //     }
  //   });
  // }

  setLoader(flag: boolean) {
    if (flag != this.loaderFlag) {
      this.loaderFlag = flag;
      this._loader.next(flag);
    }
  }

  setServerErr(flag: boolean) {
    if (flag != this.serverFlag) {
      this.serverFlag = flag;
      this._serverErr.next(flag);
    }
  }

  updateInternetStatus(status: any) {
    this._internetStatus.next(status);
  }

  objNumToString(obj: any) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        return this.objNumToString(obj[key]);
      } else if (typeof obj[key] === 'number') {
        obj[key] = '' + obj[key];
      }
    });
    return obj;
  }

  

  async getCurrentLocation () {
    return new Promise(async(resolve, reject) => {
      let permission = await Geolocation.checkPermissions();
      // console.log(permission);
      if (permission?.location === "denied") {
        permission = await Geolocation.requestPermissions();
        // console.log(permission);
        if (permission?.location === "denied") {
          this._toast.error("App required location access to perform transactions.", "Location Permission Denied!");
          resolve({});
          return;
        }
      }
      const location = await Geolocation.getCurrentPosition();
      // console.log(location);
      resolve(JSON.parse(JSON.stringify(location.coords)));
    })
    
  };

  storeCart(userId: any) {
    localStorage.setItem('cart', JSON.stringify(this.cartData));
    this.retriveCart(userId);
  }

  mergeCart(selectedChair: Array<any>, userId: any) {
    const cartList = [];
    selectedChair.forEach((chair: any) => {
      if (this.cartData[userId]?.[this.selectedTable.uuid]?.[chair.uuid]) {
        Object.keys(this.cartData[userId][this.selectedTable.uuid][chair.uuid]).forEach((key: any) => {
          cartList.push(this.cartData[userId][this.selectedTable.uuid][chair.uuid][key]);
        });
      }
    });
    return cartList
  }

  retriveCart(userId: any) {
    this.cartList = [];
    this.cartData = JSON.parse(localStorage.getItem('cart'));

    if (this.restauMode === 1 && this.selectedTable.uuid) { 
      if (this.cartData?.[userId]?.[this.selectedTable.uuid]?.[this.selectedChair.uuid]) {
        Object.keys(this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid]).forEach((key: any) => {
          this.cartList.push(this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid][key]);
        });
      }
    } else {
      if (this.cartData[userId]) {
        Object.keys(this.cartData[userId]).forEach((key: any) => {
          this.cartList.push(this.cartData[userId][key]);
        });
      }
    }
    
    
    return {list: this.cartList, data: this.cartData};
  }

  emptyCart(userId, billChair?: Array<any>) {
    this.cartData =  JSON.parse(localStorage.getItem('cart'));
    if (this.selectedTable.uuid && this.restauMode === 1) {
      if (this.cartData[userId][this.selectedTable.uuid]) {
        if (billChair?.length > 1) { 
          billChair.forEach((chair: any) => {
            this.cartData[userId][this.selectedTable.uuid][chair.uuid] = {};  
          });
          localStorage.removeItem('billChair');
          localStorage.removeItem('tables');
          localStorage.removeItem('selectedTable');
          localStorage.removeItem('selectedChair');
        } else {
          this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid] = {};
          localStorage.removeItem('tables');
          localStorage.removeItem('selectedTable');
          localStorage.removeItem('selectedChair');
        }
        this.storeCart(userId);
      }
    } else {
      if (this.cartData[userId]) {
        this.cartData[userId] = {};
        this.storeCart(userId);
      }
    }
    return {list: this.cartList, data: this.cartData};
  }

  addToCart(product: any, userId: any) {
    if (this.selectedTable.uuid && this.restauMode === 1) {
      if (this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid][product.id]) {
        this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid][product.id].quantity += 1;
      } else {
        this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid][product.id] = {...product, quantity: 1}
      }
      this.storeCart(userId);
    } else {
      if (this.cartData[userId][product.id]) {
        this.cartData[userId][product.id].quantity += 1;
      } else {
        this.cartData[userId][product.id] = {...product, quantity: 1}
      }
      this.storeCart(userId);
    }
    
    return {list: this.cartList, data: this.cartData};
  }

  addQuantity(product: any, userId: any) {
    if (this.selectedTable.uuid && this.restauMode === 1) {
      this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid][product.id].quantity += 1;
      this.storeCart(userId);
    } else {
      this.cartData[userId][product.id].quantity += 1;
      this.storeCart(userId);
    }
    return {list: this.cartList, data: this.cartData};
  }

  removeQuantity(product: any, userId: any) {
    if (this.selectedTable.uuid && this.restauMode === 1) {
      if (this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid][product.id].quantity > 1) {
        this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid][product.id].quantity -= 1;
      } else {
        delete this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid][product.id];
      }
      this.storeCart(userId);
    } else {
      if (this.cartData[userId][product.id].quantity > 1) {
        this.cartData[userId][product.id].quantity -= 1;
      } else {
        delete this.cartData[userId][product.id];
      }
      this.storeCart(userId);
    }

    
    return {list: this.cartList, data: this.cartData};
  }

  getCartSummary(cartList: any = this.cartList) {
    const summary = {
      totalQty: cartList? cartList.length : this.cartList.length,
      totalAmount: 0,
      totalItem: 0
    }

    cartList.forEach((product: any) => {
      summary.totalItem += product.quantity;
      summary.totalAmount += product.quantity * product.unitPrice;
    });
    return summary;
  }

  initCart(userId: any) {
    this.restauMode = JSON.parse(localStorage.getItem('restauMoode')) || environment.restauMode;
    this.selectedTable = JSON.parse(localStorage.getItem('selectedTable'));
    this.selectedChair = JSON.parse(localStorage.getItem('selectedChair'));
    if (this.restauMode === 1 && this.selectedTable.uuid) { 
      this.retriveCart(userId);
      if (userId && this.selectedTable.uuid && this.selectedChair.uuid) {
        this.cartData[userId] = this.cartData[userId] || {};
        this.cartData[userId][this.selectedTable.uuid] = this.cartData[userId][this.selectedTable.uuid] || {};
        this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid]  = this.cartData[userId][this.selectedTable.uuid][this.selectedChair.uuid] || {};
        this.storeCart(userId);
      } else if (userId && userId != undefined) {
        this.cartData[userId]  = {};
        this.storeCart(userId);
      }
    } else {
      this.retriveCart(userId);
      if (!this.cartData[userId]) {
        this.cartData[userId] = {};
        this.storeCart(userId);
      }
    }
    
  }

  switchCart() {
    this.cartList = [];
  }

  setPaymentData(data:  any) {
    this.paymentData = data;
  }

  getPaymentData() {
    return this.paymentData;
  }

  debounce(func, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

}
