var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { GlobalService } from "../../services/global.service";
import { SharedService } from "../../services/shared.service";
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from "../../services/share.service";
var WebpdfPreviewComponent = (function () {
    function WebpdfPreviewComponent(globalService, sharedService, sanitizer, shareService, route, router) {
        var _this = this;
        this.globalService = globalService;
        this.sharedService = sharedService;
        this.sanitizer = sanitizer;
        this.shareService = shareService;
        this.route = route;
        this.router = router;
        this.canShare = true;
        this.globalService.showAside = false;
        this.globalService.isCloudReading = false;
        if (this.globalService.isMobile) {
            this.globalService.showHeader = false;
        }
        this.route
            .params
            .subscribe(function (params) {
            var url;
            var cmisid;
            var name;
            var unSafeUrl;
            var uuid;
            var ucnd = false;
            var descriptionObj;
            if (_this.globalService.getDevice() === 'mobile') {
                //this.errorCode='NOT_SUPPORT_MOBILE';
                //return false;
            }
            if (params['url']) {
                url = params['url'];
                if (!params['cmisid']) {
                    cmisid = '';
                }
                else {
                    cmisid = params['cmisid'];
                }
                if (params['name']) {
                    name = params['name'];
                }
                else {
                    name = '';
                }
                url = encodeURIComponent(decodeURIComponent(url));
                unSafeUrl = '/foxit-webpdf-web/webapp/' +
                    _this.globalService.getDevice() +
                    '/index.html?extend-phantom=&al=' +
                    _this.globalService.getLanguage() +
                    '&object_id=' + cmisid +
                    '&docuri=' + url + '&docname=' + encodeURIComponent(name);
                console.log(unSafeUrl);
                _this.previewUrl = _this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
            }
            else if (params['drive_name']) {
                var folder_id = '';
                if (params['path']) {
                    folder_id = params['path'];
                }
                var netDriveName = params['drive_name'];
                var netDriveFileId = params['file_id'];
                var extra_params = '';
                if (params['extra_params']) {
                    extra_params = decodeURIComponent(params['extra_params']);
                }
                unSafeUrl = '/foxit-webpdf-web/webapp/' + _this.globalService.getDevice() +
                    '/index.html?extend-phantom=&al=' + _this.globalService.getLanguage()
                    + '&source=' + netDriveName
                    + '&folderid=' + folder_id
                    + '&object_id=' + netDriveFileId
                    + '&ucnd=' + ucnd
                    + extra_params;
                console.log(unSafeUrl);
                _this.previewUrl = _this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
            }
            else if (params['cmisid']) {
                cmisid = params['cmisid'];
                var extra_params = '';
                if (params['extra_params']) {
                    extra_params = decodeURIComponent(params['extra_params']);
                }
                _this.globalService.inputFile = null;
                _this.shareService.getCmisDocumentById(cmisid, true)
                    .subscribe(function (data) {
                    if (data && data.data && data.data.pdf_preview_url) {
                        if (data.data.cmis_document && data.data.cmis_document.properties && data.data.cmis_document.properties['cmis:description']) {
                            try {
                                descriptionObj = JSON.parse(data.data.cmis_document.properties['cmis:description']);
                                if (!descriptionObj.canDownload) {
                                    ucnd = true;
                                }
                            }
                            catch (e) {
                            }
                        }
                        url = encodeURIComponent(decodeURIComponent(data.data.pdf_preview_url));
                        if (_this.globalService.currentUserEmail && data.data.cmis_document.properties['cmis:createdBy'] == _this.globalService.currentUserEmail) {
                            ucnd = false;
                        }
                        unSafeUrl = '/foxit-webpdf-web/webapp/' +
                            _this.globalService.getDevice() +
                            '/index.html?extend-phantom=&al=' +
                            _this.globalService.getLanguage() +
                            '&docuri=' + url + '&object_id=' + cmisid +
                            '&ucnd=' + ucnd +
                            '&docname=' + encodeURIComponent(data.data.cmis_document.properties['cmis:name']) +
                            extra_params;
                        if (_this.globalService.currentUserEmail && data.data.cmis_document.properties['cmis:createdBy'] == _this.globalService.currentUserEmail) {
                            _this.canShare = true;
                        }
                        else {
                            _this.canShare = false;
                        }
                        _this.previewUrl = _this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
                    }
                    else {
                        if (data.ret === 200001) {
                            _this.errorCode = data.msg;
                        }
                        else if (data.ret === 100003) {
                            _this.errorCode = data.msg;
                        }
                        else {
                            _this.errorCode = 'CAN_NOT_PREVIEW';
                            _this.fileName = data.data.cmis_document.properties['cmis:name'];
                            _this.downloadUrl = data.data.download_url;
                        }
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            else if (params['uuid']) {
                uuid = params['uuid'];
                unSafeUrl = '/foxit-webpdf-web/webapp/' + _this.globalService.getDevice() + '/index.html?extend-phantom=&al=' + _this.globalService.getLanguage() + '&docuri=' + uuid;
                console.log(unSafeUrl);
                _this.previewUrl = _this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
            }
            else {
                // e.g., /preview/customparameters/%26docuri%3dhttps%253a%252f%252ftest123
                if (_this.router.url.indexOf('customparameters') !== -1) {
                    console.log('customparameters: ' + params['params']); // &docuri=https%3a%2f%2ftest123, it's already Decoded Value from %26docuri%3dhttps%253a%252f%252ftest123
                    //var extend_params = decodeURIComponent(params['params']);
                    var extend_params = params['params']; // Imporant! cannot decode again for params['params'], because we should keep the value of docuri encoded
                    console.log('customparameters: ' + extend_params);
                    var clearn_params = decodeURIComponent(extend_params);
                    var urlObj = _this.globalService.urlParaToObj(clearn_params);
                    if (urlObj && urlObj['al']) {
                        console.log('====customparameters');
                        console.log(urlObj);
                        var lang = urlObj['al'];
                        _this.sharedService.broadcast({
                            name: 'change-language',
                            lang: lang
                        });
                    }
                    // CPDFI-1071, do not force login for preview/customparameters/:params
                    /*
                    if (!this.globalService.currentUserToken) {
                      window.angularHeaderComponent.showSignInModal();
                      return;
                    }
                    */
                    //unSafeUrl = '/foxit-webpdf-web/webapp/' + this.globalService.getDevice() + '/index.html?extend-phantom=&al=' + this.globalService.getLanguage() + extend_params;
                    unSafeUrl = '/foxit-webpdf-web/webapp/' + _this.globalService.getDevice() + '/index.html?extend-phantom=' + extend_params;
                    console.log(unSafeUrl);
                    _this.previewUrl = _this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
                }
                else {
                    //error
                    var extra_params = '';
                    if (params['extra_params']) {
                        extra_params = decodeURIComponent(params['extra_params']);
                    }
                    if (_this.globalService.inputFile !== null || window.location.pathname.indexOf("/preview") != 0) {
                        unSafeUrl = '/foxit-webpdf-web/webapp/' + _this.globalService.getDevice()
                            + '/index.html?extend-phantom=&al=' + _this.globalService.getLanguage()
                            + extra_params;
                        console.log(unSafeUrl);
                        _this.previewUrl = _this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
                    }
                    else {
                        _this.router.navigate(['/']);
                    }
                }
            }
        });
        this.sharedService.on('login-event', function (event) {
            if (document.getElementById('preview-frame')) {
                console.log('login-event');
                var iframe = document.getElementById('preview-frame');
                iframe.contentWindow.WebPDF.onSignIn();
            }
        });
        this.sharedService.on('logout-event', function (event) {
            if (document.getElementById('preview-frame')) {
                console.log('logout-event');
                var iframe = document.getElementById('preview-frame');
                iframe.contentWindow.WebPDF.onAfterSignOut(_this.globalService.currentUserEmail, function () {
                    //window.parent.angularHeaderComponent.zone.run(function () {
                    //  window.parent.angularHeaderComponent.changeRouter(['/view-and-edit']);
                    //});
                });
            }
        });
        this.sharedService.on('logout-before-event', function (event) {
            if (document.getElementById('preview-frame')) {
                console.log('logout-before-event');
                var iframe = document.getElementById('preview-frame');
                iframe.contentWindow.WebPDF.onBeforeSignOut(_this.globalService.currentUser.user_id, function () {
                    console.log("logout-before-event callback");
                    window.parent.angularHeaderComponent.zone.run(function () {
                        window.parent.angularHeaderComponent.signOut();
                    });
                });
            }
        });
    }
    WebpdfPreviewComponent.prototype.onPreviewIframeLoad = function () {
        var iframe = document.getElementById('preview-frame');
        // if current user is not doc owner  hide the share icon
        if (iframe && iframe.contentWindow && iframe.contentWindow.PhantomOnline && !this.canShare) {
            iframe.contentWindow.PhantomOnline.hideShareIcon();
        }
    };
    WebpdfPreviewComponent.prototype.previewGoback = function () {
        window.angularHeaderComponent.zone.run(function () {
            return window.angularHeaderComponent.goBack();
        });
    };
    WebpdfPreviewComponent.prototype.ngOnInit = function () {
        $('#top').addClass('top-for-webviewer').hide();
        $('.main-container').addClass('main-for-webviewer');
    };
    WebpdfPreviewComponent.prototype.ngOnDestroy = function () {
        $('#top').removeClass('top-for-webviewer').show();
        $('.main-container').removeClass('main-for-webviewer');
    };
    WebpdfPreviewComponent = __decorate([
        Component({
            moduleId: module.id,
            templateUrl: './index.html',
            styleUrls: ['../share/index.css']
        }),
        __metadata("design:paramtypes", [GlobalService,
            SharedService,
            DomSanitizer,
            ShareService,
            ActivatedRoute,
            Router])
    ], WebpdfPreviewComponent);
    return WebpdfPreviewComponent;
}());
export { WebpdfPreviewComponent };
