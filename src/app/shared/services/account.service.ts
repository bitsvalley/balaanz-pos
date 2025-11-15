import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnDestroy {

  public apiSubscription: Subscription = new Subscription();

  public runTimeProperty: any = [];
  private _runTimePropObservable: any = new BehaviorSubject({});
  public runTimePropObservable = this._runTimePropObservable.asObservable();

  public userDetails: any = null;
  private _userDetailsObservable: any = new BehaviorSubject({});
  public userDetailsObservable = this._userDetailsObservable.asObservable();

  public momoPaymentData: any = null;

  constructor(private _user: UserService, private _global: GlobalService, private _nav: NavController, private toaster: ToastrService) { }


  setMomoPaymentData(data) {
    this.momoPaymentData = data;
  }

  getMomoPaymentData() {
    return this.momoPaymentData;
  }

  async getUserDetails() {
    return new Promise((resolve, reject) => {
      if (!this.userDetails) {
        const userDetailsapi = this._user.getUserDetails().subscribe((response: any) => {
          this.userDetails = response.data;
          this._userDetailsObservable.next(this.userDetails);
          resolve(this.userDetails);
        }, (error: any) => {
          if(error.error.statusCode === 401) {
            this.toaster.error('Kindly re-login using username and password to continue.', 'Not Authorized',{
              timeOut: 5000,
            });
            this.logout();
          } else {
            this.toaster.error('Error while processing your request.', 'Error While Processing',{
              timeOut: 5000,
            });
            this._global.setServerErr(true);
          }
          reject("error");
        });
        this.apiSubscription.add(userDetailsapi);
      } else {
        resolve(this.userDetails);
      }
    });
  }

  resetUserDetails() {
    this.userDetails = null;
    this.runTimeProperty = [];
  }

  logout() {
    this._global.token = "";
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    localStorage.removeItem('tables');
    localStorage.removeItem('selectedTable');
    localStorage.removeItem('restauMode');
    localStorage.removeItem('cart');
    localStorage.removeItem('billChair');
    localStorage.removeItem('selectedChair');

    this._nav.navigateForward('home');
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }

  getRunTimeProperties() {
    return new Promise((resolve, reject) => {
      if (this.runTimeProperty?.length) {
        resolve(this.runTimeProperty);
      } else {
        this._global.setLoader(true);
        const runTimePropertySubscription = this._user.getRunTimeProperties().subscribe((response: any) => {
          this.runTimeProperty = response.data;
          this._runTimePropObservable.next(this.runTimeProperty);
          resolve(this.runTimeProperty);
          this._global.setLoader(false);
        }, (error: any) => {
          this._global.setLoader(false);
        });
        this.apiSubscription.add(runTimePropertySubscription);
      }
    });
  }
}
