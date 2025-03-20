import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';
import { LoginGuardService } from 'src/app/shared/services/login-guard.service';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [LoginGuardService],
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },  

  {
    path: 'disbursement',
   
    loadChildren: () => import('./mobile-payment/components/disbursement/disbursement.module').then( m => m.DisbursementModule)
  },
  {
    path: 'collection',
   
    loadChildren: () => import('./mobile-payment/components/collection/collection.module').then( m => m.CollectionModule)
  },
  {
    path: 'transaction',
   
    loadChildren: () => import('./mobile-payment/components/transactions/transactions.module').then( m => m.TransactionsModule)
  },
  {
    path: 'tablemodule',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./table/table.module').then(m => m.TableModule)
  },
  
  {
    path: 'table',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./check/check.module').then(m => m.CheckModule)
  },
  {
    path: '',
    redirectTo: 'payment/login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'cart',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'checkout',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'paymentStatus/:requestId',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./payment-status/payment-status.module').then( m => m.PaymentStatusPageModule)
  },
  {
    path: 'receipt/:requestId',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./receipt/receipt.module').then( m => m.ReceiptPageModule)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'payment/login',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./mobile-payment/components/log-in/log-in.module').then( m => m.LogInModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
