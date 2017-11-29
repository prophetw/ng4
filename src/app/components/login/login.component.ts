import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UserService, GlobalService, SharedService, AuthenticationService} from '../../services/index';
import { PageHeaderComponent } from '../header/header.component';

declare var window: any;

@Component({
    moduleId: module.id,
    templateUrl: './login.html',
})
export class LoginComponent {
    public error:string;
    public constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private sharedService: SharedService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private globalService: GlobalService
    ){
        this.route
            .params
            .subscribe(params => {
                var token:string = params['token'];
                var redirectUrl = params['url'];
                var lang = params['lang'];
                // lang set
                var url:any = window.location.href;
                if(url.indexOf('?')>-1){
                    var paraUrl=url.split('?')[1];
                    var urlObj:any = this.globalService.urlParaToObj(paraUrl);
                    console.log('====urlObj',urlObj);
                }
                if(urlObj ){
                    if(urlObj['lang']){
                        localStorage.setItem('currentLang',urlObj['lang']);
                    }
                    if(urlObj['language']){
                        localStorage.setItem('currentLang',urlObj['language']);
                    }
                }
                if(lang){
                    localStorage.setItem('currentLang',lang);
                }
                if (!token){
                  this.router.navigateByUrl(redirectUrl);
                }else{

                  // for CPDF-2120
                  if(token.indexOf('encrypted_user=') !== -1){ // token: encrypted_user=the_encrypted_user_info

                    var encrypted_user:string = token.split('encrypted_user=')[1];
                    console.log('encrypted_user: ' + encrypted_user);

                    // post the encrypted_user and current user (empty for Guest) to cpdf backend to check
                    var currentUserEmail:string = '';
                    if (this.globalService.currentUserEmail) {
                      currentUserEmail = this.globalService.currentUserEmail;
                    }
                    this.userService.decryptUser(encrypted_user, currentUserEmail).subscribe(
                      data => {
                        if (data.ret == 0) {
                          var userAccessToken = data.data.token;
                          if (userAccessToken) {
                            this.router.navigateByUrl("/login-integration/" + encodeURIComponent(redirectUrl) + '/' + userAccessToken); // succeeded to get access token for the encrypted_user
                          } else {
                            this.router.navigateByUrl(redirectUrl); // current user is logged in, and the same as encrypted_user
                          }
                        } else {
                          //this.router.navigateByUrl(redirectUrl);
                          this.error = JSON.stringify(data); // e.g., {"ret":110001,"message":"PARAMETER_IS_NOT_VALID","data":[],"returned":0}
                        }
                      },
                      error => {
                      }
                    );

                    return;
                  }


                  var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

                  if(token.indexOf('ST') !== -1){

                    if (this.globalService.currentUserEmail) {
                      window.angularHeaderComponent.signOut();
                      if (this.globalService.useCasLogin()) {
                        return;
                      }
                    }

                    userService.getAccessTokenBySt(token).subscribe(
                      data => {

                        if (data.ret != 0) {
                          this.error = 'token error';
                          // token error.
                        }else{
                          this.error = '';
                          token = data.data[0]
                          //token = '58d0e51b44f47d94acf84a02%2Cwyd2%40qq.com';
                          userService.getCurrentInfo(token).subscribe(
                            data => {
                              //noinspection TypeScriptUnresolvedVariable
                              if (data.ret != 0) {
                                this.error = 'ticket valid';
                                // token error.
                              } else {
                                this.error = '';
                                this.sharedService.broadcast({
                                  name: 'login-event',
                                  data: data.data
                                });
                                authenticationService.saveCurrentInfo(data.data.email, token, true);
                                this.router.navigateByUrl(redirectUrl);
                                //this.route.n
                              }
                            },
                            error => {
                              this.error = 'response error';
                            }
                          );
                        }
                      },
                      error => {
                        this.error = 'response error';
                      }
                    );
                  }else if(reg.test(token)){

                    // terminate process for /login-integration/***/email_address?ticket=***
                    if (location.href.indexOf('ticket=ST') > 0) {
                      return;
                    }

                    // for PRO-1188
                    if (this.globalService.currentUserEmail) {
                      if (this.globalService.currentUserEmail == token) {
                        this.router.navigateByUrl(redirectUrl);
                        return;
                      }
                      window.angularHeaderComponent.signOut();
                      if (this.globalService.useCasLogin()) {
                        return;
                      }
                    }

                    this.authenticationService.checkEmailSignUp(token)
		                  .subscribe(
                        data => {
                          if (data && data.ret == 0){
                            this.globalService.signSuccfromLoginIntergration= () => {
                              this.router.navigateByUrl(redirectUrl);
                              this.globalService.signSuccfromLoginIntergration = function(){};
                            };

                            if (data.user_exist){
                              // 用户存在。
                              window.angularHeaderComponent.showSignModalFromLogin('1',token);
                            }else{
                              // 用户不存在
                              window.angularHeaderComponent.showSignModalFromLogin('0',token);
                            }
                          }else{
                            this.error = 'email error';
                          }
                        },
                        error => {
                          this.error = error;
                        });
                  }
                  else{
                    if (this.globalService.currentUserEmail) {
                      window.angularHeaderComponent.signOut();
                      if (this.globalService.useCasLogin()) {
                        return;
                      }
                    }

                    //token = '58d0e51b44f47d94acf84a02%2Cwyd2%40qq.com';
                    userService.getCurrentInfo(token).subscribe(
                      data => {
                        //noinspection TypeScriptUnresolvedVariable
                        if (data.ret != 0) {
                          this.error = 'token error';
                          // token error.
                        } else {
                          this.error = '';
                          this.sharedService.broadcast({
                            name: 'login-event',
                            data: data.data
                          });
                          authenticationService.saveCurrentInfo(data.data.email, token, true);
                          this.router.navigateByUrl(redirectUrl);
                          //this.route.n
                        }
                      },
                      error => {
                        this.error = 'response error';
                      }
                    );
                  }
                }

                console.log(token);
            });
    }
}
