var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by linc on 2017/9/20.
 */
import { Component, NgZone, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService } from '../services/global.service';
import { UserService } from '../services/user.service';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';
import { device } from './../utils/device';
var SubscriptionNowComponent = (function () {
    function SubscriptionNowComponent(sanitizer, globalService, zone, userService, toastyService, translate) {
        this.sanitizer = sanitizer;
        this.globalService = globalService;
        this.zone = zone;
        this.userService = userService;
        this.toastyService = toastyService;
        this.translate = translate;
        this.backdrop = false;
        this.closeCallback = function () { };
    }
    SubscriptionNowComponent.prototype.ngOnInit = function () {
    };
    SubscriptionNowComponent.prototype.showModal = function (_a) {
        var _this = this;
        var _b = _a === void 0 ? { closeCallback: function () { }, trackingId: '', source: 'online', tabName: '' } : _a, _c = _b.closeCallback, closeCallback = _c === void 0 ? function () { } : _c, _d = _b.trackingId, trackingId = _d === void 0 ? '' : _d, _e = _b.source, source = _e === void 0 ? 'online' : _e, _f = _b.tabName, tabName = _f === void 0 ? '' : _f;
        this.closeCallback = closeCallback;
        var cid = '__subscription_callback__';
        window[cid] = function (params) {
            _this.zone.runOutsideAngular(function () {
                var isManuallyBack = (params.is_manually_back === 'true');
                delete window[cid];
                _this.zone.run(function () {
                    _this.staticModal.hide();
                    if (isManuallyBack) {
                        try {
                            window.angularMainComponent.showSubscriptionDialog({ source: source, tabName: tabName });
                        }
                        catch (ex) { }
                        return;
                    }
                    _this.translate.get('subscriptionSuccessTip').subscribe(function (msg) {
                        _this.toastyService.success(msg);
                    });
                    _this.userService.getUserPhantomOnlineSubscription(_this.globalService.currentUserToken).subscribe(function (data) {
                        if (data.ret == 0) {
                            // 2. save data:
                            _this.userService.userPhantomOnlineSubscription = data.data;
                            try {
                                var iframe = document.getElementById('preview-frame');
                                iframe.contentWindow.WebPDF.afterSubscribed();
                            }
                            catch (ex) { }
                        }
                    }, function (error) {
                    });
                });
            });
        };
        var locationHref = location.href;
        var osName = device.osName();
        if (osName == "unknown")
            osName = 'foxitonline';
        var returnUrl = locationHref.slice(0, locationHref.lastIndexOf(location.pathname)) + '/assets/url-callback.html?cid=' + cid;
        var url = this.globalService.apiUrl + 'appstore/multiple-apps?app_code_list=phantom_ga_business%2Cphantom_ga_standard%2Cphantom_ga_education'
            + '&majorVersion='
            + '&minorVersion='
            + '&lang=' + this.globalService.getLanguage()
            + '&osName=' + osName
            + '&osPlatform='
            + '&deviceType='
            + '&deviceDetail='
            + '&access_token=' + (this.globalService.currentUserToken || '')
            + '&return=' + encodeURIComponent(returnUrl);
        if (!trackingId) {
            trackingId = encodeURIComponent('Foxit Online default');
        }
        url += ('&' + trackingId);
        this.subscriptionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.staticModal.show();
    };
    SubscriptionNowComponent.prototype.onShow = function () {
        this.backdrop = true;
    };
    SubscriptionNowComponent.prototype.onHide = function () {
        this.backdrop = false;
        window.angularMainComponent.doCheckUserSubscription();
    };
    SubscriptionNowComponent.prototype.close = function () {
        this.staticModal.hide();
        this.closeCallback();
    };
    __decorate([
        ViewChild('staticModal'),
        __metadata("design:type", ModalDirective)
    ], SubscriptionNowComponent.prototype, "staticModal", void 0);
    SubscriptionNowComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'subscription-now',
            templateUrl: './subscription-now.component.html',
            styleUrls: ['./subscription-now.component.css']
        }),
        __metadata("design:paramtypes", [DomSanitizer,
            GlobalService,
            NgZone,
            UserService,
            ToastyService,
            TranslateService])
    ], SubscriptionNowComponent);
    return SubscriptionNowComponent;
}());
export { SubscriptionNowComponent };
