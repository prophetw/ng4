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
import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { GlobalService } from '../services/global.service';
import { UserService } from '../services/user.service';
var SubscriptionComponent = (function () {
    function SubscriptionComponent(globalService, userService) {
        this.globalService = globalService;
        this.userService = userService;
        this.backdrop = false;
        this.closeCallback = function () { };
    }
    SubscriptionComponent.prototype.ngOnInit = function () {
    };
    SubscriptionComponent.prototype.showModal = function (_a) {
        var _b = _a === void 0 ? { closeCallback: function () { }, source: 'online', tabName: '' } : _a, _c = _b.closeCallback, closeCallback = _c === void 0 ? function () { } : _c, _d = _b.source, source = _d === void 0 ? 'online' : _d, _e = _b.tabName, tabName = _e === void 0 ? '' : _e;
        this.closeCallback = closeCallback;
        this.staticModal.show();
        this.gaSource = source;
        this.gaTab = tabName;
    };
    SubscriptionComponent.prototype.subscribeNow = function () {
        if (!this.globalService.currentUserToken) {
            // PRO-3825  未登录
            // 参考 sign.component.ts showSignInModal
            var pathname = window.location.pathname + '?open-subscription-now-dialog=true&f=' + (this.gaSource === 'online' ? '0' : '1');
            var service = window.location.protocol + "//" + window.location.host + "/redirect-to-cas/" + encodeURIComponent(pathname);
            var cas_url = this.userService.getCasSiteUrl() + '&service=' + encodeURIComponent(service);
            location.href = cas_url;
            return;
        }
        this.staticModal.hide();
        try {
            var trackingId = '';
            if (this.gaSource === 'online') {
                trackingId = 'Foxit Online Subscribe ';
            }
            else {
                trackingId = 'Phantom Online Subscribe ';
            }
            trackingId += this.gaTab;
            trackingId = 'trackingId=' + encodeURIComponent(trackingId);
            window.angularMainComponent.showSubscriptionNowDialog({ trackingId: trackingId, source: this.gaSource, tabName: this.gaTab });
            this.globalService.sendGaEvent('Subscribe', this.gaSource + '_subscribe_now_' + this.gaTab, '');
        }
        catch (ex) { }
    };
    SubscriptionComponent.prototype.showActivateLicenseCodeDialog = function () {
        var _this = this;
        if (!this.globalService.currentUserToken) {
            // PRO-4629  未登录
            // 参考 sign.component.ts showSignInModal
            var pathname = window.location.pathname + '?open-activate-license-dialog=true&f=' + (this.gaSource === 'online' ? '0' : '1');
            var service = window.location.protocol + "//" + window.location.host + "/redirect-to-cas/" + encodeURIComponent(pathname);
            var cas_url = this.userService.getCasSiteUrl() + '&service=' + encodeURIComponent(service);
            location.href = cas_url;
            return;
        }
        this.staticModal.hide();
        try {
            window.angularMainComponent.showActivateLicenseCodeDialog({
                source: this.gaSource,
                tabName: this.gaTab,
                closeCallback: function () {
                    _this.staticModal.show();
                }
            });
            this.globalService.sendGaEvent('Subscribe', this.gaSource + '_redeem_' + this.gaTab, '');
        }
        catch (ex) { }
    };
    SubscriptionComponent.prototype.onShow = function () {
        this.backdrop = true;
    };
    SubscriptionComponent.prototype.onHide = function () {
        this.backdrop = false;
    };
    SubscriptionComponent.prototype.close = function () {
        this.staticModal.hide();
        this.closeCallback();
    };
    __decorate([
        ViewChild('staticModal'),
        __metadata("design:type", ModalDirective)
    ], SubscriptionComponent.prototype, "staticModal", void 0);
    SubscriptionComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'subscription',
            templateUrl: './subscription.component.html',
            styleUrls: ['./subscription.component.css']
        }),
        __metadata("design:paramtypes", [GlobalService, UserService])
    ], SubscriptionComponent);
    return SubscriptionComponent;
}());
export { SubscriptionComponent };
