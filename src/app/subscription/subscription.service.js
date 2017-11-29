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
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalService } from '../services/global.service';
import 'rxjs/add/operator/map';
var SubscriptionService = (function () {
    function SubscriptionService(http, globalService) {
        this.http = http;
        this.globalService = globalService;
    }
    SubscriptionService.prototype.licenseCodeRedeem = function (licenseCode, source, tabName) {
        //return this.http.post(this.globalService.apiUrl + 'api-appstore/redeem_phantom_subscription', {
        //  'access-token': this.globalService.currentUserToken,
        //  license_code: licenseCode
        //}).map((res: Response) => {
        //  return res.json();
        //})
        var gaParam = '';
        var gaValue = '';
        if (tabName) {
            gaParam += '&trackingId=';
            if (source === 'online') {
                gaValue += 'Foxit Online Redeem ';
            }
            else {
                gaValue += 'Phantom Online Redeem ';
            }
            gaValue += tabName;
            gaParam += encodeURIComponent(gaValue);
        }
        return this.http.get(this.globalService.apiUrl + 'api/appstore/redeem-phantom-subscription?access-token='
            + this.globalService.currentUserToken
            + '&license_code=' + encodeURIComponent(licenseCode)
            + gaParam).map(function (res) {
            return res.json();
        });
    };
    SubscriptionService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, GlobalService])
    ], SubscriptionService);
    return SubscriptionService;
}());
export { SubscriptionService };
