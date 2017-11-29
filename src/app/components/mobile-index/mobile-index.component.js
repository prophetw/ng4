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
import { GlobalService } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { mobileOpenWith } from '../../utils/open-down-app';
var MobileIndexComponent = (function () {
    function MobileIndexComponent(globalService, userService) {
        this.globalService = globalService;
        this.userService = userService;
        // 参考 header.component.ts 有充足的提升空间, sign.component.ts showSignInModal
        //let pathname: string = '/m/login';
        var pathname = '/foxit-drive';
        var service = window.location.protocol + "//" + window.location.host + '/redirect-to-cas/' + encodeURIComponent(pathname);
        var cas_url = userService.getCasSiteUrl() + '&service=' + encodeURIComponent(service);
        this.loginUrl = cas_url;
        this.globalService.showHeader = false;
        var androidDownAppUrl;
        // 中国区和美国，安卓下载地址不同
        var hostname = location.hostname;
        if (/(-cn\.)|(\.cn$)/.test(hostname)) {
            androidDownAppUrl = phantomOnlineGlobalConfig.androidChinaDownAppUrl;
        }
        else {
            androidDownAppUrl = phantomOnlineGlobalConfig.androidDownAppUrl;
        }
        this.openWitch = mobileOpenWith({
            androidOpenAppUrl: phantomOnlineGlobalConfig.androidOpenAppUrl,
            androidDownAppUrl: androidDownAppUrl,
            iosOpenAppUrl: phantomOnlineGlobalConfig.iosOpenAppUrl,
            iosDownAppUrl: phantomOnlineGlobalConfig.iosDownAppUrl,
            uwpDownAppUrl: phantomOnlineGlobalConfig.uwpDownAppUrl,
            otherUrl: this.loginUrl
        });
    }
    MobileIndexComponent.prototype.ngOnInit = function () {
    };
    MobileIndexComponent.prototype.open = function () {
        this.openWitch();
    };
    MobileIndexComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'mobile-index',
            templateUrl: './mobile-index.component.html',
            styleUrls: ['./mobile-index.component.css']
        }),
        __metadata("design:paramtypes", [GlobalService, UserService])
    ], MobileIndexComponent);
    return MobileIndexComponent;
}());
export { MobileIndexComponent };
