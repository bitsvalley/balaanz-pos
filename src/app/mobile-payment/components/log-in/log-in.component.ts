import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AccountService } from 'src/app/shared/services/account.service';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnDestroy {

  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  public loginFrm: FormGroup = new FormGroup({});
  public loginError: Boolean = false;
  private apiSubscription: Subscription = new Subscription();

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private _nav: NavController, 
    private _account: AccountService,
    private _fb: FormBuilder,
    private _user: LoginService,
    private _global: GlobalService,
    private toaster: ToastrService,
    private _route: Router
  ) {
    this.loginFrm = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.loginFrm.valueChanges.subscribe(() => {
      this.loginError = false;
    });
  }

  ngOnDestroy() {
    // Clean up the subscription when the component is destroyed
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }

  goToDisbursement() {
    this._nav.navigateForward('payment');
  }
  
  handleLogin() {
    if (this.username == '' || this.password == '') {
      return; // Don't do anything if the form is invalid
    }

    this._account.resetUserDetails();
    this._global.setLoader(true);
    const payload = {
      username: this.username,
      password: this.password
  };
    
    const loginApi = this._user.login(payload).subscribe((response: any) => {
      this._global.setLoader(false);

      if (response.status === 'success') {
        if (!localStorage.getItem('cart')) {
          localStorage.setItem('cart', JSON.stringify({}));
        }
        localStorage.setItem('token', response.token.refresh.token);
        this.goToDisbursement();
      } else if (response.status === 'failed') {
        if (response.message === 'User is not active') {
          this.toaster.error("User is Inactive. Please reach out to the organization to get Active", "User is not Active!", {
            timeOut: 5000,
          });
        } else {
          this.loginError = true;
          this.toaster.error("Please enter correct credentials.", "Wrong Username or Password!", {
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
    this.showSuccessToast('Login Successful');
    this.navCtrl.navigateForward('/disbursement');
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }

}
