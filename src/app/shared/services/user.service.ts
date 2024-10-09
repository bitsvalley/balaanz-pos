import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { endpoints } from 'src/app/shared/resources/endPoint';

declare const grecaptcha: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public momoToken: any = null;

  constructor(private _http: HttpClient) { }

  login(payload: Object) {
    const headers = new HttpHeaders({
      "content-type": "application/json"
    });
    const url = `${environment.host}${endpoints.login}/${environment.org}`;
    return this._http.post(url, payload, {headers});
  }

  logout(userId) {
    const url = `${environment.host}${endpoints.logout}`;
    return this._http.post(url, {userId: userId});
  }

  getToken() {
    const refreshToken = localStorage.getItem("token");
    const headers = new HttpHeaders({
      "content-type": "application/json",
      "Authorization": `${refreshToken}`,
    });
    const url = `${environment.host}${endpoints.getToken}`;
    return this._http.get(url, {headers: headers});
  }

  getUserDetails() {
    const url = `${environment.host}${endpoints.getUserDetails}`;
    return this._http.get(url );
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
      authToken: btoa(environment.paymentUser + ':' + environment.paymentPass)
    }
    return this._http.post<any>(`${environment.host}${endpoints.momoAuth}`, payload);
  }

  providerInfo(number: any) {
    // const headers = new HttpHeaders({
    //   "Content-Type": 'application/json',
    //   "Captcha-Token": `${localStorage.getItem('momoCaptcha')}`,
    //   "Authorization": `Bearer ${localStorage.getItem('momoToken')}`,
    // });
    const headers = new HttpHeaders({
      "g-token": `${localStorage.getItem('momoCaptcha')}`,
      "m-token": `Bearer ${localStorage.getItem('momoToken')}`,
    });
    //return this._http.get<any>(`${environment.momoHost}${endpoints.mobilePay}${endpoints.providerInfo}${number}`, {headers});
    return this._http.get<any>(`${environment.host}${endpoints.getProviderInfo}/${number}`, {headers});
  }

  disburse(payload: any) {
    // const headers = new HttpHeaders({
    //   "Content-Type": 'application/json',
    //   "Captcha-Token": `${localStorage.getItem('momoCaptcha')}`,
    //   "Authorization": `Bearer ${localStorage.getItem('momoToken')}`,
    // });
    const headers = new HttpHeaders({
      "g-token": `${localStorage.getItem('momoCaptcha')}`,
      "m-token": `Bearer ${localStorage.getItem('momoToken')}`,
    });
	  // return this._http.post<any>(`${environment.momoHost}${endpoints.mobilePay}${endpoints.disburse}`, payload, {headers});
    return this._http.post<any>(`${environment.host}${endpoints.momoDisburse}`, payload, {headers});
  }

  async getCaptcha() {
    // grecaptcha.enterprise.ready(async () => {
    //   return await grecaptcha.enterprise.execute(environment.captchKey, {action: 'LOGIN'});
    // });
    return grecaptcha.enterprise.execute(environment.captchKey, { action: "login" });
  }

  getRunTimeProperties() {
	  return this._http.get<any>(`${environment.host}${endpoints.runTimeProperty}${environment.org}`);
  }

  validatePin(payload: any) {
    return this._http.post<any>(`${environment.host}${endpoints.validatePin}`, payload);
  }


  disburseCollect(payload:any){
    return this._http.post<any>(`${environment.restApiHost}${endpoints.disburseAmount}`, payload);
  }


  productList(payload?: any)  {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo1MzQwLCJpYXQiOjE3MjM5NTUyODQsImV4cCI6MTcyOTk1NzA4NCwidHlwZSI6ImFjY2VzcyJ9.e0A-qTtAT1hOmf0LCV-DYS-LI5rTyhU6Vay7gHn1VCE', // Your token
       
    // });
    const url = `${environment.restApiHost}${endpoints.productList}`; 
    return this._http.get(url, payload);
  }

}
