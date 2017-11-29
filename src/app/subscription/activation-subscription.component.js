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
 * Created by linc on 2017/9/19.
 */
import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { UserService } from '../services/user.service';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
var ActivationSubscriptionComponent = (function () {
    function ActivationSubscriptionComponent(user, globalService, router) {
        this.user = user;
        this.globalService = globalService;
        this.router = router;
        this.backdrop = false;
        this.gaSource = /^\/phantompdf(\?|$)/.test(this.router.url) ? 'phantompdf' : 'online';
        var userPhantomOnlineSubscription = user.userPhantomOnlineSubscription;
        if (userPhantomOnlineSubscription.phantom_online_trial_start_timestamp === userPhantomOnlineSubscription.current_timestamp) {
            this.subscribeTimeType = 0; // 刚刚订阅
        }
        else if (userPhantomOnlineSubscription.remain_days <= 0) {
            this.subscribeTimeType = 3; // 订阅过期
        }
        else if (userPhantomOnlineSubscription.remain_days <= 3) {
            this.subscribeTimeType = 2; // 订阅即将过期
        }
        else {
            this.subscribeTimeType = 1; // 正常订阅期间
        }
    }
    ActivationSubscriptionComponent.prototype.ngOnInit = function () {
    };
    ActivationSubscriptionComponent.prototype.showModal = function () {
        this.staticModal.show();
    };
    ActivationSubscriptionComponent.prototype.onShow = function () {
        this.backdrop = true;
    };
    ActivationSubscriptionComponent.prototype.onHide = function () {
        this.backdrop = false;
    };
    ActivationSubscriptionComponent.prototype.showSubscriptionDialog = function () {
        var _this = this;
        this.staticModal.hide();
        try {
            window.angularMainComponent.showSubscriptionDialog({
                source: this.gaSource,
                tabName: 'center',
                closeCallback: function () {
                    _this.staticModal.show();
                }
            });
            this.globalService.sendGaEvent('Subscribe', this.gaSource + '_subscribe_center', '');
        }
        catch (ex) { }
    };
    ActivationSubscriptionComponent.prototype.showActivateLicenseCodeDialog = function () {
        var _this = this;
        this.staticModal.hide();
        try {
            window.angularMainComponent.showActivateLicenseCodeDialog({
                source: this.gaSource,
                tabName: 'center',
                closeCallback: function () {
                    _this.staticModal.show();
                }
            });
            this.globalService.sendGaEvent('Subscribe', this.gaSource + '_activation_center', '');
        }
        catch (ex) { }
    };
    ActivationSubscriptionComponent.prototype.closeModal = function () {
        this.staticModal.hide();
        this.globalService.sendGaEvent('Subscribe', this.gaSource + '_trial_center', '');
    };
    __decorate([
        ViewChild('staticModal'),
        __metadata("design:type", ModalDirective)
    ], ActivationSubscriptionComponent.prototype, "staticModal", void 0);
    ActivationSubscriptionComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'activation-subscription',
            templateUrl: './activation-subscription.component.html',
            styleUrls: ['./activation-subscription.component.css']
        }),
        __metadata("design:paramtypes", [UserService, GlobalService, Router])
    ], ActivationSubscriptionComponent);
    return ActivationSubscriptionComponent;
}());
export { ActivationSubscriptionComponent };
