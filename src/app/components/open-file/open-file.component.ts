import { Component,OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {SharedService} from '../../services/shared.service';
import {UserService} from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WebpdfService } from "../../services/webpdf.service"
import { VerifyService } from "../../services/verify.service"
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import { MethodNeedLoginDecorator } from '../../app.methodNeedLogin.decorator'

//import {WebToolConvertComponent}  from '../modals/webtools/webtool.component'

declare var $: any;
declare var phantomOnlineGlobalConfig:any;
declare var window:any;

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl:'./open-file.html',
  styleUrls:['./open-file.css']

})
export class OpenFileComponent implements OnInit{
  //@ViewChild(WebToolConvertComponent) public webToolModal:WebToolConvertComponent;

  public chooseFile:any;
  public isLoading:boolean=false;
  public baseUrlIsPDFEditor:boolean;
  public isMobile: boolean;
  constructor(public globalService:GlobalService,
              private sharedService: SharedService,
              private location: Location,
              public route:Router,
              public webpdf:WebpdfService,
              public verify:VerifyService,
              public translate:TranslateService,
              public userService: UserService
  ){
    this.globalService.showAside = true;
    this.globalService.needLoadTool = true;
    this.globalService.isCloudReading = false;
    this.baseUrlIsPDFEditor = this.globalService.baseUrlIsPDFEditor;
    this.isMobile = this.globalService.isMobile;
  }
  ngOnInit() {
    if (this.isMobile) {
      return this.route.navigateByUrl('foxit-drive');
    }
    var __this=this;
    var getDataTransfer = function(event:any) {
      var dataTransfer:any;
      return dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
    };
    var processDragOverOrEnter = function(event:any) {
      if (event) {
        $('.dropzone').addClass('drop-active');
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
    var preventDefaultDrop = function(event:any){
      if (event) {
        if (event.preventDefault) {
          event.preventDefault();
        }
        if (event.stopPropagation) {
          return false;
        }
      }
    };
    function adjustSize(){
        var MaxHeight=0,
            MaxWidth=0;
        $('.main-part .text-container').each(function(index:any,target:any){
          $(target).height('auto');
          $(target).width('auto');
          MaxHeight = $(target).height()>MaxHeight?$(target).height():MaxHeight;
          MaxWidth = $(target).width()>MaxWidth?$(target).width():MaxWidth;
        });
        $('.main-part .text-container').each(function(index:any,target:any){
          $(target).height(MaxHeight);
        })
    }
    $(document).ready(function(){
      if(timer){
        window.clearTimeout(timer)
      }else{
        var timer = window.setTimeout(function(){
          adjustSize();
        },200)
      }
    });
    window.onresize = function(){
      if(timer){
        window.clearTimeout(timer)
      }else{
        var timer = window.setTimeout(function(){
          adjustSize();
        },200)
      }
    };
    $(document).bind('dragover', preventDefaultDrop);
    $(document).bind('dragenter', preventDefaultDrop);
    $('.dropzone').bind('dragover', processDragOverOrEnter);
    $('.dropzone').bind('dragenter', processDragOverOrEnter);
    $('.dropzone').bind('dragleave', function(e:any){
      $('.dropzone').removeClass('drop-active');
    });
    $(document).bind('drop',preventDefaultDrop);
    $('.dropzone').bind('drop', function(e:any){
      if (e){
        e.preventDefault();
      }
      $('.dropzone').removeClass('drop-active');
      //console.log(getDataTransfer(e));
      var files = getDataTransfer(e).files;
      //console.log(files);
      var fileReadyToUpload = files;
      //var fileName = files[0].name;
      //var fileType = files[0].type;
      //$('.file-info').removeClass('hide');
      //$('.file-name').html(fileName);
      __this.chooseFile=fileReadyToUpload[0];
      __this.globalService.inputFile = __this.chooseFile;
      window.angularHeaderComponent.getLastFile();

      __this.verify.verifyWebPdfFile(fileReadyToUpload[0],
         ()=>{
           __this.verifyWebpdfSuccCb()
         },
          (errMsg:any)=>{
            __this.verifyWebpdfErrCb.apply(__this,[errMsg]);
          }
         )
    });
  }
  @MethodNeedLoginDecorator()
  public showFilePicker(event?: any):void {
    document.getElementById('choose-file').click()
  }
  public uploadToPreview(event: any):void {
    var __this = this;
    var file = event.target.files ? event.target.files[0] : null;
    this.chooseFile=file;
    this.globalService.inputFile = this.chooseFile;
    if (file == null){
     return ;
    }else{
     __this.verify.verifyWebPdfFile(file,()=>{
           this.verifyWebpdfSuccCb()
     },(errMsg:any)=>{
       __this.verifyWebpdfErrCb.apply(__this,[errMsg]);
     })
    }
  }
  public verifyWebpdfSuccCb (){
    //currentFileInfo.fileName= file.name.replace(".pdf","");
    //currentFileInfo.file = file;
    this.webpdf.prepareWebpdf(this.chooseFile);
  }
  public verifyWebpdfErrCb (errMsg:any){
    // NOT_PDF    It is not a PDF file, please choose a PDF file.
    if(errMsg==='NOT_PDF'){
      errMsg = this.translate.instant('It is not a PDF file, please choose a PDF file.');
    }
    alert(errMsg)

  }
  @MethodNeedLoginDecorator()
  public openLinkInNewTab (mode:any){

    if(!this.haveUserPermissionForConvert(mode)){
      window.angularMainComponent.showSubscriptionDialog({source: 'online', tabName: mode});
      return;
    }
    /*var baseUrl:any;
    var token:any;
    var targetUrl:any;
    baseUrl = phantomOnlineGlobalConfig.cwebtoolsApiUrl;
    token = this.globalService.currentUserToken || '';

    targetUrl =baseUrl+'?al='+ this.globalService.getLanguage() +'&mode='+mode+'&access_token='+token;*/

    this.sharedService.broadcast({
      name: 'showWebToolModal',
      modeName: mode,
      fromFoxitDrive:false
    });

    return;

    //window.open(targetUrl,'_blank',"menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
  }

  public isFreeToolsForConvert(mode: any): boolean {
    let ret:boolean = false;
    let modeName:string = mode;
    switch (modeName){
      case "pdf-to-cpdf":
      case "ppt-to-pdf":
      case "word-to-pdf":
      case "excel-to-pdf":
      case "text-to-pdf":
      case "image-to-pdf":{
        ret = true;
        break;
      }
      default:
        break;
    }
    return ret;
  }

  public haveUserPermissionForConvert(mode:any): boolean{
    let ret:boolean = false;

    ret = this.isFreeToolsForConvert(mode);
    if(ret){
      return ret;
    }

    let userPhantomOnlineSubscription:any = this.userService.userPhantomOnlineSubscription;
    if (!userPhantomOnlineSubscription) {
      return true;
    }
    // 已订阅 || 订阅未过期 || 试用未过期
    if (userPhantomOnlineSubscription.isSubscribed || userPhantomOnlineSubscription.remain_days > 0) {
      return true;
    }

    let userWebToolsSubscription:any = this.userService.userWebToolsSubscription;
    if(userWebToolsSubscription != null && userWebToolsSubscription != undefined
      && mode == "compress-pdf" && userWebToolsSubscription.subscription){
      return true;
    }

    return ret;
  }
}
