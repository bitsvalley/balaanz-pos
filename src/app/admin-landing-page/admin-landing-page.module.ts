import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLandingPageRoutingModule } from './admin-landing-page-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLandingPageComponent } from './admin-landing-page.component';



@NgModule({
  declarations: [AdminLandingPageComponent],
  imports: [
    CommonModule,
    AdminLandingPageRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdminLandingPageModule { }
