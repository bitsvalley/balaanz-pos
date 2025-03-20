import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-disbursement',
  templateUrl: './disbursement.component.html',
  styleUrls: ['./disbursement.component.scss'],
})
export class DisbursementComponent  {

  phoneNumber: string = '';
  price: string = '';
  note: string = '';

  constructor(private navCtrl: NavController) {}

  handlePayment() {
    this.navCtrl.navigateForward('/collection');
  }

  goBack() {
    this.navCtrl.back();
  }

}
