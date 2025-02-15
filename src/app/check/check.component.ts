import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  goToTable() {
    this.router.navigate(['/table']);
  }

  // Navigate to the Dashboard page for Walk-in
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
