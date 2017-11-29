import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { User } from '../../models/user';
import { UserService, GlobalService, AuthenticationService } from '../../services/index';
import { PageHeaderComponent } from '../header/header.component';
import {SharedService} from "../../services/shared.service";
import { Router, NavigationEnd } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { CookieService } from 'angular2-cookie/core';
import {WebToolConvertComponent} from "../modals/webtools/webtool.component";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivationSubscriptionComponent } from '../../subscription/activation-subscription.component'
import { SubscriptionComponent } from '../../subscription/subscription.component'
import { LicenseCodeComponent } from '../../subscription/license-code.component';
import { SubscriptionNowComponent } from '../../subscription/subscription-now.component'
import { SubscriptionAdComponent } from '../../subscription/subscription-ad.component'
import { MethodNeedLoginDecorator } from '../../app.methodNeedLogin.decorator'

declare var ga: any;
declare var window: any;
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'phantom-online',
  templateUrl: "./main.html",
  styleUrls:['main.css']
})
export class MainComponent implements OnInit {
  @ViewChild(PageHeaderComponent) public header:PageHeaderComponent;
  @ViewChild(WebToolConvertComponent) public webToolModal:WebToolConvertComponent;
  @ViewChild('activationSubscription') public activationSubscriptionModal:ActivationSubscriptionComponent;
  @ViewChild(SubscriptionComponent) public subscriptionModal: SubscriptionComponent;
  @ViewChild(LicenseCodeComponent) public licenseCodeModal: LicenseCodeComponent;
  @ViewChild(SubscriptionNowComponent) public subscriptionNowModal: SubscriptionNowComponent;
  @ViewChild(SubscriptionAdComponent) public subscriptionAd: SubscriptionAdComponent;

  currentUser: User;
  //isCloudReading: boolean = false;
  //showCloudReading: boolean = false;
  //showPreviewModal: boolean = false;
  //previewUrl: string;
  //docId: any;
  public isMobile:boolean=false;
  public cloudReadingUrl:any='';
  mobileLeftAsideActive: boolean;
  public isIOSWeChatBrowser:boolean=true;
  public activationSubscriptionInitialized: boolean = false;

  // 保存现场要做到的事情
  private lastCallback :Function;


  constructor(public userService: UserService,
              public globalService: GlobalService,
              public router: Router,
              private sharedService: SharedService,
              private translate: TranslateService,
              private authenticationService:AuthenticationService,
              private cookieService:CookieService,
              private sanitizer: DomSanitizer,
              private zone:NgZone
  ) {

    window.angularMainComponent = {
      zone: this.zone,
      showSubscriptionPromptDialog: () => this.showSubscriptionPromptDialog(),
      showSubscriptionDialog: (params:any) => this.showSubscriptionDialog(params),
      enterRightTopSubscriptionAD: (position:any) => this.enterRightTopSubscriptionAD(position),
      leaveRightTopSubscriptionAD: () => this.leaveRightTopSubscriptionAD(),
      showActivateLicenseCodeDialog: (params:any) => this.showActivateLicenseCodeDialog(params),
      showSubscriptionNowDialog: (params:any) => this.showSubscriptionNowDialog(params),
      setLanguage: (forceLang?:any) => this.setLanguage(forceLang),
      doDownloadPhantomPDFClient: () => this.doDownloadPhantomPDFClient(),
      isNeedShowDowndloadClient: () => this.isNeedShowDowndloadClient(),
      doCheckUserSubscription: () => this.doCheckUserSubscription()
    };
    this.sharedService.on('login-event', (event:any) => {
      this.checkUserPhantomOnlineSubscription(this.globalService.currentUserToken);
      this.checkUserProductSubscription(this.globalService.currentUserToken);
    });
    $('body').click(function(){
      // clear selection in foxit drive for tools modal
      //window.angularHeaderComponent.clearFoxitDriveSelection()
    })

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var weChatBrowser = navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1;
    if(weChatBrowser && isiOS){
      this.isIOSWeChatBrowser=true;
    }else{
      this.isIOSWeChatBrowser=false;
    }
    this.sharedService.on('change-language',(event:any)=>{
      var lang:any=event.lang;
      console.log(event);
      this.changeLang(lang);
    });

      this.sharedService.on('showWebToolModal',(event:any)=> {
            console.log(event)
            let _eventSource :number = event.fromFoxitDrive == true ? 1:0;
            this.webToolModal.showWebToolModal(true, event.modeName, _eventSource);
          }
      );
      //if(this.globalService.getDevice() === 'mobile' && (location.href.indexOf('/share/') == -1 && location.href.indexOf('/preview/') == -1 && location.href.indexOf('/redirect-to-cas/') == -1)){
      //   this.isMobile=true;
      //}
    this.isMobile = this.globalService.isMobile;
    this.globalService.changeLanguage=this.changeLang;
    if(this.isMobile){
      this.globalService.showAside=false;
    }


      this.setLanguage();
    this.router.events.subscribe(
      event => {
        if(event instanceof NavigationEnd) {
            console.log('router change');
          console.log(event);
          if(this.globalService.isFirstPage && event.id > 1){
            this.globalService.isFirstPage = false;
          }
          window.angularHeaderComponent.zone.run(()=>
              window.angularHeaderComponent.setPDFTitle('')
          );
          // TODO: remove domain hardcode
          if (this.globalService.isCNProEnv()){
            ga('create', 'UA-53591733-8', 'auto');
          } else if( this.globalService.isProdEnv() ){
            ga('create', 'UA-53591733-6', 'auto');
          } else{
            ga('create', 'UA-53591733-7', 'auto');
          }

          if(this.globalService.currentUserEmail){
            ga('set', 'dimension1', 'Logged In');
          }else{
            ga('set', 'dimension1', 'Visitor');
          }
          ga('set', {  page: event.url });
          this.setPageTitle();
          var event_url:string = event.url;
          console.log("event_url " + event_url);
          this.globalService.gaSSO('change_router_'+event_url);
          this.globalService.currentView = event_url;
          if(event_url==='/' ||
              event_url==='/privacy-policy' ||
              event_url==='/term-of-use' ||
              event_url.indexOf('/?')>-1 ||
              event_url.indexOf('/privacy-policy')>-1 ||
              event_url.indexOf('/term-of-use')>-1)
          {
            this.globalService.isHomePage=true;
          }else{
            this.globalService.isHomePage=false;
          }
          if(event_url.indexOf('/foxit-drive')>-1){
            // 只有在 foxit-drive 这个view 才会加载 cloud-reading/index.html
            var defaultLang:string = localStorage.getItem('currentLang') || 'en-US';
            let browserLang = this.translate.getBrowserLang(); // e.g., en
            var currentLang:string = defaultLang;
            if(defaultLang){
              currentLang=defaultLang;
            }else{
              if (browserLang == 'en') {
                currentLang = 'en-US';
              } else if (browserLang == 'zh') {
                currentLang = 'zh-CN';
              }
            }
            if(!this.cloudReadingUrl){
              this.cloudReadingUrl=this.sanitizer.bypassSecurityTrustResourceUrl('/assets/cloud-reading/index.html?v={version}&lang='+currentLang);
            }
          }
          if(this.globalService.getDevice()==='mobile'){
            // 对于 mobile端 始终隐藏 左边栏
            this.globalService.showAside=false;
            this.globalService.mobileModule = '';
            if(event_url==='/shared-with-me'){
              this.globalService.showHeader=true;
              this.globalService.mobileModule = 'shared-with-me';
              this.translate.get('Shared With Me').subscribe((res: any) => {
                this.globalService.mobileTitle = res;
              });
            }else if(event_url==='/foxit-drive'){
              this.globalService.mobileModule = 'foxit-drive';
              this.globalService.showHeader=true;
              this.translate.get('Foxit Drive').subscribe((res: any) => {
                this.globalService.mobileTitle = res;
              });
            }
          }
          this.checkServerStatus();

          if (event_url.indexOf('/view-and-edit?siteaction=sign-up') == 0) {
            if (this.globalService.currentUserToken) {
              this.router.navigateByUrl('/');
            } else {
              this.header.showSignUpModal();
            }
            return;
          }

          var domain:string = window.location.protocol+"//"+window.location.host;
          if (event_url.indexOf('/check-cas/') == 0) {

            console.log('---- handle [check-cas] ----');
            var target_url:string = event_url.replace('/check-cas/', '');
            target_url = decodeURIComponent(target_url);
            console.log("target_url " + target_url);

            // redirect to cas page to check login
            var cas_url:string = this.userService.getCasSiteUrl() + '&service=' + encodeURIComponent(domain + "/redirect-to-cas/" + encodeURIComponent(target_url));
            console.log('cas url: ' + cas_url);
            location.href = cas_url;

          } else if (event_url.indexOf('/redirect-to-cas/') == 0 && event_url.indexOf('ticket=') > 0) { // URL containing a cas ticket, e.g.: http://localhost:3000/redirect-to-cas/%2Fview-and-edit?ticket=xxxx

            console.log('---- handle [ticket] ----');
            var ticket:string = event_url.split('ticket=')[1];
            var service:string = domain + event_url.split('ticket=')[0].slice(0,-1);
            var target_url:string = event_url.split('ticket=')[0].slice(0,-1).replace('/redirect-to-cas/', '');
            target_url = decodeURIComponent(target_url);

            if (target_url.indexOf('?open-subscription-now-dialog=true') !== -1) {
              this.lastCallback = () => {
                //this.lastCallback = null;
                let match:Array<string> = target_url.match(/&f=(\d)(?:$|&)/);
                let trackingId:string = '';
                if (match) {
                  trackingId = ['Foxit Online notlogin', 'Phantom Online notlogin'][match[1]];
                }
                if (trackingId) {
                  trackingId = 'trackingId=' + encodeURIComponent(trackingId);
                }
                this.showSubscriptionNowDialog({trackingId: trackingId});
              }
            } else if (target_url.indexOf('?open-activate-license-dialog=true') !== -1){
              //open-activate-license-dialog=true
              this.lastCallback = () => {
                //this.lastCallback = null;
                let match:Array<string> = target_url.match(/&f=(\d)(?:$|&)/);
                let trackingId:string = '';
                if (match) {
                  trackingId = ['Foxit Online notlogin', 'Phantom Online notlogin'][match[1]];
                }
                if (trackingId) {
                  trackingId = 'trackingId=' + encodeURIComponent(trackingId);
                }
                this.showActivateLicenseCodeDialog({trackingId: trackingId});
              }
            }

            this.authenticationService.login_by_ticket(ticket, service).subscribe(
              data => {
                if (data.ret == 0) {
                  console.log("getAccessTokenFromCas success");
                  this.checkUserPhantomOnlineSubscription(this.globalService.currentUserToken, (data:any) => {
                    this.signInGa(target_url, data.isSubscribed, data.redeem_subscription);
                  });
                  this.checkUserProductSubscription(this.globalService.currentUserToken);
                  this.router.navigateByUrl(target_url);
                } else {
                  console.log("getAccessTokenFromCas failed");
                  console.log(data);
                  this.header.signOut(true, false);
                  this.router.navigateByUrl(target_url);
                }
              },
              error => { // user is not logged-in status at CAS side
                console.log("getAccessTokenFromCas error");
                console.log(error);
                this.header.signOut(true, false);
                this.router.navigateByUrl(target_url);
              }
            );

          } else {
            this.checkToken();
          }
          //ga('set', 'userId', this.globalService.currentUser.user_id);

          this.checkNeedShowSubscriptionPromptDialog()
        }
      }
    );
  }

  checkToken() {
    if(this.globalService.currentUserToken && !this.globalService.currentUser){
      this.userService.getCurrentInfo().subscribe(
        data => {
          //noinspection TypeScriptUnresolvedVariable
          if (data.ret != 0) {
            if (!this.globalService.useCasLogin()) {
              this.header.signOut(true);
            }

            console.log('token error...');
          } else {
            this.checkUserPhantomOnlineSubscription(this.globalService.currentUserToken);
            this.checkUserProductSubscription(this.globalService.currentUserToken);
            localStorage.setItem('userInfo',JSON.stringify(data.data));
            this.currentUser = this.globalService.currentUser;
            ga('set', 'userId', this.globalService.currentUser.id);
            var option:any;
            this.cookieService.put('uid', this.globalService.currentUser.id, option ? option : null);
            ga('send', 'pageview');
          }
        },
        error => {
          this.header.signOut(true);
          console.log('response error');
        }
      );
    }
    else if (this.globalService.currentUserToken){
      ga('set', 'userId', this.globalService.currentUser.id);
      var option:any;
      this.cookieService.put('uid', this.globalService.currentUser.id, option ? option : null);
      ga('send', 'pageview');
    }
    else{
      //ga('send', 'pageview');
      var __this = this;
      setTimeout(function(){
        var iframe:any = document.getElementById('preview-frame');
        if(iframe && iframe.contentWindow){ // for PRO-3356
          //ga('set', 'userId', 'guest_' + new Date().getTime() + '_' + Math.random()); // e.g., 1505911928826_0.34134541647412453
          // guest preview 作为活跃用户的数据
          __this.globalService.sendGaEvent('guest','guest_preview_doc',window.navigator.userAgent);
        }
        //ga('send', 'pageview');
      }, 3000);
    }
  }

  toggle ():void {
    this.globalService.showAside = !this.globalService.showAside;
  }
  ngOnInit() {
    //this.loadAllUsers();
    this.globalService.mobileLeftAsideActive.subscribe(bool => {
      this.mobileLeftAsideActive = bool;
    })
  }

  checkServerStatus() {
    if (!this.userService.serverStatus) {
      this.userService.getServerStatus().subscribe(
        data => {
          if (data.ret == 0) {
            this.userService.serverStatus = data;

            this.checkServerMatain(this.userService.serverStatus.data.server_maintaining);
          }
        },
        error => {
        }
      );
    } else {
      this.checkServerMatain(this.userService.serverStatus.data.server_maintaining);
    }
  }

  checkServerMatain(server_maintaining:boolean) {
    if (server_maintaining) {
      var url:string = this.userService.getSiteMatainUrl();
      $("body").css('height', $(document).height());
      $(window).resize(function(){
        $("body").css('height', $(document).height());
      });
      $("body").html('<iframe _ngcontent-hwj-1="" allowtransparency="true" frameborder="0" height="100%"  scrolling="no"  width="100%" src="'+url+'"></iframe>');
    }
  }
  setPageTitle(){
    // set page title and favicon
    /*
    if(this.globalService.baseUrlIsPDFEditor){
      this.translate.get('PhantomPDF Online').subscribe((res: string) => {
        document.title = res;
      });
    }else{
      this.translate.get('Reader Online').subscribe((res: string) => {
        document.title = res;
      });
    }
    */

    // PRO-3867
    // 1. /phantompdf view    phantomPDF online
    // 2. /reader view        Foxit Reader Online
    // 3.其它的view            Foxit Online

    this.translate.get(['Foxit Online', 'Foxit Reader Online','PhantomPDF Online']).subscribe((res: any) => {
      let title:string;
      if (this.globalService.isMobile) {
        title = res['Foxit Reader Online'];
        return document.title = title;
      }
      if (this.globalService.baseUrlIsPDFEditor) {
        title = res['Foxit Online'];
      } else {
        title = res['Foxit Reader Online'];
      }
      $('.shortcut.icon').remove();
      $('head').append('<link rel="shortcut icon" href="/img/favicon.ico">');
      if (window.location.href.indexOf('/reader')>-1){
        title = res['Foxit Reader Online'];
      }
      if (window.location.href.indexOf('/phantompdf')>-1 || window.location.href.indexOf('/preview')>-1){
        title = res['PhantomPDF Online'];
        $('.shortcut.icon').remove();
        $('head').append('<link rel="shortcut icon" href="/img/favicon-phantompdf.ico">');
      }
      document.title = title;
    });
  }

  setLanguage(forceLang?:any) {
    // phantom online 语言
    // 默认通过浏览器自身语言 中文浏览器显示中文 英文浏览器显示英文
    // 用户设置通过参数 ?lang=zh-CN en-US
    // 用户设置>浏览器自身语言  用户设置会记录在localStorage里面

    var url:any = window.location.href;
    if(url.indexOf('?')>-1){
      var paraUrl=url.split('?')[1];
      var urlObj:any = this.globalService.urlParaToObj(paraUrl);
      console.log('====urlObj',urlObj);
    }
    if(urlObj ){
      if(urlObj['lang']){
        localStorage.setItem('currentLang',urlObj['lang']);
      }

      if(urlObj['language']){
        localStorage.setItem('currentLang',urlObj['language']);
      }
    }

    var defaultLang:string = localStorage.getItem('currentLang') || 'en-US';
    console.log(defaultLang);
    console.log(this.translate);
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en-US');
    if(forceLang){
      this.translate.addLangs([
        forceLang
      ]);
      var currentLang:string = forceLang;
      this.globalService.language=currentLang;
      this.translate.use(currentLang);
      localStorage.setItem('currentLang', currentLang);
      this.setPageTitle();
    }else{
      this.translate.addLangs([
        "en-US",
        "zh-CN"
      ]);
      let browserLang = this.translate.getBrowserLang(); // e.g., en
      let browserLangFull = this.translate.getBrowserCultureLang();  // e.g., en-US
      console.log('browserLang: ' + browserLang);
      console.log('browserLangFull: ' + browserLangFull);

      var currentLang:string;
      if(defaultLang){
        currentLang= defaultLang;
      }else{
        if (browserLang == 'en') {
          currentLang = 'en-US';
        } else if (browserLang == 'zh') {
          currentLang = 'zh-CN';
        }else{
          currentLang = 'en-US';
        }
      }
      this.globalService.language=currentLang;
      //this.cloudReadingUrl=this.sanitizer.bypassSecurityTrustResourceUrl('/cloud-reading/index.html?lang='+currentLang);
      console.log('currentLang: ' + currentLang);
      this.translate.use(currentLang);
      localStorage.setItem('currentLang', currentLang);
      // set page title
      this.setPageTitle();
    }

  }
  public changeLang(lang:any) {
    if (lang == 'en') {
      lang = 'en-US';
    } else if (lang == 'zh') {
      lang = 'zh-CN';
    }
    this.translate.currentLang=lang;
    console.log('====this.translate')
    this.translate.use(lang);
    localStorage.setItem('currentLang', lang);
    this.setPageTitle();
  }

  public doCheckUserSubscription() {
    this.checkUserPhantomOnlineSubscription(this.globalService.currentUserToken);
    this.checkUserProductSubscription(this.globalService.currentUserToken);
  }

  checkUserPhantomOnlineSubscription(token: string, success: Function = function(param:any){}) {
    if (!this.globalService.subscriptionSwitch) {
      return;
    }
    // 1. get data:
    this.userService.getUserPhantomOnlineSubscription(token).subscribe(
      data => {
        if (data.ret == 0) {
          // 2. save data:
          this.userService.userPhantomOnlineSubscription = data.data;
          success(data.data);

          // TODO 3. do some check here:
          try {
            var iframe:any   = document.getElementById('preview-frame');
            iframe.contentWindow.WebPDF.updateSubscribe();
          } catch (ex){}

          if(iframe && iframe.contentWindow && iframe.contentWindow.PhantomOnline){
            if(window.previewFrame.PhantomOnline && window.previewFrame.PhantomOnline.signincallback && typeof window.previewFrame.PhantomOnline.signincallback=='function'){
              window.previewFrame.PhantomOnline.signincallback();
            }
          }
          this.checkNeedShowSubscriptionPromptDialog();
          //this.lastCallback = null;
        }
      },
      error => {
      }
    );
  }

  checkUserWebToolsSubscription(token: string) {
    if (!this.globalService.subscriptionSwitch) {
      return;
    }
    this.userService.getUserWebToolsSubscription(token);
  }

  checkUserProductSubscription(token: string) {
    if (!this.globalService.subscriptionSwitch) {
      return;
    }
    this.userService.getUserPhantomProductSubscription(token).subscribe(
      data => {},
      error => {
      }
    );
  }

  //@MethodNeedLoginDecorator()
  private showSubscriptionPromptDialog () {
    this.activationSubscriptionInitialized = true;
    setTimeout(() => {
      this.activationSubscriptionModal.showModal();
      localStorage.setItem(this.globalService.currentUserEmail+ ':storageIsSubscribed', '' + Date.now());
    }, 100)
  }
  private checkNeedShowSubscriptionPromptDialog () {
    // 订阅相关的临时移除
    if (!this.globalService.subscriptionSwitch) {
      return;
    }
    // reader-online 不弹窗 PRO-3734
    if (!this.globalService.isPhantomOnlineMode()) {
      return;
    }
    // 移动端不弹窗
    if (this.globalService.getDevice() === 'mobile') {
      return;
    }
    // 未登录不弹窗
    if (!this.globalService.currentUserEmail) {
      return;
    }
    let userPhantomOnlineSubscription:any = this.userService.userPhantomOnlineSubscription;
    if (!userPhantomOnlineSubscription) {
      return;
    }
    // 已订阅
    if (userPhantomOnlineSubscription.isSubscribed) {
      return;
    }
    // 需要保留订阅现场的，不弹窗
    if (this.lastCallback) {
      this.lastCallback();
      return this.lastCallback = function(){};
    }
    // 登录后判断是否显示订阅提示弹窗，24小时提醒一次
    // 今天已经显示过了
    if ((+localStorage.getItem(this.globalService.currentUserEmail+ ':storageIsSubscribed') + 86400000) > Date.now()) {
      return;
    }
    // 在以下url下不弹窗
    if (/(^\/$)|(^\/redirect-to-cas\/)/.test(this.router.url)) {
      return;
    }
    if ((userPhantomOnlineSubscription.phantom_online_trial_start_timestamp === userPhantomOnlineSubscription.current_timestamp) || (userPhantomOnlineSubscription.remain_days <= 3)) {
      this.showSubscriptionPromptDialog();
    }
  }
  //@MethodNeedLoginDecorator()
  private showSubscriptionDialog (params: any) {
    this.subscriptionModal.showModal(params);
  }

  private enterRightTopSubscriptionAD (position: any) {
    this.subscriptionAd.show(position)
  }

  private leaveRightTopSubscriptionAD () {
    this.subscriptionAd.willHide();
  }

  private isNeedShowDowndloadClient (){
    return !this.userService.userHasDownloadClient;
  }

  private doDownloadPhantomPDFClient(){
    let _label_downfile: any = $("#downloadProductClient");
    let url:string = "";
    if (!this.globalService.isCNProEnv()){
      url = "http://cdn01.foxitsoftware.com/pub/foxit/phantomPDF/desktop/win/9.x/9.0/en_us/online/FoxitPhantomPDF90_enu_Setup_FOleft.msi";
    } else {
      url = "http://cdn07.foxitsoftware.cn/pub/foxit/phantomPDF/desktop/win/9.x/9.0/zh_cn/FoxitPDFEditor90_Zh_Setup_FOleftcn.msi  ";
    }
    _label_downfile.attr("href", url);
    _label_downfile.attr("target","_blank;");
    setTimeout(function () {
      document.getElementById('downloadProductClient').click();
    }, 500);
  }

  private showActivateLicenseCodeDialog (params:any) {
    this.licenseCodeModal.showModal(params);
  }

  private showSubscriptionNowDialog (params:any) {
    this.subscriptionNowModal.showModal(params);
  }

  private signInGa (url: string, isSubscribed: boolean, isKey: boolean = false) {
    // PRO-4630 & PRO-4630
    if (!isSubscribed) {
      return;
    }
    let category:string = '';
    let active:string = '';
    if (/^\/view-and-edit(\?|$)/.test(url) || /^\/foxit-drive(\?|$)/.test(url) || /^\/shared-with-me(\?|$)/.test(url)) {
      category = 'Foxit Online';
      active = 'PhantomPDF Online ';
    } else if (/^\/phantompdf(\?|$)/.test(url) || /^\/preview(\/|\?|$)/.test(url)) {
      category = 'PhantomPDF Online web';
      active = 'PhantomPDF Online ';
    } else {
      return;
    }
    if (isKey) {
      active += 'Key Customer ';
    } else {
      active += 'Subscribe Customer ';
    }
    active += 'Sign in';
    this.globalService.sendGaEvent(category, active, '');
  }
}
