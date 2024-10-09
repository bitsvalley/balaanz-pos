import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { endpoints } from 'src/app/shared/resources/endPoint';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  public customerDetails: any = {};
  public transactionDetails: any = {};
  public transactionResponse: any = {};

  constructor(private _http: HttpClient) { }

  setCustomerDetails(details: any) {
    this.customerDetails = details;
  }

  setTransDetails(data: any) {
    this.transactionDetails = data;
  }

  setTransResponse(data: any) {
    this.transactionResponse = data;
  }

  setSelectedAc(data: any) {
    this.customerDetails['selectedAccount'] = data;
  }

  searchCustomer(customerId: any) {
    const url = `${environment.restApiHost}${endpoints.searchCustomer}${customerId}`;
    return this._http.get(url);
  }

  getAccountDetails(customerId: any) {
    const url = `${environment.restApiHost}${endpoints.getCutomerACInfo}${customerId}`;
    return this._http.get(url);
  }

  getCustomerTransactions(dailyAccountId: any) {
    const url = `${environment.restApiHost}${endpoints.getCustomerTransaction}${dailyAccountId}?page=0&size=5`;
    return this._http.get(url);
  }

  disburseCollect(payload:any){
    const url = `${environment.restApiHost}${endpoints.disburseAmount}`;
    return this._http.post(url, payload);
  }

  createCustomer(payload: any) {
    const url = `${environment.restApiHost}${endpoints.createCustomer}`;
    return this._http.post(url, payload);
  }

  getAgentTransactions(agentId) {
    // const headers = new HttpHeaders({ 
    //   "Content-Type": 'application/json', 
    //   "Authorization": 'Basic ' + btoa(user + ':' + pass)
    // });
    const url = `${environment.restApiHost}${endpoints.getAgentTransaction}${agentId}`;
    return this._http.get(url);
  }

  getAgentState(agentId) {
    // const headers = new HttpHeaders({ 
    //   "Content-Type": 'application/json', 
    //   "Authorization": 'Basic ' + btoa(user + ':' + pass)
    // });
    const url = `${environment.restApiHost}${endpoints.getAgentStat}${agentId}`;
    return this._http.get(url);
  }

  createDailySavingAccount(payload: any) {
    const url = `${environment.restApiHost}${endpoints.createDailySavingAccount}`;
    return this._http.post(url, payload);
  }

  getUserInfo(username: any) {
    const url = `${environment.restApiHost}${endpoints.userInfo}${username}`;
    return this._http.get(url);
  }

}
