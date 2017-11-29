import { Component } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'my-app',
  template: `
  <div>{{name}}</div>
  <button (click)="get_user_info()">GET USER INFO</button>
  `,
})
export class OrganizePagesComponent  {
  public name:string = 'OrganizePagesComponent';
  private token:string;
  constructor(
      private http: Http,
      public globalService: GlobalService
  ){
  }

  public  get_user_info(){
      //noinspection TypeScriptUnresolvedFunction
      this.http.get(this.globalService.apiUrl + 'api/auth/get_user_info?' + (new Date()).valueOf(), this.jwt())
          .map(
              (response:Response) => {
                  let data = response.json();
                  if (data.ret == 0) {
                      this.name = JSON.stringify(data)
                      console.log(data);
                      this.globalService.currentUser = data.data;
                      this.globalService.currentUserEmail = data.data.email;
                  }
                  return data;
              }
          )
          .subscribe(
          data => console.log(data),
          error => {
              console.log('error', error);
          });
  }

  private jwt() {
    // create authorization header with jwt token
    let currentToken = this.token ? this.token : this.globalService.currentUserToken;
    if (currentToken) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentToken });
      return new RequestOptions({ headers: headers });
    }
  }
}