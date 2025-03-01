import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-landing-page',
  templateUrl: './admin-landing-page.component.html',
  styleUrls: ['./admin-landing-page.component.scss'],
})
export class AdminLandingPageComponent  implements OnInit {

  userName: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
  }

  goToProducts(){
    this.router.navigate(['/product']);
  }

  goToPurchases(){
    this.router.navigate(['/purchasesdashboardmodule']);
  }

  goToSales(){
    alert("Coming Soon");
  }

}
