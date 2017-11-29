var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, GlobalService, SharedService, AuthenticationService } from '../../services/index';
var LoginComponent = (function () {
    function LoginComponent(userService, route, sharedService, router, authenticationService, globalService) {
        var _this = this;
        this.userService = userService;
        this.route = route;
        this.sharedService = sharedService;
        this.router = router;
        this.authenticationService = authenticationService;
        this.globalService = globalService;
        this.route
            .params
            .subscribe(function (params) {
            var token = params['token'];
            var redirectUrl = params['url'];
            var lang = params['lang'];
            // lang set
            var url = window.location.href;
            if (url.indexOf('?') > -1) {
                var paraUrl = url.split('?')[1];
                var urlObj = _this.globalService.urlParaToObj(paraUrl);
                console.log('====urlObj', urlObj);
            }
            if (urlObj) {
                if (urlObj['lang']) {
                    localStorage.setItem('currentLang', urlObj['lang']);
                }
                if (urlObj['language']) {
                    localStorage.setItem('currentLang', urlObj['language']);
                }
            }
            if (lang) {
                localStorage.setItem('currentLang', lang);
            }
            if (!token) {
                _this.router.navigateByUrl(redirectUrl);
            }
            else {
                // for CPDF-2120
                if (token.indexOf('encrypted_user=') !== -1) {
                    var encrypted_user = token.split('encrypted_user=')[1];
                    console.log('encrypted_user: ' + encrypted_user);
                    // post the encrypted_user and current user (empty for Guest) to cpdf backend to check
                    var currentUserEmail = '';
                    if (_this.globalService.currentUserEmail) {
                        currentUserEmail = _this.globalService.currentUserEmail;
                    }
                    _this.userService.decryptUser(encrypted_user, currentUserEmail).subscribe(function (data) {
                        if (data.ret == 0) {
                            var userAccessToken = data.data.token;
                            if (userAccessToken) {
                                _this.router.navigateByUrl("/login-integration/" + encodeURIComponent(redirectUrl) + '/' + userAccessToken); // succeeded to get access token for the encrypted_user
                            }
                            else {
                                _this.router.navigateByUrl(redirectUrl); // current user is logged in, and the same as encrypted_user
                            }
                        }
                        else {
                            //this.router.navigateByUrl(redirectUrl);
                            _this.error = JSON.stringify(data); // e.g., {"ret":110001,"message":"PARAMETER_IS_NOT_VALID","data":[],"returned":0}
                        }
                    }, function (error) {
                    });
                    return;
                }
                var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (token.indexOf('ST') !== -1) {
                    if (_this.globalService.currentUserEmail) {
                        window.angularHeaderComponent.signOut();
                        if (_this.globalService.useCasLogin()) {
                            return;
                        }
                    }
                    userService.getAccessTokenBySt(token).subscribe(function (data) {
                        if (data.ret != 0) {
                            _this.error = 'token error';
                            // token error.
                        }
                        else {
                            _this.error = '';
                            token = data.data[0];
                            //token = '58d0e51b44f47d94acf84a02%2Cwyd2%40qq.com';
                            userService.getCurrentInfo(token).subscribe(function (data) {
                                //noinspection TypeScriptUnresolvedVariable
                                if (data.ret != 0) {
                                    _this.error = 'ticket valid';
                                    // token error.
                                }
                                else {
                                    _this.error = '';
                                    _this.sharedService.broadcast({
                                        name: 'login-event',
                                        data: data.data
                                    });
                                    authenticationService.saveCurrentInfo(data.data.email, token, true);
                                    _this.router.navigateByUrl(redirectUrl);
                                    //this.route.n
                                }
                            }, function (error) {
                                _this.error = 'response error';
                            });
                        }
                    }, function (error) {
                        _this.error = 'response error';
                    });
                }
                else if (reg.test(token)) {
                    // terminate process for /login-integration/***/email_address?ticket=***
                    if (location.href.indexOf('ticket=ST') > 0) {
                        return;
                    }
                    // for PRO-1188
                    if (_this.globalService.currentUserEmail) {
                        if (_this.globalService.currentUserEmail == token) {
                            _this.router.navigateByUrl(redirectUrl);
                            return;
                        }
                        window.angularHeaderComponent.signOut();
                        if (_this.globalService.useCasLogin()) {
                            return;
                        }
                    }
                    _this.authenticationService.checkEmailSignUp(token)
                        .subscribe(function (data) {
                        if (data && data.ret == 0) {
                            _this.globalService.signSuccfromLoginIntergration = function () {
                                _this.router.navigateByUrl(redirectUrl);
                                _this.globalService.signSuccfromLoginIntergration = function () { };
                            };
                            if (data.user_exist) {
                                // 用户存在。
                                window.angularHeaderComponent.showSignModalFromLogin('1', token);
                            }
                            else {
                                // 用户不存在
                                window.angularHeaderComponent.showSignModalFromLogin('0', token);
                            }
                        }
                        else {
                            _this.error = 'email error';
                        }
                    }, function (error) {
                        _this.error = error;
                    });
                }
                else {
                    if (_this.globalService.currentUserEmail) {
                        window.angularHeaderComponent.signOut();
                        if (_this.globalService.useCasLogin()) {
                            return;
                        }
                    }
                    //token = '58d0e51b44f47d94acf84a02%2Cwyd2%40qq.com';
                    userService.getCurrentInfo(token).subscribe(function (data) {
                        //noinspection TypeScriptUnresolvedVariable
                        if (data.ret != 0) {
                            _this.error = 'token error';
                            // token error.
                        }
                        else {
                            _this.error = '';
                            _this.sharedService.broadcast({
                                name: 'login-event',
                                data: data.data
                            });
                            authenticationService.saveCurrentInfo(data.data.email, token, true);
                            _this.router.navigateByUrl(redirectUrl);
                            //this.route.n
                        }
                    }, function (error) {
                        _this.error = 'response error';
                    });
                }
            }
            console.log(token);
        });
    }
    LoginComponent = __decorate([
        Component({
            moduleId: module.id,
            templateUrl: './login.html',
        }),
        __metadata("design:paramtypes", [UserService,
            ActivatedRoute,
            SharedService,
            Router,
            AuthenticationService,
            GlobalService])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
