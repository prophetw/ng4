var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Output } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';
var WebtoolNetdrive = (function () {
    function WebtoolNetdrive(http, sanitizer) {
        this.http = http;
        this.sanitizer = sanitizer;
        this.listSrc = this.sanitizer.bypassSecurityTrustResourceUrl("");
        this.selectDrive = new EventEmitter();
    }
    WebtoolNetdrive.prototype.ngOnInit = function () {
        this._getNetDriveMenu();
    };
    WebtoolNetdrive.prototype.opendrive = function (event, drive) {
        var drivePackage = [event, drive];
        this.selectDrive.emit(drivePackage);
    };
    WebtoolNetdrive.prototype._getNetDriveMenu = function () {
        var _this = this;
        //
        var _target = window.location.protocol + "//" + window.location.host + "/netdrive/success.html";
        var url = phantomOnlineGlobalConfig.cloudApiUrl + 'site-info/list-all-storage?app_id=FoxitWebReader&backurl=' + _target;
        this.listSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.http.get(url)
            .map(function (response) {
            var data = response.json();
            return data;
        })
            .subscribe(function (data) {
            console.log(data);
            if (data.all_storage) {
                _this.netDrives = data.all_storage;
            }
        }, function (error) {
            console.log('error', error);
        });
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], WebtoolNetdrive.prototype, "selectDrive", void 0);
    WebtoolNetdrive = __decorate([
        Component({
            moduleId: module.id,
            selector: 'webtool-netdrive',
            templateUrl: './webtool.netdrive.html',
            styleUrls: ['./webtool.netdrive.css']
        }),
        __metadata("design:paramtypes", [Http, DomSanitizer])
    ], WebtoolNetdrive);
    return WebtoolNetdrive;
}());
export { WebtoolNetdrive };
