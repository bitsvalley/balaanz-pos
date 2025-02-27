import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-landing-page',
  templateUrl: './admin-landing-page.component.html',
  styleUrls: ['./admin-landing-page.component.scss'],
})
export class AdminLandingPageComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  goToProducts(){
    this.router.navigate(['/product']);
  }

  goToPurchases(){
    alert("Coming Soon");
  }

  goToSales(){
    alert("Coming Soon");
  }

}
