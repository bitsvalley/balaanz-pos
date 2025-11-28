import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { endpoints } from 'src/app/shared/resources/endPoint';
import { Product } from 'src/app/product-add/product-add.model';
import { Observable, tap } from 'rxjs';
import { Products } from 'src/app/sales-dashboard/sales-dashboard.model';

declare const grecaptcha: any;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // getTrendingProducts(): Observable<Product[]> {
  //   const url = `${environment.apiBaseUrl}/trending-products`;  // Replace with your actual API endpoint
  //   return this._http.get<Product[]>(url);
  // }
  getCurrentUserId(): any {
    throw new Error('Method not implemented.');
  }

  public momoToken: any = null;

  constructor(private _http: HttpClient) {}

  login(payload: Object) {
    const headers = new HttpHeaders({
      'content-type': 'application/json',
    });
    const url = `${environment.host}${endpoints.login}/${environment.org}`;
    return this._http.post(url, payload, { headers });
  }

  adminlogin(payload: { name: string; password: string }) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const url = `${environment.restApiHost}${endpoints.adminlogin}`;

    const body = new URLSearchParams();
    body.set('username', payload.name);
    body.set('password', payload.password);

    return this._http.post(url, body.toString(), { headers }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        // localStorage.setItem('token_expiry', response.expiration);
      })
    );
  }

  newproductadd(payload: Object) {
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    const url = `${environment.restApiHost}${endpoints.newproductadd}`;
    return this._http.post(url, payload, { headers });
  }
  getnewproductadd(payload: Object) {
    const refreshToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: `${refreshToken}`,
    });
    const url = `${environment.restApiHost}${endpoints.newproductadd}`;
    return this._http.post(url, payload, { headers: headers });
  }

  editproduct(payload: Object) {
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    const url = `${environment.restApiHost}${endpoints.editproduct}`;
    return this._http.put(url, payload, { headers });
  }
  geteditproduct(payload: Object) {
    const refreshToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: `${refreshToken}`,
    });
    const url = `${environment.restApiHost}${endpoints.editproduct}`;
    return this._http.put(url, payload, { headers: headers });
  }

  getProductAdmin() {
    const refreshToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: `${refreshToken}`,
    });
    const url = `${environment.restApiHost}${endpoints.productList}`;
    return this._http.get(url, { headers: headers });
  }

  getSalesProduct(from: string, to: string, limit: number) {
    const refreshToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    });
    const url = `${environment.restApiHost}${
      endpoints.sales
    }?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
      to
    )}&limit=${limit}`;
    return this._http.get(url, { headers: headers });
  }

  logout(userId) {
    const url = `${environment.host}${endpoints.logout}`;
    return this._http.post(url, { userId: userId });
  }

  getToken() {
    const refreshToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: `${refreshToken}`,
    });
    const url = `${environment.host}${endpoints.getToken}`;
    return this._http.get(url, { headers: headers });
  }

  getUserDetails() {
    const url = `${environment.host}${endpoints.getUserDetails}`;
    return this._http.get(url);
  }

  getAccount(apiUrl: any) {
    const url = `${environment.host}${apiUrl}`;
    return this._http.get(url);
  }

  // getAccountTransactions(payload: any, type:any, id:any) {
  //   const url = `${environment.host}${endpoints.getTransactions}/${type}/${id}`;
  //   return this._http.post(url, payload);
  // }

  getMomoToken() {
    // const headers = new HttpHeaders({
    //   "Content-Type": 'application/json',
    //   "Authorization": 'Basic ' + btoa(environment.paymentUser + ':' + environment.paymentPass)
    // });
    // return this._http.post<any>(`${environment.momoHost}${endpoints.paymentLogin}`, {}, {headers});
    let payload = {
      authToken: btoa(environment.paymentUser + ':' + environment.paymentPass),
    };
    return this._http.post<any>(
      `${environment.host}${endpoints.momoAuth}`,
      payload
    );
  }

  providerInfo(number: any) {
    // const headers = new HttpHeaders({
    //   "Content-Type": 'application/json',
    //   "Captcha-Token": `${localStorage.getItem('momoCaptcha')}`,
    //   "Authorization": `Bearer ${localStorage.getItem('momoToken')}`,
    // });
    const headers = new HttpHeaders({
      'g-token': `${localStorage.getItem('momoCaptcha')}`,
      'm-token': `Bearer ${localStorage.getItem('momoToken')}`,
    });
    //return this._http.get<any>(`${environment.momoHost}${endpoints.mobilePay}${endpoints.providerInfo}${number}`, {headers});
    return this._http.get<any>(
      `${environment.host}${endpoints.getProviderInfo}/${number}`,
      { headers }
    );
  }

  disburse(payload: any) {
    // const headers = new HttpHeaders({
    //   "Content-Type": 'application/json',
    //   "Captcha-Token": `${localStorage.getItem('momoCaptcha')}`,
    //   "Authorization": `Bearer ${localStorage.getItem('momoToken')}`,
    // });
    const headers = new HttpHeaders({
      'g-token': `${localStorage.getItem('momoCaptcha')}`,
      'm-token': `Bearer ${localStorage.getItem('momoToken')}`,
    });
    // return this._http.post<any>(`${environment.momoHost}${endpoints.mobilePay}${endpoints.disburse}`, payload, {headers});
    return this._http.post<any>(
      `${environment.host}${endpoints.momoDisburse}`,
      payload,
      { headers }
    );
  }

  async getCaptcha() {
    // grecaptcha.enterprise.ready(async () => {
    //   return await grecaptcha.enterprise.execute(environment.captchKey, {action: 'LOGIN'});
    // });
    return grecaptcha.enterprise.execute(environment.captchKey, {
      action: 'login',
    });
  }

  getRunTimeProperties() {
    return this._http.get<any>(
      `${environment.host}${endpoints.runTimeProperty}${environment.org}`
    );
  }

  validatePin(payload: any) {
    return this._http.post<any>(
      `${environment.host}${endpoints.validatePin}`,
      payload
    );
  }

  disburseCollect(payload: any) {
    return this._http.post<any>(
      `${environment.restApiHost}${endpoints.disburseAmount}`,
      payload
    );
  }

  productList(payload?: any) {
    const url = `${environment.restApiHost}${endpoints.productList}`;
    return this._http.get(url, payload);
  }

  pay(payload) {
    const url = `${environment.restApiHost}${endpoints.payment}`;
    return this._http.post(url, payload);
  }

  payStatus(resId) {
    const url = `${environment.restApiHost}${endpoints.paymentStatus}${resId}`;
    return this._http.get(url);
  }

  getTables(bid: any) {
    const url = `${environment.restApiHost}${endpoints.getTables}${bid}`;
    return this._http.get(url);
  }

  saveCart(payload: any) {
    const url = `${environment.restApiHost}${endpoints.saveOrder}`;
    return this._http.post(url, payload);
  }

  getOrder(orgId,  branchId, tableId, chairId) {
    const url = `${environment.restApiHost}${endpoints.getOrder}orgId=${orgId}&branchId=${branchId}&primaryReference=${tableId}&secondaryReference=${chairId}`;
    return this._http.get(url);
  }

  getAllOrder(orgId,  branchId) {
    const url = `${environment.restApiHost}${endpoints.getOrder}orgId=${orgId}&branchId=${branchId}`;
    return this._http.get(url);
  }

  deleteOrder(orgId,  branchId, tableId, chairId) {
    const url = `${environment.restApiHost}${endpoints.deleteOrder}orgId=${orgId}&branchId=${branchId}&primaryReference=${tableId}&secondaryReference=${chairId}`;
    return this._http.delete(url);
  }
  
}
