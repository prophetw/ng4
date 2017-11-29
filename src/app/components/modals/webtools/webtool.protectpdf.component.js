/**
 * Created by rzg on 2017/6/3.
 */
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
import { ModalDirective } from 'ng2-bootstrap';
import { TranslateService } from '@ngx-translate/core';
var WebToolProtectPDFComponent = (function () {
    function WebToolProtectPDFComponent(translate) {
        this.translate = translate;
        this.srcPassword = "";
        this.ConfirmPassword = "";
        this.encryptionMode = "";
        this.postParamConf = null;
        this.ErrorWarning = "";
    }
    WebToolProtectPDFComponent.prototype.ngOnInit = function () {
    };
    WebToolProtectPDFComponent.prototype.showProtectPDFPage = function (callbackFunc) {
        this.webtool_protectpdf.show();
        this.postParamConf = callbackFunc;
    };
    WebToolProtectPDFComponent.prototype.hideProtectPDFPage = function () {
        this.webtool_protectpdf.hide();
    };
    WebToolProtectPDFComponent.prototype.changePasswordTextBorder = function () {
        $("#reset_protect_pwd").css("border-color", "");
        $("#set_protect_pwd").css("border-color", "");
        this.ErrorWarning = "";
        /*$("#pwd_nomatch").text("");*/
    };
    WebToolProtectPDFComponent.prototype.changePasswordConfirmTextBorder = function () {
        var _this = this;
        if (this.srcPassword.length < 6) {
            $("#set_protect_pwd").css("border-color", "red");
            this.translate.get('Webtools.ProtectPDF.LengthIsInvalid').subscribe(function (value) {
                _this.ErrorWarning = value;
            });
            /*var lenghtInfo = "The password must be between 6 and 20 characters.";
            $("#pwd_nomatch").text(lenghtInfo);*/
        }
        else {
            $("#set_protect_pwd").css("border-color", "");
            this.ErrorWarning = "";
            /*$("#pwd_nomatch").text("");*/
        }
        $("#reset_protect_pwd").css("border-color", "");
    };
    WebToolProtectPDFComponent.prototype.ignoreInvalidCharater = function (text) {
        var pattern = /[<>&]/g;
        if (pattern.test(text.value)) {
            text.value = text.value.replace(pattern, "");
        }
    };
    WebToolProtectPDFComponent.prototype.getProtectParameterInfo = function () {
        var _this = this;
        if (this.srcPassword.length > 20 || this.srcPassword.length < 6) {
            /*var lenghtInfo = "The password must be between 6 and 20 characters.";*/
            this.translate.get('Webtools.ProtectPDF.LengthIsInvalid').subscribe(function (value) {
                _this.ErrorWarning = value;
            });
            /*$("#pwd_nomatch").text(lenghtInfo);*/
            return "";
        }
        if (this.ConfirmPassword != this.srcPassword) {
            /*var compareInfo = "The two passwords don't match.";
            $("#pwd_nomatch").text(compareInfo);*/
            this.translate.get('Webtools.ProtectPDF.Password_NoMatch').subscribe(function (value) {
                _this.ErrorWarning = value;
            });
            $("#reset_protect_pwd").css("border-color", "red");
            return "";
        }
        var encryption_type = $("#encryption_type").find("option:selected")[0].value;
        var jsonInfo = "{" + "\"user_pwd\":" + "\"" + this.srcPassword + "\",\"pwd_mode\":\"" + encryption_type + "\"}";
        return jsonInfo;
    };
    WebToolProtectPDFComponent.prototype.addPasswordProtect = function () {
        var paramConf = this.getProtectParameterInfo();
        if (paramConf == "")
            return;
        this.hideProtectPDFPage();
        this.postParamConf(paramConf, false);
    };
    __decorate([
        ViewChild('webtool_protectpdf'),
        __metadata("design:type", ModalDirective)
    ], WebToolProtectPDFComponent.prototype, "webtool_protectpdf", void 0);
    WebToolProtectPDFComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'webtool-protectpdf',
            templateUrl: './webtool.protectpdf.convert.html',
            styleUrls: ['./webtool.protectpdf.convert.css']
        }),
        __metadata("design:paramtypes", [TranslateService])
    ], WebToolProtectPDFComponent);
    return WebToolProtectPDFComponent;
}());
export { WebToolProtectPDFComponent };
