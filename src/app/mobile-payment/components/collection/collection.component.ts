import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent {
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
