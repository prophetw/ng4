/**
 * Created by congting_zheng on 2017/5/16 0016.
 */
import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http'
import {GlobalService, SharedService } from "./index";
import { CookieService } from 'angular2-cookie/core';
import { FileUploader, FileUploaderOptions, Headers as UploadParams} from 'ng2-file-upload';
import { WebToolConvertComponent } from "../components/modals/webtools/webtool.component";

declare var $: any;
declare var phantomOnlineGlobalConfig: any;
declare var CommonUtil:any;
declare var WebTools:any;
declare var CommonDefined:any;
declare var ga: any;

declare function CreateWebToolFileInfos(convertType: any): any;

//import {WebToolUrls} from './webtool.urls.interface';
export class WebToolUrls {
  baseUrl: string;
  baseHttpUrl: string;
  doUpload: string;
  doConvert: string;
  getTaskId: string;
  getUserId: string;
  getConvertStatus: string;
  downLink:string;
  fileLink:string;
  doPrepareFile:string;
}

export class WebToolFileInfo {
  name: string;
  uri: string;
  type: string;
  index: number;
  path: string;
}

export class WebToolMultiFileInfos {
  taskId: string;
  type: number;
  token: string;
  count: number;
  path: string;
  files: Array<WebToolFileInfo>;
}

export class OneDriveFileInfo{
  name: string;
  type: string;
  index: number;
  buffer: any;
}
export class WebtoolMultiFilesInfos_OneDrive{
  taskId:string;
  type :number;
  token: string;
  count:string;
  fileName: string;
  files: Array<object>;
}

@Injectable()
export class WebToolService{

  browserInfo:string = "";
  userId:number = -1;
  taskid:string = "";
  fileName:string = "";
  fileDefaultName:string = "";
  fileUrl:string = "";
  docId:string = "";
  onlineDocPath = "";
  statusHandler:any = null;
  convertMode:number = -1;
  paramConfigure:string = "";
  isSplitFromSplitMode: boolean = false;
  //private token: string;
  constructor(private http: Http,
              private globalService: GlobalService,
              private cookieService: CookieService,
              private webToolUrls: WebToolUrls,
              private sharedService: SharedService,
  ){
    this.setWebToolUrl(phantomOnlineGlobalConfig.cwebtoolsApi, phantomOnlineGlobalConfig.cwebtoolsHttpApi);
    this.browserInfo = CommonUtil.getBrowserInfo();
  }

  public clearCacheData(){
    if(this.statusHandler != null){
      clearInterval(this.statusHandler);
      this.statusHandler = null;
    }
  }

  public getClientInfo(){
    let clientInfoJson:string = "";
    clientInfoJson += "{";
    clientInfoJson += "\"BrowserInfo\":\"" + this.browserInfo + "\",";
    clientInfoJson += "\"UserEmail\":\"" + this.globalService.currentUserEmail  + "\"";
    clientInfoJson += "}";

    return clientInfoJson;
  }


  public setSplitModeConvertFormat(isSplit:boolean){
    this.isSplitFromSplitMode = isSplit;
  }

  public setWebToolUrl(url: string, httpUrl: string){
    this.webToolUrls.baseUrl = url;
    this.webToolUrls.baseHttpUrl = httpUrl;
    this.resetServiceUrls();
  }
  private resetServiceUrls(){
    this.webToolUrls.doConvert = this.webToolUrls.baseUrl + "convert";
    this.webToolUrls.doUpload = this.webToolUrls.baseUrl + "uploadReader";
    this.webToolUrls.getTaskId = this.webToolUrls.baseUrl + "threadid";
    this.webToolUrls.getUserId = this.webToolUrls.baseUrl + "userid";
    this.webToolUrls.getConvertStatus = this.webToolUrls.baseUrl + "resultstatus";
    this.webToolUrls.downLink = this.webToolUrls.baseUrl + "download/connectedpdf";
    this.webToolUrls.doPrepareFile = this.webToolUrls.baseUrl + "preparefiles";
    this.webToolUrls.fileLink = this.webToolUrls.baseHttpUrl + "download/connectedpdf";
  }

  public getUserId(webtoolCompoent:WebToolConvertComponent){
    if(this.userId != -1)
      return true;
    let userid: number = -1;
    let email: string =  this.globalService.currentUserEmail;
    let token:string = this.globalService.currentUserToken;
    let clientInfo: string = this.getClientInfo();
    clientInfo = CommonUtil.base64EncodeAfterComponent(clientInfo);
    let url: string = this.webToolUrls.getUserId
      + "?email=" + email
      + "&token=" + token
      + "&clientInfo=" + clientInfo
      + "&from=PhantomOnline"
      + "&random=" + Math.random();
    let xhr:XMLHttpRequest = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.addEventListener('load', function(b:any) {
      let obj = JSON.parse(b.currentTarget.responseText);
      if(obj.ret != "0"){
        webtoolCompoent.uploadError(obj.ret);
      }else{
        userid = obj.userid;
      }
    }, !1);
    xhr.onerror = function(event:any) {
      webtoolCompoent.uploadError("83000002");
    };
    xhr.onabort =function(event:any) {
      webtoolCompoent.uploadError("83000002");
    };
    xhr.onloadend = function(event:any) {
      if (xhr.readyState == 4) {
        if (xhr.status != 404) {
        }else{
          //handle...
          webtoolCompoent.uploadError("83000002");
        }
      }
    };

    //xhr.send();
    try{
      xhr.send();
    }catch(e) {
      webtoolCompoent.uploadError("83000006");
    };

    this.userId = userid;
    if(this.userId != -1)
      return true;

    return false;
  }

  public WatchConvertStatus(webtoolComponent:WebToolConvertComponent,downUrl:string){
    let result = {ret:"83000002", status:false, isAppPageFromPDF2Word:true};
    let status = false;
    let xhr = new XMLHttpRequest();
    let url:string = this.webToolUrls.getConvertStatus
      + "?processid=" + this.taskid
      + "&random=" + Math.random();
    xhr.open('get', url, false);
    let _this = this;
    xhr.onload = function(b:any){
      let obj = CommonUtil.commonJsonParser(b.currentTarget.responseText);
      if(obj == null || obj == ""){
        status = true;
        result.status = true;
        return;
      }
      if(obj.resultCode == "1"){
        status = false;
        result.status = false;
        return;
      }
      result.ret = obj.ret;
      result.status = true;
      if(_this.convertMode == CommonUtil.ConvertType.PDFTOWORD){
        if(result.ret == "0" && obj.pageCount > 200){
          result.isAppPageFromPDF2Word = false;
        }
      }
    }
    xhr.send();
    return result;
  }
  public clearIntervalForWacthStatus(){
    clearInterval(this.statusHandler);
    this.statusHandler = null;
  }
  public MonitorConvertResult(webtoolComponent:WebToolConvertComponent,url:string, isOnline:boolean){
    let handler = self.setInterval(checkStatus,3000);
    this.statusHandler = handler;
    let visitTime = 0;
    let _this = this;
    function checkStatus(){
      visitTime++;
      let result = _this.WatchConvertStatus(webtoolComponent,url);
      if(result.status){
        clearInterval(handler);
        _this.statusHandler = null;
        if(result.ret == "0") {

          let onlineModeName = webtoolComponent.getOnlineModeName();
          if(onlineModeName == "OneDrive" && !CommonUtil.isUploadMultiFiles(_this.convertMode)){
            isOnline = true;
            let params = _this.getParamForUploadToOneDrive(_this.convertMode, result.isAppPageFromPDF2Word);
            //let fileName = CommonUtil.getOutputFileName(_this.convertMode, _this.fileDefaultName, !_this.isSplitFromSplitMode);
            webtoolComponent.uploadFileToOneDrive(params);
          }
          else
            _this.doUploadFileToCloud(webtoolComponent, isOnline);
        }else {
          // convert failed.
          url = null;
        }

        // auto download file, hide converting window and show info
        if(null != webtoolComponent && ( result.ret != "0" || CommonUtil.isNeedAutoDownloadMode(_this.convertMode, isOnline))){
            let fileSourceType:number = isOnline? webtoolComponent.fileSourceType.foxitdrive:webtoolComponent.fileSourceType.localfile;
            webtoolComponent.onShowConvertResult(result.ret, url, false, result.isAppPageFromPDF2Word, fileSourceType);
          /*// show result
          webtoolComponent.ShowResultStatus(result.ret,url,result.isAppPageFromPDF2Word);
          // hide convert window UI
          webtoolComponent.closeConvertPage();*/
        }
      }
      if(visitTime == 1080){
        clearInterval(handler);
        _this.statusHandler = null;
        if(null != webtoolComponent)
          webtoolComponent.closeConvertPage();

        //提示超时
      }
    }
  }

  public cleanFileCache(){
    this.docId = null;
    this.fileDefaultName = null;
    this.convertMode = -1;
    this.browserInfo = "";
    this.userId = -1;
    this.taskid = "";
    this.fileName = "";
    this.convertMode = -1;
  }

  public getParamForUploadToOneDrive(modeType: number, isAllPages:boolean):any{
    let _params:any = {};
    _params.fileName = this.fileDefaultName;
    _params.downLink = this.getDownLink();
    _params.fileName = this.fileDefaultName;
    _params.type = modeType;
    _params.isExtractPages = !this.isSplitFromSplitMode;
    _params.isOverlay = false;
    _params.isAllPages = isAllPages;

    var pos = this.fileDefaultName.lastIndexOf('.');
    var myFileName = this.fileDefaultName.substr(0, pos);
    var extName = this.fileDefaultName.substr(pos,this.fileDefaultName.length - pos);

    switch (modeType){
      case CommonUtil.ConvertType.OPTIMIZER:{
        this.fileDefaultName = myFileName + "_compressed" + "_" + extName;
        break;
      }
      case CommonUtil.ConvertType.SPLITPDF:{
        this.fileDefaultName = myFileName + "_splited" + "_" + extName;
        break;
      }
      case CommonUtil.ConvertType.PDFPROTECT:{
        this.fileDefaultName = myFileName + "_protected" + "_" + extName;
        break;
      }
      case CommonUtil.ConvertType.WATERMARK:
      case CommonUtil.ConvertType.PDFHEADERFOOTER:
      case CommonUtil.ConvertType.PDFTOCPDF:
      case CommonUtil.ConvertType.PDFFLATTEN: {
        _params.isOverlay = true;
        break;
      }
    }
    _params.fileName = this.fileDefaultName;
    return _params;
  }

  public getParamForUploadToCloud(modeType: number, isOnline: boolean): any{
    let _params:any = {};
    _params.cloudUrl = this.globalService.apiUrl;
    _params.token = this.globalService.currentUserToken;
    _params.docId = this.docId;
    _params.fileName = this.fileDefaultName;
    _params.fileUrl = this.getFileLink();
    _params.autoRename = true;
    _params.type = modeType;
    _params.isLocalFile = false;
    _params.isExtractPages = !this.isSplitFromSplitMode;
    _params.onlineDocPath = this.onlineDocPath;
    switch (modeType){
      case CommonUtil.ConvertType.PAGEORGANIZER:{
        if(!isOnline)
          _params.docId = null;
        break;
      }
      case CommonUtil.ConvertType.IMGTOPDF:
      case CommonUtil.ConvertType.MERGEPDF:{
        _params.onlineDocPath = "";
        _params.docId = null;
        break;
      }
      case CommonUtil.ConvertType.WATERMARK:
      case CommonUtil.ConvertType.PDFHEADERFOOTER:{
        if(isOnline){
          _params.autoRename = false;
        }
        break;
      }
      case CommonUtil.ConvertType.PDFPROTECT:{
        _params.docId = null;
        var _fileName = this.fileDefaultName.substr(0, this.fileDefaultName.lastIndexOf('.'));
        _params.fileName = _fileName + "_protected.pdf";
        break;
      }
      case CommonUtil.ConvertType.OPTIMIZER:{
        _params.docId = null;
        var _fileName = this.fileDefaultName.substr(0, this.fileDefaultName.lastIndexOf('.'));
        _params.fileName = _fileName + "_compressed.pdf";
        break;
      }
    }
    return _params;
  }

  public getParamForUploadLocalFileToCloud(modeType: number, isOnline: boolean, file: File): any{
    let _params:any = {};
    _params.cloudUrl = this.globalService.apiUrl;
    _params.token = this.globalService.currentUserToken;
    _params.docId = null;
    _params.fileName = file.name;
    _params.file = file;
    _params.autoRename = false;
    _params.type = modeType;
    _params.isLocalFile = true;
    return _params;
  }

  public doUploadFileToCloud(webtoolComponent:WebToolConvertComponent, isOnline:boolean){
    // CommonUtil.saveToCloud = function( params, successCallBack, errorCallBack)
    // CommonUtil.saveToCloud = function( cloudUrl,token, docId, fileName, fileUrl, autoRename, type)
    if(CommonUtil.isNeedAutoDownloadMode(this.convertMode, isOnline)){
      return;
    }
    let _isOnline:boolean = this.docId != null? true:false;
    let _params:any = this.getParamForUploadToCloud(this.convertMode, _isOnline);
    console.log("doUploadFileToCloud:" + JSON.stringify(_params));
    let _this = this;
    //
    CommonUtil.saveToCloud( _params, function (data:any) {
      //json: {ret:0; msg: "xxx" , docId?: ""};
      if(data.ret != "0"){
        console.log("doUploadFileToCloud error:" + data.msg);
        /*$("#downFile").attr("href",_this.getDownLink());
        document.getElementById('downFile').click();*/
        webtoolComponent.onShowConvertResult(data.ret,_this.getFileLink(), false, true, webtoolComponent.fileSourceType.foxitdrive);
      }else{
        webtoolComponent.onShowConvertResult(data.ret,data.docId, true, true, webtoolComponent.fileSourceType.foxitdrive);
        //webtoolComponent.webToolModalConvert.hide();

        //webtoolComponent.onNavigateToWebPDFPreviewFoxitDriveFile(data.docId);
      }
      // hide convert window UI

    });
  }

  public getTaskId(modeType:number,webtoolComponent:WebToolConvertComponent){
    if( !CommonUtil.isNullOrUndefined(this.taskid) && this.taskid != '')
      return true;

    if(!this.getUserId(webtoolComponent))
      return false;

    /*let userID:number  = 0;*/
    let taskID:string = "";
    let url: string = this.webToolUrls.getTaskId
      + "?userID=" + this.userId
      + "&browser=" + this.browserInfo
      + "&type=" + modeType
      + "&random=" + Math.random();
    let xhr:XMLHttpRequest = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.addEventListener('load', function(b:any) {
      let obj = JSON.parse(b.currentTarget.responseText);
      taskID = obj.threadid;
    }, !1);
    xhr.send();
    this.taskid = taskID;
    if(this.taskid == "" || this.taskid == null)
      return false;

    return true;
  }

  public checkAndGetTaskId(modeType:number,webtoolComponent:WebToolConvertComponent){
    if( !CommonUtil.isNullOrUndefined(this.taskid) && this.taskid != '')
      return this.taskid;

    if( !this.getTaskId(modeType,webtoolComponent))
      return null;

    return this.taskid;
  }

  public doUploadByXHR(files:any, modeType:number, webtoolConvert:WebToolConvertComponent){
    if (files.length <= 0 ){
      // notify
      return;
    }

    /*if(true == true){
      //this.doConvertDocsFromBuffer(uploader.queue[0]._file, modeType);
      this.doConvertDocsFromMultiFiles(files, modeType);
      return;
    }*/

    let taskId: string = this.checkAndGetTaskId(modeType,webtoolConvert);
    this.convertMode = modeType;
    //this.fileName = CommonUtil.base64EncodeAfterComponent("Merged.pdf");
    if (files.length >= 1 ){
      this.fileName = CommonUtil.base64EncodeAfterComponent(files[0].name);
      this.fileDefaultName = files[0].name;
      //this.docId = files[0].uri;
    }
    if (CommonUtil.isNullOrUndefined(this.taskid)){
      // notify error
    }

    let xhr = new XMLHttpRequest();
    /*let url: string =  this.webToolUrls.doUpload + "?fileName=" + this.fileName + "&type=" + modeType
      + "&processid=" + this.taskid + "&fileFormat=" + 0
      + "&imageIndex=" + 0 + "&imageCount=" + 1
      + "&convertImage=" + 1 + "&from=" + 0;*/
    // support multi-files
    let imageIndex:number = 0;
    let imageCount:number = 1;
    if (this.convertMode == CommonUtil.ConvertType.IMGTOPDF ||
      this.convertMode == CommonUtil.ConvertType.MERGEPDF){
      imageCount = files.length;
      imageIndex = files.length + webtoolConvert.sortableTable.getFileTotalCountFromLocal();
    }
    //
    let url: string =  this.webToolUrls.doUpload + "?fileName=" + this.fileName + "&type=" + modeType
      + "&processid=" + this.taskid + "&fileFormat=" + 0
      + "&filesCount=" + imageIndex + "&lastCount=" + imageCount
      + "&convertImage=" + 1 + "&from=2"
      + "&random=" + Math.random();

    xhr.open('post', url, true);

    let fd = new FormData();
    //let file = files[0];
    let index:number = 0;
    let fileInfos:Array<any> = [];
    for (let file of files){
      fd.append('file', file);
      let _fileInfo = {fileName:file.name, index: index, fileSize:file.size, from: CommonUtil.FileAddress.Location};
      fileInfos.push(_fileInfo);
      index++;
    }
    let _this = this;
    let jsonData:any = null;

    xhr.onload = function(event:any){

      console.log( 'upload onload:' + event);
      /*let obj = CommonUtil.commonJsonParser(event.currentTarget.responseText);
      if(obj.resultCode != "0"){
        webtoolConvert.uploadError("83000002");
        return;
      }*/
      //_this.doConvert(webtoolConvert,false);
      //console.log( 'upload onload:' + uploader.queue[0]._file.name);
    }
    xhr.onloadend = function(event:any){
      if(CommonUtil.isNullOrUndefined(event.currentTarget.responseText)){
        webtoolConvert.uploadError("83000002");
        return;
      }
      let obj = CommonUtil.commonJsonParser(event.currentTarget.responseText);
      if(obj.resultCode != "0"){
        webtoolConvert.uploadError("83000002");
        return;
      }

      _this.onFinishUpload("0", modeType, fileInfos, webtoolConvert, false);

    }

    xhr.onerror = function(event:any) {
      webtoolConvert.uploadError("83000002");
      //console.log( 'upload onerror:' + uploader.queue[0]._file.name);
    };
    xhr.upload.onprogress = function(event:any) {
      //console.log( 'upload onprogress:' + uploader.queue[0]._file.name);
      var progress = 0;
      if(event.lengthComputable) {
        progress = 100 * event.loaded / event.total;
      }
      let progressWidth:string = progress + "%";
      webtoolConvert.uploadProgressWidth(progressWidth);
    }
    xhr.upload.onloadstart = function(event) {
      //console.log( 'upload onloadstart:' + uploader.queue[0]._file.name);
    }

    try{
      xhr.send(fd);
    }catch(e) {
      webtoolConvert.uploadError("83000006");
    };
  }

  public doUploadByBuffer(file:any, modeType:number, webtoolConvert:WebToolConvertComponent){
    let taskId: string = this.checkAndGetTaskId(modeType,webtoolConvert);
    this.convertMode = modeType;
    if (CommonUtil.isNullOrUndefined(this.taskid)){
      // notify error
    }

    let buffer = file.arrayBuff;
    let fileName = file.name;

    if (fileName.length >= 1 ){
      this.fileName = CommonUtil.base64EncodeAfterComponent(fileName);
      this.fileDefaultName = fileName;
    }

    let xhr = new XMLHttpRequest();
    let imageIndex:number = 0;
    let imageCount:number = 1;
    if (this.convertMode == CommonUtil.ConvertType.IMGTOPDF ||
      this.convertMode == CommonUtil.ConvertType.MERGEPDF){
      imageCount = 1;
      imageIndex = 1 + webtoolConvert.sortableTable.getFileTotalCountFromLocal();
    }
    //
    let url: string =  this.webToolUrls.doUpload + "?fileName=" + this.fileName + "&type=" + modeType
      + "&processid=" + this.taskid + "&fileFormat=" + 0
      + "&filesCount=" + imageIndex + "&lastCount=" + imageCount
      + "&convertImage=" + 1 + "&from=2"
      + "&random=" + Math.random();

    xhr.open('post', url, true);

    let fd = new FormData();
    var blob = null;
    blob = new Blob([buffer], {type: 'application/pdf'});//, {type: 'application/pdf'}
    fd.append('file', blob);
    fd.append('fileName', file.name);

    //let file = files[0];
    let index:number = 0;
    let type:number = webtoolConvert.onGetFileSourceTypeByNetDriveName(webtoolConvert.oneDriveName);
    let fileInfos:Array<any> = [];

    /*for (let file of filesBuffer){
      fd.append('file', file);
      let _fileInfo = {fileName:file.name, index: index, fileSize:file.size};
      fileInfos.push(_fileInfo);
      index++;
    }*/
    let _this = this;
    let jsonData:any = null;

    xhr.onload = function(event:any){
      console.log( 'upload onload:' + event);
    }
    xhr.onloadend = function(event:any){
      if(CommonUtil.isNullOrUndefined(event.currentTarget.responseText)){
        webtoolConvert.uploadError("83000002");
        return;
      }
      let obj = CommonUtil.commonJsonParser(event.currentTarget.responseText);
      if(obj.resultCode != "0"){
        webtoolConvert.uploadError("83000002");
        return;
      }

      let _fileInfo = {fileName: file.name, index:index, fileSize:file.size, from: type, pageCount:0};
      _fileInfo.pageCount = obj.pageCount;
      fileInfos.push(_fileInfo);

      _this.onFinishUpload("0", modeType, fileInfos, webtoolConvert, false);
    }

    xhr.onerror = function(event:any) {
      webtoolConvert.uploadError("83000002");
    };
    xhr.upload.onprogress = function(event:any) {
      var progress = 0;
      if(event.lengthComputable) {
        progress = 100 * event.loaded / event.total;
      }
      let progressWidth:string = progress + "%";
      webtoolConvert.uploadProgressWidth(progressWidth);
    }
    xhr.upload.onloadstart = function(event) {
    }

    try{
      xhr.send(fd);
    }catch(e) {
      webtoolConvert.uploadError("83000006");
    };
  }

  // call convert from webtool-convert-extend.js
  /*public doConvertDocsFromBuffer(file:any, type:number){
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload=function(fileReader:any){
      var cfg =  WebTools.globalconfig;
      var ret = WebTools.init(cfg.cwebtoolsApi, cfg.cwebtoolsHttpApi);
      if (ret){
        var param:any = null;
        if (type == WebTools.ConvertType.SPLITPDF){
          param = {
            "splitmode":"extractpages", // "splitpage": 分成多文件 "extractpages"：抽取指定页生成一个文件
            "maxpage":"1",   // 最大页数，splitmode设为extractpages时，maxpage设为1
            "rangeinfo":"1"  // splitmode设为splitpage时，置为""空串；
          };
        }else if(type == WebTools.ConvertType.OPTIMIZER){
          param = {
            DC_Algorithm:"b",
            CC_Algorithm:"h",
            CC_Level:"medium"
          }
        } else if(type == WebTools.ConvertType.HTML2PDF){
          param = WebTools.Html2PDFParams;
          param.bURL = false;
        }
        WebTools.doConvertDocument(fileReader.currentTarget.result, file.name, type, null, param);
      }
    }
  }*/

  /*public doConvertDocsFromBufferByMulti(file:any, type:number){
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload=function(fileReader:any){
      var cfg =  WebTools.globalconfig;
      var ret = WebTools.init(cfg.cwebtoolsApi, cfg.cwebtoolsHttpApi);
      if (ret){
        var param:any = null;
        if (type == WebTools.ConvertType.SPLITPDF){
          param = {
            "splitmode":"extractpages", // "splitpage": 分成多文件 "extractpages"：抽取指定页生成一个文件
            "maxpage":"1",   // 最大页数，splitmode设为extractpages时，maxpage设为1
            "rangeinfo":"1"  // splitmode设为splitpage时，置为""空串；
          };
        }else if(type == WebTools.ConvertType.OPTIMIZER){
          param = {
            DC_Algorithm:"b",
            CC_Algorithm:"h",
            CC_Level:"medium"
          }
        } else if(type == WebTools.ConvertType.HTML2PDF){
          param = WebTools.Html2PDFParams;
          param.bURL = false;
        }
        var _webToolFileInfos = WebTools.CreateWebToolFileInfos(type);
        var buffer = fileReader.currentTarget.result;
        var fileName = file.name;
        var fileType = CommonDefined.DataType.FileBuffer;
        var index = 0;
        //file, fileName, fileType, index, access
        _webToolFileInfos.push(buffer, fileName, fileType, index, null);
        //WebTools.doConvertDocuments(fileReader.currentTarget.result, file.name, type, null, param);
        WebTools.doConvertDocuments(_webToolFileInfos, type, null, param);
      }
    }
  }*/

  /*public doConvertDocsFromUrl(file:any, type:number) {
    var url = "http://10.104.1.199:8088/download/connectedpdf?fileName=NjFlZWZkNDY3ZjE3MzM4MDkzYTc3MjhkYTYwYTIxNDg=&taskId=MjAxNy0wOC0zMF8wOV8xMQ==&fileKey=JTI4MTEwMSUyOSstK0JJTkdPLnBkZg==&type=16&taskID=-1&processid=d0754ad9e5a83e67a825533cd53b31f4&isSplitPDFMode=true";
    var cfg = WebTools.globalconfig;
    var ret = WebTools.init(cfg.cwebtoolsApi, cfg.cwebtoolsHttpApi);
    if (ret) {
      var param: any = null;
      WebTools.doConvertDocument(url, "bingo.pdf", type, null, param);
    }
  }*/

  // call convert from webtool-convert-extend.js
  /*public doConvertDocsFromMultiFiles(files:any, type:number){

    var _files = files;
    var _count = files.length;
    var _webToolFileInfos = CreateWebToolFileInfos(type);
    function _callback (){
      if(_count != _webToolFileInfos.size())
        return;
      var cfg =  WebTools.globalconfig;
      var ret = WebTools.init(cfg.cwebtoolsApi, cfg.cwebtoolsHttpApi);
      if (ret){
        var param:any = null;
        WebTools.doConvertDocuments(_webToolFileInfos, type, null, param);
      }
    }

    for (var i = 0; i < _count; i++){
      var file = _files[i];
      if(i%2 == 1){
        var _file = file;
        var fileName = file.name;
        var fileType = CommonDefined.DataType.File;
        var index = i;
        //file, fileName, fileType, index, access
        _webToolFileInfos.push(_file, fileName, fileType, index, null);
        _callback ();
        continue;
      }

      (function (file, i){
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload=function(fileReader:any){
          var buffer = fileReader.currentTarget.result;
          var fileName = file.name;
          var fileType = CommonDefined.DataType.FileBuffer;
          var index = i;
          //file, fileName, fileType, index, access
          _webToolFileInfos.push(buffer, fileName, fileType, index, null);
          _callback ();
        }
      })(file, i);

    }
  }*/

  /*public doConvertDocsFromOnlineFiles(multiFile:any, type:number){
    var _count = multiFile.count;
    var _webToolFileInfos = CreateWebToolFileInfos(type);
    var _this = this;
    function _callback (){

      var cfg =  WebTools.globalconfig;
      var ret = WebTools.init(cfg.cwebtoolsApi, cfg.cwebtoolsHttpApi);
      if (ret){
        var param:any = null;
        _webToolFileInfos.setToken(_this.globalService.currentUserToken);
        WebTools.doConvertDocuments(_webToolFileInfos, type, null, param);
      }
    }

    for (var i = 0; i < _count; i++){
      var fileInfo = multiFile.files[i];

      var _file = fileInfo.uri;
      var fileName = fileInfo.name;
      var dataType = CommonDefined.DataType.CMISFileId;
      var index = fileInfo.index;

      _webToolFileInfos.push(_file, fileName, dataType, index, null);
    }
    _callback ();
  }*/

  public doUpload(uploader:FileUploader, modeType:number, webtoolConvert:WebToolConvertComponent){
    /*this.cleanFileCache();*/
    console.log( 'doUpload, currentUserEmail:' + this.globalService.currentUserEmail + ', currentUserToken:' + this.globalService.currentUserToken);

    // call convert from webtool-convert-extend.js
    /*if(true == true){
      this.doConvertDocsFromUrl(null, modeType);
      return;
    }*/
    /*if(true == true){
      modeType = CommonUtil.ConvertType.HTML2PDF;

      this.doConvertDocsFromBufferByMulti(uploader.queue[0]._file, modeType);
      //this.doConvertDocsFromBuffer(uploader.queue[0]._file, modeType);
      return;
    }*/

    this.convertMode = modeType;
    if(this.fileName == "") {
      let fileName: string = uploader.queue[0]._file.name;
      this.fileDefaultName = fileName;
      this.fileName = CommonUtil.base64EncodeAfterComponent(fileName);
    }
    if(!this.getTaskId(modeType,webtoolConvert))
      return false;

    let opt: FileUploaderOptions = {};
    // support multi-files
    let imageIndex:number = 0;
    let imageCount:number = 1;
    if (this.convertMode == CommonUtil.ConvertType.IMGTOPDF ||
        this.convertMode == CommonUtil.ConvertType.MERGEPDF){
      imageCount = uploader.queue.length;
      imageIndex = uploader.queue.length + webtoolConvert.sortableTable.getFileTotalCountFromLocal();
    }
    //
    let url: string =  this.webToolUrls.doUpload + "?fileName=" + this.fileName + "&type=" + modeType
                            + "&processid=" + this.taskid + "&fileFormat=" + 0
                            + "&filesCount=" + imageIndex + "&lastCount=" + imageCount
                            + "&convertImage=" + 1 + "&from=2"
                            + "&random=" + Math.random();

    opt.url = url;//this.webToolUrls.doUpload;
    opt.method = "POST";
    opt.removeAfterUpload = true;

    uploader.setOptions(opt);

    if (uploader.queue.length <= 0 ){
      // notify
      return;
    }
    let _this = this;
    let jsonData:any = null;
    let fileInfos:Array<any> = [];

    //item: FileItem, response: string, status: number, headers: ParsedResponseHeaders
    uploader.onSuccessItem = function (item, response, status, headers) {
      // upload Success
      if (status == 200) {
        // response
        let pageCount = 0;
        jsonData = JSON.parse(response);
        console.log( 'upload onSuccessItem file url:' + item.url + ', response:' + jsonData);
        if(_this.convertMode == CommonUtil.ConvertType.SPLITPDF ||
            !CommonUtil.isNullOrUndefined(jsonData) ||
            jsonData.resultCode == "0"){
          pageCount = jsonData.pageCount;
        }

        let _fileInfo = {fileName:item._file.name, index: item.index, fileSize:item._file.size, pageCount:pageCount};
        fileInfos.push(_fileInfo);

      } else {
        webtoolConvert.uploadError("83000002");
      }
    };
    uploader.onErrorItem = function (item, response, status, headers) {
      webtoolConvert.uploadError("83000002");
      console.log( 'upload onProgressItem file url:' + item.url + ', response:' + response);
      uploader.clearQueue();
    }
    uploader.onProgressItem = function (fileItem, progress) {
      let progressWidth:string = progress + "%";
      webtoolConvert.uploadProgressWidth(progressWidth);
      console.log( 'upload onProgressItem file url:' + fileItem.url + ', progress:' + progress);
    }
    uploader.onCompleteAll = function () {
      if(CommonUtil.isNullOrUndefined(jsonData) || jsonData.resultCode != "0"){
        webtoolConvert.uploadError("83000002");
      }else {
        _this.onFinishUpload("0", modeType, fileInfos, webtoolConvert, false);
      }
    }
    uploader.uploadAll();
  }

  public modifyDownloadFileName(fileName:string){
    if(this.convertMode == CommonUtil.ConvertType.PPTTOPDF ||
      this.convertMode == CommonUtil.ConvertType.WORDTOPDF ||
      this.convertMode == CommonUtil.ConvertType.EXCELTOPDF) {
      let _fileName = CommonUtil.base64DecodeAfterComponent(fileName);
      let pos = _fileName.lastIndexOf(".");
      let download_fileName = _fileName.substring(0, pos) + ".pdf";
      download_fileName = CommonUtil.base64EncodeAfterComponent(download_fileName);
      return download_fileName;
    }

    return fileName;

  }

  public getDownLink():string{
    let isSplitPDFMode  = this.isSplitFromSplitMode;
    let fileName = this.modifyDownloadFileName(this.fileName);
    let url = this.webToolUrls.downLink + "?fileKey=" + fileName + "&processid=" + this.taskid
              + "&type=" + this.convertMode + "&isSplitPDFMode=" + isSplitPDFMode ;

    return url;
  }

  public getFileLink():string{
    let isSplitPDFMode  = this.isSplitFromSplitMode;
    let fileName = this.modifyDownloadFileName(this.fileName);
    let url = this.webToolUrls.fileLink + "?fileKey=" + fileName + "&processid=" + this.taskid
      + "&type=" + this.convertMode + "&isSplitPDFMode=" + isSplitPDFMode ;

    return url;
  }

  public startConvertAfterSetConfigure(webtoolComponent:WebToolConvertComponent,conf:string){
    this.paramConfigure = conf;
    this.doConvert(webtoolComponent,webtoolComponent.isOnlineForSourceFile);
  }

  public doConvert(webtoolComponent:WebToolConvertComponent, isOnline: boolean){
    // add ga
    CommonUtil.addGAInfoByType(this.convertMode);
    /*
	let gaToolName:string = CommonUtil.getGAToolNameByType(this.convertMode);
    if (!CommonUtil.isNullOrUndefined(gaToolName)){
      if (ga && typeof ga === 'function') {
        ga('send', {
          hitType: 'event',
          eventCategory: 'button',
          eventAction: 'click',
          eventLabel: gaToolName
          //eventValue: window.location.href
        });
      }
    }
	*/

    webtoolComponent.isOnlineForSourceFile = isOnline;
    let url = this.webToolUrls.doConvert;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let params = new URLSearchParams();
    let fileIndexList:string = "";
    if (CommonUtil.isUploadMultiFiles(this.convertMode )){
      fileIndexList = webtoolComponent.getFileIndexList();
      // make file name for multi-files
      let fileName: string = webtoolComponent.getFirstFileInfo().fileName;
      var _fileName = fileName.substr(0, fileName.lastIndexOf('.'));
      let count:number = webtoolComponent.sortableTable.fileItems.length;
      if(this.convertMode == CommonUtil.ConvertType.IMGTOPDF ){
        this.fileDefaultName = _fileName + "_" + count + "_Images" + ".pdf";
      } else if( this.convertMode == CommonUtil.ConvertType.MERGEPDF ){
        this.fileDefaultName = _fileName + "_" + count + "_Merged" + ".pdf";
      }
      this.fileName = CommonUtil.base64EncodeAfterComponent(this.fileDefaultName);
    }
    params.set("processid", this.taskid);
    params.set("fileName", this.fileName);
    params.set("confText",this.paramConfigure);
    params.set("redactText","");
    params.set("overlayText","");
    params.set("fileIndexList",fileIndexList);
    params.set("random",Math.random().toString());//+ "&random=" + Math.random()

    let jsonData:any = null;
    let options = new RequestOptions({ headers: headers, search: params });

    this.http.post(url, '', options).subscribe((data) => {
      let responseText = data.text();
      jsonData = JSON.parse(responseText);
      if(responseText == "" || responseText == null || CommonUtil.isNullOrUndefined(jsonData) || jsonData.ret !="0"){
        webtoolComponent.closeConvertPage();
        webtoolComponent.uploadError("83000002");
        return;
      }

      webtoolComponent.showConvertPage();
      let url:string = this.getFileLink();
      this.MonitorConvertResult(webtoolComponent,url, isOnline);
      console.log(data);
    });
    //this.http.post()
  }

  public getFilesJsonInfo(fileInfos: WebToolMultiFileInfos ) : string
  {
    /*let params = new URLSearchParams();
    params.set("processid", fileInfos.taskId);
    params.set("type", fileInfos.type.toString());
    params.set("token", fileInfos.token);
    params.set("count", fileInfos.count.toString());
    params.set("files", fileInfos.files.toString());*/
    let data:string = JSON.stringify(fileInfos);
    return data;
  }

  /*public doPrepareMutilFiles(taskData: WebToolMultiFileInfos, modeType: number, doConvert: any): any{
    let url = this.webToolUrls.doPrepareFile;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let params = new URLSearchParams();
    params.set("processid", this.taskid);
    params.set("type", modeType.toString());

    let data: string = this.getFilesJsonInfo(taskData);
    let dataEncoded :string = CommonUtil.base64EncodeAfterComponent(data);

    let options = new RequestOptions({ headers: headers, search: params });

    this.http.post(url, dataEncoded, options).subscribe((data) => {
      let dataJson = data.json();

      if( dataJson.ret == 0){

      }
      //webtoolComponent.showConvertPage();
      let url = this.getDownLink();
      this.MonitorConvertResult(null,url);
      console.log(data);

    });
  }*/

  public doConvertMutilFiles(taskData: WebToolMultiFileInfos, modeType: number, webtoolComponent:WebToolConvertComponent): any{

    // call convert from webtool-convert-extend.js
    /*if(true == true){
     this.doConvertDocsFromOnlineFiles(taskData, modeType);
     return;
    }*/

    /*this.cleanFileCache();*/
    let taskId: string = this.checkAndGetTaskId(modeType,webtoolComponent);
    this.convertMode = modeType;
    this.fileName = CommonUtil.base64EncodeAfterComponent("Merged.pdf");
    this.fileDefaultName = "Merged.pdf";
    this.onlineDocPath = "";
    if (taskData.files.length == 1){
      this.fileName = CommonUtil.base64EncodeAfterComponent(taskData.files[0].name);
      this.fileDefaultName = taskData.files[0].name;
      this.docId = taskData.files[0].uri;
      this.onlineDocPath = taskData.path;
    }
    if (CommonUtil.isNullOrUndefined(this.taskid)){
      // notify error
    }

    // if only convert local multi-files
    if (taskData.files.length == 0 && !CommonUtil.isNeedShowConfigPanel(this.convertMode) ){
      // show converting page
      webtoolComponent.showConvertPage();
      // only local file
      this.doConvert(webtoolComponent, false);
      return;
    }

    let url = this.webToolUrls.doPrepareFile;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let params = new URLSearchParams();
    params.set("processid", this.taskid);
    params.set("type", modeType.toString());
    params.set("token", this.globalService.currentUserToken);
    params.set("random", Math.random().toString());//Math.random()

    let body: string = this.getFilesJsonInfo(taskData);
    //let dataEncoded :string = CommonUtil.base64EncodeAfterComponent(body);

    let options = new RequestOptions({ headers: headers, search: params });
    //let _this = this;
    this.http.post(url, body, options).subscribe((data) => {
      webtoolComponent.closeConvertPage();
      let dataJson = data.json();

      if( dataJson.ret == 0){
        let pageCount = 0;
        if(this.convertMode == CommonUtil.ConvertType.SPLITPDF){
          pageCount = dataJson.pageCount;
        }
        if(this.convertMode == CommonUtil.ConvertType.PDFHEADERFOOTER ||
            this.convertMode == CommonUtil.ConvertType.PDFPROTECT ||
            this.convertMode == CommonUtil.ConvertType.WATERMARK ||
            this.convertMode == CommonUtil.ConvertType.SPLITPDF){
          webtoolComponent.isOnlineForSourceFile = true;
          webtoolComponent.showConfigurePage(pageCount);
          return;
        }
        this.doConvert(webtoolComponent, true);
      }
      //webtoolComponent.showConvertPage();
      //let url = this.getDownLink();
      //this.MonitorConvertResult(null,url);
      console.log(data);

    });

  }

  public onFinishUpload(ret:string, type:number, fileInfos:Array<any>, webtoolConvert:WebToolConvertComponent, isOnline: boolean){
    if (ret == "0"){
      webtoolConvert.isOnlineForSourceFile = isOnline;

      switch (type){
        // multi-file convert
        case CommonUtil.ConvertType.IMGTOPDF:
        case CommonUtil.ConvertType.MERGEPDF:
        {
          webtoolConvert.onFinishUpload(fileInfos);
          break;
        }
        case CommonUtil.ConvertType.PDFHEADERFOOTER:
        case CommonUtil.ConvertType.PDFPROTECT:
        case CommonUtil.ConvertType.WATERMARK:
        case CommonUtil.ConvertType.SPLITPDF:
        {
          webtoolConvert.showConfigurePage(fileInfos[0].pageCount);
          break;
        }
        default:{
          this.doConvert(webtoolConvert,isOnline);
          break;
        }
      }
    }
  }

  private jwt(url:string) {
    // RequestOptions
    // RequestOptionsArgs
    // create authorization header with jwt token
    /*let currentToken = this.token ? this.token : this.globalService.currentUserToken;
    if (currentToken) {
      if(url.indexOf('?')){
        url += '&access-token=' + currentToken;
      }else{
        url += '?access-token=' + currentToken;
      }
      return new RequestOptions({ url: url});
    }*/
  }
}
