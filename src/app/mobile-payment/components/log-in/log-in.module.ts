import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInComponent } from './log-in.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule,  } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';



@NgModule({
  declarations: [LogInComponent],
  imports: [
    CommonModule,
    IonicModule,       
    FormsModule,
    LoginRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogInModule { }
