import { Component, OnInit, ViewChild, Input, EventEmitter, NgZone,AfterViewInit,AfterContentChecked} from '@angular/core';

import { SignFormComponent } from '../modals/sign-form/sign.component';
import { UserService, GlobalService, AuthenticationService } from '../../services/index';
import {User} from "../../models/user";
import {SharedService} from "../../services/shared.service";
import {ProgressBarService} from '../../services/progressbar.service'
import {Location} from '@angular/common';
import { ActivatedRoute , Router} from '@angular/router';
import { MethodNeedLoginDecorator } from '../../app.methodNeedLogin.decorator'
import { OpenFileComponent } from '../open-file/open-file.component'
import {SharedWithMeComponent} from "../../modules/share/shared-with-me.component";
declare var window: any;
declare var $: any;
declare var ga: any;

@Component({
    moduleId: module.id,
    selector: 'mobile-left-panel',
    templateUrl: "./mobile-left-panel.html",
    styleUrls:['./mobile-left-panel.css']
})
export class MobileLeftPanelComponent implements OnInit,AfterViewInit,AfterContentChecked {
    @Input() currentUser: User;
    public init:boolean=false;
    public showMobilePanel:boolean=false;
    public showProfile:boolean=false;
    public foxitOnlineLogo:any='';
    public isQQBrowser:boolean=false;
    constructor(
        private authenticationService:AuthenticationService,
        private sharedService: SharedService,
        public globalService: GlobalService,
        private router: Router,
        private zone:NgZone,
        private progressbarService:ProgressBarService,
        private userService: UserService,
        private location:Location
    ) {
        var __this = this;
        if(window.navigator.userAgent.toLocaleLowerCase().indexOf('mqqbrowser')>-1){
            this.isQQBrowser=true;
        }
        this.sharedService.on('login-event', (event:any) => {
            console.log("Login event");
            __this.zone.run(()=> {
                __this.currentUser = event.data;
                this.globalService.currentUser=__this.currentUser;
            });
            localStorage.setItem('userInfo',JSON.stringify(event.data));
        });
        this.sharedService.on('showSignUpModal', (event:any) => {
            //this.showSignUpModal();
        });

        this.sharedService.on('showSignInModal', (event:any) => {
            //this.showSignInModal();
        });
        this.sharedService.on('open-mobile-left-panel',(event:any) =>{
            this.openLeftPanel();
        })
        this.setLogo();
    }
    public showSignModalFromLogin(type:any, email:any):void {

    }
    public signIn(){
        this.sharedService.broadcast({
            name: 'showSignInModal'
        })
    }
    public setLogo() {
        let isZh = this.globalService.getLanguage() === 'zh-CN';
        if (isZh) {
            this.foxitOnlineLogo = 'logo_foxit-reader-online_zh-CN.png';
        } else {
            this.foxitOnlineLogo = 'logo_foxit-reader-online_en-US.png';
        }
        //if (this.globalService.baseUrlIsPDFEditor){
        //    //this.webLogoTitle = 'PhantomPDF Online';
        //    if (isZh) {
        //        this.foxitOnlineLogo = 'logo_foxit-online_zh-CN.png';
        //    } else {
        //        this.foxitOnlineLogo = 'logo_foxit-online_en-US.png';
        //    }
        //}else{
        //    //this.webLogoTitle = 'Foxit Reader Online';
        //    //this.classForBetaSpan = 'hide';
        //    if (isZh) {
        //        this.foxitOnlineLogo = 'logo_foxit-reader-online_zh-CN.png';
        //    } else {
        //        this.foxitOnlineLogo = 'logo_foxit-reader-online_en-US.png';
        //    }
        //}
    }
    public openLeftPanel (){
        this.init=true;
        this.showMobilePanel=true;
    }
    public closeLeftPanel (){
        this.showMobilePanel=false;
    }
    public openProfile() {
        this.showProfile=true;
    }
    public closeProfile() {
        this.showProfile=false;
    }
    public changeRoute(target:any) {
        this.closeLeftPanel();
        this.router.navigate([target]);
    }
    public openProfileUrl(){
        window.angularHeaderComponent.openProfileUrl()
    }
    public openUpdatePswUrl(){
        window.angularHeaderComponent.openUpdatePswUrl()
    }
    public signOut(){
        window.angularHeaderComponent.signOut();
        this.closeProfile();
        this.closeLeftPanel();
    }
    ngOnInit() {

    }
    ngAfterViewInit() {

    }
    ngAfterContentChecked(){
    }
}
