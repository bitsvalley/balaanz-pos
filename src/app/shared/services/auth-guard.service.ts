import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor( private _nav: NavController) {}
  canActivate(): boolean {
    if (!localStorage.getItem('token')) {
      this._nav.navigateBack('home');
      return false;
    }
    return true;
  }
}
