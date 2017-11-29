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
 * Created by congting_zheng on 2017/5/31 0031.
 */
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService, SharedService } from '../../../services/index';
var SortableTableComponent = (function () {
    function SortableTableComponent(sharedService, globalService, translate) {
        this.sharedService = sharedService;
        this.globalService = globalService;
        this.translate = translate;
        this.fileItems = [];
        this.filesFromLocal = [];
        this.filesFromOnline = [];
        // count local files include deleted file
        this.fileTotalCountFromLocal = 0;
        this.firstFileInfo = null;
    }
    SortableTableComponent.prototype.ngOnInit = function () {
        //this.initEntryInfo(); add
        this.translate.instant('Webtools.Common.From');
        this.translate.instant('Webtools.Common.FoxitDrive');
        this.translate.instant('Webtools.Common.LocalDocument');
        this.translate.instant('Webtools.Common.OneDrive');
        var _this = this;
        Sortable.create(document.getElementById("sortable-handle-list"), {
            handle: ".drag-handle",
            animation: 150,
            filter: ".remove-handle",
            onFilter: function (evt) {
                var item = evt.item, ctrl = evt.target;
                if (Sortable.utils.is(ctrl, ".remove-handle")) {
                    var id = item.getElementsByClassName("drag-file-id")[0].innerText;
                    var index = item.getElementsByClassName("drag-file-isonline")[0].innerText;
                    _this.doRemoveItem(id, index);
                    item.parentNode.removeChild(item); // remove sortable item
                }
                /*else if (Sortable.utils.is(ctrl, ".js-edit")) {  // Click on edit link
                 // ...
                 }*/
            }
        });
    };
    SortableTableComponent.prototype.cleanFileItem = function () {
        this.fileTotalCountFromLocal = 0;
        this.fileItems.splice(0, this.fileItems.length);
        this.filesFromLocal.splice(0, this.filesFromLocal.length);
        this.filesFromOnline.splice(0, this.filesFromOnline.length);
    };
    SortableTableComponent.prototype.removeById = function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].fileId == id) {
                arr.splice(i, 1);
                break;
            }
        }
    };
    SortableTableComponent.prototype.getFileTotalCountFromLocal = function () {
        return this.fileTotalCountFromLocal;
    };
    SortableTableComponent.prototype.getFileAddress = function (mode) {
        var from = "";
        if (mode == CommonUtil.FileAddress.FoxitDrive) {
            from = this.translate.instant('Webtools.Common.FoxitDrive');
        }
        else if (mode == CommonUtil.FileAddress.Box) {
            from = this.translate.instant('Box');
        }
        else if (mode == CommonUtil.FileAddress.Dropbox) {
            from = this.translate.instant('Dropbox');
        }
        else if (mode == CommonUtil.FileAddress.GoogleDrive) {
            from = this.translate.instant('Google Drive');
        }
        else if (mode == CommonUtil.FileAddress.OneDrive) {
            from = this.translate.instant('OneDrive');
        }
        else {
            from = this.translate.instant('Webtools.Common.LocalDocument');
        }
        return from;
    };
    // fileId: from local : index; from online: doc-id
    SortableTableComponent.prototype.doAddItem = function (fileName, fileSize, fileId, fileAddress) {
        var _from = this.translate.instant('Webtools.Common.From') + " ";
        /*let _cloud:string = this.translate.instant('Webtools.Common.FoxitDrive');
        let _local:string = this.translate.instant('Webtools.Common.LocalDocument');
        let from:string = isOnline ? (_from + _cloud) :(_from + _local);*/
        var from = _from + this.getFileAddress(fileAddress);
        var isOnline = (fileAddress == CommonUtil.FileAddress.FoxitDrive) ? 1 : 0;
        var fileInfo = {
            fileName: fileName,
            fileSize: CommonUtil.getFileSize(fileSize),
            fileId: fileId,
            index: 0,
            from: from,
            isOnline: isOnline ? 1 : 0
        };
        fileInfo.index = isOnline ? 1 : 0;
        if (!isOnline) {
            fileInfo.index = this.fileTotalCountFromLocal;
            this.filesFromLocal.push(fileInfo);
            this.fileTotalCountFromLocal++;
        }
        else {
            this.filesFromOnline.push(fileInfo);
        }
        this.fileItems.push(fileInfo);
    };
    SortableTableComponent.prototype.doRemoveItem = function (fileId, isOnline) {
        var _isOnline = isOnline == "1" ? true : false;
        if (!isOnline) {
            this.removeById(this.filesFromLocal, fileId);
        }
        else {
            this.removeById(this.filesFromOnline, fileId);
        }
        this.removeById(this.fileItems, fileId);
    };
    SortableTableComponent.prototype.checkFileExistInOnline = function (id) {
        for (var _i = 0, _a = this.filesFromOnline; _i < _a.length; _i++) {
            var doc = _a[_i];
            if (doc.fileId == id) {
                return true;
            }
        }
        return false;
    };
    SortableTableComponent.prototype.getOnlineFileInfo = function (id) {
        for (var _i = 0, _a = this.filesFromOnline; _i < _a.length; _i++) {
            var doc = _a[_i];
            if (doc.fileId == id) {
                return doc;
            }
        }
        return null;
    };
    SortableTableComponent.prototype.getLocalFileInfo = function (index) {
        for (var _i = 0, _a = this.filesFromLocal; _i < _a.length; _i++) {
            var doc = _a[_i];
            if (doc.index == index) {
                return doc;
            }
        }
        return null;
    };
    SortableTableComponent.prototype.getOnlineDocsInfo = function () {
        var length = $("#sortable-handle-list>li").length;
        var index = 0;
        var _this = this;
        for (var i = 0; i < length; i++) {
            var child = $($("#sortable-handle-list>li")[i]);
            var isOnline = child.find(".drag-file-isonline")[0].innerText;
            if (isOnline == "1") {
                var id = child.find(".drag-file-id")[0].innerText;
                var _fileInfo = _this.getOnlineFileInfo(id);
                _fileInfo.index = _this.fileTotalCountFromLocal + index;
                index++;
            }
        }
        return this.filesFromOnline;
    };
    SortableTableComponent.prototype.getFileIndexList = function () {
        var fileSeqList = "";
        var index = 0;
        var _this = this;
        var length = $("#sortable-handle-list>li").length;
        var _fileInfo = null;
        var id = "";
        for (var i = 0; i < length; i++) {
            var child = $($("#sortable-handle-list>li")[i]);
            var isOnline = child.find(".drag-file-isonline")[0].innerText;
            if (isOnline == "1") {
                id = child.find(".drag-file-id")[0].innerText;
                _fileInfo = _this.getOnlineFileInfo(id);
                fileSeqList += _fileInfo.index;
            }
            else {
                id = child.find(".drag-file-id")[0].innerText;
                _fileInfo = _this.getLocalFileInfo(parseInt(id));
                fileSeqList += _fileInfo.index;
            }
            if (i == 0) {
                this.firstFileInfo = _fileInfo;
            }
            index++;
            if (index < length)
                fileSeqList += "_";
        }
        return fileSeqList;
    };
    SortableTableComponent.prototype.doSetIndexToItems = function () {
    };
    SortableTableComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'combined-docs',
            templateUrl: './sortable-list.html',
            styleUrls: ['./sortable-list.css']
        }),
        __metadata("design:paramtypes", [SharedService,
            GlobalService,
            TranslateService])
    ], SortableTableComponent);
    return SortableTableComponent;
}());
export { SortableTableComponent };
