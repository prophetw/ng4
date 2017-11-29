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
 * Created by congting_zheng on 2017/5/10 0010.
 */
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, SharedService } from '../../../services/index';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'angular2-cookie/core';
import { FileUploader } from 'ng2-file-upload/file-upload/file-uploader.class';
// import {User} from "../../../models/user";
import { WebToolService, WebToolFileInfo, WebToolMultiFileInfos } from '../../../services/webtool.service';
import { WebToolEntryService } from '../../../services/webtool.entry.service';
import { WebToolHeaderFooterComponent } from './webtools.headerfooter.component';
import { SortableTableComponent } from '../../commons/sortable-list/sortable-list.component';
import { WebToolProtectPDFComponent } from "./webtool.protectpdf.component";
import { WebToolWatermarkComponent } from "./webtool.watermark.component";
import { WebToolSplitPDFComponent } from "./webtool.splitpdf.component";
var WebToolConvertComponent = (function () {
    function WebToolConvertComponent(sharedService, globalService, sanitizer, webToolService, router, WebtoolEntry, translate, cookieService, 
        //private cd:ChangeDetectorRef,
        zone) {
        this.sharedService = sharedService;
        this.globalService = globalService;
        this.sanitizer = sanitizer;
        this.webToolService = webToolService;
        this.router = router;
        this.WebtoolEntry = WebtoolEntry;
        this.translate = translate;
        this.cookieService = cookieService;
        this.zone = zone;
        /*@ViewChild('webToolDownloadPage') public webToolDownloadPage:ModalDirective;*/
        this.isActiveInput = true;
        //private webToolService: WebToolService;
        this.cmisUrls = {
            img2pdf: "/cloud-reading/index.html?pluginUI=pluginList&fileType=image",
            mergepdf: "/cloud-reading/index.html?pluginUI=pluginList&fileType=pdf",
            convertpdf: "/cloud-reading/index.html?pluginUI=pluginList&fileSelectMode=single"
            /*    word2pdf:"/cloud-reading/index.html?pluginUI=pluginList&fileSelectMode=single",
             ppt2pdf:"/cloud-reading/index.html?pluginUI=pluginList&fileSelectMode=single&fileType=ppt",
             excel2pdf:"/cloud-reading/index.html?pluginUI=pluginList&fileSelectMode=single&fileType=excel"*/
        };
        this.cmisUrl = '';
        this.modalHeaderText = "";
        this.progressWidth = "0%";
        this.phantomLoginSwitchIsOn = false;
        this.loading = false;
        this.googleLoading = false;
        this.isShown = false;
        this.isShownForConvertPage = false;
        this.isUploadFile = false;
        this.isNeedCheckFoxitDriveFiles = false;
        this.isSolidTool = true;
        this.isResultPage = false;
        this.isOpenLocalDocument = true;
        this.isOpenOnlineDocument = false;
        this.isOpenOneDriveDocument = false;
        this.isSupportCombined = false;
        this.isLastSelectOnline = false;
        this.isShowCombinedTable = false;
        this.isConvertMultiFiles = false;
        this.isSuccessToConvert = true;
        this.isFailToUploadCmis = false;
        this.fileName = "";
        this.isAutoDownLoadFile = false;
        this.modeImage = "img/pdffile.png";
        this.solidInfo = "";
        this.ConvertPermission = "";
        this.resultSaveInfo = "";
        this.tipForSavingTitle = "Foxit Reader Online";
        this.isNotShowTipForSave = false;
        this.isOnlineForSourceFile = false;
        this.convertedResultData = {
            ret: "",
            url: "",
            isDocId: false,
            isAllPage: false,
            //isOnline:false,
            fileSourceType: 0
        }; // localfile
        this.fileSourceType = {
            localfile: 0,
            foxitdrive: 1,
            box: 2,
            dropbox: 3,
            googledrive: 4,
            onedrive: 5
        };
        this.tipFileInfos = {};
        this.uploader = new FileUploader({});
        this.multiFiles = null;
        this.combinedFileCount = 0;
        this.isdrivedisplay = 'none';
        this.loginouturl = '';
        this.OnlineFileInfo = {
            mode: "",
            fileName: ""
        };
        this.uiEntrys = {
            btnConvert: "Convert",
            btnAdd: "Add",
            btnCancel: "Cancel",
        };
        this.driveurl = this.sanitizer.bypassSecurityTrustResourceUrl("");
        this.tipError = {
            CMISResponseError: "84000001",
            ConnectCmisError: "84000002",
        };
        this.oneDrive_folderID = "";
        this.oneDrive_fileID = "";
        this.oneDriveIframe = null;
        this.oneDriveName = null;
        this.cmisUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
        //this.cmisUrl=this.sanitizer.bypassSecurityTrustResourceUrl(this.cmisUrls.convertpdf+'&lang='+this.globalService.language);
        //this.cd = cd;
    }
    WebToolConvertComponent.prototype.ngOnInit = function () {
        this.initEntryInfo();
        this.initResultPageInfo();
        this.initOnlineFileInfo();
    };
    WebToolConvertComponent.prototype.initOnlineFileInfo = function () {
        this.OnlineFileInfo.mode = "";
        this.OnlineFileInfo.fileName = "";
    };
    WebToolConvertComponent.prototype.setOnlineFileInfo = function (mode, fileName) {
        this.initOnlineFileInfo();
        this.OnlineFileInfo.mode = mode;
        this.OnlineFileInfo.fileName = fileName;
    };
    WebToolConvertComponent.prototype.getOnlineModeName = function () {
        return this.OnlineFileInfo.mode;
    };
    WebToolConvertComponent.prototype.initResultPageInfo = function () {
        this.ConvertPermission = "";
        this.resultInfo = "";
        this.resultSaveInfo = "";
    };
    WebToolConvertComponent.prototype.initEntryInfo = function () {
        this.translate.instant('Webtools.Excel2PDF.Success');
        this.translate.instant('Webtools.Excel2PDF.FailConvert');
        this.translate.instant('Webtools.Excel2PDF.LimitPageSize');
        this.translate.instant('Webtools.HeaderFooter.Success');
        this.translate.instant('Webtools.HeaderFooter.FailConvert');
        this.translate.instant('Webtools.HeaderFooter.LimitPageSize');
        this.translate.instant('Webtools.HeaderFooter.Drm_NoLoggin');
        this.translate.instant('Webtools.HeaderFooter.Drm_NoPermission');
        this.translate.instant('Webtools.Img2PDF.Success');
        this.translate.instant('Webtools.Img2PDF.FailConvert');
        this.translate.instant('Webtools.Img2PDF.LimitPageSize');
        this.translate.instant('Webtools.MergePDF.Success');
        this.translate.instant('Webtools.MergePDF.FailConvert');
        this.translate.instant('Webtools.MergePDF.LimitPageSize');
        this.translate.instant('Webtools.PDF2CPDF.Success');
        this.translate.instant('Webtools.PDF2CPDF.FailConvert');
        this.translate.instant('Webtools.PDF2CPDF.LimitPageSize');
        this.translate.instant('Webtools.PDF2Excel.Success');
        this.translate.instant('Webtools.PDF2Excel.FailConvert');
        this.translate.instant('Webtools.PDF2Excel.LimitPageSize');
        this.translate.instant('Webtools.PDF2Excel.SolidInfo');
        this.translate.instant('Webtools.PDF2PPT.Success');
        this.translate.instant('Webtools.PDF2PPT.FailConvert');
        this.translate.instant('Webtools.PDF2PPT.LimitPageSize');
        this.translate.instant('Webtools.PDF2PPT.SolidInfo');
        this.translate.instant('Webtools.Excel2PDF.Success');
        this.translate.instant('Webtools.Excel2PDF.FailConvert');
        this.translate.instant('Webtools.Excel2PDF.LimitPageSize');
        this.translate.instant('Webtools.PDF2HTML.Success');
        this.translate.instant('Webtools.PDF2HTML.FailConvert');
        this.translate.instant('Webtools.PDF2HTML.LimitPageSize');
        this.translate.instant('Webtools.PDF2Img.Success');
        this.translate.instant('Webtools.PDF2Img.FailConvert');
        this.translate.instant('Webtools.PDF2Img.LimitPageSize');
        this.translate.instant('Webtools.PDF2Text.Success');
        this.translate.instant('Webtools.PDF2Text.FailConvert');
        this.translate.instant('Webtools.PDF2Text.LimitPageSize');
        this.translate.instant('Webtools.Text2PDF.Success');
        this.translate.instant('Webtools.Text2PDF.FailConvert');
        this.translate.instant('Webtools.Text2PDF.LimitPageSize');
        this.translate.instant('Webtools.PDF2Word.Success');
        this.translate.instant('Webtools.PDF2Word.FailConvert');
        this.translate.instant('Webtools.PDF2Word.LimitPageSize');
        this.translate.instant('Webtools.PDF2Word.SuccessLimit');
        this.translate.instant('Webtools.PDF2Word.SolidInfo');
        this.translate.instant('Webtools.PPT2PDF.Success');
        this.translate.instant('Webtools.PPT2PDF.FailConvert');
        this.translate.instant('Webtools.PPT2PDF.LimitPageSize');
        this.translate.instant('Webtools.ProtectPDF.Success');
        this.translate.instant('Webtools.ProtectPDF.FailConvert');
        this.translate.instant('Webtools.ProtectPDF.LimitPageSize');
        this.translate.instant('Webtools.SaveFile.Tip.SaveTo');
        this.translate.instant('Webtools.SaveFile.Tip.SaveToCloud');
        this.translate.instant('Webtools.SaveFile.Tip.SaveToEnd');
        this.translate.instant('Webtools.SaveFile.Tip.SaveToLocal');
        this.translate.instant('PhantomPDF Online');
        this.translate.instant('Foxit Reader Online');
        this.translate.instant('Webtools.SplitPDF.Success');
        this.translate.instant('Webtools.SplitPDF.FailConvert');
        this.translate.instant('Webtools.SplitPDF.LimitPageSize');
        this.translate.instant('Webtools.Watermark.Success');
        this.translate.instant('Webtools.Watermark.FailConvert');
        this.translate.instant('Webtools.Watermark.LimitPageSize');
        this.translate.instant('Webtools.Watermark.Drm_NoLoggin');
        this.translate.instant('Webtools.Watermark.Drm_NoPermission');
        this.translate.instant('Webtools.Word2PDF.Success');
        this.translate.instant('Webtools.Word2PDF.FailConvert');
        this.translate.instant('Webtools.Word2PDF.LimitPageSize');
        this.translate.instant('Webtools.CompressPDF.Success');
        this.translate.instant('Webtools.CompressPDF.FailConvert');
        this.translate.instant('Webtools.CompressPDF.LimitPageSize');
        this.translate.instant('Webtools.CompressPDF.Drm_NoLoggin');
        this.translate.instant('Webtools.CompressPDF.Drm_NoPermission');
        this.translate.instant('Webtools.PDFFlatten.Success');
        this.translate.instant('Webtools.PDFFlatten.FailConvert');
        this.translate.instant('Webtools.PDFFlatten.LimitPageSize');
        this.translate.instant('Webtools.RedactPDF.LimitPageSize');
        this.translate.instant('Webtools.PageOrganizer.LimitPageSize');
        this.translate.instant('Webtools.Error.71000001');
        this.translate.instant('Webtools.Error.71000003');
        this.translate.instant('Webtools.Error.71000004');
        /*    this.translate.instant('Webtools.Error.71000007');
            this.translate.instant('Webtools.Error.71000008');*/
        this.translate.instant('Webtools.Error.82000020');
        /*this.translate.instant('Webtools.Error.82000021');*/
        this.translate.instant('Webtools.Error.84000001');
        this.translate.instant('Webtools.Error.84000002');
        this.translate.instant('Webtools.Error.84000003');
        this.translate.instant('Webtools.Error.84000004');
        this.translate.instant('Webtools.Error.84000005');
        this.translate.instant('Webtools.Error.84000006');
        this.translate.instant('Webtools.Common.PageNumberIsOverstep');
    };
    WebToolConvertComponent.prototype.initParameters = function () {
        this.isUploadFile = false;
        this.isShownForConvertPage = false;
        this.isShown = false;
        this.isOpenLocalDocument = true;
        this.isOpenOnlineDocument = false;
        this.isSupportCombined = false;
        this.isSuccessToConvert = true;
        this.isFailToUploadCmis = false;
        this.fileName = "";
        this.isAutoDownLoadFile = false;
        $("#local_doc_mode").addClass("selected");
        $("#cmis_doc_mode").removeClass("selected");
        this.webToolService.clearCacheData();
        this.webToolService.cleanFileCache();
        this.isResultPage = false;
        this.initResultPageInfo();
    };
    WebToolConvertComponent.prototype.selectedFileOnChanged = function (event) {
        // output selected file.
        console.log(event.target.value);
        if (this.uploader.queue.length <= 0 && this.multiFiles.length == 0)
            return;
        this.uploadFile();
        //let element = event.srcElement;
        //let target = event.target;
        //console.log('clean selectedFileOnChanged: ' + target.value);
        //console.log('clean selectedFileOnChanged: ' + element.value);
        //element.value = '';
        //console.log('finish selectedFileOnChanged: ' + element.value);
    };
    WebToolConvertComponent.prototype.fileOverBase = function (event) {
        // drop file to target position
        console.log(event.target.value);
    };
    WebToolConvertComponent.prototype.fileDropOver = function (event) {
        // finish drop and release mouse
        //console.log(event.target.value);
        this.uploadFile();
        //this.uploader.queue[0].remove();
    };
    WebToolConvertComponent.prototype.uploadFile = function () {
        // uploadFile
        console.log("uploadFile....");
        this.isUploadFile = true;
        this.initOnlineFileInfo();
        if (CommonUtil.isNavigateToWebPDF(this.modeType)) {
            if (this.uploader.queue.length == 0) {
                return;
            }
            CommonUtil.addGAInfoByType(this.modeType);
            this.onNavigateToWebPDF(this.modeType, this.uploader.queue[0]._file, null, this.fileSourceType.localfile);
            //this.onNavigateToWebPDFPageOrganizer(this.uploader.queue[0]._file, null);
            return;
        }
        if (CommonUtil.isUploadMultiFiles(this.modeType)) {
            this.fileName = this.multiFiles[0].name;
            this.fileName = CommonUtil.ResetFileName(this.fileName, 40);
            this.webToolService.doUploadByXHR(this.multiFiles, this.modeType, this);
        }
        else {
            this.fileName = this.uploader.queue[0]._file.name;
            this.fileName = CommonUtil.ResetFileName(this.fileName, 40);
            this.webToolService.doUpload(this.uploader, this.modeType, this);
        }
    };
    WebToolConvertComponent.prototype.uploadResultFileToOneDrive = function () {
    };
    WebToolConvertComponent.prototype.uploadProgressWidth = function (percent) {
        $("#progress_bar").css("width", percent);
    };
    WebToolConvertComponent.prototype.showConvertPage = function () {
        this.webToolModal.hide();
        this.webToolModalConvert.show();
    };
    WebToolConvertComponent.prototype.setResultInformation = function (ret, isAllPages, mode, fileSourceType) {
        this.initResultPageInfo();
        var isOnline = this.isOnlineForSourceFile;
        if (!isOnline) {
            isOnline = fileSourceType != this.fileSourceType.localfile;
        }
        var result = this.WebtoolEntry.getErrorEntry(ret, isAllPages, mode, isOnline);
        //let reslut = WebtoolEntryManager.getErrorEntry(ret, isAllPages, mode);
        if (result.ConvertInfo != "")
            this.resultInfo = this.translate.instant(result.ConvertInfo);
        if (result.PermissionInfo != "")
            this.ConvertPermission = this.translate.instant(result.PermissionInfo);
        if (result.SaveInfo != "") {
            this.resultSaveInfo = this.translate.instant(result.SaveInfo);
            if (result.IsOnline) {
                var name_1 = this.onGetNetDriveCommonNameByNetDriveType(fileSourceType);
                this.resultSaveInfo += name_1;
                this.resultSaveInfo += this.translate.instant("Webtools.SaveFile.Tip.SaveToEnd");
            }
        }
    };
    WebToolConvertComponent.prototype.uploadError = function (result) {
        this.isSuccessToConvert = false;
        this.setResultInformation(result, true, this.modeType, 0);
        //this.resultInfo = this.tipFileInfos[result];
        this.webToolModal.hide();
        this.isResultPage = true;
        var _this = this;
        //_this.cd.markForCheck();
        //_this.cd.detectChanges();
        setTimeout(function () {
            _this.isResultPage = false;
            // _this.cd.markForCheck();
            // _this.cd.detectChanges();
        }, 6000);
    };
    WebToolConvertComponent.prototype.doShowErrorMessageForSelectFile = function (result) {
        if (this.isResultPage)
            return;
        this.isSuccessToConvert = false;
        this.setResultInformation(result, true, this.modeType, 0);
        //this.resultInfo = this.tipFileInfos[result];
        this.isResultPage = true;
        var _this = this;
        setTimeout(function () {
            _this.isResultPage = false;
        }, 6000);
    };
    WebToolConvertComponent.prototype.onFinishUpload = function (fileInfos) {
        // clean
        this.uploader.clearQueue();
        this.multiFiles = null;
        // notify
        switch (this.modeType) {
            case CommonUtil.ConvertType.IMGTOPDF:
            case CommonUtil.ConvertType.MERGEPDF: {
                this.isUploadFile = false;
                for (var _i = 0, fileInfos_1 = fileInfos; _i < fileInfos_1.length; _i++) {
                    var fileInfo = fileInfos_1[_i];
                    //let _fileInfo = {fileName:item._file.name, index: item.index, fileSize:item._file.size};
                    //public doAddItem(fileName:string, fileSize:number, fileId:string, isOnline:boolean )
                    var id = this.sortableTable.getFileTotalCountFromLocal().toString();
                    this.sortableTable.doAddItem(fileInfo.fileName, fileInfo.fileSize, id, fileInfo.from);
                }
                this.combinedFileCount = this.sortableTable.fileItems.length;
                this.onSwitchCombinedDocs();
                //this.cd.markForCheck();
                //this.cd.detectChanges();
                break;
            }
            default: {
                break;
            }
        }
    };
    WebToolConvertComponent.prototype.onNavigateToWebPDF = function (modeType, file, docId, fileSourceType) {
        this.webToolModal.hide();
        var extra_params = "";
        switch (modeType) {
            case CommonUtil.ConvertType.PAGEORGANIZER: {
                extra_params = "&viewermodel=1";
                break;
            }
            case CommonUtil.ConvertType.PDFREDACTOR: {
                extra_params = "&viewermodel=2";
                break;
            }
        }
        switch (fileSourceType) {
            case this.fileSourceType.localfile: {
                this.globalService.inputFile = file;
                window.angularHeaderComponent.getLastFile();
                this.router.navigate(['/preview', encodeURIComponent(extra_params)]);
                break;
            }
            case this.fileSourceType.foxitdrive: {
                this.router.navigate(['/preview/cmis/', encodeURIComponent(docId), encodeURIComponent(extra_params)]);
                break;
            }
            case this.fileSourceType.box:
            case this.fileSourceType.dropbox:
            case this.fileSourceType.googledrive:
            case this.fileSourceType.onedrive: {
                var netDriveName = this.oneDriveName;
                if (CommonUtil.isNullOrUndefined(this.oneDrive_folderID)) {
                    this.router.navigate(['/preview/netdrive/', netDriveName, encodeURIComponent(docId), encodeURIComponent(extra_params)]);
                }
                else {
                    this.router.navigate(['/preview/netdrive/', netDriveName, encodeURIComponent(docId), encodeURIComponent(extra_params),
                        encodeURIComponent(this.oneDrive_folderID)]);
                }
                break;
            }
            default: {
                console.log("onNavigateToWebPDFPreview parameters is invalid. modeType=" + modeType + ",type=" + fileSourceType);
                break;
            }
        }
    };
    WebToolConvertComponent.prototype.onNavigateToWebPDFRedactor = function (file, docId, fileSourceType) {
        this.webToolModal.hide();
        if (!CommonUtil.isNullOrUndefined(file)) {
            this.globalService.inputFile = file;
            window.angularHeaderComponent.getLastFile();
            this.router.navigate(['/preview', encodeURIComponent("&viewermodel=2")]);
        }
        else if (!CommonUtil.isNullOrUndefined(docId)) {
            var url = "/preview/cmis/" + encodeURIComponent(docId) + "/" + encodeURIComponent("&viewermodel=2");
            this.router.navigate(['/preview/cmis/', encodeURIComponent(docId), encodeURIComponent("&viewermodel=2")]);
        }
    };
    //PAGEORGANIZER
    WebToolConvertComponent.prototype.onNavigateToWebPDFPageOrganizer = function (file, docId, fileSourceType) {
        this.webToolModal.hide();
        if (!CommonUtil.isNullOrUndefined(file)) {
            this.globalService.inputFile = file;
            window.angularHeaderComponent.getLastFile();
            this.router.navigate(['/preview', encodeURIComponent("&viewermodel=1")]);
            /*let _params:any = this.webToolService.getParamForUploadLocalFileToCloud(this.modeType, false, file);
             console.log("doUploadFileToCloud:" + JSON.stringify(_params));
             //
             CommonUtil.saveToCloud( _params, function (data:any) {
      
             if(data.ret != "0"){
             //
             console.log("doUploadFileToCloud error:" + data.msg);
             }else{
             //webtoolComponent.onNavigateToWebPDFPreviewFoxitDriveFile(data.docId);
             let url:string = "/preview/cmis/"+ encodeURIComponent(data.docId)+ "/"+encodeURIComponent("&viewermodel=1");
             //$("#previewInWebPDF").attr("href",url);
             this.router.navigate(['/preview/cmis/', encodeURIComponent(data.docId), encodeURIComponent("&viewermodel=1")]);
             //document.getElementById('previewInWebPDF').click();
             }
             // hide convert window UI
      
             });*/
            /*this.globalService.inputFile = file;
             let url:string = "/preview//" + "/"+encodeURIComponent("&viewermodel=1");
             $("#previewInWebPDF").attr("href",url);
             document.getElementById('previewInWebPDF').click();*/
        }
        else if (!CommonUtil.isNullOrUndefined(docId)) {
            var url = "/preview/cmis/" + encodeURIComponent(docId) + "/" + encodeURIComponent("&viewermodel=1");
            this.router.navigate(['/preview/cmis/', encodeURIComponent(docId), encodeURIComponent("&viewermodel=1")]);
            //$("#previewInWebPDF").attr("href",url);
            //document.getElementById('previewInWebPDF').click();
        }
    };
    WebToolConvertComponent.prototype.onNavigateToWebPDFPreviewFoxitDriveFile = function (docId) {
        if (CommonUtil.isNullOrUndefined(docId))
            return;
        var id = docId.split(",")[0];
        //let url:string = "preview/cmis/" + id;
        this.router.navigate(['/preview/cmis/', encodeURIComponent(docId)]);
        //$("#previewInWebPDF").attr("href",url);
        //document.getElementById('previewInWebPDF').click();
    };
    WebToolConvertComponent.prototype.onNavigateToWebPDFPreviewNetDriveFile = function (docId, netDriveName) {
        if (CommonUtil.isNullOrUndefined(docId))
            return;
        var extra_params = "&viewermodel=0";
        //{path: 'preview/netdrive/:drive_name/:file_id', component: WebpdfPreviewComponent}, //
        if (CommonUtil.isNullOrUndefined(this.oneDrive_folderID)) {
            this.router.navigate(['/preview/netdrive/', netDriveName, encodeURIComponent(docId), encodeURIComponent(extra_params)]);
        }
        else {
            this.router.navigate(['/preview/netdrive/', netDriveName, encodeURIComponent(docId), encodeURIComponent(extra_params),
                encodeURIComponent(this.oneDrive_folderID)]);
        }
    };
    WebToolConvertComponent.prototype.onNavigateToWebPDFPreviewOnlineUrl = function (url) {
        if (CommonUtil.isNullOrUndefined(url))
            return;
        //, fileName:string :, encodeURIComponent(fileName)
        this.router.navigate(['/preview/url/', encodeURIComponent(url)]);
    };
    WebToolConvertComponent.prototype.onNavigateToWebPDFPreview = function (fileUri, isDocId, fileSourceType) {
        if (CommonUtil.isNullOrUndefined(fileUri))
            return;
        if (!CommonUtil.isNeedToBePreview(this.modeType)) {
            return;
        }
        var _this = this;
        setTimeout(function () {
            if (!isDocId || fileSourceType == _this.fileSourceType.localfile) {
                _this.onNavigateToWebPDFPreviewOnlineUrl(fileUri);
                return;
            }
            switch (fileSourceType) {
                case _this.fileSourceType.foxitdrive: {
                    _this.onNavigateToWebPDFPreviewFoxitDriveFile(fileUri);
                    break;
                }
                case _this.fileSourceType.box:
                case _this.fileSourceType.dropbox:
                case _this.fileSourceType.googledrive:
                case _this.fileSourceType.onedrive: {
                    var netDriveName = _this.oneDriveName;
                    _this.onNavigateToWebPDFPreviewNetDriveFile(fileUri, netDriveName);
                    break;
                }
                default: {
                    console.log("onNavigateToWebPDFPreview parameters is invalid. fileUri=" + fileUri + ",type=" + fileSourceType);
                    break;
                }
            }
        }, 1000);
    };
    WebToolConvertComponent.prototype.ShowResultStatus = function (result, downUrl, isDocId, isAllPage, fileSourceType) {
        this.isSuccessToConvert = false;
        this.isFailToUploadCmis = false;
        if (!CommonUtil.isNullOrUndefined(downUrl) && !isDocId) {
            var _label_downfile = $("#downFile");
            _label_downfile.attr("href", downUrl);
            //_label_downfile.attr("target","_blank;");
            this.isAutoDownLoadFile = true;
            setTimeout(function () {
                document.getElementById('downFile').click();
            }, 500);
        }
        this.isResultPage = true;
        //this.cd.markForCheck();
        //this.cd.detectChanges();
        //let result_in = WebtoolEntryManager.getErrorEntry(result, true, this.modeType);
        if (result == "0") {
            //let result_in = WebtoolEntryManager.getErrorEntry(result, true, this.modeType);
            /*if(CommonUtil.isNeedAutoDownloadMode(this.modeType)) {
             this.isAutoDownLoadFile = true;
             document.getElementById('downFile').click();
             }*/
            this.isSuccessToConvert = true;
            this.setResultInformation(result, isAllPage, this.modeType, fileSourceType);
        }
        else {
            if (result == "84000001" || result == "84000002"
                || result == "84000003" || result == "84000004"
                || result == "84000005" || result == "84000006") {
                this.isAutoDownLoadFile = false;
                this.isFailToUploadCmis = true;
            }
            this.setResultInformation(result, isAllPage, this.modeType, fileSourceType);
        }
        var _this = this;
        setTimeout(function () {
            _this.isResultPage = false;
            //_this.cd.markForCheck();
            //_this.cd.detectChanges();
        }, 6000);
    };
    /*
     * ret: 0:success;
     * fileUri: include url and docId,
     * isDocId: true means fileUri is docId, otherwise url
     *
     * */
    WebToolConvertComponent.prototype.onShowConvertResult = function (ret, fileUri, isDocId, isAllPage, fileSourceType) {
        this.isNotShowTipForSave = false;
        var showTipFlag = this.cookieService.get("webtoolSaveFileTip");
        if (showTipFlag == "hide") {
            this.isNotShowTipForSave = true;
        }
        //toPreview: true means do preview file
        var toPreview = true;
        if (ret != "0" // show error info
            || fileSourceType != this.fileSourceType.localfile // is from cloud drive file
            || this.isNotShowTipForSave
            || CommonUtil.isNullOrUndefined(fileUri)) {
            // show result
            this.ShowResultStatus(ret, fileUri, isDocId, isAllPage, fileSourceType);
            // hide convert window UI
            this.closeConvertPage();
            //if(isOnline)
            this.onNavigateToWebPDFPreview(fileUri, isDocId, fileSourceType);
            return;
        }
        this.doShowSavedTip(ret, fileUri, isDocId, fileSourceType, isAllPage);
    };
    WebToolConvertComponent.prototype.doShowSavedTip = function (ret, downUrl, isDocId, fileSourceType, isAllPage) {
        this.convertedResultData = { ret: "", url: "", isDocId: false, fileSourceType: 0, isAllPage: false }; //isOnline:false
        this.convertedResultData.ret = ret;
        this.convertedResultData.url = downUrl;
        this.convertedResultData.fileSourceType = fileSourceType;
        this.convertedResultData.isAllPage = isAllPage;
        this.convertedResultData.isDocId = isDocId;
        if (this.globalService.baseUrlIsPDFEditor) {
            this.tipForSavingTitle = this.translate.instant('PhantomPDF Online');
        }
        else {
            this.tipForSavingTitle = this.translate.instant('Foxit Reader Online');
        }
        this.closeConvertPage();
        this.webToolTipForSave.show();
    };
    WebToolConvertComponent.prototype.onCheckSavedTipSettingAndDownload = function () {
        var ret = this.convertedResultData.ret;
        var downUrl = this.convertedResultData.url;
        var isAllPage = this.convertedResultData.isAllPage;
        var fileSourceType = this.convertedResultData.fileSourceType;
        var isDocId = this.convertedResultData.isDocId;
        this.webToolTipForSave.hide();
        var today = new Date();
        var ms = today.getTime() + 365 * 24 * 3600 * 1000;
        var expireDate = new Date(ms);
        var option = {
            expires: expireDate
        };
        if (!this.isNotShowTipForSave) {
            this.cookieService.put("webtoolSaveFileTip", "show", option);
        }
        else {
            this.cookieService.put("webtoolSaveFileTip", "hide", option);
        }
        this.ShowResultStatus(ret, downUrl, isDocId, isAllPage, fileSourceType);
        //if(isOnline)
        this.onNavigateToWebPDFPreview(downUrl, isDocId, fileSourceType);
    };
    WebToolConvertComponent.prototype.getFileFilterByModeType = function (modeType) {
        var ret = "";
        switch (modeType) {
            case CommonUtil.ConvertType.PDFTOCPDF:
            case CommonUtil.ConvertType.OPTIMIZER:
            case CommonUtil.ConvertType.WATERMARK:
            case CommonUtil.ConvertType.MERGEPDF:
            case CommonUtil.ConvertType.PDFTOTXT:
            case CommonUtil.ConvertType.PDFTOIMG:
            case CommonUtil.ConvertType.PDFPROTECT:
            case CommonUtil.ConvertType.PDFREDACTOR:
            case CommonUtil.ConvertType.PDFHEADERFOOTER:
            case CommonUtil.ConvertType.ROTATEPDF:
            case CommonUtil.ConvertType.PDFTOWORD:
            case CommonUtil.ConvertType.SPLITPDF:
            case CommonUtil.ConvertType.PAGEORGANIZER:
            case CommonUtil.ConvertType.PDFTOEXCEL:
            case CommonUtil.ConvertType.PDFTOPPT:
            case CommonUtil.ConvertType.PDFTOHTML:
            case CommonUtil.ConvertType.PDFFLATTEN: {
                ret = "application/pdf";
                break;
            }
            /*case CommonUtil.ConvertType.IMGTOPDF : {
              ret = "image/gif,image/jpeg,image/jpg,image/png,image/jpx,image/bmp, image/tiff, image/tif";
              break;
            }*/
            default: {
            }
        }
        return ret;
    };
    WebToolConvertComponent.prototype.isMatchedFileByModeType = function (file, modeType) {
        var fileName = file.name;
        if (CommonUtil.isSupportedFile(fileName, modeType))
            return true;
        return false;
        /* let fileFilter:string = this.getFileFilterByModeType(modeType);
         let fileType:string = file.type;
         if (!this.webToolService.isNullOrUndefined(fileType) && fileType.length > 0 && fileFilter.indexOf(fileType) >= 0){
         return true;
         }
         return false;*/
    };
    WebToolConvertComponent.prototype.getMatchedFilesByModeType = function (files, modeType) {
        if (CommonUtil.isNullOrUndefined(files) || files.length == 0) {
            return null;
        }
        var _files = [];
        var isMatched = false;
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            isMatched = this.isMatchedFileByModeType(file, modeType);
            if (!isMatched) {
                continue;
            }
            _files.push(file);
        }
        return _files;
    };
    WebToolConvertComponent.prototype.getMatchedFilesByFileSize = function (files, fileMaxSize) {
        var __files = [];
        var isExceed = false;
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var file = files_2[_i];
            isExceed = file.size && file.size >= fileMaxSize * 1024 * 1024;
            if (isExceed) {
                continue;
            }
            __files.push(file);
        }
        return __files;
    };
    WebToolConvertComponent.prototype.getMaxFileSize = function (modeType) {
        var maxSize = 50;
        if (modeType == CommonUtil.ConvertType.PDFREDACTOR ||
            modeType == CommonUtil.ConvertType.PAGEORGANIZER) {
            maxSize = 200;
        }
        else if (modeType == CommonUtil.ConvertType.WORDTOPDF ||
            modeType == CommonUtil.ConvertType.EXCELTOPDF ||
            modeType == CommonUtil.ConvertType.PPTTOPDF ||
            modeType == CommonUtil.ConvertType.TEXTTOPDF) {
            maxSize = 5;
        }
        return maxSize;
    };
    WebToolConvertComponent.prototype.doFilterFilesByTypeAndFileSize = function (files, modeType) {
        var _files = this.getMatchedFilesByModeType(files, modeType);
        var fileMaxSize = this.getMaxFileSize(modeType);
        if (null == _files || _files.length == 0) {
            this.doShowErrorMessageForSelectFile("82000020");
            return null;
        }
        // files less than {fileMaxSize} MB
        var __files = this.getMatchedFilesByFileSize(_files, fileMaxSize);
        if (__files.length < _files.length) {
            this.doShowErrorMessageForSelectFile("82000021");
        }
        return __files;
    };
    WebToolConvertComponent.prototype.doShowFileWindow = function () {
        this.cleanFileCache();
        //
        if (CommonUtil.isUploadMultiFiles(this.modeType)) {
            document.getElementById('SelectMultiFileMode').click();
        }
        else {
            document.getElementById('SelectFileMode').click();
        }
    };
    WebToolConvertComponent.prototype.cleanFileCache = function () {
        var _this = this;
        //this.isActiveInput = false;
        //this.isActiveInput = true;
        var _fileInput = null;
        if (CommonUtil.isUploadMultiFiles(this.modeType)) {
            _fileInput = $("#SelectMultiFileMode");
        }
        else {
            _fileInput = $("#SelectFileMode");
        }
        //_fileInput = $("#SelectFileMode");
        var _innerHtml = _fileInput.clone().val("");
        var fileFilter = this.getFileFilterByModeType(this.modeType);
        _innerHtml.attr("accept", fileFilter);
        _fileInput.after(_innerHtml);
        _fileInput.remove();
        if (CommonUtil.isUploadMultiFiles(this.modeType)) {
            _fileInput = $("#SelectMultiFileMode");
        }
        else {
            _fileInput = $("#SelectFileMode");
        }
        //var file2 = document.getElementById("SelectFileMode");
        //_fileInput.addEventListener("change",
        _fileInput.unbind("change").bind('change', function (event) {
            var files = event.target.files;
            var _files = _this.doFilterFilesByTypeAndFileSize(files, _this.modeType);
            if (null == _files || _files.length == 0) {
                return;
            }
            if (CommonUtil.isUploadMultiFiles(_this.modeType)) {
                _this.multiFiles = _files;
            }
            else {
                _this.uploader.clearQueue();
                var options = _this.uploader.options;
                _this.uploader.addToQueue(_files, options);
            }
            _this.selectedFileOnChanged(event);
        });
    };
    WebToolConvertComponent.prototype.initClickEvent = function () {
        var _this = this;
        $('.web-tool-dropzone').unbind('click');
        $('.web-tool-dropzone').bind('click', function () {
            _this.doShowFileWindow();
        });
    };
    WebToolConvertComponent.prototype.initDragEvent = function () {
        var getDataTransfer = function (event) {
            var dataTransfer;
            return dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
        };
        var processDragOverOrEnter = function (event) {
            if (event) {
                $('.web-tool-dropzone').addClass('drop-active');
                if (event.preventDefault) {
                    event.preventDefault();
                }
                if (event.stopPropagation) {
                    return false;
                }
            }
            getDataTransfer(event).effectAllowed = 'copy';
            return false;
        };
        var preventDefaultDrop = function (event) {
            if (event) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                if (event.stopPropagation) {
                    return false;
                }
            }
        };
        $(document).unbind("dragover");
        $(document).unbind("dragenter");
        $(document).unbind("drop");
        $('.web-tool-dropzone').unbind("dragover");
        $('.web-tool-dropzone').unbind("dragenter");
        $('.web-tool-dropzone').unbind("dragleave");
        $('.web-tool-dropzone').unbind("drop");
        $(document).bind('dragover', preventDefaultDrop);
        $(document).bind('dragenter', preventDefaultDrop);
        $(document).bind('drop', preventDefaultDrop);
        $('.web-tool-dropzone').bind('dragover', processDragOverOrEnter);
        $('.web-tool-dropzone').bind('dragenter', processDragOverOrEnter);
        $('.web-tool-dropzone').bind('dragleave', function (e) {
            $('.web-tool-dropzone').removeClass('drop-active');
        });
        var _this = this;
        $('.web-tool-dropzone').bind('drop', function (e) {
            if (e) {
                e.preventDefault();
            }
            $('.web-tool-dropzone').removeClass('drop-active');
            var files = getDataTransfer(e).files;
            var _files = _this.doFilterFilesByTypeAndFileSize(files, _this.modeType);
            if (null == _files || _files.length == 0) {
                return;
            }
            if (CommonUtil.isUploadMultiFiles(_this.modeType)) {
                _this.multiFiles = _files;
            }
            else {
                var options = _this.uploader.options;
                var __files = [];
                __files.push(files[0]);
                _this.uploader.clearQueue();
                _this.uploader.addToQueue(__files, options);
            }
            _this.fileDropOver(e);
        });
    };
    WebToolConvertComponent.prototype.HideWarnPage = function () {
        this.webtoolWarning.hide();
    };
    WebToolConvertComponent.prototype.showConfigurePage = function (pageCount) {
        var _this = this;
        function callbackFromHeaderFooter(param, isSplitFromSplit) {
            _this.startConvertFunc(param, isSplitFromSplit);
        }
        if (this.modeType == CommonUtil.ConvertType.PDFHEADERFOOTER) {
            this.webToolModal.hide();
            this.webtoolHeaderFooter.showHeaderFooterPage(callbackFromHeaderFooter);
            return;
        }
        else if (this.modeType == CommonUtil.ConvertType.PDFPROTECT) {
            this.webToolModal.hide();
            this.webtoolProtectPDF.showProtectPDFPage(callbackFromHeaderFooter);
        }
        else if (this.modeType == CommonUtil.ConvertType.WATERMARK) {
            this.webToolModal.hide();
            this.webtoolWatermark.showWatermarkPage(callbackFromHeaderFooter);
        }
        else if (this.modeType == CommonUtil.ConvertType.SPLITPDF) {
            this.webToolModal.hide();
            this.webtoolSplitPDF.showSplitPDFPage(pageCount, callbackFromHeaderFooter);
        }
    };
    WebToolConvertComponent.prototype.setCmisUrl = function (modeTye) {
        var _url;
        switch (modeTye) {
            case CommonUtil.ConvertType.IMGTOPDF: {
                _url = this.sanitizer.bypassSecurityTrustResourceUrl(this.cmisUrls.img2pdf);
                break;
            }
            case CommonUtil.ConvertType.MERGEPDF: {
                _url = this.sanitizer.bypassSecurityTrustResourceUrl(this.cmisUrls.mergepdf);
                break;
            }
            /* case CommonUtil.ConvertType.PPTTOPDF:{
             this.cmisUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.cmisUrls.ppt2pdf);
             break;
             }
             case CommonUtil.ConvertType.WORDTOPDF:{
             this.cmisUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.cmisUrls.word2pdf);
             break;
             }
             case CommonUtil.ConvertType.EXCELTOPDF:{
             this.cmisUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.cmisUrls.excel2pdf);
             break;
             }*/
            default: {
                _url = this.sanitizer.bypassSecurityTrustResourceUrl(this.cmisUrls.convertpdf);
                break;
            }
        }
        if (_url.toString() != this.cmisUrl.toString())
            this.cmisUrl = _url;
    };
    WebToolConvertComponent.prototype.doPrepareWebToolsEntrys = function (modeType) {
        var _this = this;
        switch (modeType) {
            case CommonUtil.ConvertType.PDFREDACTOR: {
                this.translate.get('Webtools.BTN.RedactPDF').subscribe(function (value) {
                    _this.uiEntrys.btnConvert = value;
                });
                break;
            }
            case CommonUtil.ConvertType.MERGEPDF: {
                this.translate.get('Webtools.BTN.MergePDF').subscribe(function (value) {
                    _this.uiEntrys.btnConvert = value;
                });
                break;
            }
            case CommonUtil.ConvertType.PAGEORGANIZER: {
                this.translate.get('Webtools.BTN.PageOrganizer').subscribe(function (value) {
                    _this.uiEntrys.btnConvert = value;
                });
                break;
            }
            case CommonUtil.ConvertType.PDFHEADERFOOTER: {
                this.translate.get('Webtools.BTN.HeaderFooter').subscribe(function (value) {
                    _this.uiEntrys.btnConvert = value;
                });
                break;
            }
            case CommonUtil.ConvertType.PDFPROTECT: {
                this.translate.get('Webtools.BTN.PasswordProtect').subscribe(function (value) {
                    _this.uiEntrys.btnConvert = value;
                });
                break;
            }
            case CommonUtil.ConvertType.OPTIMIZER: {
                this.translate.get('Webtools.BTN.CompressPDF').subscribe(function (value) {
                    _this.uiEntrys.btnConvert = value;
                });
                break;
            }
            case CommonUtil.ConvertType.WATERMARK: {
                this.translate.get('Webtools.BTN.Watermark').subscribe(function (value) {
                    _this.uiEntrys.btnConvert = value;
                });
                break;
            }
            case CommonUtil.ConvertType.SPLITPDF: {
                this.translate.get('Webtools.BTN.SplitPDF').subscribe(function (value) {
                    _this.uiEntrys.btnConvert = value;
                });
                break;
            }
            default: {
                // "subscribe" replace of "toPromise().then"
                this.translate.get('Webtools.BTN.Convert').subscribe(function (value) {
                    _this.uiEntrys.btnConvert = value;
                });
                break;
            }
        }
        /*    this.translate.get('Webtools.BTN.Add').subscribe( (value:string) => {
         this.uiEntrys.btnAdd = value;
         } );
         this.translate.get('Webtools.BTN.Cancel').subscribe( (value:string) => {
         this.uiEntrys.btnCancel = value;
         } );*/
    };
    WebToolConvertComponent.prototype.setModeShowImage = function () {
        switch (this.modeType) {
            case CommonUtil.ConvertType.WORDTOPDF:
                this.modeImage = "img/word.png";
                break;
            case CommonUtil.ConvertType.EXCELTOPDF:
                this.modeImage = "img/excel.png";
                break;
            case CommonUtil.ConvertType.PPTTOPDF:
                this.modeImage = "img/ppt.png";
                break;
            case CommonUtil.ConvertType.TEXTTOPDF:
                this.modeImage = "img/txt.PNG";
                break;
            case CommonUtil.ConvertType.IMGTOPDF:
                this.modeImage = "img/image.PNG";
                break;
            default:
                this.modeImage = "img/pdffile.png";
        }
    };
    WebToolConvertComponent.prototype.showWebToolModal = function (phantomLoginSwitchIsOn, modeName, eventFrom) {
        this.initParameters();
        var modal_header = this.getDocumentInfo(modeName);
        this.setModeShowImage();
        this.isNeedCheckFoxitDriveFiles = false;
        if (eventFrom == 1) {
            this.isNeedCheckFoxitDriveFiles = true;
        }
        if (this.modeType == CommonUtil.ConvertType.PDFTOEXCEL ||
            this.modeType == CommonUtil.ConvertType.PDFTOPPT ||
            this.modeType == CommonUtil.ConvertType.PDFTOWORD) {
            this.isSolidTool = true;
            var solidInfo = this.WebtoolEntry.getSolidInfoByType(this.modeType);
            this.solidInfo = this.translate.instant(solidInfo);
        }
        else {
            this.isSolidTool = false;
        }
        if (this.modeType != CommonUtil.ConvertType.PDFTOWORD &&
            this.modeType != CommonUtil.ConvertType.PDFTOTXT &&
            this.modeType != CommonUtil.ConvertType.PDFTOIMG &&
            this.modeType != CommonUtil.ConvertType.PDFTOEXCEL &&
            this.modeType != CommonUtil.ConvertType.OPTIMIZER &&
            this.modeType != CommonUtil.ConvertType.IMGTOPDF &&
            this.modeType != CommonUtil.ConvertType.MERGEPDF &&
            this.modeType != CommonUtil.ConvertType.PDFHEADERFOOTER &&
            this.modeType != CommonUtil.ConvertType.PDFPROTECT &&
            this.modeType != CommonUtil.ConvertType.WATERMARK &&
            this.modeType != CommonUtil.ConvertType.SPLITPDF &&
            this.modeType != CommonUtil.ConvertType.PDFTOHTML &&
            this.modeType != CommonUtil.ConvertType.PAGEORGANIZER &&
            this.modeType != CommonUtil.ConvertType.PDFREDACTOR &&
            this.modeType != CommonUtil.ConvertType.PDFTOCPDF &&
            this.modeType != CommonUtil.ConvertType.PPTTOPDF &&
            this.modeType != CommonUtil.ConvertType.WORDTOPDF &&
            this.modeType != CommonUtil.ConvertType.EXCELTOPDF &&
            this.modeType != CommonUtil.ConvertType.TEXTTOPDF &&
            this.modeType != CommonUtil.ConvertType.PDFFLATTEN &&
            this.modeType != CommonUtil.ConvertType.PDFTOPPT) {
            this.webtoolWarning.show();
            return;
        }
        if (this.modeType == CommonUtil.ConvertType.MERGEPDF ||
            this.modeType == CommonUtil.ConvertType.IMGTOPDF) {
            this.isSupportCombined = true;
        }
        this.setCmisUrl(this.modeType);
        this.doPrepareWebToolsEntrys(this.modeType);
        this.modalHeaderText = this.translate.instant(modal_header);
        if (phantomLoginSwitchIsOn) {
            this.phantomLoginSwitchIsOn = true;
        }
        else {
            this.phantomLoginSwitchIsOn = false;
        }
        this.title = 'WebTool Convert';
        this.convertType = 'No defined!';
        console.log('====showWebToolModal====');
        if (!this.isShown) {
            //noinspection TypeScriptUnresolvedFunction
            this.webToolModal.show();
        }
        else {
            this.error = '';
        }
    };
    WebToolConvertComponent.prototype.hideModal = function () {
        //noinspection TypeScriptUnresolvedFunction
        console.log('====hideWebToolModal====');
        this.webToolModal.hide();
    };
    WebToolConvertComponent.prototype.onShow = function () {
        this.isShown = true;
    };
    WebToolConvertComponent.prototype.onShown = function () {
        this.sortableTable.cleanFileItem();
        if (this.isNeedCheckFoxitDriveFiles) {
            this.onMergePDFForFoxitDrive();
            this.doSwitchCombinedDocs();
        }
        else {
            this.doSwitchLocalDocument();
        }
        //this.cleanFileCache();
        this.initClickEvent();
        this.initDragEvent();
    };
    WebToolConvertComponent.prototype.onHide = function () {
        this.isShown = false;
        this.progressWidth = "0%";
        this.uploader.cancelAll();
        this.OpenLocalDocument();
    };
    // event from cloud-reading-iframe, Merge PDF
    WebToolConvertComponent.prototype.onMergePDFForFoxitDrive = function () {
        switch (this.modeType) {
            case CommonUtil.ConvertType.IMGTOPDF:
            case CommonUtil.ConvertType.MERGEPDF: {
                this.doRefreshCombinedDocsForFoxitDrive();
                break;
            }
            default: {
                break;
            }
        }
    };
    WebToolConvertComponent.prototype.onFinishSelectOnlineDocs = function () {
        if (!this.isLastSelectOnline) {
            return;
        }
        switch (this.modeType) {
            case CommonUtil.ConvertType.IMGTOPDF:
            case CommonUtil.ConvertType.MERGEPDF: {
                this.doRefreshCombinedDocs();
                break;
            }
            default: {
                break;
            }
        }
    };
    WebToolConvertComponent.prototype.doRefreshCombinedDocsForFoxitDrive = function () {
        var foxitDriveIFrame = document.getElementById("cloud-reading-iframe");
        var doc = foxitDriveIFrame;
        var docsInfo = doc.contentWindow.CloudReading;
        var fileInfos = [];
        if (CommonUtil.isNullOrUndefined(docsInfo.multipleChooseFiles)) {
            if (CommonUtil.isNullOrUndefined(docsInfo.choseFile)) {
                console.log("no select any file.");
                return;
            }
            fileInfos.push(docsInfo.choseFile);
        }
        else {
            fileInfos = docsInfo.multipleChooseFiles;
        }
        var isExist = true;
        var isSupportFile = true;
        for (var _i = 0, fileInfos_2 = fileInfos; _i < fileInfos_2.length; _i++) {
            var doc_1 = fileInfos_2[_i];
            isSupportFile = CommonUtil.isSupportedFile(doc_1.name, this.modeType);
            if (!isSupportFile)
                continue;
            isExist = this.sortableTable.checkFileExistInOnline(doc_1.id);
            if (isExist)
                continue;
            this.sortableTable.doAddItem(doc_1.name, doc_1.contentStreamLength, doc_1.id, CommonUtil.FileAddress.FoxitDrive);
        }
        var lastFileCount = this.combinedFileCount;
        this.combinedFileCount = this.sortableTable.fileItems.length;
        if (lastFileCount != this.combinedFileCount) {
            this.onSwitchCombinedDocs();
        }
    };
    WebToolConvertComponent.prototype.doRefreshCombinedDocs = function () {
        var doc = this.cloudDocsFrame;
        var docsInfo = doc.nativeElement.contentWindow.CloudReading;
        var fileInfos = [];
        if (CommonUtil.isNullOrUndefined(docsInfo.multipleChooseFiles)) {
            if (CommonUtil.isNullOrUndefined(docsInfo.choseFile)) {
                console.log("no select any file.");
                return;
            }
            fileInfos.push(docsInfo.choseFile);
        }
        else {
            fileInfos = docsInfo.multipleChooseFiles;
        }
        var isExist = true;
        var isSupportFile = true;
        var isCanAdd = false;
        for (var _i = 0, fileInfos_3 = fileInfos; _i < fileInfos_3.length; _i++) {
            var doc_2 = fileInfos_3[_i];
            isSupportFile = CommonUtil.isSupportedFile(doc_2.name, this.modeType);
            if (!isSupportFile)
                continue;
            if (!isCanAdd)
                isCanAdd = true;
            isExist = this.sortableTable.checkFileExistInOnline(doc_2.id);
            if (isExist)
                continue;
            this.sortableTable.doAddItem(doc_2.name, doc_2.contentStreamLength, doc_2.id, CommonUtil.FileAddress.FoxitDrive);
        }
        var lastFileCount = this.combinedFileCount;
        this.combinedFileCount = this.sortableTable.fileItems.length;
        if (isCanAdd || lastFileCount != this.combinedFileCount) {
            this.onSwitchCombinedDocs();
        }
    };
    WebToolConvertComponent.prototype.doSwitchLocalDocument = function () {
        this.isOpenOnlineDocument = false;
        this.isShowCombinedTable = false;
        this.isOpenOneDriveDocument = false;
        this.isOpenLocalDocument = true;
        this.isdrivedisplay = 'none';
        $(".file_list li").removeClass("selected");
        $("#local_doc_mode").addClass("selected");
        // $("#cmis_doc_mode").removeClass("selected");
        // $("#combined_docs_mode").removeClass("selected");
    };
    WebToolConvertComponent.prototype.doSwitchCombinedDocs = function () {
        this.isOpenOnlineDocument = false;
        this.isOpenLocalDocument = false;
        this.isOpenOneDriveDocument = false;
        this.isShowCombinedTable = true;
        this.isdrivedisplay = 'none';
        $(".file_list li").removeClass("selected");
        $("#combined_docs_mode").addClass("selected");
        // $("#local_doc_mode").removeClass("selected");
        // $("#cmis_doc_mode").removeClass("selected");
    };
    WebToolConvertComponent.prototype.doSwitchOneDriveDocs = function () {
        this.isOpenOnlineDocument = false;
        this.isOpenLocalDocument = false;
        this.isShowCombinedTable = false;
        this.isOpenOneDriveDocument = true;
        this.isdrivedisplay = 'block';
        //$(".file_list li").removeClass("selected");
        $("#combined_docs_mode").removeClass("selected");
    };
    WebToolConvertComponent.prototype.onSwitchCombinedDocs = function () {
        this.doSwitchCombinedDocs();
    };
    WebToolConvertComponent.prototype.doSwitchOnlineDocument = function () {
        this.isShowCombinedTable = false;
        this.isOpenLocalDocument = false;
        this.isOpenOnlineDocument = true;
        this.isOpenOneDriveDocument = false;
        this.isdrivedisplay = 'none';
        $(".file_list li").removeClass("selected");
        $("#cmis_doc_mode").addClass("selected");
        // $("#local_doc_mode").removeClass("selected");
        // $("#combined_docs_mode").removeClass("selected");
    };
    WebToolConvertComponent.prototype.OpenLocalDocument = function () {
        this.doSwitchLocalDocument();
        this.isLastSelectOnline = false;
    };
    WebToolConvertComponent.prototype.doOpenCombinedDocs = function () {
        this.doSwitchCombinedDocs();
        this.isLastSelectOnline = false;
    };
    WebToolConvertComponent.prototype.OpenOnlineDocument = function () {
        this.doSwitchOnlineDocument();
        this.isLastSelectOnline = true;
    };
    WebToolConvertComponent.prototype.onAddOnlineDocsToCombine = function () {
        if (this.isOpenOneDriveDocument) {
            this.onConvertOneDriveDocs();
        }
        else {
            this.onFinishSelectOnlineDocs();
        }
    };
    WebToolConvertComponent.prototype.OpenOneDriveDocument = function () {
        this.doSwitchOneDriveDocs();
        //alert("Open");
    };
    WebToolConvertComponent.prototype.checkValidForConvert = function () {
        if (this.isShowCombinedTable) {
            var doDisable = "";
            var limitMinCount = -1;
            if (this.modeType == CommonUtil.ConvertType.IMGTOPDF) {
                limitMinCount = 1;
            }
            else if (this.modeType == CommonUtil.ConvertType.MERGEPDF) {
                limitMinCount = 2;
            }
            if (limitMinCount != -1) {
                if (this.sortableTable.fileItems.length < limitMinCount) {
                    doDisable = "disabled";
                    this.isConvertMultiFiles = false;
                }
                return doDisable;
            }
        }
        if (this.isOpenOnlineDocument) {
            return "";
        }
        return "";
    };
    WebToolConvertComponent.prototype.onShowNetDriveErrorForUpload = function (err) {
        var _this = this;
        console.log(err);
        this.zone.run(function () {
            _this.uploadError("83000002");
        });
    };
    WebToolConvertComponent.prototype.onConvertOneDriveDocs = function () {
        var _this = this;
        var iframeWindow = this.oneDriveDocsFrame.nativeElement.contentWindow;
        this.oneDriveIframe = iframeWindow;
        this.oneDriveName = this.oneDriveIframe.getCurrentDriveName();
        var fileId = iframeWindow.getSelectFileId();
        this.oneDrive_fileID = fileId;
        this.oneDrive_folderID = iframeWindow.getSelectFolderid();
        if (CommonUtil.isNullOrUndefined(fileId))
            return;
        if (CommonUtil.isNavigateToWebPDF(this.modeType)) {
            CommonUtil.addGAInfoByType(this.modeType);
            var type = this.onGetFileSourceTypeByNetDriveName(this.oneDriveName);
            this.onNavigateToWebPDF(this.modeType, null, fileId, type);
            return;
        }
        console.log("fileID: " + fileId);
        iframeWindow.getFileInfo(fileId).then(function (fileInfo) {
            //fileInfo:{id: "AC7B071215D0D95A!246", name: "xxx.docx", path: null, size: 591709, modified: "2017-10-23T08:12:07.437Z"}
            // check type  and size
            if (!CommonUtil.isSupportedFile(fileInfo.name, _this.modeType)) {
                _this.zone.run(function () { _this.doShowErrorMessageForSelectFile("82000020"); });
                return;
            }
            var maxSize = _this.getMaxFileSize(_this.modeType);
            if (fileInfo.size > maxSize * 1024 * 1024) {
                _this.zone.run(function () { _this.doShowErrorMessageForSelectFile("82000021"); });
                return;
            }
            iframeWindow.getFileById(fileId).then(function (file) {
                _this.zone.run(function () {
                    _this.startUploadFileFromOneDrive();
                    _this.setOnlineFileInfo("OneDrive", file.name);
                    _this.webToolService.doUploadByBuffer(file, _this.modeType, _this);
                });
            }, function (err) {
                _this.onShowNetDriveErrorForUpload(err);
            }).catch(function (err) {
                this.onShowNetDriveErrorForUpload(err);
            });
        }, function (err) {
            _this.onShowNetDriveErrorForUpload(err);
        }).catch(function (err) {
            _this.onShowNetDriveErrorForUpload(err);
        });
    };
    WebToolConvertComponent.prototype.onGetFileSourceTypeByNetDriveName = function (netDriveName) {
        var type = this.fileSourceType.localfile;
        if (netDriveName.toLowerCase() == "box") {
            type = this.fileSourceType.box;
        }
        else if (netDriveName.toLowerCase() == "dropbox") {
            type = this.fileSourceType.dropbox;
        }
        else if (netDriveName.toLowerCase() == "google drive") {
            type = this.fileSourceType.googledrive;
        }
        else if (netDriveName.toLowerCase() == "onedrive") {
            type = this.fileSourceType.onedrive;
        }
        return type;
    };
    WebToolConvertComponent.prototype.onGetNetDriveCommonNameByNetDriveType = function (type) {
        var output = "";
        /*
         "Foxit Drive": "Foxit Drive",
         "Box": "Box.",
         "Dropbox": "Dropbox.",
         "Google Drive": "Google Drive.",
         "OneDrive": "OneDrive.",
         * */
        if (type == this.fileSourceType.foxitdrive) {
            output = this.translate.instant("Foxit Drive");
        }
        else if (type == this.fileSourceType.box) {
            output = this.translate.instant("Box");
        }
        else if (type == this.fileSourceType.dropbox) {
            output = this.translate.instant("Dropbox");
        }
        else if (type == this.fileSourceType.googledrive) {
            output = this.translate.instant("Google Drive");
        }
        else if (type == this.fileSourceType.onedrive) {
            output = this.translate.instant("OneDrive");
        }
        return output;
    };
    /*
     * type: net drive(value in this.fileSourceType)
     * step: no use
     * */
    WebToolConvertComponent.prototype.onGetErrorCodeByNetDrive = function (type, step) {
        var ret = "";
        switch (type) {
            case this.fileSourceType.box: {
                ret = "84000003";
                break;
            }
            case this.fileSourceType.dropbox: {
                ret = "84000004";
                break;
            }
            case this.fileSourceType.googledrive: {
                ret = "84000005";
                break;
            }
            case this.fileSourceType.onedrive: {
                ret = "84000006";
                break;
            }
        }
        return ret;
    };
    WebToolConvertComponent.prototype.uploadFileToOneDrive = function (params) {
        var _this = this;
        //let iframeWindow = this.oneDriveDocsFrame.nativeElement.contentWindow;
        //let destName = CommonUtil.getResultFileNameByMode(this.OnlineFileInfo.fileName,this.modeType);
        var _modeType = params.type;
        var _fileName = params.fileName;
        var _downLink = params.downLink;
        var _isExtractPages = params.isExtractPages;
        var _isOverlay = params.isOverlay;
        var _isAllPages = params.isAllPages;
        var _fileID = _isOverlay ? this.oneDrive_fileID : "";
        var myFileName = CommonUtil.getOutputFileName(_modeType, _fileName, _isExtractPages);
        var options = { dest_name: myFileName, folder_id: this.oneDrive_folderID, file_id: _fileID, auto_rename: true };
        var type = this.onGetFileSourceTypeByNetDriveName(this.oneDriveName);
        this.oneDriveIframe.uploadfile(_downLink, myFileName, options).then(function (data) {
            _this.zone.run(function () {
                var json = CommonUtil.commonJsonParser(data);
                var uri = _downLink;
                if (!CommonUtil.isNullOrUndefined(json) && !CommonUtil.isNullOrUndefined(json.id))
                    uri = json.id;
                _this.onShowConvertResult("0", uri, true, _isAllPages, type);
                console.log(data);
            });
        }, function (error) {
            console.log(error);
            _this.zone.run(function () {
                var ret = _this.onGetErrorCodeByNetDrive(type, null);
                var uri = _downLink;
                _this.onShowConvertResult(ret, uri, false, _isAllPages, type);
            });
        }).catch(function (err) {
            var _this = this;
            console.log(err);
            this.zone.run(function () {
                var ret = _this.onGetErrorCodeByNetDrive(type, null);
                var uri = _downLink;
                _this.onShowConvertResult(ret, uri, false, _isAllPages, type);
            });
        });
        /*this.oneDriveIframe.uploadfile(downlink, destName, options).then(function(data:any){
         _this.onShowConvertResult("0",downlink, true, true, true);
         //_this.cd.detectChanges();
         console.log(data);
         });*/
    };
    WebToolConvertComponent.prototype.startUploadFileFromOneDrive = function () {
        this.isUploadFile = true;
        this.isdrivedisplay = "none";
        this.isOpenOneDriveDocument = false;
    };
    WebToolConvertComponent.prototype.onConvertOnlineDocs = function () {
        this.initOnlineFileInfo();
        if (this.isOpenLocalDocument)
            return;
        //document.getElementById("cloud-reading-iframe").contentWindow;
        var docInfo = document.getElementById("cloud-docs-webtool");
        //docInfo[0].contentWindow.CloudReading.choseFile;
        //docInfo[0].contentWindow.CloudReading.multipleChooseFiles;
        var doc = this.cloudDocsFrame;
        var docsInfo = doc.nativeElement.contentWindow.CloudReading;
        //let docs = $('#cloud-docs-webtool')[0].contentWindow.CloudReading
        //console.log("doc info:" + docs.choseFile);
        //console.log("doc info:" + docs.multipleChooseFiles);
        var docs = docsInfo;
        console.log("doc info:" + docs.choseFile);
        console.log("doc info:" + docs.multipleChooseFiles);
        if (CommonUtil.isNavigateToWebPDF(this.modeType)) {
            if (CommonUtil.isNullOrUndefined(docs.choseFile)) {
                return;
            }
            CommonUtil.addGAInfoByType(this.modeType);
            this.onNavigateToWebPDF(this.modeType, null, docs.choseFile.id, this.fileSourceType.foxitdrive);
            return;
        }
        var multiFile = new WebToolMultiFileInfos;
        multiFile.files = [];
        multiFile.path = "";
        if (!CommonUtil.isUploadMultiFiles(this.modeType) && !CommonUtil.isNullOrUndefined(docs.choseFile)) {
            var fileInfo = new WebToolFileInfo;
            fileInfo.type = "online";
            fileInfo.name = docs.choseFile.name;
            if (!CommonUtil.isSupportedFile(fileInfo.name, this.modeType)) {
                this.doShowErrorMessageForSelectFile("82000020");
                return;
            }
            var fileSize = docs.choseFile.contentStreamLength;
            var maxSize = this.getMaxFileSize(this.modeType);
            if (fileSize > maxSize * 1024 * 1024) {
                this.doShowErrorMessageForSelectFile("82000021");
                return;
            }
            fileInfo.index = 0;
            fileInfo.uri = docs.choseFile.id;
            multiFile.files.push(fileInfo);
            multiFile.type = this.modeType;
            multiFile.count = 1;
            multiFile.path = docs.choseFile.path.substring(0, docs.choseFile.path.lastIndexOf("/"));
            this.webToolService.doConvertMutilFiles(multiFile, this.modeType, this);
        }
        else if (CommonUtil.isUploadMultiFiles(this.modeType) && this.sortableTable.fileItems.length > 0) {
            var fileInfos = this.sortableTable.getOnlineDocsInfo();
            for (var _i = 0, fileInfos_4 = fileInfos; _i < fileInfos_4.length; _i++) {
                var doc_3 = fileInfos_4[_i];
                var fileInfo = new WebToolFileInfo;
                fileInfo.type = "online";
                fileInfo.name = doc_3.fileName;
                fileInfo.index = doc_3.index;
                fileInfo.uri = doc_3.fileId;
                multiFile.files.push(fileInfo);
            }
            multiFile.type = this.modeType;
            multiFile.count = fileInfos.length;
            multiFile.path = "";
            this.webToolService.doConvertMutilFiles(multiFile, this.modeType, this);
        }
    };
    WebToolConvertComponent.prototype.getFileIndexList = function () {
        return this.sortableTable.getFileIndexList();
    };
    WebToolConvertComponent.prototype.getFirstFileInfo = function () {
        return this.sortableTable.firstFileInfo;
    };
    WebToolConvertComponent.prototype.doGetOnlineDocs = function () {
        // 1. get data from online, and save to combine
        var doc = this.cloudDocsFrame;
        var docsInfo = doc.nativeElement.contentWindow.CloudReading;
        if (CommonUtil.isNullOrUndefined(docsInfo.multipleChooseFiles)) {
            return null;
        }
        var isExist = true;
        for (var _i = 0, _a = docsInfo.multipleChooseFiles; _i < _a.length; _i++) {
            var doc_4 = _a[_i];
            isExist = this.sortableTable.checkFileExistInOnline(doc_4.id);
            if (isExist)
                continue;
            // CommonUtil.FileAddress  is equal with this.fileSourceType
            this.sortableTable.doAddItem(doc_4.name, doc_4.contentStreamLength, doc_4.id, CommonUtil.FileAddress.FoxitDrive);
        }
        // 2. from combine
        return null;
    };
    WebToolConvertComponent.prototype.SelectAllFile = function () {
        var flag = true;
        var selectAll_class = $(".selectAll");
        if (selectAll_class[0].checked == false) {
            flag = false;
        }
        var fileList_checkbox_class = $(".fileList_checkbox_btn");
        for (var index in fileList_checkbox_class) {
            fileList_checkbox_class[index].checked = flag;
        }
    };
    WebToolConvertComponent.prototype.openConvertMode = function () {
        this.webToolModal.hide();
        this.webToolModalConvert.show();
    };
    WebToolConvertComponent.prototype.closeConvertPage = function () {
        this.webToolModalConvert.hide();
        this.webToolService.clearCacheData();
        //
    };
    WebToolConvertComponent.prototype.onHideConvertPage = function () {
        this.webToolService.clearCacheData();
    };
    WebToolConvertComponent.prototype.onShowConvertPage = function () {
        this.isShownForConvertPage = true;
    };
    WebToolConvertComponent.prototype.getDocumentInfo = function (modeName) {
        if (modeName == "pdf-to-word") {
            this.modeType = CommonUtil.ConvertType.PDFTOWORD;
            //return "PDF to Word";
        }
        else if (modeName == "pdf-to-excel") {
            this.modeType = CommonUtil.ConvertType.PDFTOEXCEL;
            //return "PDF to Excel";
        }
        else if (modeName == "pdf-to-ppt") {
            this.modeType = CommonUtil.ConvertType.PDFTOPPT;
        }
        else if (modeName == "pdf-to-text") {
            this.modeType = CommonUtil.ConvertType.PDFTOTXT;
            //return "PDF to Text";
        }
        else if (modeName == "pdf-to-image") {
            this.modeType = CommonUtil.ConvertType.PDFTOIMG;
            //return "PDF to Image";
        }
        else if (modeName == "image-to-pdf") {
            this.modeType = CommonUtil.ConvertType.IMGTOPDF;
            //return "Image to PDF";
        }
        else if (modeName == "merge-pdf") {
            this.modeType = CommonUtil.ConvertType.MERGEPDF;
            //return "Merge PDF";
        }
        else if (modeName == "split-pdf") {
            this.modeType = CommonUtil.ConvertType.SPLITPDF;
            //return "Split PDF";
        }
        else if (modeName == "page-organizer") {
            this.modeType = CommonUtil.ConvertType.PAGEORGANIZER;
            //return "Page Organizer";
        }
        else if (modeName == "headerfooter") {
            this.modeType = CommonUtil.ConvertType.PDFHEADERFOOTER;
            //return "Header & Footer"
        }
        else if (modeName == "add-watermark-to-pdf") {
            this.modeType = CommonUtil.ConvertType.WATERMARK;
            //return "Watermark";
        }
        else if (modeName == "redact-pdf") {
            this.modeType = CommonUtil.ConvertType.PDFREDACTOR;
            //return "Redact PDF";
        }
        else if (modeName == "protect-pdf") {
            this.modeType = CommonUtil.ConvertType.PDFPROTECT;
            //return "Password Protect";
        }
        else if (modeName == "compress-pdf") {
            this.modeType = CommonUtil.ConvertType.OPTIMIZER;
            //return "Compress PDF";
        }
        else if (modeName == "pdf-to-html") {
            this.modeType = CommonUtil.ConvertType.PDFTOHTML;
            //return "PDF to HTML";
        }
        else if (modeName == "pdf-to-cpdf") {
            this.modeType = CommonUtil.ConvertType.PDFTOCPDF;
            //return "PDF to cPDF";
        }
        else if (modeName == "ppt-to-pdf") {
            this.modeType = CommonUtil.ConvertType.PPTTOPDF;
        }
        else if (modeName == "word-to-pdf") {
            this.modeType = CommonUtil.ConvertType.WORDTOPDF;
        }
        else if (modeName == "excel-to-pdf") {
            this.modeType = CommonUtil.ConvertType.EXCELTOPDF;
        }
        else if (modeName == "text-to-pdf") {
            this.modeType = CommonUtil.ConvertType.TEXTTOPDF;
        }
        else if (modeName == "flatten-pdf") {
            this.modeType = CommonUtil.ConvertType.PDFFLATTEN;
        }
        return this.WebtoolEntry.GetModeName(this.modeType);
        //return "";
    };
    WebToolConvertComponent.prototype.startConvertFunc = function (conf, isSplitFromSplit) {
        var paramConf = CommonUtil.base64EncodeAfterComponent(conf);
        this.webtoolHeaderFooter.hideHeaderFooterMode();
        this.webToolModalConvert.show();
        this.webToolService.setSplitModeConvertFormat(isSplitFromSplit);
        this.webToolService.startConvertAfterSetConfigure(this, paramConf);
        //this.webToolService.cleanFileCache();
    };
    WebToolConvertComponent.prototype.selectDrive = function (drivePackage) {
        var url = "../../netdrive/index.html?chose=" + drivePackage[1].name + "&logoutUrl=" + drivePackage[1].logoutUrl + '&lang=' + this.globalService.getLanguage();
        this.driveurl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.isOpenLocalDocument = false;
        this.isOpenOnlineDocument = false;
        this.isdrivedisplay = 'block';
        var event = drivePackage[0];
        $(".file_list li").removeClass("selected");
        $(event.target).parents('li').addClass('selected');
        var data = window.localStorage.getItem(drivePackage[1].name);
        this.checkNeedNetdirveLogin(drivePackage[1].name, drivePackage[1].loginUrl, drivePackage[1].logoutUrl);
    };
    WebToolConvertComponent.prototype.getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return '';
    };
    WebToolConvertComponent.prototype.checkNeedNetdirveLogin = function (drivename, loginUrl, logoutUrl) {
        var userId = null;
        try {
            userId = this.getCookie('currentEmail');
        }
        catch (ex) {
        }
        var driveUserIdKey = drivename + ':userId';
        if (userId !== localStorage.getItem(driveUserIdKey)) {
            var newWindow = window.open("about:blank", '_blank', 'width=400,height=300,toolbar=no,scrollbars=yes,resizable=yes,menubar=no,screenX=100,screenY=100');
            loginoutNetdrive();
            localStorage.removeItem(driveUserIdKey);
            localStorage.removeItem(drivename);
        }
        else {
            login();
        }
        function login() {
            var data = window.localStorage.getItem(drivename);
            var accoutid = null;
            if (data) {
                data = JSON.parse(data);
                accoutid = data['FoxitWebReader'].id;
            }
            if (accoutid == null) {
                window.open(loginUrl, "", "width=400,height=300,toolbar=no,scrollbars=yes,resizable=yes,menubar=no,screenX=100,screenY=100");
            }
        }
        function loginoutNetdrive() {
            $('#drive_loginout').remove();
            var $iframe = $('<iframe width="0" height="0" id="drive_loginout" src="' + logoutUrl + '"></iframe');
            $('body').append($iframe);
            $iframe.on('load', function () {
                newWindow.location = loginUrl;
            });
        }
    };
    __decorate([
        ViewChild('webToolModalConvert'),
        __metadata("design:type", ModalDirective)
    ], WebToolConvertComponent.prototype, "webToolModalConvert", void 0);
    __decorate([
        ViewChild('webToolModal'),
        __metadata("design:type", ModalDirective)
    ], WebToolConvertComponent.prototype, "webToolModal", void 0);
    __decorate([
        ViewChild('webtoolWarning'),
        __metadata("design:type", ModalDirective)
    ], WebToolConvertComponent.prototype, "webtoolWarning", void 0);
    __decorate([
        ViewChild('webToolTipForSave'),
        __metadata("design:type", ModalDirective)
    ], WebToolConvertComponent.prototype, "webToolTipForSave", void 0);
    __decorate([
        ViewChild(WebToolHeaderFooterComponent),
        __metadata("design:type", WebToolHeaderFooterComponent)
    ], WebToolConvertComponent.prototype, "webtoolHeaderFooter", void 0);
    __decorate([
        ViewChild(WebToolProtectPDFComponent),
        __metadata("design:type", WebToolProtectPDFComponent)
    ], WebToolConvertComponent.prototype, "webtoolProtectPDF", void 0);
    __decorate([
        ViewChild(WebToolWatermarkComponent),
        __metadata("design:type", WebToolWatermarkComponent)
    ], WebToolConvertComponent.prototype, "webtoolWatermark", void 0);
    __decorate([
        ViewChild(SortableTableComponent),
        __metadata("design:type", SortableTableComponent)
    ], WebToolConvertComponent.prototype, "sortableTable", void 0);
    __decorate([
        ViewChild(WebToolSplitPDFComponent),
        __metadata("design:type", WebToolSplitPDFComponent)
    ], WebToolConvertComponent.prototype, "webtoolSplitPDF", void 0);
    __decorate([
        ViewChild('cloudDocsFrame'),
        __metadata("design:type", ElementRef)
    ], WebToolConvertComponent.prototype, "cloudDocsFrame", void 0);
    __decorate([
        ViewChild('OneDriveDocsFrame'),
        __metadata("design:type", ElementRef)
    ], WebToolConvertComponent.prototype, "oneDriveDocsFrame", void 0);
    WebToolConvertComponent = __decorate([
        Component({
            moduleId: module.id,
            selector: 'webtool-convert',
            templateUrl: './webtool.convert.html',
            styleUrls: ['./webtool.convert.css']
        }),
        __metadata("design:paramtypes", [SharedService,
            GlobalService,
            DomSanitizer,
            WebToolService,
            Router,
            WebToolEntryService,
            TranslateService,
            CookieService,
            NgZone])
    ], WebToolConvertComponent);
    return WebToolConvertComponent;
}());
export { WebToolConvertComponent };
