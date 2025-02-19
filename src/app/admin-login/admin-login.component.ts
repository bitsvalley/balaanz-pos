import { Component, OnInit } from '@angular/core';
import { AdminLogin } from './admin-login.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent  implements OnInit {

  loginForm: FormGroup;
  isSubmitted = false;

  constructor(
    private _nav: NavController,
    private formBuilder: FormBuilder,
    private router: Router
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
  }

  login(){
    this._nav.navigateForward('product');
  }
}


