import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminLoginRoutingModule } from './admin-login-routing.module';



@NgModule({
  declarations: [AdminLoginComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    AdminLoginRoutingModule
  ]
})
export class AdminLoginModule { }
