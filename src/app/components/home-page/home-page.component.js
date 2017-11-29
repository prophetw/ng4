var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { GlobalService } from "../../services/global.service";
import { SignFormComponent } from "../../components/modals/sign-form/sign.component";
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
var HomePageComponent = (function () {
    function HomePageComponent(globalService, sharedService, route, router) {
        this.globalService = globalService;
        this.sharedService = sharedService;
        this.route = route;
        this.router = router;
        this.hideSignUp = false;
        if (this.globalService.isMobile) {
            if (this.globalService.currentUserEmail) {
                this.router.navigateByUrl('foxit-drive');
            }
            else {
                this.router.navigateByUrl('mobile-index');
            }
            return;
        }
        //隐藏页面不需要的部分
        this.globalService.showAside = false;
        this.globalService.isCloudReading = false;
        this.globalService.isHomePage = true;
        //this.globalService.showHeader = false;
        //this.hideSignUp = this.globalService.hideSignUp;
        function adjustSize() {
            var MaxHeight = 0, MaxWidth = 0;
            $('.app-brief .text-container').each(function (index, target) {
                $(target).height('auto');
                $(target).width('auto');
                MaxHeight = $(target).height() > MaxHeight ? $(target).height() : MaxHeight;
                MaxWidth = $(target).width() > MaxWidth ? $(target).width() : MaxWidth;
            });
            $('.app-brief .text-container').each(function (index, target) {
                $(target).height(MaxHeight);
            });
        }
        $(document).ready(function () {
            if (timer) {
                window.clearTimeout(timer);
            }
            else {
                var timer = window.setTimeout(function () {
                    adjustSize();
                }, 200);
            }
        });
        window.onresize = function () {
            if (timer) {
                window.clearTimeout(timer);
            }
            else {
                var timer = window.setTimeout(function () {
                    adjustSize();
                }, 200);
            }
        };
    }
    HomePageComponent.prototype.goTo = function (router) {
        // 暂时 appstore 没有合并过来 合并过来 下面的 app-store 代码可以删除
        if (router === 'app-store') {
            window.open('https://cloud.connectedpdf.com/appstore/app-list');
        }
        else if (router === 'site') {
            var siteUrl = this.globalService.getSiteUrl();
            window.open(siteUrl);
        }
        else if (router === 'privacy') {
            var privacyUrl = this.globalService.getPrivacyUrl();
            window.open(privacyUrl);
        }
        else {
            this.router.navigate([router]);
        }
    };
    HomePageComponent.prototype.openLinkInNewTab = function (toolName) {
    };
    HomePageComponent.prototype.showSignInModal = function () {
        this.sharedService.broadcast({
            name: 'showSignInModal'
        });
    };
    HomePageComponent.prototype.showSignUpModal = function () {
        this.sharedService.broadcast({
            name: 'showSignUpModal'
        });
    };
    __decorate([
        ViewChild(SignFormComponent),
        __metadata("design:type", SignFormComponent)
    ], HomePageComponent.prototype, "signModal", void 0);
    HomePageComponent = __decorate([
        Component({
            moduleId: module.id,
            templateUrl: './home-page-common.html',
            styleUrls: ['home-page.css']
        }),
        __metadata("design:paramtypes", [GlobalService,
            SharedService,
            ActivatedRoute,
            Router])
    ], HomePageComponent);
    return HomePageComponent;
}());
export { HomePageComponent };
