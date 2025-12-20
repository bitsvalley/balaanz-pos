import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService {
  constructor( private _nav: NavController) {}
  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      if (environment.restauMode === 1) {
        this._nav.navigateForward('tablemodule');
      } else {
        this._nav.navigateForward('dashboard');
      }
      
      return false;
    }

    return true;
  }
}
