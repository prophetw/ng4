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
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../services/index';
import { SharedService } from "../../services/shared.service";
import { UserService } from '../../services/user.service';
var LeftAsideComponent = (function () {
    function LeftAsideComponent(globalService, translate, sharedService, userService) {
        var _this = this;
        this.globalService = globalService;
        this.translate = translate;
        this.sharedService = sharedService;
        this.userService = userService;
        this.adsIsShow = true;
        this.chinaArea = false;
        this.isMobile = false;
        this.chinaArea = this.translate.getBrowserLang() === 'zh'; // e.g., en
        console.log('====chinaArea====');
        console.log(this.chinaArea);
        this.sharedService.on('change-language', function (event) {
            _this.chinaArea = _this.translate.getBrowserLang() === 'zh'; // e.g., en
        });
        $('.left-aside').click(function () {
            window.angularHeaderComponent.clearFoxitDriveSelection();
        });
    }
    LeftAsideComponent.prototype.closeAds = function () {
        this.adsIsShow = false;
    };
    LeftAsideComponent.prototype.openAds = function (trackId) {
        this.globalService.openAds(trackId);
    };
    LeftAsideComponent.prototype.showSubscriptionDialog = function () {
        try {
            window.angularMainComponent.showSubscriptionDialog({ source: 'online', tabName: 'left' });
            this.globalService.sendGaEvent('Subscribe', 'online_subscribe_left', '');
        }
        catch (ex) { }
    };
    LeftAsideComponent.prototype.doDownloadPhantomPDFClient = function () {
        try {
            window.angularMainComponent.doDownloadPhantomPDFClient();
            var date = new Date().toISOString(); // "2017-11-22T09:34:29.546Z"
            var eventCategory = "Desktop Promotion";
            var eventAction = this.globalService.currentUserEmail + "_"
                + "download" + "_"
                + date + "_"
                + "FOLeft";
            var eventLabel = "";
            this.globalService.sendGaEvent(eventCategory, eventAction, eventLabel);
        }
        catch (ex) { }
    };
    LeftAsideComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'left-aside',
            templateUrl: "./left-aside.html",
            styleUrls: ['./left-aside.css']
        }),
        __metadata("design:paramtypes", [GlobalService,
            TranslateService,
            SharedService,
            UserService])
    ], LeftAsideComponent);
    return LeftAsideComponent;
}());
export { LeftAsideComponent };
