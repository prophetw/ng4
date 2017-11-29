var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, Input, NgZone } from '@angular/core';
import { SignFormComponent } from '../modals/sign-form/sign.component';
import { UserService, GlobalService, AuthenticationService } from '../../services/index';
import { User } from "../../models/user";
import { SharedService } from "../../services/shared.service";
import { ProgressBarService } from '../../services/progressbar.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
var PageHeaderComponent = (function () {
    function PageHeaderComponent(authenticationService, sharedService, globalService, router, zone, progressbarService, userService, location, translate) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.sharedService = sharedService;
        this.globalService = globalService;
        this.router = router;
        this.zone = zone;
        this.progressbarService = progressbarService;
        this.userService = userService;
        this.location = location;
        this.translate = translate;
        this.status = { isopen: false };
        this.PDFTitle = '';
        this.PDFExtension = '';
        this.needAdjustWidth = false;
        this.classForBetaSpan = '';
        this.showSortByList = false;
        this.showSearchBar = false;
        this.trStyle = false;
        this.homepageLogo = '';
        this.searchKeyword = '';
        console.log('=====here');
        var __this = this;
        this.isMobile = this.globalService.getDevice() === 'mobile';
        this.baseUrlIsPDFEditor = this.globalService.baseUrlIsPDFEditor;
        this.sharedService.on('login-event', function (event) {
            console.log("Login event");
            __this.zone.run(function () {
                __this.currentUser = event.data;
            });
            if (window.location.href.indexOf('?') > -1) {
                var urlObj = _this.globalService.urlParaToObj(window.location.href.split('?')[1]);
            }
            console.log('====urlObj===');
            console.log(urlObj);
            localStorage.setItem('userInfo', JSON.stringify(event.data));
            if (urlObj && urlObj.redirect_url) {
                setTimeout(function () {
                    __this.router.navigate([decodeURIComponent(urlObj.redirect_url)]);
                });
                //
                //window.location.href=__this.globalService.getSiteOrigin()+decodeURIComponent(urlObj.redirect_url);
            }
        });
        this.sharedService.on('showSignUpModal', function (event) {
            _this.showSignUpModal();
        });
        this.sharedService.on('showSignInModal', function (event) {
            _this.showSignInModal();
        });
        this.sharedService.on('foxit-drive-onload', function (event) {
            _this.globalService.foxitDriveLoaded = true;
            _this.foxitDriveInterface = _this.getFoxitDriveInterface();
            if (_this.foxitDriveInterface) {
                _this.trStyle = _this.foxitDriveInterface.trStyle;
            }
            //console.log('######qqq')
            //console.log(qqq);
        });
        window.angularHeaderComponent = {
            zone: this.zone,
            showSignInModal: function (phantomLoginSwitchIsOn) { return _this.showSignInModal(phantomLoginSwitchIsOn); },
            showSignUpModal: function () { return _this.showSignUpModal(); },
            signOut: function (force) {
                if (force === void 0) { force = true; }
                return _this.signOut(force);
            },
            changeRouter: function (router) { return _this.changeRouter(router); },
            navigateByUrl: function (url) { return _this.navigateByUrl(url); },
            goBack: function (goBackNotRoot) { return _this.goBack(goBackNotRoot); },
            closeDropdown: function () { return _this.closeDropdown(); },
            changeLanguage: function (lang) { return _this.changeLanguage(lang); },
            setPDFTitle: function (title) { return _this.setPDFTitle(title); },
            getAppOrOpenInApp: function (params) { return _this.getAppOrOpenInApp(params); },
            getLastFile: function () { return _this.globalService.inputFile; },
            openProfileUrl: function () { return _this.openProfileUrl(); },
            openUpdatePswUrl: function () { return _this.openUpdatePswUrl(); },
            openFeedBackUrl: function () { return _this.openFeedBackUrl(); },
            setPageTitle: function () { return _this.setPageTitle(); },
            openAds: function (trackId) { return _this.openAds(trackId); },
            hideHeader: function () { return _this.hideHeader(); },
            closeDropdowns: function () { return _this.closeDropdowns(); },
            component: this,
            clearFoxitDriveSelection: function () { return _this.clearFoxitDriveSelection(); },
            isPhantomOnlineMode: function () { return _this.isPhantomOnlineMode(); },
            getUserPhantomOnlineSubscription: function () { return _this.getUserPhantomOnlineSubscription(); },
            showSignModalFromLogin: function (type, email) { return _this.showSignModalFromLogin(type, email); },
            showWebToolFn: function (toolName, fromFoxitDrive) { return _this.showWebToolFn(toolName, fromFoxitDrive); },
            foxitDriveLoaded: function () { return _this.foxitDriveLoaded(); },
            isProdEnv: function () { return _this.isProdEnv(); },
            isCNProEnv: function () { return _this.isCNProEnv(); },
            isEnterprise: function () { return _this.isEnterprise(); },
        };
        this.setLogo();
        this.sharedService.on('change-language', function (event) {
            _this.setLogo();
        });
    }
    PageHeaderComponent.prototype.foxitDriveLoaded = function () {
        this.sharedService.broadcast({
            name: 'foxit-drive-onload'
        });
    };
    PageHeaderComponent.prototype.showWebToolFn = function (toolName, fromFoxitDrive) {
        this.sharedService.broadcast({
            name: 'showWebToolModal',
            modeName: toolName,
            fromFoxitDrive: true
        });
    };
    PageHeaderComponent.prototype.changeLanguage = function (lang) {
        this.sharedService.broadcast({
            name: 'change-language',
            lang: lang || 'en-US'
        });
    };
    PageHeaderComponent.prototype.hideHeader = function () {
        this.globalService.showHeader = false;
    };
    PageHeaderComponent.prototype.clearSearchInput = function () {
        this.searchKeyword = '';
    };
    PageHeaderComponent.prototype.setPageTitle = function () {
        var _this = this;
        this.translate.get(['Foxit Online', 'Foxit Reader Online']).subscribe(function (res) {
            var title;
            if (_this.globalService.isMobile) {
                title = res['Foxit Reader Online'];
            }
            else if (_this.globalService.baseUrlIsPDFEditor) {
                title = res['Foxit Online'];
            }
            else {
                title = res['Foxit Reader Online'];
            }
            document.title = title;
        });
    };
    PageHeaderComponent.prototype.setLogo = function () {
        var isZh = this.globalService.getLanguage() === 'zh-CN';
        if (isZh) {
            this.foxitOnlineLogo = 'logo_foxit-online_zh-CN.png';
            this.homepageLogo = 'logo_homepage_zh-CN.png';
        }
        else {
            this.foxitOnlineLogo = 'logo_foxit-online_en-US.png';
            this.homepageLogo = 'logo_homepage_en-US.png';
        }
        if (this.globalService.baseUrlIsPDFEditor) {
            this.webLogoTitle = 'PhantomPDF Online';
            if (isZh) {
                this.foxitOnlineLogo = 'logo_foxit-online_zh-CN.png';
            }
            else {
                this.foxitOnlineLogo = 'logo_foxit-online_en-US.png';
            }
        }
        else {
            this.webLogoTitle = 'Foxit Reader Online';
            this.classForBetaSpan = 'hide';
            if (isZh) {
                //this.foxitOnlineLogo = 'logo_foxit-reader-online_zh-CN.png';
                this.foxitOnlineLogo = 'logo_foxit-online_zh-CN.png';
            }
            else {
                //this.foxitOnlineLogo = 'logo_foxit-reader-online_en-US.png';
                this.foxitOnlineLogo = 'logo_foxit-online_en-US.png';
            }
        }
    };
    PageHeaderComponent.prototype.getFoxitDriveInterface = function () {
        var iframe = document.getElementById('cloud-reading-iframe');
        console.log(iframe);
        if (iframe && iframe.contentWindow && iframe.contentWindow.CloudReading) {
            return iframe.contentWindow.CloudReading;
        }
        else {
            return null;
        }
    };
    PageHeaderComponent.prototype.clearFoxitDriveSelection = function () {
        var foxitDriveInterface = this.getFoxitDriveInterface();
        if (foxitDriveInterface) {
            console.log(foxitDriveInterface);
            foxitDriveInterface.$timeout(function () {
                foxitDriveInterface.clearSelection();
                foxitDriveInterface.$scope.$apply();
            });
        }
    };
    PageHeaderComponent.prototype.showSignModalFromLogin = function (type, email) {
        this.signModal.model.email = email;
        var timeout = 100;
        if (this.globalService.currentUserEmail) {
            console.log(this.globalService.currentUserEmail);
            this.signOut(true);
            timeout = 1000;
        }
        // 1  弹出 sign in 界面
        if (type == '1') {
            var __this = this;
            setTimeout(function () {
                __this.signModal.showSignInModal();
            }, timeout);
        }
        else {
            this.signModal.showSignUpModal();
        }
    };
    PageHeaderComponent.prototype.refreshList = function () {
        var _this = this;
        console.log(this.router.url);
        if (this.router.url === '/shared-with-me') {
            //this.shareWithMe.refresh();
            this.sharedService.broadcast({
                name: 'refresh-list'
            });
        }
        else if (this.router.url === '/foxit-drive') {
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            if (this.foxitDriveInterface) {
                console.log(this.foxitDriveInterface);
                this.foxitDriveInterface.$timeout(function () {
                    _this.foxitDriveInterface.refreshCurFolderList();
                });
            }
        }
    };
    PageHeaderComponent.prototype.refreshSharedList = function () {
        this.sharedService.broadcast({
            name: 'refresh-shared-list'
        });
    };
    PageHeaderComponent.prototype.showLeftPanel = function () {
        this.sharedService.broadcast({
            name: 'open-mobile-left-panel'
        });
    };
    PageHeaderComponent.prototype.search = function () {
        var _this = this;
        //alert('search');
        if (this.router.url === '/shared-with-me') {
            //this.shareWithMe.refresh();
            //this.sharedService.broadcast({
            //    name:'refresh-list'
            //});
        }
        else if (this.router.url === '/foxit-drive') {
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            if (this.foxitDriveInterface) {
                console.log(this.foxitDriveInterface);
                this.foxitDriveInterface.$timeout(function () {
                    _this.foxitDriveInterface.search(null, null, 'type=all&title=' + _this.searchKeyword);
                });
                this.globalService.searchMode = false;
            }
        }
    };
    PageHeaderComponent.prototype.showSearchBarFn = function () {
        this.showSearchBar = true;
        this.globalService.searchMode = true;
    };
    PageHeaderComponent.prototype.searchBarCancelBtnFn = function () {
        var _this = this;
        this.showSearchBar = false;
        this.globalService.searchMode = false;
        this.foxitDriveInterface = this.getFoxitDriveInterface();
        if (this.foxitDriveInterface) {
            console.log(this.foxitDriveInterface);
            this.foxitDriveInterface.$timeout(function () {
                _this.foxitDriveInterface.cancelSearch();
            });
        }
    };
    PageHeaderComponent.prototype.sortBy = function (listBy) {
        //alert('sortBy');
        var _this = this;
        if (this.router.url === '/shared-with-me') {
            //this.shareWithMe.refresh();
            //this.sharedService.broadcast({
            //    name:'refresh-list'
            //});
        }
        else if (this.router.url === '/foxit-drive') {
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            if (this.foxitDriveInterface) {
                console.log(this.foxitDriveInterface);
                this.foxitDriveInterface.$timeout(function () {
                    _this.foxitDriveInterface.changeSort(listBy);
                    if (_this.listSortBy === listBy) {
                        _this.listSortBy = '-' + listBy;
                    }
                    else {
                        _this.listSortBy = listBy;
                    }
                });
            }
        }
    };
    PageHeaderComponent.prototype.closeDropdowns = function () {
        this.closeSortByList();
    };
    PageHeaderComponent.prototype.toggleSortByList = function (event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        if (this.router.url === '/shared-with-me') {
            //this.shareWithMe.refresh();
            //this.sharedService.broadcast({
            //    name:'refresh-list'
            //});
            this.currentView = 'shared-with-me';
        }
        else if (this.router.url === '/foxit-drive') {
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            this.currentView = 'foxit-drive';
            if (this.foxitDriveInterface) {
                console.log(this.foxitDriveInterface);
                this.listSortBy = this.foxitDriveInterface.folderOrderBy;
                //this.foxitDriveInterface.$timeout(()=>{
                //    this.foxitDriveInterface.changeDocShowStyle()
                //})
            }
        }
        this.showSortByList = !this.showSortByList;
    };
    PageHeaderComponent.prototype.closeSortByList = function () {
        this.showSortByList = false;
    };
    PageHeaderComponent.prototype.changeListView = function (viewType) {
        var _this = this;
        // viewType : list  large-thumbnail
        //alert('changeView');
        if (this.router.url === '/shared-with-me') {
            //this.shareWithMe.refresh();
            //this.sharedService.broadcast({
            //    name:'refresh-list'
            //});
        }
        else if (this.router.url === '/foxit-drive') {
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            if (this.foxitDriveInterface) {
                this.trStyle = !this.trStyle;
                this.foxitDriveInterface.$timeout(function () {
                    _this.foxitDriveInterface.changeDocShowStyle();
                });
            }
        }
    };
    PageHeaderComponent.prototype.ngOnInit = function () {
        $(window).on('blur', function (e) {
            window.angularHeaderComponent.zone.run(function () {
                return window.angularHeaderComponent.closeDropdown();
            });
        });
        $(window).on('click', function (e) {
            window.angularHeaderComponent.zone.run(function () {
                return window.angularHeaderComponent.closeDropdown();
            });
        });
        // test pdf title
        //window.angularHeaderComponent.zone.run(()=>
        //    window.angularHeaderComponent.setPDFTitle('我真的是一个帅帅的中国人哦哈哈哈哈哈 .pdf')
        //);
    };
    PageHeaderComponent.prototype.ngAfterViewInit = function () {
        var __this = this;
        // contentChild is updated after the content has been checked
        // angularjs2 hook https://angular.io/guide/lifecycle-hooks
        $('header').click(function () {
            __this.clearFoxitDriveSelection();
        });
    };
    PageHeaderComponent.prototype.openclient = function (params) {
        var ua = navigator.userAgent.toLowerCase();
        //var isSafari = ua.indexOf('chrome') ===-1 && ua.indexOf('safari')!==-1;
        //// /////
        //// https://jira.foxitsoftware.cn/browse/MOB-1786
        //// 回调参数定义：
        //// FoxitMobilePDF://endpoint-xxxx/cmisid-xxxx/filename-xxxx/useremail-xxxx 直接下载该文档并打开
        //// FoxitMobilePDF://endpoint-xxxx/foxit-drive/useremail-xxxx 直接进入foxit-drive界面
        //// FoxitMobilePDF://default 进入app默认界面
        //// /////
        var config = {
            /*scheme:必须*/
            scheme_IOS: 'FoxitMobilePDF://',
            scheme_Adr: '',
            download_ios_free_url: 'itms-apps://itunes.apple.com/app/id507040546',
            download_ios_url: 'itms-apps://itunes.apple.com/app/id866909872',
            download_android_url: 'https://play.google.com/store/apps/details?id=com.foxit.mobile.pdf.lite',
            download_android_cn_url: 'https://www.foxitsoftware.cn/products/mobilereader/?trackingId=download_apk',
            timeout: 600
        };
        var startTime = Date.now();
        var ifr = document.createElement('iframe');
        //ifr.src = ua.indexOf('os') > 0 ? config.scheme_IOS+params['path'].slice(1) : config.scheme_Adr+params['path'].slice(1);
        var scheme_IOS = config.scheme_IOS + '';
        var endpoint = this.globalService.cwsApiUrl;
        var fileName = params && params.fileName || '';
        var cmisId = params && params.cmisId || '';
        if (this.router.url.indexOf('foxit-drive') !== -1) {
            scheme_IOS = config.scheme_IOS + 'endpoint-' + endpoint + 'foxit-drive/useremail-' + this.globalService.currentUserEmail;
        }
        else if (this.router.url.indexOf('preview') !== -1) {
            scheme_IOS = config.scheme_IOS + 'endpoint-' + endpoint + 'cmisid-' + cmisId + '/filename-' + fileName + '/useremail-' + this.globalService.currentUserEmail;
        }
        else {
            scheme_IOS = config.scheme_IOS + 'default';
        }
        console.log('=====scheme_IOS====');
        console.log(scheme_IOS);
        ifr.src = ua.indexOf('os') > 0 ? scheme_IOS : config.scheme_Adr;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        var t = window.setTimeout(function () {
            var endTime = Date.now();
            if (!startTime || endTime - startTime < config.timeout + 200) {
                // 中国区
                if (window.location.href.indexOf('foxitsoftware.cn')) {
                    window.location = ua.indexOf('os') > 0 ? config.download_ios_free_url : config.download_android_cn_url;
                }
                else {
                    // 非中国区
                    window.location = ua.indexOf('os') > 0 ? config.download_ios_free_url : config.download_android_url;
                }
            }
        }, config.timeout);
        window.onblur = function () {
            window.clearTimeout(t);
        };
    };
    PageHeaderComponent.prototype.getAppOrOpenInApp = function (params) {
        //var params={
        //    path:this.router.url
        //};
        //console.log(this.router.url);
        this.openclient(params);
        //window.addEventListener("DOMContentLoaded", function(){
        //    document.getElementById("J-call-app").addEventListener('click',this.openclient,false);
        //
        //}, false);
    };
    PageHeaderComponent.prototype.isProdEnv = function () {
        return this.globalService.isProdEnv();
    };
    PageHeaderComponent.prototype.isCNProEnv = function () {
        return this.globalService.isCNProEnv();
    };
    PageHeaderComponent.prototype.isEnterprise = function () {
        return this.globalService.hideSignUp;
    };
    PageHeaderComponent.prototype.setPDFTitle = function (title) {
        var titleWidth = $('<span id="temp-calculate-width" style="z-index: -9999;position: relative;">' + title + '</span>').appendTo('body').width();
        if (title == '') {
            this.PDFTitle = '';
            this.PDFExtension = '';
        }
        else {
            this.PDFTitle = title.slice(0, title.lastIndexOf('.'));
            this.PDFExtension = title.slice(title.lastIndexOf('.'));
        }
        if (titleWidth && titleWidth > 324) {
            this.needAdjustWidth = true;
        }
        else {
            this.needAdjustWidth = false;
        }
        $('#temp-calculate-width').remove();
    };
    PageHeaderComponent.prototype.openProfileUrl = function () {
        var profileUrl = this.globalService.getProfileUrl();
        var token = this.globalService.currentUserToken;
        var url = this.globalService.accountApiUrl + 'site/login?access-token=' + token + '&to=' + encodeURIComponent(profileUrl);
        this.globalService.sendGaEvent('phantomPDF online web', 'profile', 'profile');
        window.open(url, '_blank', "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
        return false;
    };
    PageHeaderComponent.prototype.openUpdatePswUrl = function () {
        var updatePsw = this.globalService.getUpdatePasswordUrl();
        var token = this.globalService.currentUserToken;
        var url = this.globalService.accountApiUrl + 'site/login?access-token=' + token + '&to=' + encodeURIComponent(updatePsw);
        this.globalService.sendGaEvent('phantomPDF online web', 'update-password', 'update-password');
        window.open(url, '_blank', "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
        return false;
    };
    PageHeaderComponent.prototype.openFeedBackUrl = function () {
        var url = 'http://feedback.debenu.com/forums/595774-phantompdf-reader-online/';
        this.globalService.sendGaEvent('phantomPDF online web', 'feedback', 'feedback');
        window.open(url, null, null);
        return false;
    };
    PageHeaderComponent.prototype.goBack = function (goBackNotRoot) {
        if (this.globalService.isFirstPage || window.location.href.indexOf('preview/url') > -1) {
            this.router.navigate(['/']);
        }
        else {
            this.location.back();
        }
    };
    PageHeaderComponent.prototype.changeRouter = function (router) {
        this.setPDFTitle('');
        this.router.navigate(router);
    };
    PageHeaderComponent.prototype.openNewPage = function (router) {
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
    PageHeaderComponent.prototype.navigateByUrl = function (url) {
        this.setPDFTitle('');
        this.router.navigateByUrl(url);
    };
    PageHeaderComponent.prototype.changeToRouter = function (router) {
        var _this = this;
        var __this = this;
        var iframe = document.getElementById('preview-frame');
        if (iframe && iframe.contentWindow && iframe.contentWindow.WebPDF && iframe.contentWindow.WebPDF.onBeforeLeave) {
            var userId = this.globalService.currentUser && this.globalService.currentUser.user_id || null;
            iframe.contentWindow.WebPDF.onBeforeLeave(userId, function (isLeave) {
                if (isLeave) {
                    window.angularHeaderComponent.zone.run(function () {
                        window.parent.angularHeaderComponent.setPDFTitle('');
                        __this.router.navigate([router]);
                    });
                }
            });
        }
        else {
            window.angularHeaderComponent.zone.run(function () {
                // same router then reload the page
                if (_this.router.url === router) {
                    window.location.reload();
                }
                else {
                    __this.router.navigate([router]);
                }
            });
        }
    };
    PageHeaderComponent.prototype.closeDropdown = function ($event) {
        this.status.isopen = false;
    };
    PageHeaderComponent.prototype.toggleDropdown = function ($event) {
        //this.status.isopen = true;
        if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        this.status.isopen = !this.status.isopen;
    };
    PageHeaderComponent.prototype.showSignInModal = function (phantomLoginSwitchIsOn) {
        this.signModal.showSignInModal(phantomLoginSwitchIsOn);
    };
    PageHeaderComponent.prototype.showSignUpModal = function () {
        this.signModal.showSignUpModal();
    };
    PageHeaderComponent.prototype.signOut = function (force, logout_from_cas) {
        if (force === void 0) { force = true; }
        if (logout_from_cas === void 0) { logout_from_cas = true; }
        console.log('==== signOut ====' + force + logout_from_cas);
        this.globalService.sendGaEvent('phantomPDF online web', 'sign-out', 'sign-out');
        //if (force == null) {
        //    force = true;
        //}
        if (document.getElementById('preview-frame') && !force) {
            console.log("send logout-before-event");
            this.sharedService.broadcast({
                name: 'logout-before-event'
            });
        }
        else {
            this.authenticationService.signOut();
            this.currentUser = null;
            this.sharedService.broadcast({
                name: 'logout-event'
            });
            if (logout_from_cas && this.globalService.useCasLogin()) {
                var service = window.location.href;
                if (document.getElementById('preview-frame') !== null) {
                    if (this.globalService.isMobile) {
                        service = this.globalService.getSiteOrigin();
                    }
                }
                if (service.indexOf('?siteaction') > -1) {
                    service = service.replace(/\?siteaction.*/g, '');
                }
                var cas_url = this.userService.getCasSiteLogoutUrl() + '?service=' + encodeURIComponent(service);
                window.location.href = cas_url;
            }
        }
    };
    PageHeaderComponent.prototype.openAds = function (trackId) {
        //this.sharedService.broadcast({
        //    name:'change-language',
        //    lang:'en-US'
        //})
        this.globalService.openAds(trackId);
    };
    PageHeaderComponent.prototype.isPhantomOnlineMode = function () {
        return this.globalService.isPhantomOnlineMode();
    };
    PageHeaderComponent.prototype.getUserPhantomOnlineSubscription = function () {
        return {
            userPhantomOnlineSubscription: this.userService.userPhantomOnlineSubscription,
            userSubscription: this.userService.userSubscription,
            userWebToolsSubscription: this.userService.userWebToolsSubscription,
            userIsNeedDownloadClient: !this.userService.userHasDownloadClient
        };
    };
    PageHeaderComponent.prototype.showSubscriptionDialog = function () {
        try {
            window.angularMainComponent.showSubscriptionDialog({ source: 'online', tabName: 'right' });
        }
        catch (ex) { }
        this.globalService.sendGaEvent('Subscribe', 'online_subscribe_right', '');
    };
    PageHeaderComponent.prototype.enterRightTopSubscriptionAD = function ($event) {
        try {
            var target = $event.target;
            var width = window.innerWidth || document.body.clientWidth;
            window.angularMainComponent.enterRightTopSubscriptionAD({
                right: (width - (target.offsetLeft + target.offsetWidth)) + 'px',
                top: (target.offsetTop + target.offsetHeight + 10) + 'px'
            });
        }
        catch (ex) { }
    };
    PageHeaderComponent.prototype.leaveRightTopSubscriptionAD = function () {
        try {
            window.angularMainComponent.leaveRightTopSubscriptionAD();
        }
        catch (ex) { }
    };
    __decorate([
        Input(),
        __metadata("design:type", User)
    ], PageHeaderComponent.prototype, "currentUser", void 0);
    __decorate([
        ViewChild(SignFormComponent),
        __metadata("design:type", SignFormComponent)
    ], PageHeaderComponent.prototype, "signModal", void 0);
    PageHeaderComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'page-header',
            templateUrl: "./header.html",
            styleUrls: ['./header.css']
        }),
        __metadata("design:paramtypes", [AuthenticationService,
            SharedService,
            GlobalService,
            Router,
            NgZone,
            ProgressBarService,
            UserService,
            Location,
            TranslateService])
    ], PageHeaderComponent);
    return PageHeaderComponent;
}());
export { PageHeaderComponent };
