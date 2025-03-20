import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Network } from '@capacitor/network';
import { NgZone  } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public pageLoader: boolean = false;
  public serverErr: boolean = false;
  public internetConnected: any = true;
  public displayHeader: boolean = false;
  public userDetails: any = null;
  public runTimeProps: any = null;
  public pageTitle: any = "";

  constructor(private platform: Platform, private _account: AccountService, private _router: Router, private _global: GlobalService, private zone: NgZone) {
    this._router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        // console.log(event);
        if (event.url === '/home' || event.url === '/disbursement' || event.url === '/collection') {
          this.displayHeader = false;
        } else if (event.url !== '/') {
          this.getUserDetails();
          this.displayHeader = true;
          this.setPageTitle(event.url);
        }
      }
    });
    this.setPageTitle(this._router.url);
    this.initializeApp();

    this._global.loader.subscribe((response: boolean) => {
      if (response != this.pageLoader) {
        this.pageLoader = response;
      }
    });

    this._global.serverErr.subscribe((response: boolean) => {
      if (response != this.serverErr) {
        this.serverErr = response;
      }
    });
  }

  setPageTitle(url) {
    if (url === '/dashboard') {
      this.pageTitle = "Dashboard";
    } else if (url.search('/customerDetails') !== -1) {
      this.pageTitle = "Customer Details";
    } else if (url.search('/initTransaction') !== -1) {
      this.pageTitle = "Transaction"
    } else if (url.search('/createCustomer') !== -1) {
      this.pageTitle = "Create Customer"
    } else if (url.search('/transSummary') !== -1) {
      this.pageTitle = "Summary"
    } else if (url.search('/transactionSummary') !== -1) {
      this.pageTitle = "Transaction Summary"
    } else if (url.search('/createUser') !== -1) {
      this.pageTitle = "Create User"
    }

  }

  getUserDetails() {
    this._global.setLoader(true);
    this._account.getUserDetails().then((response: any) => {
      this.userDetails = response;
      // console.log(this.userDetails);
      this.getRunTimeProperties();
      this._global.setLoader(false);
    }, (error) => {
      this._global.setLoader(false);
    });
  }

  getRunTimeProperties() {
    this._account.getRunTimeProperties().then((response: any) => {
      this.runTimeProps = response;
    }, (error) => {
      this._global.setLoader(false);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      document.body.setAttribute('data-theme', 'light');
      document.body.classList.toggle('dark', false);
      // Network Status
      Network.addListener('networkStatusChange', status => {
        // console.log('Network status changed', status);
        this.showNetworkPrompt(status);
      });

      // Subscribe Internet Status
      this._global.internetStatus.subscribe((status: any) => {
        if (this.internetConnected != status) {
          this.internetConnected = status;
          this.zone.run(() => { console.log("Internet Connectivity Changed!") });
        }
      });

      // getCurrentNetworkStatus
      setTimeout(() => {
        this.getNetworkStatus();
      }, 0);
    });
  }

  async getNetworkStatus() {
    const status = await Network.getStatus();
    this.showNetworkPrompt(status);
  };

  showNetworkPrompt(status: any) {
    if(!status.connected || status.connectionType == 'none') {
      this._global.serverErr(false);
      this._global.updateInternetStatus(false);
    } else {
      this._global.updateInternetStatus(true);
    }
  }
}
