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
import { Component } from '@angular/core';
var SubscriptionAdComponent = (function () {
    function SubscriptionAdComponent() {
        this.position = {};
    }
    SubscriptionAdComponent.prototype.ngOnInit = function () {
    };
    SubscriptionAdComponent.prototype.mouseenter = function () {
        clearTimeout(this.willShowTimer);
        this.in = false;
        //clearTimeout(this.leaveTimer);
        //this.hover = true;
    };
    SubscriptionAdComponent.prototype.mouseleave = function () {
        clearTimeout(this.willShowTimer);
        this.in = false;
        //this.leaveTimer = setTimeout(() => {
        //  this.hover = false;
        //}, 500);
    };
    SubscriptionAdComponent.prototype.show = function (position) {
        var _this = this;
        //clearTimeout(this.willHideTimer);
        this.position = position;
        //this.in = true;
        this.willShowTimer = setTimeout(function () {
            _this.in = true;
        }, 1500);
    };
    SubscriptionAdComponent.prototype.willHide = function () {
        //this.willHideTimer = setTimeout(() => {
        //  this.in = false;
        //}, 500);
        clearTimeout(this.willShowTimer);
        this.in = false;
    };
    SubscriptionAdComponent.prototype.showSubscriptionDialog = function () {
        this.in = false;
        this.hover = false;
        try {
            window.angularMainComponent.showSubscriptionDialog({ source: 'online', tabName: 'right' });
        }
        catch (ex) { }
    };
    SubscriptionAdComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'subscription-ad',
            templateUrl: './subscription-ad.component.html',
            styleUrls: ['./subscription-ad.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], SubscriptionAdComponent);
    return SubscriptionAdComponent;
}());
export { SubscriptionAdComponent };
