import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-landing-page',
  templateUrl: './admin-landing-page.component.html',
  styleUrls: ['./admin-landing-page.component.scss'],
})
export class AdminLandingPageComponent  implements OnInit {

  userName: string;
  isAccountOpen: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
  }

  goToProducts(){
    this.router.navigate(['/product']);
  }

  goToPurchases(){
    // alert("Coming Soon");
    this.router.navigate(['/purchasesdashboardmodule']);
  }

  goToSales(){
    // alert("Coming Soon");
    this.router.navigate(['/salesdashboardmodule']);
  }
  
    toggleAccountMenu() {
      this.isAccountOpen = !this.isAccountOpen;
    }
  
    closeAccount() {
      this.isAccountOpen = false;
    }
  
    Logout() {
      console.log("User logged out!");
      localStorage.removeItem('userName');
      this.router.navigate(['/admin-login']); 
    }
  }
