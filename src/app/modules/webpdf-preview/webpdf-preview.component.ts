import {Component, ViewChild, OnInit} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {SharedService} from "../../services/shared.service";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {ShareService} from  "../../services/share.service";

declare var window: any;
declare var $: any;

@Component({
  moduleId: module.id,
  templateUrl: './index.html',
  styleUrls: ['../share/index.css']
})
export class WebpdfPreviewComponent implements OnInit {
  public previewUrl: SafeResourceUrl;
  public canShare: boolean = true;
  public errorCode: string;
  public downloadUrl: string;
  public fileName: string;

  constructor(public globalService: GlobalService,
              private sharedService: SharedService,
              public sanitizer: DomSanitizer,
              private shareService: ShareService,
              private route: ActivatedRoute,
              private router: Router) {

    console.log('#######comes here');
    this.globalService.showAside = false;
    this.globalService.isCloudReading = false;
    if(this.globalService.isMobile){
      this.globalService.showHeader = false;
    }
    this.route
      .params
      .subscribe(params => {
        var url: string;
        var cmisid: string;
        var name: string;
        var unSafeUrl: any;
        var uuid: string;
        var ucnd: boolean=false;
        var descriptionObj: any;
        if(this.globalService.getDevice() === 'mobile'){
           //this.errorCode='NOT_SUPPORT_MOBILE';
           //return false;
        }
        if (params['url']) {
          url = params['url'];
          if (!params['cmisid']) {
            cmisid = '';
          } else {
            cmisid = params['cmisid'];
          }
          if (params['name']) {
            name = params['name'];
          } else {
            name = '';
          }
          url = encodeURIComponent(decodeURIComponent(url));
          unSafeUrl = '/foxit-webpdf-web/webapp/' +
            this.globalService.getDevice() +
            '/index.html?extend-phantom=&al=' +
            this.globalService.getLanguage() +
            '&object_id=' + cmisid +
            '&docuri=' + url + '&docname=' + encodeURIComponent(name);
          console.log(unSafeUrl);
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
        }
        else if (params['drive_name']){
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
          unSafeUrl = '/foxit-webpdf-web/webapp/' + this.globalService.getDevice() +
            '/index.html?extend-phantom=&al=' + this.globalService.getLanguage()
            + '&source=' + netDriveName
            + '&folderid=' + folder_id
            + '&object_id=' + netDriveFileId
            + '&ucnd=' + ucnd
            + extra_params;
          console.log(unSafeUrl);
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
        }
        else if (params['cmisid']) {
          cmisid = params['cmisid'];
          var extra_params = '';
          if (params['extra_params']) {
            extra_params = decodeURIComponent(params['extra_params']);
          }
          this.globalService.inputFile = null;
          this.shareService.getCmisDocumentById(cmisid, true)
            .subscribe(
              data => {
                if (data && data.data && data.data.pdf_preview_url) {
                  if(data.data.cmis_document && data.data.cmis_document.properties && data.data.cmis_document.properties['cmis:description']){
                    try {
                      descriptionObj = JSON.parse(data.data.cmis_document.properties['cmis:description']);
                      if(!descriptionObj.canDownload){
                        ucnd=true;
                      }
                    }catch (e){
                    }
                  }
                  url = encodeURIComponent(decodeURIComponent(data.data.pdf_preview_url));
                  if (this.globalService.currentUserEmail && data.data.cmis_document.properties['cmis:createdBy'] == this.globalService.currentUserEmail) {
                    ucnd = false;
                  }
                  unSafeUrl = '/foxit-webpdf-web/webapp/' +
                    this.globalService.getDevice() +
                    '/index.html?extend-phantom=&al=' +
                    this.globalService.getLanguage() +
                    '&docuri=' + url + '&object_id=' + cmisid +
                    '&ucnd=' + ucnd +
                    '&docname=' + encodeURIComponent(data.data.cmis_document.properties['cmis:name']) +
                    extra_params;
                  if (this.globalService.currentUserEmail && data.data.cmis_document.properties['cmis:createdBy'] == this.globalService.currentUserEmail) {
                    this.canShare = true;
                  } else {
                    this.canShare = false;
                  }
                  this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
                } else {
                  if (data.ret === 200001) {
                    this.errorCode = data.msg;
                  }
                  else if (data.ret === 100003) {
                    this.errorCode = data.msg;
                  } else {
                    this.errorCode = 'CAN_NOT_PREVIEW';
                    this.fileName = data.data.cmis_document.properties['cmis:name'];
                    this.downloadUrl = data.data.download_url;
                  }
                }
              },
              error => {
                console.log(error);
              }
            );
        }
        else if (params['uuid']) {
          uuid = params['uuid'];
          unSafeUrl = '/foxit-webpdf-web/webapp/' + this.globalService.getDevice() + '/index.html?extend-phantom=&al=' + this.globalService.getLanguage() + '&docuri=' + uuid;
          console.log(unSafeUrl);
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
        }
        else {
          // e.g., /preview/customparameters/%26docuri%3dhttps%253a%252f%252ftest123
          if (this.router.url.indexOf('customparameters') !== -1) {
            console.log('customparameters: ' + params['params']); // &docuri=https%3a%2f%2ftest123, it's already Decoded Value from %26docuri%3dhttps%253a%252f%252ftest123
            //var extend_params = decodeURIComponent(params['params']);
            var extend_params = params['params']; // Imporant! cannot decode again for params['params'], because we should keep the value of docuri encoded
            console.log('customparameters: ' + extend_params);
            var clearn_params:any = decodeURIComponent(extend_params);
            var urlObj:any = this.globalService.urlParaToObj(clearn_params);
            if(urlObj && urlObj['al']){
              console.log('====customparameters');
              console.log(urlObj);
              var lang:any=urlObj['al'];
              this.sharedService.broadcast({
                name:'change-language',
                lang:lang
              })
            }
            // CPDFI-1071, do not force login for preview/customparameters/:params
            /*
            if (!this.globalService.currentUserToken) {
              window.angularHeaderComponent.showSignInModal();
              return;
            }
            */


            //unSafeUrl = '/foxit-webpdf-web/webapp/' + this.globalService.getDevice() + '/index.html?extend-phantom=&al=' + this.globalService.getLanguage() + extend_params;
            unSafeUrl = '/foxit-webpdf-web/webapp/' + this.globalService.getDevice() + '/index.html?extend-phantom=' + extend_params;
            console.log(unSafeUrl);
            this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
          } else {
            //error
            var extra_params = '';
            if (params['extra_params']) {
              extra_params = decodeURIComponent(params['extra_params']);
            }

            if (this.globalService.inputFile !== null || window.location.pathname.indexOf("/preview") != 0) {
              unSafeUrl = '/foxit-webpdf-web/webapp/' + this.globalService.getDevice()
                + '/index.html?extend-phantom=&al=' + this.globalService.getLanguage()
                + extra_params;
              console.log(unSafeUrl);
              this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unSafeUrl);
            } else {
              this.router.navigate(['/']);
            }
          }
        }
      });
    this.sharedService.on('login-event', (event: any) => {
      if (document.getElementById('preview-frame')) {
        console.log('login-event');
        var iframe: any = document.getElementById('preview-frame');
        iframe.contentWindow.WebPDF.onSignIn();
      }
    });
    this.sharedService.on('logout-event', (event: any) => {
      if (document.getElementById('preview-frame')) {
        console.log('logout-event');
        var iframe: any = document.getElementById('preview-frame');
        iframe.contentWindow.WebPDF.onAfterSignOut(this.globalService.currentUserEmail, function () {
          //window.parent.angularHeaderComponent.zone.run(function () {
          //  window.parent.angularHeaderComponent.changeRouter(['/view-and-edit']);
          //});
        });
      }
    });
    this.sharedService.on('logout-before-event', (event: any) => {
      if (document.getElementById('preview-frame')) {
        console.log('logout-before-event');
        var iframe: any = document.getElementById('preview-frame');
        iframe.contentWindow.WebPDF.onBeforeSignOut(this.globalService.currentUser.user_id, function(){
          console.log("logout-before-event callback");
          window.parent.angularHeaderComponent.zone.run(function () {
            window.parent.angularHeaderComponent.signOut();
          });
        });
      }
    });
  }

  public onPreviewIframeLoad(): void {
    var iframe: any = document.getElementById('preview-frame');
    // if current user is not doc owner  hide the share icon
    if (iframe && iframe.contentWindow && iframe.contentWindow.PhantomOnline && !this.canShare) {
      iframe.contentWindow.PhantomOnline.hideShareIcon();
    }
  }

  public previewGoback(): void {
    window.angularHeaderComponent.zone.run(() =>
      window.angularHeaderComponent.goBack()
    );
  }

  ngOnInit() {
    $('#top').addClass('top-for-webviewer').hide();
    $('.main-container').addClass('main-for-webviewer');
  }

  ngOnDestroy() {
    $('#top').removeClass('top-for-webviewer').show();
    $('.main-container').removeClass('main-for-webviewer');
  }
}
