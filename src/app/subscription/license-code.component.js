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
import { SubscriptionService } from './subscription.service';
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../services/global.service';
import { UserService } from '../services/user.service';
var LicenseCodeComponent = (function () {
    function LicenseCodeComponent(subscriptionService, toastyService, translate, userService, globalService) {
        this.subscriptionService = subscriptionService;
        this.toastyService = toastyService;
        this.translate = translate;
        this.userService = userService;
        this.globalService = globalService;
        this.backdrop = false;
        this.closeCallback = function () { };
        this.subBackdrop = false;
    }
    LicenseCodeComponent.prototype.ngOnInit = function () {
    };
    LicenseCodeComponent.prototype.showModal = function (_a) {
        var _b = _a === void 0 ? { closeCallback: function () { }, source: 'online', tabName: '' } : _a, _c = _b.closeCallback, closeCallback = _c === void 0 ? function () { } : _c, _d = _b.source, source = _d === void 0 ? 'online' : _d, _e = _b.tabName, tabName = _e === void 0 ? '' : _e;
        this.closeCallback = closeCallback;
        this.staticModal.show();
        this.gaSource = source;
        this.gaTab = tabName;
    };
    LicenseCodeComponent.prototype.activate = function (licenseCode) {
        var _this = this;
        // CVAS-1690
        this.subscriptionService.licenseCodeRedeem(licenseCode.replace(/^\s*/, '').replace(/\s*$/, ''), this.gaSource, this.gaTab).subscribe(function (res) {
            switch (res.ret) {
                case 0:
                    _this.translate.get('licenseCodeRedeemCode0').subscribe(function (msg) {
                        _this.toastyService.success(msg);
                    });
                    _this.staticModal.hide();
                    _this.callPreviewAfterSubscribed();
                    break;
                case 111009:
                    _this.translate.get('licenseCodeRedeemCode111009').subscribe(function (msg) {
                        _this.showSubModal(msg);
                    });
                    break;
                case 111010:
                    _this.translate.get('licenseCodeRedeemCode111010').subscribe(function (msg) {
                        _this.showSubModal(msg);
                    });
                    break;
                case 111011:
                    _this.translate.get('licenseCodeRedeemCode111011').subscribe(function (msg) {
                        _this.showSubModal(msg);
                    });
                    break;
                case 111012:
                    _this.translate.get('licenseCodeRedeemCode111012').subscribe(function (msg) {
                        _this.showSubModal(msg);
                    });
                    break;
                case 111013:
                    _this.translate.get('licenseCodeRedeemCode111013').subscribe(function (msg) {
                        _this.showSubModal(msg);
                    });
                    break;
                case 111014:
                    _this.translate.get('licenseCodeRedeemCode111014').subscribe(function (msg) {
                        _this.showSubModal(msg);
                    });
                    break;
                case 111015:
                    _this.translate.get('licenseCodeRedeemCode111015').subscribe(function (msg) {
                        _this.showSubModal(msg);
                    });
                    break;
                case 999999:
                default:
                    _this.translate.get('licenseCodeRedeemCode999999').subscribe(function (msg) {
                        _this.showSubModal(msg);
                    });
                    break;
            }
        }, function () {
            _this.translate.get('licenseCodeRedeemCode999999').subscribe(function (msg) {
                _this.showSubModal(msg);
            });
        });
        this.globalService.sendGaEvent('Subscribe', this.gaSource + '_activation_' + this.gaTab, '');
    };
    LicenseCodeComponent.prototype.onShow = function () {
        this.backdrop = true;
    };
    LicenseCodeComponent.prototype.onHide = function () {
        this.backdrop = false;
    };
    LicenseCodeComponent.prototype.callPreviewAfterSubscribed = function () {
        var _this = this;
        this.userService.getUserPhantomOnlineSubscription(this.globalService.currentUserToken).subscribe(function (data) {
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
    };
    LicenseCodeComponent.prototype.close = function () {
        this.staticModal.hide();
        this.closeCallback();
        this.globalService.sendGaEvent('Subscribe', this.gaSource + '_activation_cancel_' + this.gaTab, '');
    };
    LicenseCodeComponent.prototype.showSubModal = function (msg) {
        this.subMessage = msg;
        this.subModal.show();
    };
    LicenseCodeComponent.prototype.onSubShow = function () {
        this.subBackdrop = true;
    };
    LicenseCodeComponent.prototype.onSubHide = function () {
        this.subBackdrop = false;
    };
    LicenseCodeComponent.prototype.purchase = function () {
        this.subModal.hide();
        this.staticModal.hide();
        try {
            var trackingId = '';
            if (this.gaSource === 'online') {
                trackingId = 'Foxit Online Purchase ';
            }
            else {
                trackingId = 'Phantom Online Purchase ';
            }
            trackingId += this.gaTab;
            trackingId = 'trackingId=' + encodeURIComponent(trackingId);
            window.angularMainComponent.showSubscriptionNowDialog({ trackingId: trackingId, source: this.gaSource, tabName: this.gaTab });
            this.globalService.sendGaEvent('Subscribe', this.gaSource + '_purchase_' + this.gaTab, '');
        }
        catch (ex) { }
    };
    LicenseCodeComponent.prototype.hideSubModal = function () {
        this.subModal.hide();
        this.globalService.sendGaEvent('Subscribe', this.gaSource + '_purchase_cancel_' + this.gaTab, '');
    };
    __decorate([
        ViewChild('staticModal'),
        __metadata("design:type", ModalDirective)
    ], LicenseCodeComponent.prototype, "staticModal", void 0);
    __decorate([
        ViewChild('subModal'),
        __metadata("design:type", ModalDirective)
    ], LicenseCodeComponent.prototype, "subModal", void 0);
    LicenseCodeComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'license-code',
            templateUrl: './license-code.component.html',
            styleUrls: ['./license-code.component.css']
        }),
        __metadata("design:paramtypes", [SubscriptionService,
            ToastyService,
            TranslateService,
            UserService,
            GlobalService])
    ], LicenseCodeComponent);
    return LicenseCodeComponent;
}());
export { LicenseCodeComponent };
