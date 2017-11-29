/**
 * Created by congting_zheng on 2017/5/10 0010.
 */
import {
  Component, ViewChild, Input, Output, EventEmitter, HostListener, OnInit, ElementRef, ChangeDetectorRef, NgZone
} from '@angular/core';
import {ModalDirective, BsDropdownDirective, BsDropdownToggleDirective , TooltipDirective} from 'ngx-bootstrap';
import {
  DomSanitizer, SafeResourceUrl, SafeUrl
} from '@angular/platform-browser';
import {
  AuthenticationService, AlertService, GlobalService, UserService, SharedService
} from '../../../services/index';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { CookieService } from 'angular2-cookie/core';

import {FileUploader} from 'ng2-file-upload/file-upload/file-uploader.class';
import {FileSelectDirective, FileDropDirective} from 'ng2-file-upload/ng2-file-upload';
// import {User} from "../../../models/user";
import {
  WebToolService, WebToolFileInfo, WebToolMultiFileInfos,
  WebtoolMultiFilesInfos_OneDrive, OneDriveFileInfo
} from '../../../services/webtool.service';
import {WebToolEntryService} from '../../../services/webtool.entry.service';
import {WebToolHeaderFooterComponent} from './webtools.headerfooter.component';
import {SortableTableComponent} from '../../commons/sortable-list/sortable-list.component';
import {WebToolProtectPDFComponent} from "./webtool.protectpdf.component";
import {WebToolWatermarkComponent} from "./webtool.watermark.component";
import {WebToolSplitPDFComponent} from "./webtool.splitpdf.component";
declare var window: any;
declare var $: any;
declare var phantomOnlineGlobalConfig: any;
declare var CommonUtil:any;
declare var WebtoolEntryManager:any;
declare var ga: any;

@Component({
  moduleId: module.id,
  selector: 'webtool-convert',
  templateUrl: './webtool.convert.html',
  styleUrls: ['./webtool.convert.css']
})
export class WebToolConvertComponent implements OnInit {
  @ViewChild('webToolModalConvert') public webToolModalConvert: ModalDirective;
  @ViewChild('webToolModal') public webToolModal: ModalDirective;
  @ViewChild('webtoolWarning') public webtoolWarning: ModalDirective;
  @ViewChild('webToolTipForSave') public webToolTipForSave: ModalDirective;
  @ViewChild(WebToolHeaderFooterComponent) public webtoolHeaderFooter: WebToolHeaderFooterComponent;
  @ViewChild(WebToolProtectPDFComponent) public webtoolProtectPDF: WebToolProtectPDFComponent;
  @ViewChild(WebToolWatermarkComponent) public webtoolWatermark: WebToolWatermarkComponent;
  @ViewChild(SortableTableComponent) public sortableTable: SortableTableComponent;
  @ViewChild(WebToolSplitPDFComponent) public webtoolSplitPDF: WebToolSplitPDFComponent;

  /*@ViewChild('webToolDownloadPage') public webToolDownloadPage:ModalDirective;*/

  public isActiveInput: boolean = true;
  public chooseFile: any;
  //private webToolService: WebToolService;
  public cmisUrls: any = {
    img2pdf: "/cloud-reading/index.html?pluginUI=pluginList&fileType=image",
    mergepdf: "/cloud-reading/index.html?pluginUI=pluginList&fileType=pdf",
    convertpdf: "/cloud-reading/index.html?pluginUI=pluginList&fileSelectMode=single"
    /*    word2pdf:"/cloud-reading/index.html?pluginUI=pluginList&fileSelectMode=single",
     ppt2pdf:"/cloud-reading/index.html?pluginUI=pluginList&fileSelectMode=single&fileType=ppt",
     excel2pdf:"/cloud-reading/index.html?pluginUI=pluginList&fileSelectMode=single&fileType=excel"*/
  };
  public cmisUrl: any = '';
  public modalHeaderText: string = "";
  public progressWidth: string = "0%";
  public phantomLoginSwitchIsOn: boolean = false;
  public title: string;
  public loading: boolean = false;
  public googleLoading: boolean = false;
  public isShown: boolean = false;
  public isShownForConvertPage: boolean = false;
  public isUploadFile: boolean = false;
  public convertType: string;
  public error: string;
  public modeType: number;
  public isNeedCheckFoxitDriveFiles: boolean = false;
  public isSolidTool:boolean = true;

  public isResultPage: boolean = false;
  public isOpenLocalDocument: boolean = true;
  public isOpenOnlineDocument: boolean = false;
  public isOpenOneDriveDocument: boolean = false;
  public isSupportCombined: boolean = false;
  public isLastSelectOnline: boolean = false;
  public isShowCombinedTable: boolean = false;
  public isConvertMultiFiles: boolean = false;
  public isSuccessToConvert: boolean = true;
  public isFailToUploadCmis: boolean = false;
  public fileName: string = "";
  public isAutoDownLoadFile: boolean = false;
  public modeImage: string = "img/pdffile.png";
  public solidInfo: string = "";


  public resultInfo: string;
  public ConvertPermission: string = "";
  public resultSaveInfo: string = "";

  public tipForSavingTitle: string = "Foxit Reader Online";
  public isNotShowTipForSave: boolean = false;
  public isOnlineForSourceFile: boolean = false;
  public convertedResultData = {
    ret: "",
    url: "",
    isDocId: false,
    isAllPage: false,
    //isOnline:false,
    fileSourceType: 0
  }; // localfile

  public fileSourceType = {
    localfile: 0,
    foxitdrive: 1,
    box: 2,
    dropbox: 3,
    googledrive: 4,
    onedrive: 5
  };

  public tipFileInfos = {};

  public uploader: FileUploader = new FileUploader({});
  public multiFiles: any = null;
  public combinedFileCount: number = 0;
  public isdrivedisplay: string = 'none';
  public loginouturl: string = '';

  public OnlineFileInfo = {
    mode: "",
    fileName: ""
  }

  public uiEntrys = {
    btnConvert: "Convert",
    btnAdd: "Add",
    btnCancel: "Cancel",
  };

  public driveurl: any = this.sanitizer.bypassSecurityTrustResourceUrl("");

  constructor(private sharedService: SharedService,
              public globalService: GlobalService,
              private sanitizer: DomSanitizer,
              private webToolService: WebToolService,
              private router: Router,
              private WebtoolEntry: WebToolEntryService,
              private translate: TranslateService,
              private cookieService: CookieService,
              //private cd:ChangeDetectorRef,
              private zone: NgZone) {
    this.cmisUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
    //this.cmisUrl=this.sanitizer.bypassSecurityTrustResourceUrl(this.cmisUrls.convertpdf+'&lang='+this.globalService.language);
    //this.cd = cd;
  }

  ngOnInit() {
    this.initEntryInfo();
    this.initResultPageInfo();
    this.initOnlineFileInfo();
  }

  public initOnlineFileInfo() {
    this.OnlineFileInfo.mode = "";
    this.OnlineFileInfo.fileName = "";
  }

  public setOnlineFileInfo(mode: string, fileName: string) {
    this.initOnlineFileInfo();
    this.OnlineFileInfo.mode = mode;
    this.OnlineFileInfo.fileName = fileName;
  }

  public getOnlineModeName() {
    return this.OnlineFileInfo.mode;
  }

  public initResultPageInfo() {
    this.ConvertPermission = "";
    this.resultInfo = "";
    this.resultSaveInfo = "";
  }

  public tipError = {
    CMISResponseError: "84000001",
    ConnectCmisError: "84000002",
  };

  public initEntryInfo() {
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
  }

  public initParameters() {
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
  }

  public selectedFileOnChanged(event: any) {
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
  }

  public fileOverBase(event: any) {
    // drop file to target position
    console.log(event.target.value);
  }

  public fileDropOver(event: any) {
    // finish drop and release mouse
    //console.log(event.target.value);
    this.uploadFile();
    //this.uploader.queue[0].remove();
  }

  public uploadFile() {
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
    } else {
      this.fileName = this.uploader.queue[0]._file.name;
      this.fileName = CommonUtil.ResetFileName(this.fileName, 40);
      this.webToolService.doUpload(this.uploader, this.modeType, this);
    }

  }

  public uploadResultFileToOneDrive() {

  }

  public  uploadProgressWidth(percent: string) {
    $("#progress_bar").css("width", percent);
  }

  public showConvertPage() {
    this.webToolModal.hide();
    this.webToolModalConvert.show();
  }

  public setResultInformation(ret: any, isAllPages: any, mode: any, fileSourceType: number) {
    this.initResultPageInfo();
    let isOnline: boolean = this.isOnlineForSourceFile;
    if (!isOnline) {
      isOnline = fileSourceType != this.fileSourceType.localfile;
    }
    let result = this.WebtoolEntry.getErrorEntry(ret, isAllPages, mode, isOnline);

    //let reslut = WebtoolEntryManager.getErrorEntry(ret, isAllPages, mode);
    if (result.ConvertInfo != "")
      this.resultInfo = this.translate.instant(result.ConvertInfo);
    if (result.PermissionInfo != "")
      this.ConvertPermission = this.translate.instant(result.PermissionInfo);
    if (result.SaveInfo != "") {
      this.resultSaveInfo = this.translate.instant(result.SaveInfo);
      if (result.IsOnline) {
        let name: string = this.onGetNetDriveCommonNameByNetDriveType(fileSourceType);
        this.resultSaveInfo += name;
        this.resultSaveInfo += this.translate.instant("Webtools.SaveFile.Tip.SaveToEnd");
      }
    }

  }

  public uploadError(result: string) {
    this.isSuccessToConvert = false;
    this.setResultInformation(result, true, this.modeType, 0);
    //this.resultInfo = this.tipFileInfos[result];
    this.webToolModal.hide();
    this.isResultPage = true;

    let _this = this;
    //_this.cd.markForCheck();
    //_this.cd.detectChanges();

    setTimeout(function () {
      _this.isResultPage = false;
      // _this.cd.markForCheck();
      // _this.cd.detectChanges();
    }, 6000);
  }

  public doShowErrorMessageForSelectFile(result: string) {
    if (this.isResultPage)
      return;
    this.isSuccessToConvert = false;
    this.setResultInformation(result, true, this.modeType, 0);
    //this.resultInfo = this.tipFileInfos[result];
    this.isResultPage = true;

    let _this = this;
    setTimeout(function () {
      _this.isResultPage = false;
    }, 6000);
  }

  public onFinishUpload(fileInfos: Array<any>) {
    // clean
    this.uploader.clearQueue();
    this.multiFiles = null;
    // notify
    switch (this.modeType) {
      case CommonUtil.ConvertType.IMGTOPDF:
      case CommonUtil.ConvertType.MERGEPDF: {
        this.isUploadFile = false;
        for (let fileInfo of fileInfos) {
          //let _fileInfo = {fileName:item._file.name, index: item.index, fileSize:item._file.size};
          //public doAddItem(fileName:string, fileSize:number, fileId:string, isOnline:boolean )
          let id: string = this.sortableTable.getFileTotalCountFromLocal().toString();
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
  }

  public onNavigateToWebPDF(modeType: number, file: File, docId: string, fileSourceType: number) {
    this.webToolModal.hide();
    let extra_params: string = "";
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
        let netDriveName: string = this.oneDriveName;
        if (CommonUtil.isNullOrUndefined(this.oneDrive_folderID)){
          this.router.navigate(['/preview/netdrive/', netDriveName, encodeURIComponent(docId), encodeURIComponent(extra_params)]);
        }else {
          this.router.navigate(['/preview/netdrive/', netDriveName, encodeURIComponent(docId), encodeURIComponent(extra_params)
            , encodeURIComponent(this.oneDrive_folderID)]);
        }
        break;
      }
      default : {
        console.log("onNavigateToWebPDFPreview parameters is invalid. modeType=" + modeType + ",type=" + fileSourceType);
        break;
      }
    }

  }

  public onNavigateToWebPDFRedactor(file: File, docId: string, fileSourceType: number) {
    this.webToolModal.hide();
    if (!CommonUtil.isNullOrUndefined(file)) {
      this.globalService.inputFile = file;
      window.angularHeaderComponent.getLastFile();
      this.router.navigate(['/preview', encodeURIComponent("&viewermodel=2")]);
    } else if (!CommonUtil.isNullOrUndefined(docId)) {
      let url: string = "/preview/cmis/" + encodeURIComponent(docId) + "/" + encodeURIComponent("&viewermodel=2");
      this.router.navigate(['/preview/cmis/', encodeURIComponent(docId), encodeURIComponent("&viewermodel=2")]);
    }
  }

  //PAGEORGANIZER
  public onNavigateToWebPDFPageOrganizer(file: File, docId: string, fileSourceType: number) {
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
    } else if (!CommonUtil.isNullOrUndefined(docId)) {

      let url: string = "/preview/cmis/" + encodeURIComponent(docId) + "/" + encodeURIComponent("&viewermodel=1");
      this.router.navigate(['/preview/cmis/', encodeURIComponent(docId), encodeURIComponent("&viewermodel=1")]);
      //$("#previewInWebPDF").attr("href",url);
      //document.getElementById('previewInWebPDF').click();
    }

  }

  public onNavigateToWebPDFPreviewFoxitDriveFile(docId: string) {
    if (CommonUtil.isNullOrUndefined(docId))
      return;
    let id: string = docId.split(",")[0];

    //let url:string = "preview/cmis/" + id;
    this.router.navigate(['/preview/cmis/', encodeURIComponent(docId)]);
    //$("#previewInWebPDF").attr("href",url);
    //document.getElementById('previewInWebPDF').click();
  }

  public onNavigateToWebPDFPreviewNetDriveFile(docId: string, netDriveName: string) {
    if (CommonUtil.isNullOrUndefined(docId))
      return;
    let extra_params:string = "&viewermodel=0";
    //{path: 'preview/netdrive/:drive_name/:file_id', component: WebpdfPreviewComponent}, //
    if (CommonUtil.isNullOrUndefined(this.oneDrive_folderID)){
      this.router.navigate(['/preview/netdrive/', netDriveName, encodeURIComponent(docId), encodeURIComponent(extra_params)]);
    }else {
      this.router.navigate(['/preview/netdrive/', netDriveName, encodeURIComponent(docId), encodeURIComponent(extra_params)
        , encodeURIComponent(this.oneDrive_folderID)]);
    }
  }

  public onNavigateToWebPDFPreviewOnlineUrl(url: string) {
    if (CommonUtil.isNullOrUndefined(url))
      return;
    //, fileName:string :, encodeURIComponent(fileName)
    this.router.navigate(['/preview/url/', encodeURIComponent(url)]);
  }

  public onNavigateToWebPDFPreview(fileUri: string, isDocId: boolean, fileSourceType: number) {
    if (CommonUtil.isNullOrUndefined(fileUri))
      return;
    if (!CommonUtil.isNeedToBePreview(this.modeType)) {
      return;
    }
    let _this = this;
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
          let netDriveName: string = _this.oneDriveName;
          _this.onNavigateToWebPDFPreviewNetDriveFile(fileUri, netDriveName);
          break;
        }
        default : {
          console.log("onNavigateToWebPDFPreview parameters is invalid. fileUri=" + fileUri + ",type=" + fileSourceType);
          break;
        }
      }

    }, 1000);

  }

  public ShowResultStatus(result: string, downUrl: string, isDocId: boolean, isAllPage: boolean, fileSourceType: number) {
    this.isSuccessToConvert = false;
    this.isFailToUploadCmis = false;

    if (!CommonUtil.isNullOrUndefined(downUrl) && !isDocId) {
      let _label_downfile: any = $("#downFile");
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
    } else {
      if (result == "84000001" || result == "84000002"
        || result == "84000003" || result == "84000004"
        || result == "84000005" || result == "84000006") {
        this.isAutoDownLoadFile = false;
        this.isFailToUploadCmis = true;
      }
      this.setResultInformation(result, isAllPage, this.modeType, fileSourceType);
    }

    let _this = this;
    setTimeout(function () {
      _this.isResultPage = false;
      //_this.cd.markForCheck();
      //_this.cd.detectChanges();
    }, 6000);
  }

  /*
   * ret: 0:success;
   * fileUri: include url and docId,
   * isDocId: true means fileUri is docId, otherwise url
   *
   * */
  public onShowConvertResult(ret: string, fileUri: string, isDocId: boolean, isAllPage: boolean, fileSourceType: number) {
    this.isNotShowTipForSave = false;
    let showTipFlag: string = this.cookieService.get("webtoolSaveFileTip");
    if (showTipFlag == "hide") {
      this.isNotShowTipForSave = true;
    }
    //toPreview: true means do preview file
    let toPreview: boolean = true;

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
  }

  public doShowSavedTip(ret: string, downUrl: string, isDocId: boolean, fileSourceType: number, isAllPage: boolean) {
    this.convertedResultData = {ret: "", url: "", isDocId: false, fileSourceType: 0, isAllPage: false};//isOnline:false
    this.convertedResultData.ret = ret;
    this.convertedResultData.url = downUrl;
    this.convertedResultData.fileSourceType = fileSourceType;
    this.convertedResultData.isAllPage = isAllPage;
    this.convertedResultData.isDocId = isDocId;

    if (this.globalService.baseUrlIsPDFEditor) {
      this.tipForSavingTitle = this.translate.instant('PhantomPDF Online');
    } else {
      this.tipForSavingTitle = this.translate.instant('Foxit Reader Online');
    }

    this.closeConvertPage();
    this.webToolTipForSave.show();
  }

  public onCheckSavedTipSettingAndDownload() {
    let ret: string = this.convertedResultData.ret;
    let downUrl: string = this.convertedResultData.url;
    let isAllPage: boolean = this.convertedResultData.isAllPage;
    let fileSourceType: number = this.convertedResultData.fileSourceType;
    let isDocId: boolean = this.convertedResultData.isDocId;
    this.webToolTipForSave.hide();
    let today: Date = new Date();
    let ms: number = today.getTime() + 365 * 24 * 3600 * 1000;
    let expireDate: Date = new Date(ms);
    let option = {
      expires: expireDate
    };
    if (!this.isNotShowTipForSave) {
      this.cookieService.put("webtoolSaveFileTip", "show", option);
    } else {
      this.cookieService.put("webtoolSaveFileTip", "hide", option);
    }

    this.ShowResultStatus(ret, downUrl, isDocId, isAllPage, fileSourceType);
    //if(isOnline)
    this.onNavigateToWebPDFPreview(downUrl, isDocId, fileSourceType);
  }

  public getFileFilterByModeType(modeType: number): string {
    let ret: string = "";
    switch (modeType) {
      case CommonUtil.ConvertType.PDFTOCPDF :
      case CommonUtil.ConvertType.OPTIMIZER :
      case CommonUtil.ConvertType.WATERMARK :
      case CommonUtil.ConvertType.MERGEPDF :
      case CommonUtil.ConvertType.PDFTOTXT :
      case CommonUtil.ConvertType.PDFTOIMG :
      case CommonUtil.ConvertType.PDFPROTECT :
      case CommonUtil.ConvertType.PDFREDACTOR :
      case CommonUtil.ConvertType.PDFHEADERFOOTER :
      case CommonUtil.ConvertType.ROTATEPDF :
      case CommonUtil.ConvertType.PDFTOWORD :
      case CommonUtil.ConvertType.SPLITPDF :
      case CommonUtil.ConvertType.PAGEORGANIZER :
      case CommonUtil.ConvertType.PDFTOEXCEL :
      case CommonUtil.ConvertType.PDFTOPPT:
      case CommonUtil.ConvertType.PDFTOHTML :
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
  }

  public isMatchedFileByModeType(file: File, modeType: number) {
    let fileName = file.name;
    if (CommonUtil.isSupportedFile(fileName, modeType))
      return true;

    return false;

    /* let fileFilter:string = this.getFileFilterByModeType(modeType);
     let fileType:string = file.type;
     if (!this.webToolService.isNullOrUndefined(fileType) && fileType.length > 0 && fileFilter.indexOf(fileType) >= 0){
     return true;
     }
     return false;*/
  }

  public getMatchedFilesByModeType(files: Array<File>, modeType: number): Array<File> {
    if (CommonUtil.isNullOrUndefined(files) || files.length == 0) {
      return null;
    }
    let _files: Array<File> = [];
    let isMatched: boolean = false;
    for (let file of files) {
      isMatched = this.isMatchedFileByModeType(file, modeType);
      if (!isMatched) {
        continue;
      }
      _files.push(file);
    }
    return _files;
  }

  public getMatchedFilesByFileSize(files: Array<File>, fileMaxSize: number): Array<File> {
    let __files: Array<File> = [];
    let isExceed: boolean = false;
    for (let file of files) {
      isExceed = file.size && file.size >= fileMaxSize * 1024 * 1024;
      if (isExceed) {
        continue;
      }
      __files.push(file);
    }

    return __files;
  }

  public getMaxFileSize(modeType: number) {
    var maxSize = 50;
    if (modeType == CommonUtil.ConvertType.PDFREDACTOR ||
      modeType == CommonUtil.ConvertType.PAGEORGANIZER) {
      maxSize = 200;
    } else if (modeType == CommonUtil.ConvertType.WORDTOPDF ||
      modeType == CommonUtil.ConvertType.EXCELTOPDF ||
      modeType == CommonUtil.ConvertType.PPTTOPDF ||
      modeType == CommonUtil.ConvertType.TEXTTOPDF) {
      maxSize = 5;
    }

    return maxSize;
  }

  public doFilterFilesByTypeAndFileSize(files: Array<File>, modeType: number): Array<File> {
    let _files: Array<File> = this.getMatchedFilesByModeType(files, modeType);
    let fileMaxSize = this.getMaxFileSize(modeType);

    if (null == _files || _files.length == 0) {
      this.doShowErrorMessageForSelectFile("82000020");
      return null;
    }
    // files less than {fileMaxSize} MB
    let __files: Array<File> = this.getMatchedFilesByFileSize(_files, fileMaxSize);
    if (__files.length < _files.length) {
      this.doShowErrorMessageForSelectFile("82000021");
    }

    return __files;
  }

  public doShowFileWindow() {
    this.cleanFileCache();
    //
    if (CommonUtil.isUploadMultiFiles(this.modeType)) {
      document.getElementById('SelectMultiFileMode').click();
    } else {
      document.getElementById('SelectFileMode').click();
    }
  }

  public cleanFileCache() {
    let _this = this;
    //this.isActiveInput = false;

    //this.isActiveInput = true;

    var _fileInput: any = null;
    if (CommonUtil.isUploadMultiFiles(this.modeType)) {
      _fileInput = $("#SelectMultiFileMode");
    } else {
      _fileInput = $("#SelectFileMode");
    }

    //_fileInput = $("#SelectFileMode");
    let _innerHtml: any = _fileInput.clone().val("");
    let fileFilter = this.getFileFilterByModeType(this.modeType);
    _innerHtml.attr("accept",fileFilter);

    _fileInput.after(_innerHtml);
    _fileInput.remove();


    if (CommonUtil.isUploadMultiFiles(this.modeType)) {
      _fileInput = $("#SelectMultiFileMode");
    } else {
      _fileInput = $("#SelectFileMode");
    }

    //var file2 = document.getElementById("SelectFileMode");
    //_fileInput.addEventListener("change",
    _fileInput.unbind("change").bind('change', function (event: any) {
      var files = event.target.files;

      let _files: Array<File> = _this.doFilterFilesByTypeAndFileSize(files, _this.modeType);
      if (null == _files || _files.length == 0) {
        return;
      }

      if (CommonUtil.isUploadMultiFiles(_this.modeType)) {
        _this.multiFiles = _files;
      } else {
        _this.uploader.clearQueue();
        let options = _this.uploader.options;
        _this.uploader.addToQueue(_files, options);
      }
      _this.selectedFileOnChanged(event);
    });

  }

  public initClickEvent() {
    let _this = this;
    $('.web-tool-dropzone').unbind('click');
    $('.web-tool-dropzone').bind('click', function () {
      _this.doShowFileWindow();
    });
  }

  public initDragEvent() {

    var getDataTransfer = function (event: any) {
      var dataTransfer: any;
      return dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
    };

    var processDragOverOrEnter = function (event: any) {
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
    var preventDefaultDrop = function (event: any) {
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
    $('.web-tool-dropzone').bind('dragleave', function (e: any) {
      $('.web-tool-dropzone').removeClass('drop-active');
    });

    var _this = this;
    $('.web-tool-dropzone').bind('drop', function (e: any) {
      if (e) {
        e.preventDefault();
      }
      $('.web-tool-dropzone').removeClass('drop-active');

      var files = getDataTransfer(e).files;

      let _files: Array<File> = _this.doFilterFilesByTypeAndFileSize(files, _this.modeType);
      if (null == _files || _files.length == 0) {
        return;
      }

      if (CommonUtil.isUploadMultiFiles(_this.modeType)) {
        _this.multiFiles = _files;
      } else {
        let options = _this.uploader.options;
        let __files: Array<File> = [];
        __files.push(files[0]);
        _this.uploader.clearQueue();
        _this.uploader.addToQueue(__files, options);
      }


      _this.fileDropOver(e);
    });
  }

  public HideWarnPage() {
    this.webtoolWarning.hide();
  }

  public showConfigurePage(pageCount: number) {
    let _this = this;

    function callbackFromHeaderFooter(param: any, isSplitFromSplit: boolean) {
      _this.startConvertFunc(param, isSplitFromSplit);
    }

    if (this.modeType == CommonUtil.ConvertType.PDFHEADERFOOTER) {
      this.webToolModal.hide();
      this.webtoolHeaderFooter.showHeaderFooterPage(callbackFromHeaderFooter);
      return;
    } else if (this.modeType == CommonUtil.ConvertType.PDFPROTECT) {
      this.webToolModal.hide();
      this.webtoolProtectPDF.showProtectPDFPage(callbackFromHeaderFooter);
    } else if (this.modeType == CommonUtil.ConvertType.WATERMARK) {
      this.webToolModal.hide();
      this.webtoolWatermark.showWatermarkPage(callbackFromHeaderFooter);
    } else if (this.modeType == CommonUtil.ConvertType.SPLITPDF) {
      this.webToolModal.hide();
      this.webtoolSplitPDF.showSplitPDFPage(pageCount, callbackFromHeaderFooter);
    }
  }

  public setCmisUrl(modeTye: number) {
    let _url: SafeResourceUrl;
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
  }

  public doPrepareWebToolsEntrys(modeType: number) {
    switch (modeType) {
      case CommonUtil.ConvertType.PDFREDACTOR: {
        this.translate.get('Webtools.BTN.RedactPDF').subscribe((value: string) => {
          this.uiEntrys.btnConvert = value;
        });
        break;
      }
      case CommonUtil.ConvertType.MERGEPDF: {
        this.translate.get('Webtools.BTN.MergePDF').subscribe((value: string) => {
          this.uiEntrys.btnConvert = value;
        });
        break;
      }
      case CommonUtil.ConvertType.PAGEORGANIZER: {
        this.translate.get('Webtools.BTN.PageOrganizer').subscribe((value: string) => {
          this.uiEntrys.btnConvert = value;
        });
        break;
      }
      case CommonUtil.ConvertType.PDFHEADERFOOTER: {
        this.translate.get('Webtools.BTN.HeaderFooter').subscribe((value: string) => {
          this.uiEntrys.btnConvert = value;
        });
        break;
      }
      case CommonUtil.ConvertType.PDFPROTECT: {
        this.translate.get('Webtools.BTN.PasswordProtect').subscribe((value: string) => {
          this.uiEntrys.btnConvert = value;
        });
        break;
      }
      case CommonUtil.ConvertType.OPTIMIZER: {
        this.translate.get('Webtools.BTN.CompressPDF').subscribe((value: string) => {
          this.uiEntrys.btnConvert = value;
        });
        break;
      }
      case CommonUtil.ConvertType.WATERMARK: {
        this.translate.get('Webtools.BTN.Watermark').subscribe((value: string) => {
          this.uiEntrys.btnConvert = value;
        });
        break;
      }
      case CommonUtil.ConvertType.SPLITPDF: {
        this.translate.get('Webtools.BTN.SplitPDF').subscribe((value: string) => {
          this.uiEntrys.btnConvert = value;
        });
        break;
      }
      default: {
        // "subscribe" replace of "toPromise().then"
        this.translate.get('Webtools.BTN.Convert').subscribe((value: string) => {
          this.uiEntrys.btnConvert = value;
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

  }

  public setModeShowImage() {
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
  }

  public showWebToolModal(phantomLoginSwitchIsOn?: boolean, modeName?: string, eventFrom?: number): void {
    this.initParameters();
    let modal_header = this.getDocumentInfo(modeName);
    this.setModeShowImage();
    this.isNeedCheckFoxitDriveFiles = false;
    if (eventFrom == 1) {
      this.isNeedCheckFoxitDriveFiles = true;
    }

    if(this.modeType == CommonUtil.ConvertType.PDFTOEXCEL ||
      this.modeType == CommonUtil.ConvertType.PDFTOPPT ||
      this.modeType == CommonUtil.ConvertType.PDFTOWORD){
      this.isSolidTool = true;
      let solidInfo = this.WebtoolEntry.getSolidInfoByType(this.modeType);
      this.solidInfo = this.translate.instant(solidInfo);
    }else{
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
      this.modeType != CommonUtil.ConvertType.PDFTOPPT
    ) {
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
    } else {
      this.phantomLoginSwitchIsOn = false;
    }
    this.title = 'WebTool Convert';
    this.convertType = 'No defined!';

    console.log('====showWebToolModal====');
    if (!this.isShown) {
      //noinspection TypeScriptUnresolvedFunction
      this.webToolModal.show();
    } else {
      this.error = '';
    }
  }

  public hideModal(): void {
    //noinspection TypeScriptUnresolvedFunction
    console.log('====hideWebToolModal====');
    this.webToolModal.hide();
  }

  public onShow() {
    this.isShown = true;
  }

  public onShown() {
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
  }

  public onHide() {
    this.isShown = false;
    this.progressWidth = "0%";
    this.uploader.cancelAll();
    this.OpenLocalDocument();
  }

  // event from cloud-reading-iframe, Merge PDF
  public onMergePDFForFoxitDrive() {
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
  }

  public onFinishSelectOnlineDocs() {
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
  }

  public doRefreshCombinedDocsForFoxitDrive(): boolean {
    let foxitDriveIFrame: any = document.getElementById("cloud-reading-iframe");
    let doc: any = foxitDriveIFrame;
    let docsInfo = doc.contentWindow.CloudReading;
    let fileInfos: Array<any> = [];

    if (CommonUtil.isNullOrUndefined(docsInfo.multipleChooseFiles)) {
      if (CommonUtil.isNullOrUndefined(docsInfo.choseFile)) {
        console.log("no select any file.");
        return;
      }
      fileInfos.push(docsInfo.choseFile);

    } else {
      fileInfos = docsInfo.multipleChooseFiles;
    }
    let isExist: boolean = true;
    let isSupportFile: boolean = true;
    for (let doc of fileInfos) {
      isSupportFile = CommonUtil.isSupportedFile(doc.name, this.modeType);
      if (!isSupportFile)
        continue;

      isExist = this.sortableTable.checkFileExistInOnline(doc.id);
      if (isExist)
        continue;

      this.sortableTable.doAddItem(doc.name, doc.contentStreamLength, doc.id, CommonUtil.FileAddress.FoxitDrive);
    }

    let lastFileCount: number = this.combinedFileCount;
    this.combinedFileCount = this.sortableTable.fileItems.length;
    if (lastFileCount != this.combinedFileCount) {
      this.onSwitchCombinedDocs();
    }
  }

  public doRefreshCombinedDocs(): boolean {

    let doc = this.cloudDocsFrame;
    let docsInfo = doc.nativeElement.contentWindow.CloudReading;
    let fileInfos: Array<any> = [];

    if (CommonUtil.isNullOrUndefined(docsInfo.multipleChooseFiles)) {
      if (CommonUtil.isNullOrUndefined(docsInfo.choseFile)) {
        console.log("no select any file.");
        return;
      }
      fileInfos.push(docsInfo.choseFile);

    } else {
      fileInfos = docsInfo.multipleChooseFiles;
    }
    let isExist: boolean = true;
    let isSupportFile: boolean = true;
    let isCanAdd = false;
    for (let doc of fileInfos) {
      isSupportFile = CommonUtil.isSupportedFile(doc.name, this.modeType);
      if (!isSupportFile)
        continue;
      if (!isCanAdd)
        isCanAdd = true;
      isExist = this.sortableTable.checkFileExistInOnline(doc.id);
      if (isExist)
        continue;

      this.sortableTable.doAddItem(doc.name, doc.contentStreamLength, doc.id, CommonUtil.FileAddress.FoxitDrive);
    }
    let lastFileCount: number = this.combinedFileCount;
    this.combinedFileCount = this.sortableTable.fileItems.length;
    if (isCanAdd || lastFileCount != this.combinedFileCount) {
      this.onSwitchCombinedDocs();
    }
  }

  public doSwitchLocalDocument() {
    this.isOpenOnlineDocument = false;
    this.isShowCombinedTable = false;
    this.isOpenOneDriveDocument = false;
    this.isOpenLocalDocument = true;
    this.isdrivedisplay = 'none';

    $(".file_list li").removeClass("selected");
    $("#local_doc_mode").addClass("selected");
    // $("#cmis_doc_mode").removeClass("selected");
    // $("#combined_docs_mode").removeClass("selected");
  }

  public doSwitchCombinedDocs() {
    this.isOpenOnlineDocument = false;
    this.isOpenLocalDocument = false;
    this.isOpenOneDriveDocument = false;
    this.isShowCombinedTable = true;
    this.isdrivedisplay = 'none';

    $(".file_list li").removeClass("selected");
    $("#combined_docs_mode").addClass("selected");
    // $("#local_doc_mode").removeClass("selected");
    // $("#cmis_doc_mode").removeClass("selected");
  }

  public doSwitchOneDriveDocs() {
    this.isOpenOnlineDocument = false;
    this.isOpenLocalDocument = false;
    this.isShowCombinedTable = false;
    this.isOpenOneDriveDocument = true;
    this.isdrivedisplay = 'block';

    //$(".file_list li").removeClass("selected");
    $("#combined_docs_mode").removeClass("selected");
  }

  public onSwitchCombinedDocs() {
    this.doSwitchCombinedDocs();
  }

  public doSwitchOnlineDocument() {
    this.isShowCombinedTable = false;
    this.isOpenLocalDocument = false;
    this.isOpenOnlineDocument = true;
    this.isOpenOneDriveDocument = false;
    this.isdrivedisplay = 'none';

    $(".file_list li").removeClass("selected");
    $("#cmis_doc_mode").addClass("selected");
    // $("#local_doc_mode").removeClass("selected");
    // $("#combined_docs_mode").removeClass("selected");
  }

  public OpenLocalDocument() {
    this.doSwitchLocalDocument();
    this.isLastSelectOnline = false;
  }

  public doOpenCombinedDocs() {
    this.doSwitchCombinedDocs();
    this.isLastSelectOnline = false;
  }

  public OpenOnlineDocument() {
    this.doSwitchOnlineDocument();
    this.isLastSelectOnline = true;
  }

  public onAddOnlineDocsToCombine() {
    if (this.isOpenOneDriveDocument) {
      this.onConvertOneDriveDocs();
    } else {
      this.onFinishSelectOnlineDocs();
    }
  }

  public OpenOneDriveDocument() {
    this.doSwitchOneDriveDocs();
    //alert("Open");
  }

  public checkValidForConvert(): any {
    if (this.isShowCombinedTable) {
      let doDisable:string = "";
      let limitMinCount:number = -1;
      if (this.modeType == CommonUtil.ConvertType.IMGTOPDF) {
        limitMinCount = 1;
      } else if (this.modeType == CommonUtil.ConvertType.MERGEPDF) {
        limitMinCount = 2;
      }
      if (limitMinCount != -1 ){
        if (this.sortableTable.fileItems.length < limitMinCount){
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
  }

  @ViewChild('cloudDocsFrame') public cloudDocsFrame: ElementRef;
  @ViewChild('OneDriveDocsFrame') public oneDriveDocsFrame: ElementRef;

  public oneDrive_folderID: string = "";
  public oneDrive_fileID: string = "";
  public oneDriveIframe: any = null;
  public oneDriveName: string = null;

  public onShowNetDriveErrorForUpload(err:any){
    console.log(err);
    this.zone.run(() => {
      this.uploadError("83000002");
    });
  }

  public onConvertOneDriveDocs() {

    let iframeWindow = this.oneDriveDocsFrame.nativeElement.contentWindow;
    this.oneDriveIframe = iframeWindow;
    this.oneDriveName = this.oneDriveIframe.getCurrentDriveName();
    let fileId = iframeWindow.getSelectFileId();
    this.oneDrive_fileID = fileId;
    this.oneDrive_folderID = iframeWindow.getSelectFolderid();
    if (CommonUtil.isNullOrUndefined(fileId))
      return;
    if (CommonUtil.isNavigateToWebPDF(this.modeType)) {
      CommonUtil.addGAInfoByType(this.modeType);
      let type: number = this.onGetFileSourceTypeByNetDriveName(this.oneDriveName);
      this.onNavigateToWebPDF(this.modeType, null, fileId, type);
      return;
    }
    console.log("fileID: " + fileId);

    iframeWindow.getFileInfo(fileId).then( (fileInfo: any) =>{
      //fileInfo:{id: "AC7B071215D0D95A!246", name: "xxx.docx", path: null, size: 591709, modified: "2017-10-23T08:12:07.437Z"}
      // check type  and size
      if (!CommonUtil.isSupportedFile(fileInfo.name, this.modeType)) {
        this.zone.run( () =>{this.doShowErrorMessageForSelectFile("82000020");});
        return;
      }

      let maxSize = this.getMaxFileSize(this.modeType);
      if (fileInfo.size > maxSize * 1024 * 1024) {
        this.zone.run( () =>{this.doShowErrorMessageForSelectFile("82000021");});
        return;
      }

      iframeWindow.getFileById(fileId).then((file: any) => {
        this.zone.run(() => {
          this.startUploadFileFromOneDrive();
          this.setOnlineFileInfo("OneDrive", file.name);
          this.webToolService.doUploadByBuffer(file, this.modeType, this);
        });
      }, (err: any) => {
        this.onShowNetDriveErrorForUpload(err);
      }).catch(function (err: any) {
        this.onShowNetDriveErrorForUpload(err);
      });
    }, (err: any) => {
      this.onShowNetDriveErrorForUpload(err);
    }).catch((err: any) => {
      this.onShowNetDriveErrorForUpload(err);
    });
  }

  public onGetFileSourceTypeByNetDriveName(netDriveName: string): number {
    let type: number = this.fileSourceType.localfile;
    if (netDriveName.toLowerCase() == "box") {
      type = this.fileSourceType.box;
    } else if (netDriveName.toLowerCase() == "dropbox") {
      type = this.fileSourceType.dropbox;
    } else if (netDriveName.toLowerCase() == "google drive") {
      type = this.fileSourceType.googledrive;
    } else if (netDriveName.toLowerCase() == "onedrive") {
      type = this.fileSourceType.onedrive;
    }
    return type;
  }

  public onGetNetDriveCommonNameByNetDriveType(type: number): string {
    let output: string = "";
    /*
     "Foxit Drive": "Foxit Drive",
     "Box": "Box.",
     "Dropbox": "Dropbox.",
     "Google Drive": "Google Drive.",
     "OneDrive": "OneDrive.",
     * */
    if (type == this.fileSourceType.foxitdrive) {
      output = this.translate.instant("Foxit Drive");
    } else if (type == this.fileSourceType.box) {
      output = this.translate.instant("Box");
    } else if (type == this.fileSourceType.dropbox) {
      output = this.translate.instant("Dropbox");
    } else if (type == this.fileSourceType.googledrive) {
      output = this.translate.instant("Google Drive");
    } else if (type == this.fileSourceType.onedrive) {
      output = this.translate.instant("OneDrive");
    }
    return output;
  }

  /*
   * type: net drive(value in this.fileSourceType)
   * step: no use
   * */
  public onGetErrorCodeByNetDrive(type: number, step: string): string {
    let ret: string = "";
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
  }

  public uploadFileToOneDrive(params: any) {
    //let iframeWindow = this.oneDriveDocsFrame.nativeElement.contentWindow;
    //let destName = CommonUtil.getResultFileNameByMode(this.OnlineFileInfo.fileName,this.modeType);
    let _modeType = params.type;
    let _fileName = params.fileName;
    let _downLink = params.downLink;
    let _isExtractPages = params.isExtractPages;
    let _isOverlay = params.isOverlay;
    let _isAllPages = params.isAllPages;

    let _fileID = _isOverlay ? this.oneDrive_fileID : "";
    let myFileName = CommonUtil.getOutputFileName(_modeType, _fileName, _isExtractPages);
    let options = {dest_name: myFileName, folder_id: this.oneDrive_folderID, file_id: _fileID, auto_rename: true};
    let type: number = this.onGetFileSourceTypeByNetDriveName(this.oneDriveName);
    this.oneDriveIframe.uploadfile(_downLink, myFileName, options).then((data: any) => {
      this.zone.run(() => {
        let json: any = CommonUtil.commonJsonParser(data);
        let uri: string = _downLink;
        if (!CommonUtil.isNullOrUndefined(json) && !CommonUtil.isNullOrUndefined(json.id))
          uri = json.id;
        this.onShowConvertResult("0", uri, true, _isAllPages, type);
        console.log(data);
      });
    }, (error: any) => {
      console.log(error);
      this.zone.run(() => {
        let ret: string = this.onGetErrorCodeByNetDrive(type, null);
        let uri: string = _downLink;
        this.onShowConvertResult(ret, uri, false, _isAllPages, type);
      });
    }).catch(function (err: any) {
      console.log(err);
      this.zone.run(() => {
        let ret: string = this.onGetErrorCodeByNetDrive(type, null);
        let uri: string = _downLink;
        this.onShowConvertResult(ret, uri, false, _isAllPages, type);
      });
    });

    /*this.oneDriveIframe.uploadfile(downlink, destName, options).then(function(data:any){
     _this.onShowConvertResult("0",downlink, true, true, true);
     //_this.cd.detectChanges();
     console.log(data);
     });*/
  }

  public startUploadFileFromOneDrive() {
    this.isUploadFile = true;
    this.isdrivedisplay = "none";
    this.isOpenOneDriveDocument = false;
  }

  public onConvertOnlineDocs() {
    this.initOnlineFileInfo();
    if (this.isOpenLocalDocument)
      return;

    //document.getElementById("cloud-reading-iframe").contentWindow;
    let docInfo = document.getElementById("cloud-docs-webtool");
    //docInfo[0].contentWindow.CloudReading.choseFile;
    //docInfo[0].contentWindow.CloudReading.multipleChooseFiles;
    let doc = this.cloudDocsFrame;
    let docsInfo = doc.nativeElement.contentWindow.CloudReading;
    //let docs = $('#cloud-docs-webtool')[0].contentWindow.CloudReading
    //console.log("doc info:" + docs.choseFile);
    //console.log("doc info:" + docs.multipleChooseFiles);
    let docs = docsInfo;
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

    let multiFile: WebToolMultiFileInfos = new WebToolMultiFileInfos;
    multiFile.files = [];
    multiFile.path = "";
    if (!CommonUtil.isUploadMultiFiles(this.modeType) && !CommonUtil.isNullOrUndefined(docs.choseFile)) {
      let fileInfo: WebToolFileInfo = new WebToolFileInfo;
      fileInfo.type = "online";
      fileInfo.name = docs.choseFile.name;
      if (!CommonUtil.isSupportedFile(fileInfo.name, this.modeType)) {
        this.doShowErrorMessageForSelectFile("82000020");
        return;
      }

      let fileSize = docs.choseFile.contentStreamLength;
      let maxSize = this.getMaxFileSize(this.modeType);
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
    } else if (CommonUtil.isUploadMultiFiles(this.modeType) && this.sortableTable.fileItems.length > 0) {
      let fileInfos: Array<any> = this.sortableTable.getOnlineDocsInfo();
      for (let doc of fileInfos) {
        let fileInfo: WebToolFileInfo = new WebToolFileInfo;
        fileInfo.type = "online";
        fileInfo.name = doc.fileName;
        fileInfo.index = doc.index;
        fileInfo.uri = doc.fileId;

        multiFile.files.push(fileInfo);
      }

      multiFile.type = this.modeType;
      multiFile.count = fileInfos.length;
      multiFile.path = "";
      this.webToolService.doConvertMutilFiles(multiFile, this.modeType, this);
    }
  }

  public getFileIndexList(): string {
    return this.sortableTable.getFileIndexList();
  }

  public getFirstFileInfo(): any {
    return this.sortableTable.firstFileInfo;
  }

  public doGetOnlineDocs(): Array<any> {
    // 1. get data from online, and save to combine
    let doc = this.cloudDocsFrame;
    let docsInfo = doc.nativeElement.contentWindow.CloudReading;
    if (CommonUtil.isNullOrUndefined(docsInfo.multipleChooseFiles)) {
      return null;
    }
    let isExist: boolean = true;
    for (let doc of docsInfo.multipleChooseFiles) {
      isExist = this.sortableTable.checkFileExistInOnline(doc.id);
      if (isExist)
        continue;
      // CommonUtil.FileAddress  is equal with this.fileSourceType
      this.sortableTable.doAddItem(doc.name, doc.contentStreamLength, doc.id, CommonUtil.FileAddress.FoxitDrive);
    }
    // 2. from combine


    return null;
  }

  public SelectAllFile() {
    var flag = true;
    var selectAll_class = $(".selectAll");
    if (selectAll_class[0].checked == false) {
      flag = false;
    }
    var fileList_checkbox_class = $(".fileList_checkbox_btn");
    for (var index in fileList_checkbox_class) {
      fileList_checkbox_class[index].checked = flag;
    }
  }

  public openConvertMode() {
    this.webToolModal.hide();
    this.webToolModalConvert.show();
  }

  public closeConvertPage() {
    this.webToolModalConvert.hide();
    this.webToolService.clearCacheData();
    //
  }

  public onHideConvertPage() {
    this.webToolService.clearCacheData();
  }

  public onShowConvertPage() {
    this.isShownForConvertPage = true;
  }

  public getDocumentInfo(modeName?: string) {
    if (modeName == "pdf-to-word") {
      this.modeType = CommonUtil.ConvertType.PDFTOWORD;
      //return "PDF to Word";
    } else if (modeName == "pdf-to-excel") {
      this.modeType = CommonUtil.ConvertType.PDFTOEXCEL;
      //return "PDF to Excel";
    } else if (modeName == "pdf-to-ppt") {
      this.modeType = CommonUtil.ConvertType.PDFTOPPT;
    } else if (modeName == "pdf-to-text") {
      this.modeType = CommonUtil.ConvertType.PDFTOTXT;
      //return "PDF to Text";
    } else if (modeName == "pdf-to-image") {
      this.modeType = CommonUtil.ConvertType.PDFTOIMG;
      //return "PDF to Image";
    } else if (modeName == "image-to-pdf") {
      this.modeType = CommonUtil.ConvertType.IMGTOPDF;
      //return "Image to PDF";
    } else if (modeName == "merge-pdf") {
      this.modeType = CommonUtil.ConvertType.MERGEPDF;
      //return "Merge PDF";
    } else if (modeName == "split-pdf") {
      this.modeType = CommonUtil.ConvertType.SPLITPDF;
      //return "Split PDF";
    } else if (modeName == "page-organizer") {
      this.modeType = CommonUtil.ConvertType.PAGEORGANIZER;
      //return "Page Organizer";
    } else if (modeName == "headerfooter") {
      this.modeType = CommonUtil.ConvertType.PDFHEADERFOOTER;
      //return "Header & Footer"
    } else if (modeName == "add-watermark-to-pdf") {
      this.modeType = CommonUtil.ConvertType.WATERMARK;
      //return "Watermark";
    } else if (modeName == "redact-pdf") {
      this.modeType = CommonUtil.ConvertType.PDFREDACTOR;
      //return "Redact PDF";
    } else if (modeName == "protect-pdf") {
      this.modeType = CommonUtil.ConvertType.PDFPROTECT;
      //return "Password Protect";
    } else if (modeName == "compress-pdf") {
      this.modeType = CommonUtil.ConvertType.OPTIMIZER;
      //return "Compress PDF";
    } else if (modeName == "pdf-to-html") {
      this.modeType = CommonUtil.ConvertType.PDFTOHTML;
      //return "PDF to HTML";
    } else if (modeName == "pdf-to-cpdf") {
      this.modeType = CommonUtil.ConvertType.PDFTOCPDF;
      //return "PDF to cPDF";
    } else if (modeName == "ppt-to-pdf") {
      this.modeType = CommonUtil.ConvertType.PPTTOPDF;
    } else if (modeName == "word-to-pdf") {
      this.modeType = CommonUtil.ConvertType.WORDTOPDF;
    } else if (modeName == "excel-to-pdf") {
      this.modeType = CommonUtil.ConvertType.EXCELTOPDF;
    } else if (modeName == "text-to-pdf") {
      this.modeType = CommonUtil.ConvertType.TEXTTOPDF;
    } else if (modeName == "flatten-pdf") {
      this.modeType = CommonUtil.ConvertType.PDFFLATTEN;
    }

    return this.WebtoolEntry.GetModeName(this.modeType);

    //return "";
  }

  public startConvertFunc(conf: string, isSplitFromSplit: boolean) {
    let paramConf = CommonUtil.base64EncodeAfterComponent(conf);
    this.webtoolHeaderFooter.hideHeaderFooterMode();
    this.webToolModalConvert.show();
    this.webToolService.setSplitModeConvertFormat(isSplitFromSplit);
    this.webToolService.startConvertAfterSetConfigure(this, paramConf);
    //this.webToolService.cleanFileCache();
  }

  selectDrive(drivePackage: any) {
    let url = `../../netdrive/index.html?chose=${drivePackage[1].name}&logoutUrl=${drivePackage[1].logoutUrl}` + '&lang=' + this.globalService.getLanguage();
    this.driveurl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.isOpenLocalDocument = false;
    this.isOpenOnlineDocument = false;
    this.isdrivedisplay = 'block';
    let event = drivePackage[0];

    $(".file_list li").removeClass("selected");
    $(event.target).parents('li').addClass('selected');

    var data = window.localStorage.getItem(drivePackage[1].name);

    this.checkNeedNetdirveLogin(drivePackage[1].name, drivePackage[1].loginUrl, drivePackage[1].logoutUrl);

  }

  public getCookie(name: any) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return decodeURIComponent(arr[2]);
    else
      return '';
  }

  public checkNeedNetdirveLogin(drivename: any, loginUrl: any, logoutUrl: any) {
    var userId = null;
    try {
      userId = this.getCookie('currentEmail');
    } catch (ex) {

    }

    var driveUserIdKey = drivename+ ':userId';
    if (userId !== localStorage.getItem(driveUserIdKey)) {
        var newWindow = window.open("about:blank", '_blank','width=400,height=300,toolbar=no,scrollbars=yes,resizable=yes,menubar=no,screenX=100,screenY=100');
        loginoutNetdrive();
        localStorage.removeItem(driveUserIdKey);
        localStorage.removeItem(drivename);
    } else {
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
            window.open(loginUrl,"","width=400,height=300,toolbar=no,scrollbars=yes,resizable=yes,menubar=no,screenX=100,screenY=100");
        }
    }

    function loginoutNetdrive() {
        $('#drive_loginout').remove();
        var $iframe = $('<iframe width="0" height="0" id="drive_loginout" src="'+ logoutUrl +'"></iframe');
        $('body').append($iframe);
        $iframe.on('load', function(){
            newWindow.location = loginUrl;
        });
    }

  }

}
