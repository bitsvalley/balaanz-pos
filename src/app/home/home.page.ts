import { Component, OnDestroy, Optional, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { AccountService } from 'src/app/shared/services/account.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('loginButton', { static: false }) loginButton: any;

  public loginFrm: FormGroup = new FormGroup({});
  public loginError: Boolean = false;
  public apiSubscription: Subscription = new Subscription();


  constructor(private _nav: NavController, private _account: AccountService, private _fb: FormBuilder, private _user: UserService, private _global: GlobalService, private toaster: ToastrService, private _route: Router, private _platform: Platform, @Optional() private _routerOutlet?: IonRouterOutlet) {
    this.loginFrm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loginFrm.valueChanges.subscribe(() => {
      this.loginError = false;
    });

    this._platform.backButton.subscribeWithPriority(-1, () => {
      if (!this._routerOutlet?.canGoBack()) {
        App.exitApp();
      }
    });
  }

  goToDashboard() {
    this._nav.navigateForward('table');
  }

  ionViewWillEnter() {
    this._global.setServerErr(false);
    this.apiSubscription = new Subscription();
    this.loginFrm.reset();
    if (localStorage.getItem("token")) {
      this.toaster.success("Redirecting to Dashboard since you are already logged in.", "Already Logged In!", {
        timeOut: 5000
      })
      this.goToDashboard();
    }
  }

  ionViewWillLeave() {
    this._global.setServerErr(false);
    this.apiSubscription.unsubscribe();
  }

  login() {
    this._account.resetUserDetails();
    this._global.setLoader(true);
    const loginApi = this._user.login(this.loginFrm.value).subscribe((response: any) => {
      this._global.setLoader(false);
      if (response.status === 'success') {
        if (!localStorage.getItem('cart'))  {
          localStorage.setItem('cart', JSON.stringify({}));
        }
        localStorage.setItem('token', response.token.refresh.token);
        this.goToDashboard();
      } else if (response.status === 'failed') {
        if (response.message === 'User is not active') {
          this.toaster.error("User is Inactive. Please reach out to organization to get Active", "User is not Active!", {
            timeOut: 5000,
          });
        }  else {
          this.loginError = true;
          this.toaster.error("Please enter correct credential.", "Wrong Username or Password!", {
            timeOut: 5000,
          });
        }
      } else {
        this.loginError = false;
        this.toaster.error("Please try again after some time.", "Internal Server Error!", {
          timeOut: 5000,
        });
      }
    }, (error) => {
      this._global.setLoader(false);
      this.loginError = false;
      this.toaster.error("Please try again after some time.", "Internal Server Error!", {
        timeOut: 5000,
      });
    });
    this.apiSubscription.add(loginApi);
  }

  onFocus(fieldName: any) {
    // console.log(fieldName);
    setTimeout(() => {
      this.scrollToLoginButton();
    }, 100);
  }

  scrollToLoginButton() {
    this.content.scrollToBottom(300); // 300ms smooth scroll duration
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }
}
