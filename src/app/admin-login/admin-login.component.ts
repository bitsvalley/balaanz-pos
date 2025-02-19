import { Component, OnInit, Optional } from '@angular/core';
import { AdminLogin } from './admin-login.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { AccountService } from '../shared/services/account.service';
import { GlobalService } from '../shared/services/global.service';
import { UserService } from '../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent  implements OnInit {

  loginForm: FormGroup;
  isSubmitted = false;
  loginError: boolean;
  apiSubscription: any;

  constructor(
    private _nav: NavController,
    private formBuilder: FormBuilder,
    private router: Router,
    // private _account: AccountService,
    private _user: UserService, 
    private _global: GlobalService, 
   private toaster: ToastrService,
  private _route: Router,
  private _platform: Platform,
   @Optional() private _routerOutlet?: IonRouterOutlet
  ) { }

  

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }

    const loginData: AdminLogin = {
      name: this.loginForm.value.name,
      password: this.loginForm.value.password
    };

    console.log('Login Data:', loginData);
    // Add your login logic here
    // Example: this.authService.login(loginData)
    // this._account.resetUserDetails();
    this._global.setLoader(true);
    const loginApi = this._user.adminlogin(this.loginForm.value).subscribe((response: any) => {
      this._global.setLoader(false);
      console.log(response)
      if (response.token !== null) {
        //localStorage.setItem('token', response.token);
        this.goToProduct();
      } else if (response.token === null) {
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


  goToProduct(){
    this._nav.navigateForward('product');
  }
  

}


