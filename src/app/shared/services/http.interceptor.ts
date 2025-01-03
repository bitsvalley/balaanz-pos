import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { GlobalService } from 'src/app/shared/services/global.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AccountService } from 'src/app/shared/services/account.service';

@Injectable()
export class HttpInterceptorClass implements HttpInterceptor {

  constructor(private _global: GlobalService, private _user: UserService, private _account: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if(request.url.search('getAccessToken') == -1 && request.url.search('login') == -1 && request.url.search('logout') == -1 && request.url.search('token') == -1 && request.url.search('client') == -1 && request.url.search('api') == -1) {
        let token = this._global.token;
        if (token) {
            request = request.clone({
                setHeaders: { 
                    "Authorization": `${token}`,
                    "Content-Type": "application/json"
                }
            });
            return next.handle(request);
        } else {
            let requstApi: HttpRequest<any> = request;
            if (localStorage.getItem('token')) {
              return this._user.getToken().pipe(mergeMap((response: any) => {
                // Set Token For Other Service
                this._global.token = response.token.access.token;
                // localStorage.setItem('refreshToken', response.refresh.token);

                // Call Actual Api
                token = response.token.access.token;
                requstApi = request.clone({
                    setHeaders: { 
                        "Authorization": `${token}`,
                        "Content-Type": "application/json"
                    }
                });
                return next.handle(requstApi);
              }), catchError(() => {
                this._global.setLoader(false);
                this._account.logout();
                return throwError(() => new Error('Failed to retrieve token. Please try again.'));
              }));
            } else {
              requstApi = request.clone({
                setHeaders: { 
                    "Content-Type": "application/json"
                }
              });
              return next.handle(requstApi);
            }
        }
    } else if (request.url.search('api') > 0) {
      let requstApi: HttpRequest<any> = request;
      // Call Actual Api
      let token = localStorage.getItem('token');
      requstApi = request.clone({
          setHeaders: { 
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      });
      return next.handle(requstApi);
    } else {
      return next.handle(request);
    }
  }
}
