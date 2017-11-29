import { Component, OnInit, ViewChild, Input, EventEmitter,AfterViewInit, NgZone} from '@angular/core';

import { SignFormComponent } from '../modals/sign-form/sign.component';
import { UserService, GlobalService, AuthenticationService } from '../../services/index';
import {User} from "../../models/user";
import {SharedService} from "../../services/shared.service";
import {ProgressBarService} from '../../services/progressbar.service'
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import { ActivatedRoute , Router} from '@angular/router';
import { MethodNeedLoginDecorator } from '../../app.methodNeedLogin.decorator'
import { OpenFileComponent } from '../open-file/open-file.component'
import {SharedWithMeComponent} from "../../modules/share/shared-with-me.component";
import {MobileIndexComponent} from "../mobile-index/mobile-index.component";
import {MobileLeftPanelComponent} from "../mobile-left-panel/mobile-left-panel.component";
declare var window: any;
declare var $: any;
declare var ga: any;

@Component({
    moduleId: module.id,
    selector: 'page-header',
    templateUrl: "./header.html",
    styleUrls:['./header.css']
})
export class PageHeaderComponent implements OnInit,AfterViewInit{
    public status: {isopen: boolean} = {isopen: false};
    public PDFTitle: any='';
    public PDFExtension: any='';
    public needAdjustWidth:boolean=false;
    public webLogoTitle:string;
    public foxitOnlineLogo:string;
    public classForBetaSpan:string = '';
    public baseUrlIsPDFEditor:boolean;
    public isMobile:boolean;
    public foxitDriveInterface:any;
    public showSortByList:boolean=false;
    public currentView:any;
    public listSortBy:any;
    public showSearchBar:boolean=false;
    public trStyle:boolean=false;
    public homepageLogo:any='';
    public searchKeyword:any='';
    @Input() currentUser: User;
    @ViewChild(SignFormComponent) public signModal:SignFormComponent;
    constructor(
        private authenticationService:AuthenticationService,
        private sharedService: SharedService,
        public globalService: GlobalService,
        private router: Router,
        private zone:NgZone,
        private progressbarService:ProgressBarService,
        public userService: UserService,
        private location:Location,
        private translate:TranslateService
    ) {
        console.log('=====here')
        var __this = this;
        this.isMobile=this.globalService.getDevice()==='mobile';
        this.baseUrlIsPDFEditor = this.globalService.baseUrlIsPDFEditor;
        this.sharedService.on('login-event', (event:any) => {
            console.log("Login event");
            __this.zone.run(()=> {
                __this.currentUser = event.data;
            });
            if(window.location.href.indexOf('?')>-1){
                var urlObj = this.globalService.urlParaToObj(window.location.href.split('?')[1]);
            }
            console.log('====urlObj===');
            console.log(urlObj);
            localStorage.setItem('userInfo',JSON.stringify(event.data));
            if(urlObj && urlObj.redirect_url){
                setTimeout(function(){
                    __this.router.navigate([decodeURIComponent(urlObj.redirect_url)]);
                });
                //
                //window.location.href=__this.globalService.getSiteOrigin()+decodeURIComponent(urlObj.redirect_url);
            }
        });
        this.sharedService.on('showSignUpModal', (event:any) => {
            this.showSignUpModal();
        });

        this.sharedService.on('showSignInModal', (event:any) => {
            this.showSignInModal();
        });
        this.sharedService.on('foxit-drive-onload', (event:any) => {
            this.globalService.foxitDriveLoaded=true;
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            if(this.foxitDriveInterface){
                this.trStyle = this.foxitDriveInterface.trStyle;
            }
            //console.log('######qqq')
            //console.log(qqq);
        });

        window.angularHeaderComponent = {
            zone: this.zone,
            showSignInModal: (phantomLoginSwitchIsOn?:boolean) => this.showSignInModal(phantomLoginSwitchIsOn),
            showSignUpModal: () => this.showSignUpModal(),
            signOut: (force:boolean = true) => this.signOut(force),
            changeRouter: (router: any) => this.changeRouter(router),
            navigateByUrl: (url: string) => this.navigateByUrl(url),
            goBack: (goBackNotRoot:any) => this.goBack(goBackNotRoot),
            closeDropdown: () => this.closeDropdown(),
            changeLanguage: (lang:any)=> this.changeLanguage(lang),
            setPDFTitle:(title:any) => this.setPDFTitle(title),
            getAppOrOpenInApp:(params:any) => this.getAppOrOpenInApp(params),
            getLastFile:() => this.globalService.inputFile,
            openProfileUrl:() => this.openProfileUrl(),
            openUpdatePswUrl:() => this.openUpdatePswUrl(),
            openFeedBackUrl:() => this.openFeedBackUrl(),
            setPageTitle:() => this.setPageTitle(),
            openAds:(trackId: string) => this.openAds(trackId),
            hideHeader:() => this.hideHeader(),
            closeDropdowns: ()=> this.closeDropdowns(),
            component: this,
            clearFoxitDriveSelection: ()=> this.clearFoxitDriveSelection(),
            isPhantomOnlineMode:() => this.isPhantomOnlineMode(),
            getUserPhantomOnlineSubscription:() => this.getUserPhantomOnlineSubscription(),
            showSignModalFromLogin:(type:any,email:any) => this.showSignModalFromLogin(type,email),
            showWebToolFn:(toolName:any,fromFoxitDrive:any)=>this.showWebToolFn(toolName,fromFoxitDrive),
            foxitDriveLoaded:()=>this.foxitDriveLoaded(),
          isProdEnv:() => this.isProdEnv(),
          isCNProEnv:() => this.isCNProEnv(),
          isEnterprise:() => this.isEnterprise(),
        };
        this.setLogo();
        this.sharedService.on('change-language',(event:any)=>{
            this.setLogo();
        });

    }
    public foxitDriveLoaded(){
        this.sharedService.broadcast({
            name:'foxit-drive-onload'
        });
    }
    public showWebToolFn(toolName:any,fromFoxitDrive:boolean){
        this.sharedService.broadcast({
            name:'showWebToolModal',
            modeName:toolName,
            fromFoxitDrive:true
        })
    }
    public changeLanguage(lang:any){
        this.sharedService.broadcast({
            name:'change-language',
            lang:lang || 'en-US'
        })
    }
    public hideHeader(){
        this.globalService.showHeader=false;
    }
    public clearSearchInput(){
        this.searchKeyword='';
    }
    setPageTitle(){
        this.translate.get(['Foxit Online', 'Foxit Reader Online']).subscribe((res: any) => {
            let title:string;
            if (this.globalService.isMobile) {
                title = res['Foxit Reader Online']
            } else if (this.globalService.baseUrlIsPDFEditor) {
                title = res['Foxit Online'];
            } else {
                title = res['Foxit Reader Online'];
            }
            document.title = title;
        });
    }
    public setLogo() {
        let isZh = this.globalService.getLanguage() === 'zh-CN';
        if(isZh){
            this.foxitOnlineLogo = 'logo_foxit-online_zh-CN.png';
            this.homepageLogo = 'logo_homepage_zh-CN.png'
        }else{
            this.foxitOnlineLogo = 'logo_foxit-online_en-US.png';
            this.homepageLogo = 'logo_homepage_en-US.png'
        }
        if (this.globalService.baseUrlIsPDFEditor){
            this.webLogoTitle = 'PhantomPDF Online';
            if (isZh) {
                this.foxitOnlineLogo = 'logo_foxit-online_zh-CN.png';
            } else {
                this.foxitOnlineLogo = 'logo_foxit-online_en-US.png';
            }
        }else{
            this.webLogoTitle = 'Foxit Reader Online';
            this.classForBetaSpan = 'hide';
            if (isZh) {
                //this.foxitOnlineLogo = 'logo_foxit-reader-online_zh-CN.png';
                this.foxitOnlineLogo = 'logo_foxit-online_zh-CN.png';
            } else {
                //this.foxitOnlineLogo = 'logo_foxit-reader-online_en-US.png';
                this.foxitOnlineLogo = 'logo_foxit-online_en-US.png';
            }
        }
    }
    public getFoxitDriveInterface(){
        var iframe:any = document.getElementById('cloud-reading-iframe');
        console.log(iframe)
        if(iframe && iframe.contentWindow && iframe.contentWindow.CloudReading){
            return iframe.contentWindow.CloudReading;
        }else{
            return null
        }

    }
    public clearFoxitDriveSelection(){
        var foxitDriveInterface:any=this.getFoxitDriveInterface();
        if (foxitDriveInterface){
            console.log(foxitDriveInterface);
            foxitDriveInterface.$timeout(function(){
                foxitDriveInterface.clearSelection();
                foxitDriveInterface.$scope.$apply();
            })
        }
    }
    public showSignModalFromLogin(type:any, email:any):void {
        this.signModal.model.email = email;

        var timeout:any = 100;
        if (this.globalService.currentUserEmail) { // logged in
            console.log(this.globalService.currentUserEmail);
            this.signOut(true);
            timeout = 1000;
        }

        // 1  弹出 sign in 界面
        if (type == '1'){
            var __this = this;
            setTimeout(function(){
                __this.signModal.showSignInModal();
            },timeout);
        }else{
            this.signModal.showSignUpModal();
        }
    }
    refreshList (){
        console.log(this.router.url);
        if(this.router.url==='/shared-with-me'){
            //this.shareWithMe.refresh();
            this.sharedService.broadcast({
                name:'refresh-list'
            });
        }else if(this.router.url==='/foxit-drive'){

            this.foxitDriveInterface = this.getFoxitDriveInterface();
            if(this.foxitDriveInterface){
                console.log(this.foxitDriveInterface);
                this.foxitDriveInterface.$timeout(()=>{
                    this.foxitDriveInterface.refreshCurFolderList()
                })
            }
        }
    }
    refreshSharedList () {
      this.sharedService.broadcast({
        name:'refresh-shared-list'
      });
    }
    showLeftPanel (){
        this.sharedService.broadcast({
            name:'open-mobile-left-panel'
        });
    }
    search (){
        //alert('search');
        if(this.router.url==='/shared-with-me'){

            //this.shareWithMe.refresh();
            //this.sharedService.broadcast({
            //    name:'refresh-list'
            //});
        }else if(this.router.url==='/foxit-drive'){
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            if(this.foxitDriveInterface){
                console.log(this.foxitDriveInterface);
                this.foxitDriveInterface.$timeout(()=>{
                    this.foxitDriveInterface.search(null,null,'type=all&title='+this.searchKeyword);
                })
                this.globalService.searchMode=false;
            }
        }
    }
    public showSearchBarFn (){
        this.showSearchBar=true;
        this.globalService.searchMode=true;
    }
    public searchBarCancelBtnFn (){
        this.showSearchBar=false;
        this.globalService.searchMode=false;
        this.foxitDriveInterface = this.getFoxitDriveInterface();
        if(this.foxitDriveInterface){
            console.log(this.foxitDriveInterface);
            this.foxitDriveInterface.$timeout(()=>{
                this.foxitDriveInterface.cancelSearch();
            })
        }
    }
    sortBy (listBy:any){
        //alert('sortBy');



        if(this.router.url==='/shared-with-me'){

            //this.shareWithMe.refresh();
            //this.sharedService.broadcast({
            //    name:'refresh-list'
            //});
        }else if(this.router.url==='/foxit-drive'){
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            if(this.foxitDriveInterface){
                console.log(this.foxitDriveInterface);
                this.foxitDriveInterface.$timeout(()=>{
                    this.foxitDriveInterface.changeSort(listBy)
                    if(this.listSortBy === listBy){
                        this.listSortBy='-'+listBy;
                    }else{
                        this.listSortBy=listBy;
                    }
                })
            }
        }
    }
    closeDropdowns (){
        this.closeSortByList()
    }
    toggleSortByList (event?:any){
        if(event){
            event.stopPropagation();
            event.preventDefault();
        }
        if(this.router.url==='/shared-with-me'){
            //this.shareWithMe.refresh();
            //this.sharedService.broadcast({
            //    name:'refresh-list'
            //});
            this.currentView='shared-with-me';
        }else if(this.router.url==='/foxit-drive'){
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            this.currentView='foxit-drive';

            if(this.foxitDriveInterface){
                console.log(this.foxitDriveInterface);
                this.listSortBy = this.foxitDriveInterface.folderOrderBy;
                //this.foxitDriveInterface.$timeout(()=>{
                //    this.foxitDriveInterface.changeDocShowStyle()
                //})
            }
        }
        this.showSortByList=!this.showSortByList;
    }
    closeSortByList (){
        this.showSortByList=false;
    }
    changeListView (viewType:any){
        // viewType : list  large-thumbnail
        //alert('changeView');
        if(this.router.url==='/shared-with-me'){
            //this.shareWithMe.refresh();
            //this.sharedService.broadcast({
            //    name:'refresh-list'
            //});
        }else if(this.router.url==='/foxit-drive'){
            this.foxitDriveInterface = this.getFoxitDriveInterface();
            if(this.foxitDriveInterface){
                this.trStyle=!this.trStyle;
                this.foxitDriveInterface.$timeout(()=>{
                    this.foxitDriveInterface.changeDocShowStyle();
                })
            }
        }

    }

    ngOnInit() {
        $(window).on('blur',function(e:any) {
            window.angularHeaderComponent.zone.run(()=>
                window.angularHeaderComponent.closeDropdown()
            );
        });
        $(window).on('click',function(e:any) {
            window.angularHeaderComponent.zone.run(()=>
                window.angularHeaderComponent.closeDropdown()
            );
        });
        // test pdf title
        //window.angularHeaderComponent.zone.run(()=>
        //    window.angularHeaderComponent.setPDFTitle('我真的是一个帅帅的中国人哦哈哈哈哈哈 .pdf')
        //);
    }
    ngAfterViewInit() {
        var __this=this;
        // contentChild is updated after the content has been checked
        // angularjs2 hook https://angular.io/guide/lifecycle-hooks
        $('header').click(function(){
            __this.clearFoxitDriveSelection();
        })
    }

    openclient(params:any) {
        var ua = navigator.userAgent.toLowerCase();
        //var isSafari = ua.indexOf('chrome') ===-1 && ua.indexOf('safari')!==-1;

        //// /////
        //// https://jira.foxitsoftware.cn/browse/MOB-1786
        //// 回调参数定义：
        //// FoxitMobilePDF://endpoint-xxxx/cmisid-xxxx/filename-xxxx/useremail-xxxx 直接下载该文档并打开
        //// FoxitMobilePDF://endpoint-xxxx/foxit-drive/useremail-xxxx 直接进入foxit-drive界面
        //// FoxitMobilePDF://default 进入app默认界面
        //// /////

        var config = {
            /*scheme:必须*/
            scheme_IOS: 'FoxitMobilePDF://',
            scheme_Adr: '',
            download_ios_free_url: 'itms-apps://itunes.apple.com/app/id507040546',
            download_ios_url: 'itms-apps://itunes.apple.com/app/id866909872',
            download_android_url: 'https://play.google.com/store/apps/details?id=com.foxit.mobile.pdf.lite',
            download_android_cn_url: 'https://www.foxitsoftware.cn/products/mobilereader/?trackingId=download_apk',
            timeout: 600
        };
        var startTime = Date.now();
        var ifr = document.createElement('iframe');
        //ifr.src = ua.indexOf('os') > 0 ? config.scheme_IOS+params['path'].slice(1) : config.scheme_Adr+params['path'].slice(1);

        var scheme_IOS:any=config.scheme_IOS+'';

        var endpoint:any=this.globalService.cwsApiUrl;
        var fileName:any=params&&params.fileName || '';
        var cmisId:any=params&&params.cmisId || '';

        if(this.router.url.indexOf('foxit-drive')!==-1){
            scheme_IOS = config.scheme_IOS+'endpoint-'+endpoint+'foxit-drive/useremail-'+this.globalService.currentUserEmail;
        }else if(this.router.url.indexOf('preview')!==-1){
            scheme_IOS = config.scheme_IOS+'endpoint-'+endpoint+'cmisid-'+cmisId+'/filename-'+fileName+'/useremail-'+this.globalService.currentUserEmail;
        }else{
            scheme_IOS = config.scheme_IOS+'default';
        }
        console.log('=====scheme_IOS====');
        console.log(scheme_IOS);
        ifr.src = ua.indexOf('os') > 0 ? scheme_IOS : config.scheme_Adr;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        var t = window.setTimeout(function() {
            var endTime = Date.now();
            if (!startTime || endTime - startTime < config.timeout + 200) { //如果装了app并跳到客户端后，endTime - startTime 一定> timeout + 200
                // 中国区
                if(window.location.href.indexOf('foxitsoftware.cn')){
                    window.location = ua.indexOf('os') > 0 ? config.download_ios_free_url : config.download_android_cn_url;
                }else{
                // 非中国区
                    window.location = ua.indexOf('os') > 0 ? config.download_ios_free_url : config.download_android_url;
                }
            }
        }, config.timeout);

        window.onblur = function() {
            window.clearTimeout(t);
        }
    }
    public getAppOrOpenInApp(params:any){
        //var params={
        //    path:this.router.url
        //};
        //console.log(this.router.url);
        this.openclient(params);
        //window.addEventListener("DOMContentLoaded", function(){
        //    document.getElementById("J-call-app").addEventListener('click',this.openclient,false);
        //
        //}, false);
    }

  public isProdEnv (){
    return this.globalService.isProdEnv();
  }

  public isCNProEnv () {
    return this.globalService.isCNProEnv();
  }

  public isEnterprise (){
    return this.globalService.hideSignUp;
  }

    public setPDFTitle (title?:any){
        var titleWidth = $('<span id="temp-calculate-width" style="z-index: -9999;position: relative;">'+title+'</span>').appendTo('body').width()
        if(title==''){
            this.PDFTitle='';
            this.PDFExtension='';
        }else{
            this.PDFTitle = title.slice(0,title.lastIndexOf('.'));
            this.PDFExtension = title.slice(title.lastIndexOf('.'));
        }
        if(titleWidth && titleWidth>324){
           this.needAdjustWidth=true;
        }else{
            this.needAdjustWidth=false;
        }
        $('#temp-calculate-width').remove();

    }
    public openProfileUrl (){
        var profileUrl = this.globalService.getProfileUrl();
        var token = this.globalService.currentUserToken;
        var url =this.globalService.accountApiUrl+'site/login?access-token='+token+'&to='+encodeURIComponent(profileUrl);
        this.globalService.sendGaEvent('phantomPDF online web','profile','profile');
        window.open(url,'_blank',"menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
        return false;
    }
    public openUpdatePswUrl (){
        var updatePsw = this.globalService.getUpdatePasswordUrl();
        var token = this.globalService.currentUserToken;
        var url = this.globalService.accountApiUrl+'site/login?access-token='+ token +'&to='+encodeURIComponent(updatePsw);
        this.globalService.sendGaEvent('phantomPDF online web','update-password','update-password');
        window.open(url,'_blank',"menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
        return false;
    }
    public openFeedBackUrl(){
        var url = 'http://feedback.debenu.com/forums/595774-phantompdf-reader-online/';
        this.globalService.sendGaEvent('phantomPDF online web','feedback','feedback');
        window.open(url,null,null);
        return false;
    }
    public goBack(goBackNotRoot:any):void{
        if(this.globalService.isFirstPage || window.location.href.indexOf('preview/url')>-1){
            this.router.navigate(['/']);
        }else{
            this.location.back()
        }
    }
    public changeRouter(router: any):void{
        this.setPDFTitle('');
        this.router.navigate(router);

    }
    public openNewPage(router:any):void{
        // 暂时 appstore 没有合并过来 合并过来 下面的 app-store 代码可以删除
        if(router === 'app-store'){
            window.open('https://cloud.connectedpdf.com/appstore/app-list');
        }else if(router === 'site'){
            var siteUrl=this.globalService.getSiteUrl();
            window.open(siteUrl);
        }else if(router === 'privacy'){
            var privacyUrl = this.globalService.getPrivacyUrl()
            window.open(privacyUrl);
        }else{
            this.router.navigate([router]);
        }
    }

    public navigateByUrl(url: string):void{
        this.setPDFTitle('');
        this.router.navigateByUrl(url);
    }

    public changeToRouter(router: any):void{
        var __this=this;
        var iframe:any = document.getElementById('preview-frame');
        if(iframe && iframe.contentWindow && iframe.contentWindow.WebPDF && iframe.contentWindow.WebPDF.onBeforeLeave ){
            var userId =this.globalService.currentUser && this.globalService.currentUser.user_id || null;
            iframe.contentWindow.WebPDF.onBeforeLeave(userId , (isLeave:any)=>{
                if(isLeave){
                    window.angularHeaderComponent.zone.run(()=>{
                        window.parent.angularHeaderComponent.setPDFTitle('');
                        __this.router.navigate([router]);
                    })
                }
            })
        }else{
            window.angularHeaderComponent.zone.run(()=>{
                // same router then reload the page
                if(this.router.url === router){
                    window.location.reload();
                }else{
                    __this.router.navigate([router]);
                }
            })
        }
    }
    public closeDropdown($event?: MouseEvent): void {
        this.status.isopen = false;
    }
    public toggleDropdown($event?: MouseEvent): void {
        //this.status.isopen = true;
        if($event){
            $event.preventDefault();
            $event.stopPropagation();
        }
        this.status.isopen = !this.status.isopen;
    }
    public showSignInModal(phantomLoginSwitchIsOn?:boolean):void {
        this.signModal.showSignInModal(phantomLoginSwitchIsOn);
    }

    public showSignUpModal():void {
        this.signModal.showSignUpModal();
    }

    public signOut(force:boolean = true, logout_from_cas:boolean = true):void {
        console.log('==== signOut ====' + force + logout_from_cas);
        this.globalService.sendGaEvent('phantomPDF online web','sign-out','sign-out');

        //if (force == null) {
        //    force = true;
        //}
        if(document.getElementById('preview-frame') && !force){
            console.log("send logout-before-event");
            this.sharedService.broadcast({
                name: 'logout-before-event'
            });
        }else{
            this.authenticationService.signOut();
            this.currentUser = null;
            this.sharedService.broadcast({
                name: 'logout-event'
            });

            if (logout_from_cas && this.globalService.useCasLogin()) {
                var service:string = window.location.href;
                if(document.getElementById('preview-frame')!==null){
                    if(this.globalService.isMobile){
                        service=this.globalService.getSiteOrigin();
                    }
                }
                if(service.indexOf('?siteaction')>-1){
                    service = service.replace(/\?siteaction.*/g,'')
                }
                var cas_url:string = this.userService.getCasSiteLogoutUrl() + '?service=' + encodeURIComponent(service);
                window.location.href = cas_url;
            }
        }

    }
    public openAds(trackId:string){
        //this.sharedService.broadcast({
        //    name:'change-language',
        //    lang:'en-US'
        //})
        this.globalService.openAds(trackId);
    }

    public isPhantomOnlineMode(){
        return this.globalService.isPhantomOnlineMode();
    }

  public getUserPhantomOnlineSubscription(){
        return {
            userPhantomOnlineSubscription:this.userService.userPhantomOnlineSubscription,
            userSubscription:this.userService.userSubscription,
            userWebToolsSubscription:this.userService.userWebToolsSubscription,
            userIsNeedDownloadClient:!this.userService.userHasDownloadClient
        };
    }

  public showSubscriptionDialog () {
    try {
      window.angularMainComponent.showSubscriptionDialog({source: 'online', tabName: 'right'});
    } catch (ex) {}
    this.globalService.sendGaEvent('Subscribe', 'online_subscribe_right', '');
  }
  enterRightTopSubscriptionAD ($event:any) {
    try {
      let target:any = $event.target;
      let width = window.innerWidth || document.body.clientWidth;
      window.angularMainComponent.enterRightTopSubscriptionAD({
        right: (width - (target.offsetLeft + target.offsetWidth)) + 'px',
        top: (target.offsetTop + target.offsetHeight + 10) + 'px'
      })
    } catch (ex) {}
  }
  leaveRightTopSubscriptionAD () {
    try {
      window.angularMainComponent.leaveRightTopSubscriptionAD()
    } catch (ex) {}
  }
}
