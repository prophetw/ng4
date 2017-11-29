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
 * Created by rzg on 2017/6/7.
 */
import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { TranslateService } from '@ngx-translate/core';
var WebToolSplitPDFComponent = (function () {
    function WebToolSplitPDFComponent(translate) {
        this.translate = translate;
        this.isSplitFullPages = true;
        this.isValidSplitRange = false;
        this.isValidExtractRange = false;
        this.pageCount = 0;
        this.global_rangeinfo = "";
        this.example = 'Webtools.SplitPDF.Example';
        this.SplitMaxPageText = "";
        this.SplitExtractRangeText = "";
        this.TotalPageInfo = "(Total pages:0)";
        this.setSplitConfigureFunc = null;
        this.SplitButtonStyle_Normal = "background-color: #f7f7f7;color: #666666;border-color:#d1d1d1;";
        this.SplitButtonStyle_Hover = "background-color: #eaeaea;color: #666666;border-color:#d1d1d1;";
        this.SplitButtonStyle_Active = "background-color: #e1e1e1;color: #666666;border-color:#c3c3c3;";
        this.SplitButtonStyle_Unused = "background-color: #f7f7f7;color: #cccccc;border-color:#d1d1d1;";
    }
    WebToolSplitPDFComponent.prototype.ngOnInit = function () {
        this.initSplitPage();
    };
    WebToolSplitPDFComponent.prototype.initSplitPage = function () {
        $("#extract_range").attr("disabled", true);
        $("#extract_range").css("border-color", "");
        $("#split_range").attr("disabled", false);
        $("#setExtractInfo p").css("opacity", "0.5");
        $("#setSplitInfo p").css("opacity", "1");
        $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
    };
    WebToolSplitPDFComponent.prototype.SelectSplitMode_FromReader = function () {
        $("#extract_range").attr("disabled", true);
        $("#extract_range").css("border-color", "");
        $("#split_range").attr("disabled", false);
        $("#setExtractInfo p").css("opacity", "0.5");
        $("#setSplitInfo p").css("opacity", "1");
        if (this.isValidSplitRange) {
            $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
        }
        else {
            $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
        }
        this.isSplitFullPages = true;
    };
    WebToolSplitPDFComponent.prototype.SelectExtractMode_FromReader = function () {
        $("#split_range").attr("disabled", true);
        $("#split_range").css("border-color", "");
        $("#extract_range").attr("disabled", false);
        $("#setSplitInfo p").css("opacity", "0.5");
        $("#setExtractInfo p").css("opacity", "1");
        if (this.isValidExtractRange) {
            $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
        }
        else {
            $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
        }
        this.isSplitFullPages = false;
    };
    WebToolSplitPDFComponent.prototype.CheckSplitRange = function () {
        var pattern = /[^0-9]/g;
        if (pattern.test(this.SplitMaxPageText)) {
            this.SplitMaxPageText = this.SplitMaxPageText.replace(pattern, "");
            event.target.value = this.SplitMaxPageText;
            if (this.SplitMaxPageText == "") {
                $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
                this.isValidSplitRange = false;
            }
            return;
        }
        var count = Number(this.SplitMaxPageText);
        if (count > this.pageCount || count == 0) {
            $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
            this.isValidSplitRange = false;
        }
        else {
            $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
            this.isValidSplitRange = true;
        }
    };
    WebToolSplitPDFComponent.prototype.setButtonColor = function (idName) {
        if (this.global_rangeinfo == "") {
            this.isValidExtractRange = false;
            $(idName).attr("style", this.SplitButtonStyle_Unused);
        }
        else {
            this.isValidExtractRange = true;
            if (idName == "#SplitPDFButton") {
                $(idName).attr("style", this.SplitButtonStyle_Normal);
            }
            else {
                $(idName).attr("style", this.SplitButtonStyle_Normal);
            }
        }
    };
    WebToolSplitPDFComponent.prototype.CheckExtractRange = function () {
        var pattern = /[^0-9-,]/g;
        if (pattern.test(this.SplitExtractRangeText)) {
            event.target.value = this.SplitExtractRangeText.replace(pattern, "");
            return;
        }
        this.global_rangeinfo = "";
        var rangeArray = new Array();
        rangeArray = this.SplitExtractRangeText.split(",");
        for (var i = 0; i < rangeArray.length; i++) {
            var rangeInfo = rangeArray[i];
            if (rangeInfo == "") {
                continue;
            }
            var pageNum = new Array();
            pageNum = rangeInfo.split("-");
            if (pageNum.length > 2)
                continue;
            if (pageNum.length == 2) {
                if (pageNum[0] == "" || pageNum[1] == "")
                    continue;
                else {
                    var firstValue = Number(pageNum[0]);
                    var secondValue = Number(pageNum[1]);
                    if (firstValue > secondValue)
                        continue;
                    if (firstValue == 0 || secondValue == 0)
                        continue;
                    if (secondValue > this.pageCount)
                        continue;
                    this.global_rangeinfo += rangeInfo + ",";
                }
            }
            else {
                var value = Number(pageNum[0]);
                if (value == 0 || value > this.pageCount)
                    continue;
                this.global_rangeinfo += rangeInfo + ",";
            }
        }
        if (this.global_rangeinfo.length != 0 && this.global_rangeinfo[this.global_rangeinfo.length - 1] == ',') {
            this.global_rangeinfo = this.global_rangeinfo.substring(0, this.global_rangeinfo.length - 1);
        }
        this.setButtonColor("#SplitPDFButton");
    };
    WebToolSplitPDFComponent.prototype.getDataJsonFromExtractPagesMode = function () {
        var jsonData = "";
        jsonData += "{\"splitmode\":\"extractpages\",";
        jsonData += "\"maxpage\":\"1\",";
        jsonData += "\"rangeinfo\":\"" + this.global_rangeinfo + "\"}";
        return jsonData;
    };
    WebToolSplitPDFComponent.prototype.getDataJsonFromSplitPDFMode_Reader = function () {
        var jsonData = "";
        var maxpage = this.SplitMaxPageText;
        if (maxpage == undefined || maxpage == "") {
            return "";
        }
        else if (parseInt(maxpage) == 0) {
            return "";
        }
        else {
            if (parseInt(maxpage) > this.pageCount) {
                return "";
            }
            jsonData += "{\"splitmode\":\"splitpage\",\"maxpage\":\"" + maxpage + "\"}";
        }
        return jsonData;
    };
    WebToolSplitPDFComponent.prototype.getSplitDataJson = function () {
        if (!this.isSplitFullPages && this.global_rangeinfo == "")
            return "";
        var jsonData = "";
        if (this.isSplitFullPages) {
            jsonData = this.getDataJsonFromSplitPDFMode_Reader();
        }
        else {
            jsonData = this.getDataJsonFromExtractPagesMode();
        }
        return jsonData;
    };
    WebToolSplitPDFComponent.prototype.showSplitPDFPage = function (pageCount, callbackFunc) {
        var _this = this;
        this.pageCount = pageCount;
        this.translate.get('Webtools.SplitPDF.TotalPage').subscribe(function (value) {
            _this.TotalPageInfo = value + pageCount;
        });
        /*this.TotalPageInfo = "Total page:" + pageCount;*/
        this.setSplitConfigureFunc = callbackFunc;
        this.webtool_splitpdf.show();
    };
    WebToolSplitPDFComponent.prototype.hideSplitPDFPage = function () {
        this.webtool_splitpdf.hide();
    };
    WebToolSplitPDFComponent.prototype.onStartSplitPDF = function () {
        var conf = this.getSplitDataJson();
        if (conf == "")
            return;
        $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Active);
        this.hideSplitPDFPage();
        this.setSplitConfigureFunc(conf, this.isSplitFullPages);
    };
    WebToolSplitPDFComponent.prototype.mouseEnterEvent = function () {
        if (this.isSplitFullPages) {
            if (this.isValidSplitRange) {
                $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Hover);
            }
        }
        else {
            if (this.isValidExtractRange) {
                $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Hover);
            }
        }
    };
    WebToolSplitPDFComponent.prototype.mouseLeaveEvent = function () {
        if (this.isSplitFullPages) {
            if (this.isValidSplitRange) {
                $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
            }
        }
        else {
            if (this.isValidExtractRange) {
                $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
            }
        }
    };
    __decorate([
        ViewChild('webtool_splitpdf'),
        __metadata("design:type", ModalDirective)
    ], WebToolSplitPDFComponent.prototype, "webtool_splitpdf", void 0);
    WebToolSplitPDFComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'webtool-splitpdf',
            templateUrl: './webtool.splitpdf.convert.html',
            styleUrls: ['./webtool.splitpdf.convert.css']
        }),
        __metadata("design:paramtypes", [TranslateService])
    ], WebToolSplitPDFComponent);
    return WebToolSplitPDFComponent;
}());
export { WebToolSplitPDFComponent };
