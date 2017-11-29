import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { GlobalService } from "./global.service";
import { SharedService } from "./shared.service";
import { UserService } from "./user.service";
import { CookieService } from 'angular2-cookie/core';
//import 'rxjs/add/operator/mergeMap';
//import myGlobals = require('../globals');
//declare var gapi: any;
declare var $:any;
@Injectable()
export class AuthenticationService {
    constructor(
        private http: Http,
        private sharedService: SharedService,
        private cookieService: CookieService,
        private userService:UserService,
        private globalService: GlobalService
    ) { }
    login(email: string, password: string, rememberMe: boolean) {
        if (!this.globalService.useCasLogin()) {
            return this.http.post(this.globalService.apiUrl + 'api/auth/access_token?' + (new Date()).valueOf(), { email: email, password: password })
              .map((response: Response) => {
                  // login successful if there's a jwt token in the response
                  let user = response.json();
                  if (user && user.ret == 0) {
                      this.saveCurrentInfo(email, user.data.access_token, rememberMe);
                  }
                  return user;
              });
        }

      // will NOT go to here anymore, because now we use cas login page not our own login page.
      /*
      var casUrl = this.userService.getCasApiUrl();
        console.log("casUrl " + casUrl);
        var body = "service="+encodeURIComponent(this.userService.getServiceForCas())+"&username="+encodeURIComponent(email)+"&password="+encodeURIComponent(password)+"&rememberMe="+(rememberMe ? "true":"false");
        //console.log("body " + body);

        return this.http.post(casUrl, body)
          .map((response: Response) => {

              let ticket = response.text();
              console.log("casTicket " + ticket);

              return ticket;
          }).flatMap( (ticket) => this.http.get(this.userService.getApiUrl_4_access_token_by_st(ticket, this.userService.getServiceForCas())).map((response:Response) => {
              let data = response.json();
              console.log('access-token-by-st, data: ');
              console.log(data);
              if (data && data.ret == 0) {
                  this.saveCurrentInfo(email, data.data[0], rememberMe);
                  return {
                      "ret": 0,
                      "data": {
                          "access_token": data.data[0],
                          "foxit_session": "",
                          "expire_date": 0
                      }
                  };
              } else {
                  return {
                      "ret": -1
                  };
              }
            }
          ));
      */

    }
    googleLogin (token: string, rememberMe: boolean) {
        //noinspection TypeScriptUnresolvedFunction
        return this.http.get(this.globalService.apiUrl + 'api/auth/google_access_token?token='+ token + '&' + (new Date()).valueOf())
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.ret == 0) {
                    this.saveCurrentInfo(user.data.email, user.data.access_token, rememberMe);
                }
                return user;
            });
    }
    signUp(email:string, password:string) {
        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(this.globalService.apiUrl + 'api/auth/signup?' + (new Date()).valueOf()+'&lang='+this.globalService.getLanguage(), { email: email, password: password, from: 'PRO' })
        .map((response:Response) => {
            let user = response.json();
            if (user && user.ret == 0) {
                this.saveCurrentInfo(email, user.data.access_token, true);
            }
            return user;
        });
    }
    checkEmailSignUp(email:string) {
        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(this.globalService.apiUrl + 'api/auth/check_email?' + (new Date()).valueOf(), { email: email})
					.map((response:Response) => {
              let data = response.json();
              return data;
          });
    }
    signOut() {
        // remove user from local storage to log user out
        localStorage.removeItem('userInfo');
        this.cookieService.remove('currentEmail');
        this.cookieService.remove('currentToken');
        this.cookieService.remove('token_cookie_expire');

        this.globalService.currentUser = null;
        this.globalService.currentUserToken = null; // fix bug PRO-1281, main.ts checked globalService.currentUserToken
        this.globalService.currentUserEmail = '';
        //if(gapi.auth2){
        //    gapi.auth2.getAuthInstance().signOut();
        //}
        //this.sharedService.broadcast({
        //    name: 'logout-event'
        //});

    }

    saveCurrentInfo(email:string, token:string, rememberMe:boolean) {
        this.globalService.currentUserEmail = email;
        this.globalService.currentUserToken = token;
        var today = new Date();
        if(rememberMe){
            var ms:number = today.getTime()+31 * 24 * 3600 * 1000;
            var expireDate = new Date(ms);
            var option = {
                expires: expireDate
            };
            this.cookieService.put('token_cookie_expire', ms.toString(), option);
        }

        this.cookieService.put('currentToken', token, option ? option : null);
        this.cookieService.put('currentEmail', email, option ? option : null);
    }



  login_by_ticket (ticket:string, service:string){
    return this.http.get(this.userService.getApiUrl_4_access_token_by_st(ticket, service)).map((response:Response) => {
          let data = response.json();
          console.log('access-token-by-st, data: ');
          console.log(data);

          if (data && data.ret == 0) {
            var refreshed_token:string = data.data[0]; // success
            console.log("refreshed_token " + refreshed_token);
          } else {
            var refreshed_token:string = ''; // failed
          }

          return refreshed_token;
        }
      ).flatMap( (token) => this.http.get(this.userService.getApiUrl_4_get_user_info(token)).map((response:Response) => {
          let data = response.json();
          console.log('user info, data: ');
          console.log(data);

          if (data.ret == 0) {
            this.sharedService.broadcast({
              name: 'login-event',
              data: data.data
            });

            // update the token to cookie
            var cookie_currentToken:string = this.cookieService.get('currentToken');
            if (cookie_currentToken) {
              var option:any = null;
              var cookie_token_cookie_expire:string = this.cookieService.get('token_cookie_expire');
              if (cookie_token_cookie_expire) {
                var expireDate = new Date(parseInt(cookie_token_cookie_expire));
                option = {
                  expires: expireDate
                };
              }

              this.cookieService.put('currentToken', token, option);
              this.globalService.currentUserEmail = data.data.email;
              this.globalService.currentUserToken = token;
            } else {
              this.saveCurrentInfo(data.data.email, token, true);
            }

            return {
              "ret": 0,
              "data": {
                "access_token": token,
                "foxit_session": "",
                "expire_date": 0
              }
            };
          } else {
            return {
              "ret": -1
            };
          }
        }
      ));

  }
}