import { Injectable } from '@angular/core';
import {User} from "../models/user";
import { CookieService } from 'angular2-cookie/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
//import {webpdfApiUrl, apiUrl} from '../globals';
import { device } from './../utils/device'
declare var phantomOnlineGlobalConfig: any;
declare var navigator: any;
declare var ga: any;
declare var window: any;
@Injectable()
export class GlobalService {
    public isFirstPage:boolean = true;
    public gridSize:number = 1;
    public webpdfApiUrl:string;
    public apiUrl:string;
    public accountApiUrl:string;
    public cwsApiUrl:string;
    public currentUserEmail:string;
    public currentUser: User;
    currentUser$: BehaviorSubject<User>
    public currentUserToken:string;
    public showAside: boolean = false;
    public isCloudReading: boolean = false;
    public isHomePage:boolean = false;
    public showHeader:boolean = true;
    public methodNeedLogin : boolean = false;
    public baseUrlIsPDFEditor : boolean;
    public language : any='en-US';
    public appName: string='Reader Online';
    public documentTitle : string;
    public inputFile : File=null;
    public hideSignUp: boolean=true;
    public mobileTitle: string='';
    public mobileModule: string = '';
    public searchMode: boolean=false;
    public currentView:any='';
    public needLoadTool:boolean=false;
    public isBrowserSide:boolean=true;
    mobileLeftAsideActive: BehaviorSubject<boolean>;
    isMobile: boolean;
    public foxitDriveLoaded:boolean=false;
    public changeLanguage:any;

    // 判断订阅开关的临时变量
    public subscriptionSwitch:boolean;

    setMobileLeftAsideActive (bool:boolean) {
      this.mobileLeftAsideActive.next(bool);
    }

    public getCurrentUser () :User {
        return this.currentUser;
    }
    public getDevice(): string {
        if (navigator.userAgent.match(/mobile|Android|iPhone|ios|iPod/i)){
            return 'mobile';
        }else{
            return 'pc';
        }
    }

    public isWindowPC() :boolean {
      if (device.windowsPC()){
        return true;
      }
      return false;
    }
    public getSiteOrigin(){
        if(window.location.origin){
            return window.location.origin
        }else{
            var origin:any = window.location.protocol + "//"
                + window.location.hostname
                + (window.location.port ? ':' + window.location.port : '');
            return origin;
        }
    }
    public isEmail(value:string):boolean {
        if (value.match(/^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/)) {
            return true;
        } else {
            return false;
        }
    }
    constructor(
        private cookieService: CookieService
    ){
      // 判断订阅开关的临时变量
      window.__subscriptionSwitch__ = this.subscriptionSwitch = this.setSubscriptionSwitch();
      this.mobileLeftAsideActive = new BehaviorSubject(false);
      this.currentUser$ = new BehaviorSubject(this.currentUser);
      // 解决bug PRO-2818
      //this.isMobile = this.getDevice() === 'mobile' && (location.href.indexOf('/share/') == -1 && location.href.indexOf('/preview/') == -1 && location.href.indexOf('/redirect-to-cas/') == -1);
      this.isMobile = this.getDevice() === 'mobile';// && (location.href.indexOf('/share/') == -1 && location.href.indexOf('/redirect-to-cas/') == -1);
      //this.isMobile = true;
        console.log('--GlobalService constructor--');
        const encode = encodeURIComponent;
        window['encodeURIComponent'] = (component: string) => {
            return encode(component).replace(/[!'()*]/g, (c) => {
                // Also encode !, ', (, ), and *
                return '%' + c.charCodeAt(0).toString(16);
            });
        };
        // TODO: wrong logic for enterprise site checking. 判断企业版：hideSignUp=true -> enterprise
        var notEnterpriseSite:any;
        notEnterpriseSite=[
            'localhost',
            'foxitsoftware.com',
            'foxitsoftware.cn',
            'connectedpdf.com'
        ];
        for(var site of notEnterpriseSite){
            if(window.location.href.indexOf(site)!==-1){
                this.hideSignUp=false;
                break;
            }
        }

        //this.baseUrlIsPDFEditor = window.location.href.indexOf('pdfeditor')>-1
        //  || window.location.href.indexOf('localhost')>-1
        //  || window.location.href.indexOf('10.203.22.205')>-1;

        // PRO-3690 q3 暂时不发布 baseUrlIsPDFEditor 所以产品环境 false
        //this.baseUrlIsPDFEditor = false; // TODO: should change it to true for Q3 release 判断phantom-online/reader-online: baseUrlIsPDFEditor=true -> phantom-online
        //if (window.location.href.indexOf('docker')>-1 ||
        //    window.location.href.indexOf('localhost')>-1 ||
        //    window.location.href.indexOf('10.203.22.205')>-1 ||
        //    window.location.href.indexOf('demo2')>-1 ||
        //    window.location.href.indexOf('pdfeditor')>-1 ||
        //    window.location.href.indexOf('fz05')>-1 ||
        //    window.location.href.indexOf('fz06')>-1 ||
        //    window.location.href.indexOf('fz07')>-1
        //) {
        //    this.baseUrlIsPDFEditor = true;
        //    this.appName='PhantomPDF Online';
        //}
        this.baseUrlIsPDFEditor = true;

        this.webpdfApiUrl = phantomOnlineGlobalConfig.webpdfApiUrl;
        this.apiUrl = phantomOnlineGlobalConfig.apiUrl;
        this.accountApiUrl = phantomOnlineGlobalConfig.accountApiUrl;
        this.cwsApiUrl = phantomOnlineGlobalConfig.cwsApiUrl;
        this.methodNeedLogin = phantomOnlineGlobalConfig.methodNeedLogin;
        this.currentUserEmail = this.cookieService.get('currentEmail');
        this.currentUserToken = this.cookieService.get('currentToken');

    }

  public isPhantomOnlineMode(){
    if (window.location.pathname.indexOf("/reader") == 0) { // PRO-3137 PRO-3135 PRO-3134
      return false;
    }
    if (window.location.pathname.indexOf("/share/") == 0) { // PRO-3133
      return false;
    }

    return this.baseUrlIsPDFEditor;
  }
    public getCookie(name:any){
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    public dateFormat(fmt:any,date?:any){
        // dateFormat('yy-MM-dd hh:mm:ss')
        // return  17-11-20 17:46:53


        if(date){
            var __this=new Date(date)
        }else {
            var __this = new Date();
        }
        var o = {
            "M+": __this.getMonth() + 1, //月份
            "d+": __this.getDate(), //日
            "h+": __this.getHours(), //小时
            "m+": __this.getMinutes(), //分
            "s+": __this.getSeconds(), //秒
            "q+": Math.floor((__this.getMonth() + 3) / 3), //季度
            "S": __this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (__this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    public getLanguage() {
        if (localStorage.getItem('currentLang')) {
            return localStorage.getItem('currentLang'); // e.g., zh-CN
        }
        return 'en-US';
    }
    public sendGaEvent(category:any, action:any, label:any) {
        if (ga && typeof ga === 'function') {
            return ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action,
                eventLabel: label+ ' from '+window.location.href
                //eventValue: window.location.href
            });
        }
    }
    public gaSSO(eventLabel:any){
        // 多用户使用同一个 账号登录
        var _ga=this.getCookie('_ga');
        var userEmail=this.currentUserEmail;
        if(_ga&&userEmail){
            if (ga && typeof ga === 'function') {
                return ga('send', {
                    hitType: 'event',
                    eventCategory: 'SSO',
                    eventAction: userEmail,
                    eventLabel: _ga+' '+this.dateFormat('yy-MM-dd hh:mm:ss')+' '+eventLabel+' '+window.navigator.userAgent
                    //eventValue: window.location.href
                });
            }
        }else{
            return false;
        }


    }
    public urlParaToObj (urlPara:string, needEncode?:any) {
        var arr:any, i:any, k:any, len1:any, obj:any;
        obj = {};
        if (urlPara.indexOf('&') !== -1) {
            arr = urlPara.split('&');
            for (k = 0, len1 = arr.length; k < len1; k++) {
                i = arr[k];
                if (needEncode) {
                    obj[i.split('=')[0]] = encodeURIComponent(i.split('=')[1]);
                } else {
                    obj[i.split('=')[0]] = i.split('=')[1];
                }
            }
        } else {
            if (needEncode) {
                obj[urlPara.split('=')[0]] = encodeURIComponent(i.split('=')[1]);
            } else {
                obj[urlPara.split('=')[0]] = urlPara.split('=')[1];
            }
        }
        return obj;
    }
    public openAds(trackId:any){

        var targetUrl:any;
        if (trackId == 'top-right') { // provided by viewer page
            trackId = 'onlineviewertop-right';
        }
        targetUrl = this.getPdfEditorUrl() + "?trackingid="+trackId+"/";
        this.sendGaEvent('phantomPDF online web','click ads link','ads position '+trackId);
        window.open(targetUrl);

        /*
        var baseUrl:any;
        var returnUrl:any;
        var returnBaseurl:any;
        var token:any;
        var targetUrl:any;
        var lang:any;
        lang = 'en-US';
        baseUrl = this.apiUrl;
        // returnBaseurl = this.webpdfApiUrl.slice(0,this.webpdfApiUrl.indexOf('webpdf'));
        // fix PRO-740
        returnBaseurl = window.location.protocol+"//"+window.location.host + '/';
        returnUrl = returnBaseurl+'view-and-edit?trackingId='+trackId;
        returnUrl = encodeURIComponent(returnUrl);
        token = this.currentUserToken || '';

        targetUrl =baseUrl+'appstore/app-detail?category=1&app_code=PhantomPDF&majorVersion=&minorVersion=&lang='+lang+'&return='+returnUrl+'&access_token='+token+'&fromClient=no';
        this.sendGaEvent('phantomPDF online web','click ads link','ads position '+trackId);
        window.open(targetUrl);
        */
    }

    // special usage for LoginComponent, cannot delete the method.
    public signSuccfromLoginIntergration(){
    }

    public isDevEnv (){
        var host:string = window.location.host;
        return host.indexOf("localhost") == 0;
    }

    public isProdEnv (){
        var host:string = window.location.hostname;
        return (
          host == 'pdfeditor.connectedpdf.com' // Deprecated
          || host == 'reader.connectedpdf.com' // Deprecated
          || host == 'online.foxitsoftware.com'
          || host == 'online.foxitsoftware.cn'
        );
    }

    public isCNProEnv (){
      var host:string = window.location.hostname;
      return host == 'online.foxitsoftware.cn';
    }

    public useCasLogin (){
      return true; // always use cas login
        //return !this.isDevEnv();
    }

  /**
   * TODO: how to define Guest?
   * @returns {boolean}
   */
  /*
  public isGuest (){
        if () {
            return false;
        }
        return true;
    }
    */

    getForgotPasswordUrl (fromWhichView?:any){
        if(fromWhichView){
            fromWhichView=decodeURIComponent(fromWhichView);
        }else{
            fromWhichView='/';
        }
        var url:string = this.accountApiUrl + 'site/forgetpassword?from=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + fromWhichView) + '&lang=' + this.getLanguage();
        //var url:string = this.apiUrl + 'site/forgetpassword?from=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + '/') + '&lang=' + this.getLanguage();
        console.log('====url====');
        console.log(url);
        return url;
    }
    getUpdatePasswordUrl (fromWhichView?:any){
        if(fromWhichView){
            fromWhichView=decodeURIComponent(fromWhichView);
        }else{
            fromWhichView='/';
        }
        var url:string = this.accountApiUrl+'profile/password?from=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + fromWhichView) + '&lang=' + this.getLanguage();
        //var url:string = this.apiUrl+'profile/password?from=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + '/') + '&lang=' + this.getLanguage();
        return url;
    }
    getProfileUrl (fromWhichView?:any){
        if(fromWhichView){
            fromWhichView=decodeURIComponent(fromWhichView);
        }else{
            fromWhichView='/';
        }
        var url:string = this.accountApiUrl+'profile/profile?from=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + fromWhichView) + '&lang=' + this.getLanguage();
        //var url:string = this.apiUrl+'profile/profile?from=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + '/') + '&lang=' + this.getLanguage();
        return url;
    }
    getSiteUrl (){
        var url:string;
        if (this.getLanguage() == 'zh-CN') {
            url = 'https://www.foxitsoftware.cn/';
        }else{
            url = 'https://www.foxitsoftware.com/';
        }
        return url;
    }
    getPrivacyUrl (){
        var url:string = 'https://www.connectedpdf.com/privacy.html';
        //if (this.getLanguage() == 'zh-CN') {
        //    url = 'https://www.foxitsoftware.cn/company/privacy.php';
        //}else{
        //    //url = 'https://www.foxitsoftware.com/company/privacy-policy.php';
        //    url = '/privacy-policy';
        //}
        url = '/privacy-policy';
        return url;
    }

    getTermsUrl (){
        var url:string = 'https://www.connectedpdf.com/terms.html';
        //if (this.getLanguage() == 'zh-CN') {
        //    url = 'https://www.foxitsoftware.cn/products/reader/eula.html';
        //}else{
        //    //url = 'https://www.foxitsoftware.com/company/privacy-policy.php';
        //    url = '/term-of-use';
        //}
        url = '/term-of-use';
        return url;
    }

  /**
   * official site phantom page
   * @returns {string}
   */
  getPdfEditorUrl (){
        var url:string = 'https://www.foxitsoftware.com/pdf-editor/';
        if (this.getLanguage() == 'zh-CN') {
            url = 'https://www.foxitsoftware.cn/pdf-editor/';
        }
        return url;
    }

  private setSubscriptionSwitch () {
    return true;
    //let href = location.href;
    //if (/(docker)|(localhost)|(demo2)|(pdfeditor)/.test(href)) {
    //  return true;
    //}
    //return false;
  }
}
