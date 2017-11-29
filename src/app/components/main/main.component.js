var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, NgZone } from '@angular/core';
import { UserService, GlobalService, AuthenticationService } from '../../services/index';
import { PageHeaderComponent } from '../header/header.component';
import { SharedService } from "../../services/shared.service";
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'angular2-cookie/core';
import { WebToolConvertComponent } from "../modals/webtools/webtool.component";
import { DomSanitizer } from '@angular/platform-browser';
import { ActivationSubscriptionComponent } from '../../subscription/activation-subscription.component';
import { SubscriptionComponent } from '../../subscription/subscription.component';
import { LicenseCodeComponent } from '../../subscription/license-code.component';
import { SubscriptionNowComponent } from '../../subscription/subscription-now.component';
import { SubscriptionAdComponent } from '../../subscription/subscription-ad.component';
var MainComponent = (function () {
    function MainComponent(userService, globalService, router, sharedService, translate, authenticationService, cookieService, sanitizer, zone) {
        var _this = this;
        this.userService = userService;
        this.globalService = globalService;
        this.router = router;
        this.sharedService = sharedService;
        this.translate = translate;
        this.authenticationService = authenticationService;
        this.cookieService = cookieService;
        this.sanitizer = sanitizer;
        this.zone = zone;
        //isCloudReading: boolean = false;
        //showCloudReading: boolean = false;
        //showPreviewModal: boolean = false;
        //previewUrl: string;
        //docId: any;
        this.isMobile = false;
        this.cloudReadingUrl = '';
        this.isIOSWeChatBrowser = true;
        this.activationSubscriptionInitialized = false;
        window.angularMainComponent = {
            zone: this.zone,
            showSubscriptionPromptDialog: function () { return _this.showSubscriptionPromptDialog(); },
            showSubscriptionDialog: function (params) { return _this.showSubscriptionDialog(params); },
            enterRightTopSubscriptionAD: function (position) { return _this.enterRightTopSubscriptionAD(position); },
            leaveRightTopSubscriptionAD: function () { return _this.leaveRightTopSubscriptionAD(); },
            showActivateLicenseCodeDialog: function (params) { return _this.showActivateLicenseCodeDialog(params); },
            showSubscriptionNowDialog: function (params) { return _this.showSubscriptionNowDialog(params); },
            setLanguage: function (forceLang) { return _this.setLanguage(forceLang); },
            doDownloadPhantomPDFClient: function () { return _this.doDownloadPhantomPDFClient(); },
            isNeedShowDowndloadClient: function () { return _this.isNeedShowDowndloadClient(); },
            doCheckUserSubscription: function () { return _this.doCheckUserSubscription(); }
        };
        this.sharedService.on('login-event', function (event) {
            _this.checkUserPhantomOnlineSubscription(_this.globalService.currentUserToken);
            _this.checkUserProductSubscription(_this.globalService.currentUserToken);
        });
        $('body').click(function () {
            // clear selection in foxit drive for tools modal
            //window.angularHeaderComponent.clearFoxitDriveSelection()
        });
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var weChatBrowser = navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1;
        if (weChatBrowser && isiOS) {
            this.isIOSWeChatBrowser = true;
        }
        else {
            this.isIOSWeChatBrowser = false;
        }
        this.sharedService.on('change-language', function (event) {
            var lang = event.lang;
            console.log(event);
            _this.changeLang(lang);
        });
        this.sharedService.on('showWebToolModal', function (event) {
            console.log(event);
            var _eventSource = event.fromFoxitDrive == true ? 1 : 0;
            _this.webToolModal.showWebToolModal(true, event.modeName, _eventSource);
        });
        //if(this.globalService.getDevice() === 'mobile' && (location.href.indexOf('/share/') == -1 && location.href.indexOf('/preview/') == -1 && location.href.indexOf('/redirect-to-cas/') == -1)){
        //   this.isMobile=true;
        //}
        this.isMobile = this.globalService.isMobile;
        this.globalService.changeLanguage = this.changeLang;
        if (this.isMobile) {
            this.globalService.showAside = false;
        }
        this.setLanguage();
        this.router.events.subscribe(function (event) {
            if (event instanceof NavigationEnd) {
                console.log('router change');
                console.log(event);
                if (_this.globalService.isFirstPage && event.id > 1) {
                    _this.globalService.isFirstPage = false;
                }
                window.angularHeaderComponent.zone.run(function () {
                    return window.angularHeaderComponent.setPDFTitle('');
                });
                // TODO: remove domain hardcode
                if (_this.globalService.isCNProEnv()) {
                    ga('create', 'UA-53591733-8', 'auto');
                }
                else if (_this.globalService.isProdEnv()) {
                    ga('create', 'UA-53591733-6', 'auto');
                }
                else {
                    ga('create', 'UA-53591733-7', 'auto');
                }
                if (_this.globalService.currentUserEmail) {
                    ga('set', 'dimension1', 'Logged In');
                }
                else {
                    ga('set', 'dimension1', 'Visitor');
                }
                ga('set', { page: event.url });
                _this.setPageTitle();
                var event_url = event.url;
                console.log("event_url " + event_url);
                _this.globalService.gaSSO('change_router_' + event_url);
                _this.globalService.currentView = event_url;
                if (event_url === '/' ||
                    event_url === '/privacy-policy' ||
                    event_url === '/term-of-use' ||
                    event_url.indexOf('/?') > -1 ||
                    event_url.indexOf('/privacy-policy') > -1 ||
                    event_url.indexOf('/term-of-use') > -1) {
                    _this.globalService.isHomePage = true;
                }
                else {
                    _this.globalService.isHomePage = false;
                }
                if (event_url.indexOf('/foxit-drive') > -1) {
                    // 只有在 foxit-drive 这个view 才会加载 cloud-reading/index.html
                    var defaultLang = localStorage.getItem('currentLang') || null;
                    var browserLang = _this.translate.getBrowserLang(); // e.g., en
                    var currentLang = defaultLang;
                    if (defaultLang) {
                        currentLang = defaultLang;
                    }
                    else {
                        if (browserLang == 'en') {
                            currentLang = 'en-US';
                        }
                        else if (browserLang == 'zh') {
                            currentLang = 'zh-CN';
                        }
                    }
                    if (!_this.cloudReadingUrl) {
                        _this.cloudReadingUrl = _this.sanitizer.bypassSecurityTrustResourceUrl('/cloud-reading/index.html?v={version}&lang=' + currentLang);
                    }
                }
                if (_this.globalService.getDevice() === 'mobile') {
                    // 对于 mobile端 始终隐藏 左边栏
                    _this.globalService.showAside = false;
                    _this.globalService.mobileModule = '';
                    if (event_url === '/shared-with-me') {
                        _this.globalService.showHeader = true;
                        _this.globalService.mobileModule = 'shared-with-me';
                        _this.translate.get('Shared With Me').subscribe(function (res) {
                            _this.globalService.mobileTitle = res;
                        });
                    }
                    else if (event_url === '/foxit-drive') {
                        _this.globalService.mobileModule = 'foxit-drive';
                        _this.globalService.showHeader = true;
                        _this.translate.get('Foxit Drive').subscribe(function (res) {
                            _this.globalService.mobileTitle = res;
                        });
                    }
                }
                _this.checkServerStatus();
                if (event_url.indexOf('/view-and-edit?siteaction=sign-up') == 0) {
                    if (_this.globalService.currentUserToken) {
                        _this.router.navigateByUrl('/');
                    }
                    else {
                        _this.header.showSignUpModal();
                    }
                    return;
                }
                var domain = window.location.protocol + "//" + window.location.host;
                if (event_url.indexOf('/check-cas/') == 0) {
                    console.log('---- handle [check-cas] ----');
                    var target_url = event_url.replace('/check-cas/', '');
                    target_url = decodeURIComponent(target_url);
                    console.log("target_url " + target_url);
                    // redirect to cas page to check login
                    var cas_url = _this.userService.getCasSiteUrl() + '&service=' + encodeURIComponent(domain + "/redirect-to-cas/" + encodeURIComponent(target_url));
                    console.log('cas url: ' + cas_url);
                    location.href = cas_url;
                }
                else if (event_url.indexOf('/redirect-to-cas/') == 0 && event_url.indexOf('ticket=') > 0) {
                    console.log('---- handle [ticket] ----');
                    var ticket = event_url.split('ticket=')[1];
                    var service = domain + event_url.split('ticket=')[0].slice(0, -1);
                    var target_url = event_url.split('ticket=')[0].slice(0, -1).replace('/redirect-to-cas/', '');
                    target_url = decodeURIComponent(target_url);
                    if (target_url.indexOf('?open-subscription-now-dialog=true') !== -1) {
                        _this.lastCallback = function () {
                            //this.lastCallback = null;
                            var match = target_url.match(/&f=(\d)(?:$|&)/);
                            var trackingId = '';
                            if (match) {
                                trackingId = ['Foxit Online notlogin', 'Phantom Online notlogin'][match[1]];
                            }
                            if (trackingId) {
                                trackingId = 'trackingId=' + encodeURIComponent(trackingId);
                            }
                            _this.showSubscriptionNowDialog({ trackingId: trackingId });
                        };
                    }
                    else if (target_url.indexOf('?open-activate-license-dialog=true') !== -1) {
                        //open-activate-license-dialog=true
                        _this.lastCallback = function () {
                            //this.lastCallback = null;
                            var match = target_url.match(/&f=(\d)(?:$|&)/);
                            var trackingId = '';
                            if (match) {
                                trackingId = ['Foxit Online notlogin', 'Phantom Online notlogin'][match[1]];
                            }
                            if (trackingId) {
                                trackingId = 'trackingId=' + encodeURIComponent(trackingId);
                            }
                            _this.showActivateLicenseCodeDialog({ trackingId: trackingId });
                        };
                    }
                    _this.authenticationService.login_by_ticket(ticket, service).subscribe(function (data) {
                        if (data.ret == 0) {
                            console.log("getAccessTokenFromCas success");
                            _this.checkUserPhantomOnlineSubscription(_this.globalService.currentUserToken, function (data) {
                                _this.signInGa(target_url, data.isSubscribed, data.redeem_subscription);
                            });
                            _this.checkUserProductSubscription(_this.globalService.currentUserToken);
                            _this.router.navigateByUrl(target_url);
                        }
                        else {
                            console.log("getAccessTokenFromCas failed");
                            console.log(data);
                            _this.header.signOut(true, false);
                            _this.router.navigateByUrl(target_url);
                        }
                    }, function (error) {
                        console.log("getAccessTokenFromCas error");
                        console.log(error);
                        _this.header.signOut(true, false);
                        _this.router.navigateByUrl(target_url);
                    });
                }
                else {
                    _this.checkToken();
                }
                //ga('set', 'userId', this.globalService.currentUser.user_id);
                _this.checkNeedShowSubscriptionPromptDialog();
            }
        });
    }
    MainComponent.prototype.checkToken = function () {
        var _this = this;
        if (this.globalService.currentUserToken && !this.globalService.currentUser) {
            this.userService.getCurrentInfo().subscribe(function (data) {
                //noinspection TypeScriptUnresolvedVariable
                if (data.ret != 0) {
                    if (!_this.globalService.useCasLogin()) {
                        _this.header.signOut(true);
                    }
                    console.log('token error...');
                }
                else {
                    _this.checkUserPhantomOnlineSubscription(_this.globalService.currentUserToken);
                    _this.checkUserProductSubscription(_this.globalService.currentUserToken);
                    localStorage.setItem('userInfo', JSON.stringify(data.data));
                    _this.currentUser = _this.globalService.currentUser;
                    ga('set', 'userId', _this.globalService.currentUser.id);
                    var option;
                    _this.cookieService.put('uid', _this.globalService.currentUser.id, option ? option : null);
                    ga('send', 'pageview');
                }
            }, function (error) {
                _this.header.signOut(true);
                console.log('response error');
            });
        }
        else if (this.globalService.currentUserToken) {
            ga('set', 'userId', this.globalService.currentUser.id);
            var option;
            this.cookieService.put('uid', this.globalService.currentUser.id, option ? option : null);
            ga('send', 'pageview');
        }
        else {
            //ga('send', 'pageview');
            var __this = this;
            setTimeout(function () {
                var iframe = document.getElementById('preview-frame');
                if (iframe && iframe.contentWindow) {
                    //ga('set', 'userId', 'guest_' + new Date().getTime() + '_' + Math.random()); // e.g., 1505911928826_0.34134541647412453
                    // guest preview 作为活跃用户的数据
                    __this.globalService.sendGaEvent('guest', 'guest_preview_doc', window.navigator.userAgent);
                }
                //ga('send', 'pageview');
            }, 3000);
        }
    };
    MainComponent.prototype.toggle = function () {
        this.globalService.showAside = !this.globalService.showAside;
    };
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        //this.loadAllUsers();
        this.globalService.mobileLeftAsideActive.subscribe(function (bool) {
            _this.mobileLeftAsideActive = bool;
        });
    };
    MainComponent.prototype.checkServerStatus = function () {
        var _this = this;
        if (!this.userService.serverStatus) {
            this.userService.getServerStatus().subscribe(function (data) {
                if (data.ret == 0) {
                    _this.userService.serverStatus = data;
                    _this.checkServerMatain(_this.userService.serverStatus.data.server_maintaining);
                }
            }, function (error) {
            });
        }
        else {
            this.checkServerMatain(this.userService.serverStatus.data.server_maintaining);
        }
    };
    MainComponent.prototype.checkServerMatain = function (server_maintaining) {
        if (server_maintaining) {
            var url = this.userService.getSiteMatainUrl();
            $("body").css('height', $(document).height());
            $(window).resize(function () {
                $("body").css('height', $(document).height());
            });
            $("body").html('<iframe _ngcontent-hwj-1="" allowtransparency="true" frameborder="0" height="100%"  scrolling="no"  width="100%" src="' + url + '"></iframe>');
        }
    };
    MainComponent.prototype.setPageTitle = function () {
        // set page title and favicon
        /*
        if(this.globalService.baseUrlIsPDFEditor){
          this.translate.get('PhantomPDF Online').subscribe((res: string) => {
            document.title = res;
          });
        }else{
          this.translate.get('Reader Online').subscribe((res: string) => {
            document.title = res;
          });
        }
        */
        var _this = this;
        // PRO-3867
        // 1. /phantompdf view    phantomPDF online
        // 2. /reader view        Foxit Reader Online
        // 3.其它的view            Foxit Online
        this.translate.get(['Foxit Online', 'Foxit Reader Online', 'PhantomPDF Online']).subscribe(function (res) {
            var title;
            if (_this.globalService.isMobile) {
                title = res['Foxit Reader Online'];
                return document.title = title;
            }
            if (_this.globalService.baseUrlIsPDFEditor) {
                title = res['Foxit Online'];
            }
            else {
                title = res['Foxit Reader Online'];
            }
            $('.shortcut.icon').remove();
            $('head').append('<link rel="shortcut icon" href="/img/favicon.ico">');
            if (window.location.href.indexOf('/reader') > -1) {
                title = res['Foxit Reader Online'];
            }
            if (window.location.href.indexOf('/phantompdf') > -1 || window.location.href.indexOf('/preview') > -1) {
                title = res['PhantomPDF Online'];
                $('.shortcut.icon').remove();
                $('head').append('<link rel="shortcut icon" href="/img/favicon-phantompdf.ico">');
            }
            document.title = title;
        });
    };
    MainComponent.prototype.setLanguage = function (forceLang) {
        // phantom online 语言
        // 默认通过浏览器自身语言 中文浏览器显示中文 英文浏览器显示英文
        // 用户设置通过参数 ?lang=zh-CN en-US
        // 用户设置>浏览器自身语言  用户设置会记录在localStorage里面
        var url = window.location.href;
        if (url.indexOf('?') > -1) {
            var paraUrl = url.split('?')[1];
            var urlObj = this.globalService.urlParaToObj(paraUrl);
            console.log('====urlObj', urlObj);
        }
        if (urlObj) {
            if (urlObj['lang']) {
                localStorage.setItem('currentLang', urlObj['lang']);
            }
            if (urlObj['language']) {
                localStorage.setItem('currentLang', urlObj['language']);
            }
        }
        var defaultLang = localStorage.getItem('currentLang') || null;
        console.log(defaultLang);
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en-US');
        if (forceLang) {
            this.translate.addLangs([
                forceLang
            ]);
            var currentLang = forceLang;
            this.globalService.language = currentLang;
            this.translate.use(currentLang);
            localStorage.setItem('currentLang', currentLang);
            this.setPageTitle();
        }
        else {
            this.translate.addLangs([
                "en-US",
                "zh-CN"
            ]);
            var browserLang = this.translate.getBrowserLang(); // e.g., en
            var browserLangFull = this.translate.getBrowserCultureLang(); // e.g., en-US
            console.log('browserLang: ' + browserLang);
            console.log('browserLangFull: ' + browserLangFull);
            var currentLang;
            if (defaultLang) {
                currentLang = defaultLang;
            }
            else {
                if (browserLang == 'en') {
                    currentLang = 'en-US';
                }
                else if (browserLang == 'zh') {
                    currentLang = 'zh-CN';
                }
                else {
                    currentLang = 'en-US';
                }
            }
            this.globalService.language = currentLang;
            //this.cloudReadingUrl=this.sanitizer.bypassSecurityTrustResourceUrl('/cloud-reading/index.html?lang='+currentLang);
            console.log('currentLang: ' + currentLang);
            this.translate.use(currentLang);
            localStorage.setItem('currentLang', currentLang);
            // set page title
            this.setPageTitle();
        }
    };
    MainComponent.prototype.changeLang = function (lang) {
        if (lang == 'en') {
            lang = 'en-US';
        }
        else if (lang == 'zh') {
            lang = 'zh-CN';
        }
        this.translate.currentLang = lang;
        console.log('====this.translate');
        this.translate.use(lang);
        localStorage.setItem('currentLang', lang);
        this.setPageTitle();
    };
    MainComponent.prototype.doCheckUserSubscription = function () {
        this.checkUserPhantomOnlineSubscription(this.globalService.currentUserToken);
        this.checkUserProductSubscription(this.globalService.currentUserToken);
    };
    MainComponent.prototype.checkUserPhantomOnlineSubscription = function (token, success) {
        var _this = this;
        if (success === void 0) { success = function (param) { }; }
        if (!this.globalService.subscriptionSwitch) {
            return;
        }
        // 1. get data:
        this.userService.getUserPhantomOnlineSubscription(token).subscribe(function (data) {
            if (data.ret == 0) {
                // 2. save data:
                _this.userService.userPhantomOnlineSubscription = data.data;
                success(data.data);
                // TODO 3. do some check here:
                try {
                    var iframe = document.getElementById('preview-frame');
                    iframe.contentWindow.WebPDF.updateSubscribe();
                }
                catch (ex) { }
                if (iframe && iframe.contentWindow && iframe.contentWindow.PhantomOnline) {
                    if (window.previewFrame.PhantomOnline && window.previewFrame.PhantomOnline.signincallback && typeof window.previewFrame.PhantomOnline.signincallback == 'function') {
                        window.previewFrame.PhantomOnline.signincallback();
                    }
                }
                _this.checkNeedShowSubscriptionPromptDialog();
                //this.lastCallback = null;
            }
        }, function (error) {
        });
    };
    MainComponent.prototype.checkUserWebToolsSubscription = function (token) {
        if (!this.globalService.subscriptionSwitch) {
            return;
        }
        this.userService.getUserWebToolsSubscription(token);
    };
    MainComponent.prototype.checkUserProductSubscription = function (token) {
        if (!this.globalService.subscriptionSwitch) {
            return;
        }
        this.userService.getUserPhantomProductSubscription(token).subscribe(function (data) { }, function (error) {
        });
    };
    //@MethodNeedLoginDecorator()
    MainComponent.prototype.showSubscriptionPromptDialog = function () {
        var _this = this;
        this.activationSubscriptionInitialized = true;
        setTimeout(function () {
            _this.activationSubscriptionModal.showModal();
            localStorage.setItem(_this.globalService.currentUserEmail + ':storageIsSubscribed', '' + Date.now());
        }, 100);
    };
    MainComponent.prototype.checkNeedShowSubscriptionPromptDialog = function () {
        // 订阅相关的临时移除
        if (!this.globalService.subscriptionSwitch) {
            return;
        }
        // reader-online 不弹窗 PRO-3734
        if (!this.globalService.isPhantomOnlineMode()) {
            return;
        }
        // 移动端不弹窗
        if (this.globalService.getDevice() === 'mobile') {
            return;
        }
        // 未登录不弹窗
        if (!this.globalService.currentUserEmail) {
            return;
        }
        var userPhantomOnlineSubscription = this.userService.userPhantomOnlineSubscription;
        if (!userPhantomOnlineSubscription) {
            return;
        }
        // 已订阅
        if (userPhantomOnlineSubscription.isSubscribed) {
            return;
        }
        // 需要保留订阅现场的，不弹窗
        if (this.lastCallback) {
            this.lastCallback();
            return this.lastCallback = function () { };
        }
        // 登录后判断是否显示订阅提示弹窗，24小时提醒一次
        // 今天已经显示过了
        if ((+localStorage.getItem(this.globalService.currentUserEmail + ':storageIsSubscribed') + 86400000) > Date.now()) {
            return;
        }
        // 在以下url下不弹窗
        if (/(^\/$)|(^\/redirect-to-cas\/)/.test(this.router.url)) {
            return;
        }
        if ((userPhantomOnlineSubscription.phantom_online_trial_start_timestamp === userPhantomOnlineSubscription.current_timestamp) || (userPhantomOnlineSubscription.remain_days <= 3)) {
            this.showSubscriptionPromptDialog();
        }
    };
    //@MethodNeedLoginDecorator()
    MainComponent.prototype.showSubscriptionDialog = function (params) {
        this.subscriptionModal.showModal(params);
    };
    MainComponent.prototype.enterRightTopSubscriptionAD = function (position) {
        this.subscriptionAd.show(position);
    };
    MainComponent.prototype.leaveRightTopSubscriptionAD = function () {
        this.subscriptionAd.willHide();
    };
    MainComponent.prototype.isNeedShowDowndloadClient = function () {
        return !this.userService.userHasDownloadClient;
    };
    MainComponent.prototype.doDownloadPhantomPDFClient = function () {
        var _label_downfile = $("#downloadProductClient");
        var url = "";
        if (!this.globalService.isCNProEnv()) {
            url = "http://cdn01.foxitsoftware.com/pub/foxit/phantomPDF/desktop/win/9.x/9.0/en_us/online/FoxitPhantomPDF90_enu_Setup_FOleft.msi";
        }
        else {
            url = "http://cdn07.foxitsoftware.cn/pub/foxit/phantomPDF/desktop/win/9.x/9.0/zh_cn/FoxitPDFEditor90_Zh_Setup_FOleftcn.msi  ";
        }
        _label_downfile.attr("href", url);
        _label_downfile.attr("target", "_blank;");
        setTimeout(function () {
            document.getElementById('downloadProductClient').click();
        }, 500);
    };
    MainComponent.prototype.showActivateLicenseCodeDialog = function (params) {
        this.licenseCodeModal.showModal(params);
    };
    MainComponent.prototype.showSubscriptionNowDialog = function (params) {
        this.subscriptionNowModal.showModal(params);
    };
    MainComponent.prototype.signInGa = function (url, isSubscribed, isKey) {
        if (isKey === void 0) { isKey = false; }
        // PRO-4630 & PRO-4630
        if (!isSubscribed) {
            return;
        }
        var category = '';
        var active = '';
        if (/^\/view-and-edit(\?|$)/.test(url) || /^\/foxit-drive(\?|$)/.test(url) || /^\/shared-with-me(\?|$)/.test(url)) {
            category = 'Foxit Online';
            active = 'PhantomPDF Online ';
        }
        else if (/^\/phantompdf(\?|$)/.test(url) || /^\/preview(\/|\?|$)/.test(url)) {
            category = 'PhantomPDF Online web';
            active = 'PhantomPDF Online ';
        }
        else {
            return;
        }
        if (isKey) {
            active += 'Key Customer ';
        }
        else {
            active += 'Subscribe Customer ';
        }
        active += 'Sign in';
        this.globalService.sendGaEvent(category, active, '');
    };
    __decorate([
        ViewChild(PageHeaderComponent),
        __metadata("design:type", PageHeaderComponent)
    ], MainComponent.prototype, "header", void 0);
    __decorate([
        ViewChild(WebToolConvertComponent),
        __metadata("design:type", WebToolConvertComponent)
    ], MainComponent.prototype, "webToolModal", void 0);
    __decorate([
        ViewChild('activationSubscription'),
        __metadata("design:type", ActivationSubscriptionComponent)
    ], MainComponent.prototype, "activationSubscriptionModal", void 0);
    __decorate([
        ViewChild(SubscriptionComponent),
        __metadata("design:type", SubscriptionComponent)
    ], MainComponent.prototype, "subscriptionModal", void 0);
    __decorate([
        ViewChild(LicenseCodeComponent),
        __metadata("design:type", LicenseCodeComponent)
    ], MainComponent.prototype, "licenseCodeModal", void 0);
    __decorate([
        ViewChild(SubscriptionNowComponent),
        __metadata("design:type", SubscriptionNowComponent)
    ], MainComponent.prototype, "subscriptionNowModal", void 0);
    __decorate([
        ViewChild(SubscriptionAdComponent),
        __metadata("design:type", SubscriptionAdComponent)
    ], MainComponent.prototype, "subscriptionAd", void 0);
    MainComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'phantom-online',
            templateUrl: "./main.html",
            styleUrls: ['main.css']
        }),
        __metadata("design:paramtypes", [UserService,
            GlobalService,
            Router,
            SharedService,
            TranslateService,
            AuthenticationService,
            CookieService,
            DomSanitizer,
            NgZone])
    ], MainComponent);
    return MainComponent;
}());
export { MainComponent };
