"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var open_down_app_1 = require('../utils/open-down-app');
var global_service_1 = require('../services/global.service');
var user_service_1 = require('../services/user.service');
var MobileIndexComponent = (function () {
    function MobileIndexComponent(globalService, userService) {
        this.globalService = globalService;
        this.userService = userService;
        // 参考 header.component.ts 有充足的提升空间
        var pathname = '/m/login';
        var service = window.location.protocol + "//" + window.location.host + pathname;
        var cas_url = userService.getCasSiteUrl() + '&service=' + encodeURIComponent(service);
        this.loginUrl = cas_url;
        this.openWitch = open_down_app_1.mobileOpenWith({
            androidOpenAppUrl: phantomOnlineGlobalConfig.androidOpenAppUrl,
            androidDownAppUrl: phantomOnlineGlobalConfig.androidDownAppUrl,
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
        core_1.Component({
            moduleId: module.id,
            selector: 'mobile-index',
            templateUrl: './mobile-index.component.html',
            styleUrls: ['./mobile-index.component.css']
        }), 
        __metadata('design:paramtypes', [global_service_1.GlobalService, user_service_1.UserService])
    ], MobileIndexComponent);
    return MobileIndexComponent;
}());
exports.MobileIndexComponent = MobileIndexComponent;
