import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { User } from '../models/user';
import { GlobalService } from './global.service';
import { CookieService } from 'angular2-cookie/core';
import { ActivatedRoute , Router} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {
  public serverStatus:any;
  private userInfoMap:any = {};
  private userInfoObserveMap:any = {};

  /**
   * UserService.userPhantomOnlineSubscription
   * 用户的 phantom online 订阅数据.
   *
   * 用户登录成功时 以及 登录用户刷新页面时 会获取此数据,
   * 如果用户还没有订阅记录, 那么我们会自动帮用户开启 14 天的免费试用,
   * 如果 current_timestamp 和 phantom_online_trial_start_timestamp 的值是相等的, 说明刚刚自动帮用户开启 14 天的免费试用（注意 PRO-3163 可以以此进行判断）.
  {
    "isSubscribed": true, // 用户是否持有有效的 phantompdf 订阅记录, 可能是用户自己订阅或购买的, 也可能是某个组织的管理员订阅或购买 并把用户加入到这个组织的, 也可能是用户使用 永久key 兑换得到的订阅记录
    "subscribedApp": ***, // 可能是 phantom_ga_business_org, phantom_ga_business, phantom_ga_standard_org, phantom_ga_standard, ...
    "phantom_online_trial_start": "2017-09-12 14:06:23", // 用户phantom online 免费试用开始的时间字符串
    "phantom_online_trial_start_timestamp": 1505225183, // 用户phantom online 免费试用开始的时间戳 //1511769600
    "current_timestamp": 1505225183, // userPhantomOnlineSubscription 数据更新时间
    "remain_days": 14, // 用户phantom online 免费试用剩余的天数, 总数是14天
    "can_use_paid_service": true // 用户能使用phantom online 高级付费功能吗, 是这样算出来的: (isSubscribed || remain_days >0)
  }
  */
  public userPhantomOnlineSubscription:any;
  public userWebToolsSubscription:any;
  public userSubscription:any;
  public userHasDownloadClient:boolean = true;

    constructor(
      private http: Http,
      private cookieService: CookieService,
      private router: Router,
      private globalService: GlobalService
    ) {
      console.log('--UserService constructor--');
    }
    private token:string;
    getCurrentInfo (token:string = ''){
        this.token = token;
        var url:string = this.globalService.apiUrl + 'api/auth/get_user_info?' + (new Date()).valueOf();
        //noinspection TypeScriptUnresolvedFunction
        return this.http.get(url, this.jwt(url))
            .map(
                (response:Response) => {
                    let data = response.json();
                    if (data.ret == 0) {
                        this.globalService.currentUser = data.data;
                        this.globalService.currentUserEmail = data.data.email;
                    } else {
                      console.log("getCurrentInfo failed, data: ");
                      console.log(data);
                      if (data.ret == 100007 && this.globalService.useCasLogin()) { // the token in cookie (globalService.currentUserToken) is not valid.
                        var check_cas_route = "/check-cas/" + encodeURIComponent(window.location.pathname);
                        console.log("check_cas_route " + check_cas_route);
                        this.router.navigateByUrl(check_cas_route);

                      }
                    }
                    return data;
                }
            );
    }

    getAccessTokenBySt (ticket:string = ''){
        //noinspection TypeScriptUnresolvedFunction
        return this.http.get(this.getApiUrl_4_access_token_by_st(ticket))
					.map(
            (response:Response) => {
                let data = response.json();
                return data;
            }
          );
    }

  getApiUrl_4_access_token_by_st (ticket:string = '', service:string = ''){
    if (service == '') {
      service = this.getServiceForCas();
    }
    var url:string = this.globalService.apiUrl + 'api/auth/access-token-by-st?'+(new Date()).valueOf()+'&casTicket='+ ticket+'&casService='+ encodeURIComponent(service);
    return url;
  }

  getApiUrl_4_get_user_info (token:string){
    var url:string = this.globalService.apiUrl + 'api/auth/get_user_info?' + (new Date()).valueOf()+'&access-token='+token;
    return url;
  }

  /**
   *
   * @returns {string}
   * https://cas-vagrant.foxitsoftware.com/
   */
  private getCasDomain (){
    return this.globalService.accountApiUrl.replace('appstore', 'cas');
    //return this.globalService.apiUrl.replace('cloud', 'cas');
    /*
    var domain = this.globalService.apiUrl.replace('cloud', 'reader');
    var currentDomain = window.location.protocol+"//"+window.location.host+"/"; // e.g., Might be https://pdfeditor-demo2.connectedpdf.com/

    if (domain != currentDomain && currentDomain.indexOf("localhost") == -1) {
      domain = currentDomain;
    }

    return domain;
    */
  }

  /**
   * Deprecated
   * @returns {string}
   */
  //getCasApiUrl (){
  //  return this.getCasDomain() + 'cas/v1/login?'+(new Date()).valueOf();
  //}
  getCasSiteUrl (){
    var lang_for_cas:string = this.globalService.getLanguage().replace('-', '_'); // https://confluence.foxitsoftware.com/pages/viewpage.action?pageId=13490357
    return this.getCasDomain() + 'cas/login?al=' + lang_for_cas+'&als='+this.globalService.getLanguage();
  }

  getCasSiteLogoutUrl (){
    return this.getCasDomain() + 'cas/logout';
  }

  getServiceForCas (){
    var service = this.globalService.webpdfApiUrl.replace('/webpdf/', '/');
    return service;
  }

  getSiteMatainUrl (){
    var url = this.globalService.apiUrl + 'site/matain';
    return url;
  }

  getServerStatus (){
    var url:string = this.globalService.apiUrl + 'api/auth/get-server-status?' + (new Date()).valueOf();
    return this.http.get(url)
      .map(
        (response:Response) => {
          let data = response.json();
          console.log('getServerStatus:');
          console.log(data);
          return data;
        }
      );
  }

  getUserPhantomOnlineSubscription (token: string){
    var url:string = this.globalService.apiUrl + 'api/appstore/get-user-phantom-online-subscription?' + (new Date()).valueOf() + '&access-token=' + token;
    return this.http.get(url)
      .map(
        (response:Response) => {
          let data = response.json();
          console.log('getUserPhantomOnlineSubscription:');
          console.log(data);
          return data;
        }
      );
  }

  getUserPhantomProductSubscription(token: string){
    var __this=this;
    __this.userHasDownloadClient = true;
    var isWindowPC = this.globalService.isWindowPC();

    var url:string = this.globalService.apiUrl + 'api/appstore/app/my?' + (new Date()).valueOf() + '&access-token=' + token;
    return this.http.get(url).map(
        (response:Response) => {
          var _userHasDownloadClient = false;
          let arrData:Array<any> = response.json();
          let subscription = response.json();
          __this.userSubscription = subscription;
          //let data:any = {ret:-1,data:null};
          for (let one of arrData){
            if((one.button_id == 'phantom_ga_standard_org' ||
                one.button_id == 'phantom_ga_business' ||
                one.button_id == 'phantom_ga_standard'
              ) && one.subscription){
              _userHasDownloadClient = true;
              //break;
            } else if(one.button_id == 'WebTools_PDF_Compressor' && one.subscription){
              //data.data = one;
              //data.ret = 0;
              __this.userWebToolsSubscription = one;
              //break;
            }
          }
          //__this.userHasDownloadClient = _userHasDownloadClient;

            __this.userHasDownloadClient = isWindowPC? _userHasDownloadClient :true;
          //console.log('getUserPhantomProductSubscription:');
          //console.log(data);
          return __this.userHasDownloadClient;
        });
  }

  getUserWebToolsSubscription (token: string){
    var __this=this;
    var url:string = this.globalService.apiUrl + 'api/appstore/app/my?' + (new Date()).valueOf() + '&access-token=' + token;
    return this.http.get(url)
      .map(
        (response:Response) => {
          let arrData:Array<any> = response.json();
          let subscription = response.json();
          __this.userSubscription = subscription;
          let data:any = {ret:-1,data:null};
          for (let one of arrData){
            if(one.button_id == 'WebTools_PDF_Compressor' && one.subscription){
              data.data = one;
              data.ret = 0;
              break;
            }
          }

          console.log('getUserWebToolsSubscription:');
          console.log(data);
          return data;
        }
      );
  }

  decryptUser (encrypted_user: string, email:string){
    var url:string = this.globalService.cwsApiUrl + 'cpdfapi/v2/server/decryptUser';
    return this.http.post(url, { encrypted_user: encrypted_user, email: email })
      .map(
        (response:Response) => {
          let data = response.json();
          console.log('decryptUser:');
          console.log(data);
          return data;
        }
      );
  }



    private jwt(url:string) {
        // create authorization header with jwt token
        let currentToken = this.token ? this.token : this.globalService.currentUserToken;
        if (currentToken) {
            if(url.indexOf('?')){
                url += '&access-token=' + currentToken;
            }else{
                url += '?access-token=' + currentToken;
            }
            return new RequestOptions({ url: url});
        }
    }

  getUserInfoByEmail (email: string) {
    let token:string = this.token || this.globalService.currentUserToken;
    if (!token) {
      return Observable.throw('')
    }
    let userInfoMap = this.userInfoMap[token] = this.userInfoMap[token] || {};
    if (userInfoMap[email]) {
      return Observable.of(userInfoMap[email]);
    }
    let userInfoObserveMap = this.userInfoObserveMap[token] = this.userInfoObserveMap[token] || {};
    if (userInfoObserveMap[email]) {
      return userInfoObserveMap[email];
    }
    let url = this.globalService.apiUrl + 'api/v3/user/' + encodeURIComponent(email) + '?access-token=' + token;
    return userInfoObserveMap[email] = this.http.get(url).map((res:Response) => {
      let data = res.json();
      userInfoMap[email] = data;
      return data;
    });
  }
}
