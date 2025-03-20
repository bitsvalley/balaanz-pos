import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { endpoints } from '../configs/end-point';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }
  
  login(payload: Object) {
    const headers = new HttpHeaders({
      "content-type": "application/json"
    });
    const url = `${environment.host}${endpoints.login}/${environment.org}`;
    return this._http.post(url, payload, {headers});
  }
}
