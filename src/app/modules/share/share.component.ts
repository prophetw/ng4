import { Component , ViewChild, OnInit, ElementRef} from '@angular/core';
import { GlobalService } from "../../services/global.service";
import { SharedService } from "../../services/shared.service";
import { ShareService } from  "../../services/share.service";
import { ActivatedRoute , Router} from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var window: any;
declare var $: any;
@Component({
  moduleId: module.id,
  templateUrl: './index.html',
  styleUrls: ['index.css']
})
export class ShareComponent  implements OnInit{
  //@ViewChild('iframe') iframe: ElementRef;
  public errorCode: string;
  public previewUrl: string;
  public fileName: string;
  public downloadUrl: string;
  public canShare: boolean=false;
  constructor(
      public globalService: GlobalService,
      private sharedService: SharedService,
      private shareService: ShareService,
      private route: ActivatedRoute,
      private router: Router,
      public sanitizer: DomSanitizer
  ) {
    this.globalService.showAside = false;
    this.globalService.isCloudReading = false;
    if(this.globalService.isMobile){
        this.globalService.showHeader = false;
    }
    this.loadShareDocument();

    this.sharedService.on('login-event', (event:any) => {
      this.loadShareDocument();
      if(document.getElementById('preview-frame')){
          console.log('login-event');
          var iframe:any   = document.getElementById('preview-frame');
          iframe.contentWindow.WebPDF.onSignIn();
      }
    });
    this.sharedService.on('logout-before-event', (event:any) => {
      if(document.getElementById('preview-frame')) {
          console.log('logout-before-event');
          var iframe:any   = document.getElementById('preview-frame');
          iframe.contentWindow.WebPDF.onBeforeSignOut(this.globalService.currentUser.user_id, function(){
              console.log("logout-before-event callback");
              window.parent.angularHeaderComponent.zone.run(function(){
                  window.parent.angularHeaderComponent.signOut();
              });
          });
      }
    });
    this.sharedService.on('logout-event', (event:any) => {
        this.globalService.currentUserToken='';
      if(document.getElementById('preview-frame')) {
        console.log('logout-event');
        var __this = this;
        var iframe:any   = document.getElementById('preview-frame');
        iframe.contentWindow.WebPDF.onAfterSignOut(this.globalService.currentUserEmail, function(){
          window.parent.angularHeaderComponent.zone.run(function(){
            //window.parent.angularHeaderComponent.changeRouter(['/']);
            __this.loadShareDocument();
          });
        });
      }else{
        this.loadShareDocument();
      }
    });
  }
  public onPreviewIframeLoad(): void {
      var iframe:any   = document.getElementById('preview-frame');
      // if current user is not doc owner  hide the share icon
      if(iframe && iframe.contentWindow && iframe.contentWindow.PhantomOnline && !this.canShare){
          iframe.contentWindow.PhantomOnline.hideShareIcon();
      }
  }
  private loadShareDocument():void {
      this.route
          .params
          .subscribe(params => {
            var siteaction = params['siteaction'];
            var target_url = params['target_url'];
            var redirect_url = params['redirect_url']||'/view-and-edit';
            console.log('siteaction: ' + siteaction);
            console.log('target_url: ' + target_url);
            console.log('redirect_url: ' + redirect_url);
            if (siteaction) {
              if(siteaction == 'forgetpassword'){
                window.location.href = this.globalService.getForgotPasswordUrl(redirect_url);
              } else if (siteaction == 'sign-up') {
                this.router.navigateByUrl('/view-and-edit?siteaction=sign-up&redirect_url='+redirect_url);
              }
              return;
            }
            if (target_url) {
              return;
            }

              if(this.globalService.getDevice() === 'mobile'){
                  // this.errorCode='NOT_SUPPORT_MOBILE';
                  // return false;
              }
              var code:string = params['code'];
            var extra_params = '';
            if (params['extra_params']) {
              extra_params = decodeURIComponent(params['extra_params']);
            }else{
                // https://jira.foxitsoftware.cn/browse/PRO-2583#
                // manifest.json    openpluginboard=param
                // params
                //  1.share ==> 文档分享
                //  2.inline-comment ==> 评论面板
                //  3.cDRM  ==> 保护文档
                //  4.connected_review  ==>  互联审阅
                extra_params = '&openpluginboard=share'
            }
              this.shareService.getShare(code).subscribe(
                  data => {
                      //noinspection TypeScriptUnresolvedVariable
                      if(data.ret == 0){
                          var docuri:string;
                          var url:any;
                          var currentUserCanNotDownload:any=false;
                          if(data.data.pdf_preview_url){
                              if(data.data.share){
                                  if(data.data.share.can_download!==1 && this.globalService.currentUserEmail !== data.data.cmis_document.properties['cmis:createdBy']){
                                      currentUserCanNotDownload=true;
                                  }
                              }
                              // shared file has read-only property so not open share panel
                              if(this.globalService.currentUserEmail !== data.data.cmis_document.properties['cmis:createdBy']){
                                  if (extra_params==='&openpluginboard=share'){
                                      extra_params='';
                                  }
                              }
                              docuri = encodeURIComponent(decodeURIComponent(data.data.pdf_preview_url));
                              url = '/foxit-webpdf-web/webapp/'+
                                  this.globalService.getDevice() +
                                  '/index.html?extend-phantom=&al=' +
                                  this.globalService.getLanguage() +
                                  '&docuri=' + docuri +
                                  '&ucnd=' + currentUserCanNotDownload +
                                  '&object_id=' +
                                  data.data.cmis_document.id +
                                  '&docname=' +
                                  encodeURIComponent(data.data.cmis_document.properties['cmis:name']) +
                                extra_params;

                              if(this.globalService.currentUserEmail && data.data.cmis_document.properties['cmis:createdBy']==this.globalService.currentUserEmail){
                                  this.canShare = true
                              }else{
                                  this.canShare = false
                              }

                              // https://jira.foxitsoftware.cn/browse/CPDF-2038
                              // 成功分享的 Share 文档总数 – 成功分享定义为本周内开始分享的文档并被除了分享者本人外一个人打开阅读过。
                              // 1. 7天内
                              // 2. 非owner打开 包括(guest)
                              var currentViewTime=+new Date();
                              var sharedTime=+new Date(data.data.share.updated);
                              if(this.globalService.currentUserEmail && data.data.cmis_document.properties['cmis:createdBy']!==this.globalService.currentUserEmail || !this.globalService.currentUserEmail){
                                  if(((currentViewTime-sharedTime)/1000/60/60/24)<7){
                                      this.globalService.sendGaEvent('phantomPDF online web','Shared File Success',data.data.cmis_document['id']);
                                  }
                              }
                              if(this.globalService.currentUserEmail){
                                  this.shareService.postViewRecord({
                                      "type":"view",
                                      "object_id":data.data.cmis_document.id
                                  })
                              }
                              url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                              this.errorCode = '';
                              this.previewUrl = url;
                          }else{
                              this.errorCode = 'CAN_NOT_PREVIEW';
                              this.fileName = data.data.cmis_document.properties['cmis:name'];
                              this.downloadUrl = data.data.download_url;
                          }
                      } else {
                          this.previewUrl = '';
                          //share is not found.
                          //noinspection TypeScriptUnresolvedVariable
                          if(data.ret == 400002){
                              // SHARE_IS_NOT_EXIST
                              this.errorCode = 'NOT_FOUND';
                              //forbid
                          }else{
                              if(this.globalService.currentUserEmail){
                                  this.errorCode = 'FORBID';
                              }else{
                                  this.errorCode = 'FORBID_GUEST';
                              }
                          }
                      }
                  },
                  error => {
                      console.log(error);
                  }
              );
          });
  }
  public showSignInModal():void {
    this.sharedService.broadcast({
        name: 'showSignInModal'
    });
  }

  public previewGoback():void{
    window.angularHeaderComponent.zone.run(()=>
      window.angularHeaderComponent.goBack()
    );
  }
  ngOnInit(){
    $('#top').addClass('top-for-webviewer').hide();
    $('.main-container').addClass('main-for-webviewer');
  }
  ngOnDestroy(){
    $('#top').removeClass('top-for-webviewer').show();
    $('.main-container').removeClass('main-for-webviewer');
  }
}
