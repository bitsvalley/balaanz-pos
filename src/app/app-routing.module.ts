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
    path: 'adminlandingpage',
   
    loadChildren: () => import('./admin-landing-page/admin-landing-page.module').then( m => m.AdminLandingPageModule)
  },
  {
    path: 'newproductadd',
   
    loadChildren: () => import('./add-new-product/add-new-product/add-new-product.module').then( m => m.AddNewProductModule)
  },
  {
    path: 'editproduct',
   
    loadChildren: () => import('./edit-product/edit-product/edit-product.module').then( m => m.EditProductModule)
  },
  {
    path: 'adminlogin',
   
    loadChildren: () => import('./admin-login/admin-login.module').then( m => m.AdminLoginModule)
  },
  {
    path: 'purchasesdashboardmodule',
   
    loadChildren: () => import('./purchases-dashboard/purchases-dashboard.module').then( m => m.PurchasesDashboardModule)
  },
  {
    path: 'tablemodule',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./table/table.module').then(m => m.TableModule)
  },
  {
    path: 'product',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./product-add/product-add.module').then(m => m.ProductAddModule)
  },
  // {
  //   path: 'table',
  //   canActivate: [AuthGuardService],
  //   loadChildren: () => import('./check/check.module').then(m => m.CheckModule)
  // },
  {
    path: '',
    redirectTo: 'home',
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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
