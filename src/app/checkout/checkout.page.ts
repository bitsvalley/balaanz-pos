import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  selectedPaymentMethod: string = '';

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }
  
  constructor() { }

  ngOnInit() {
  }

}
