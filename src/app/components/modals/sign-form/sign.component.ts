import {Component, ViewChild, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {ModalDirective, BsDropdownDirective, BsDropdownToggleDirective , TooltipDirective} from 'ngx-bootstrap';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AuthenticationService, AlertService, GlobalService, UserService,SharedService} from '../../../services/index';
import {User} from "../../../models/user";
import { CookieService } from 'angular2-cookie/core';
import {TranslateService} from '@ngx-translate/core';
declare var window: any;
declare var $: any;
declare var gapi: any;
@Component({
    moduleId: module.id,
    selector: 'sign-form',
    templateUrl: './sign.html',
    styleUrls:['./sign.css']
})
export class SignFormComponent {
    @ViewChild('signModal') public signModal:ModalDirective;
    @ViewChild('poptip') public poptip : TooltipDirective;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        var target:any = event.target;
        if (target.tagName == 'INPUT' && target.type == 'password'){
            this.detectCapsLock(event);
        }
    }
    public model: any = {
        email: "",
        password: "",
        rememberMe: true
    };
    public phantomLoginSwitchIsOn:boolean=false;
    public title: string;
    public loading: boolean = false;
    public googleLoading: boolean = false;
    public isShown: boolean = false;
    public forgetPswdUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalService.getForgotPasswordUrl());
    public policyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalService.getPrivacyUrl());
    public termsOfUse = this.sanitizer.bypassSecurityTrustResourceUrl(this.globalService.getTermsUrl());
    public formType: string;
    public baseUrlIsPDFEditor:boolean=true;
    public hideSignUp: boolean=false;

    public error: string;

    constructor(
        private cookieService: CookieService,
        private authenticationService:AuthenticationService,
        private userService:UserService,
        private sharedService: SharedService,
        public globalService: GlobalService,
        private sanitizer:DomSanitizer,
        private translate: TranslateService,
    ) {
        this.baseUrlIsPDFEditor = this.globalService.baseUrlIsPDFEditor;
        this.hideSignUp = this.globalService.hideSignUp;
    }

    public detectCapsLock(event:any) : void{
        var e = event||window.event;
        var o = e.target||e.srcElement;
        var keyCode  =  e.keyCode||e.which; // 按键的keyCode
        var isShift  =  e.shiftKey ||(keyCode  ==   16 ) || false ; // shift键是否按住
        if (
          ((keyCode >=   65   &&  keyCode  <=   90 )  &&   !isShift) // Caps Lock 打开，且没有按住shift键
          || ((keyCode >=   97   &&  keyCode  <=   122 )  &&  isShift)// Caps Lock 打开，且按住shift键
        ){
            this.poptip.show();
        }
        else{
            this.poptip.hide();
        }
    }

    public forgetPswd(){
        this.globalService.sendGaEvent('phantomPDF online web','forget-password','forget-password');
        window.open(this.forgetPswdUrl,null,null);
    }
    public closeAlert():void {
        this.error = '';
    }
    public showSignInModal(phantomLoginSwitchIsOn?:boolean):void {
        if (this.globalService.currentUserToken) {
            location.reload();
            return;
        }

        if(phantomLoginSwitchIsOn){
            this.phantomLoginSwitchIsOn=true;
        }else{
            if (this.globalService.useCasLogin()) {
                var pathname:string = window.location.pathname;
                if (pathname.indexOf("siteaction=sign-up") > 0) { // '/view-and-edit?siteaction=sign-up'
                    pathname = '/view-and-edit';
                }
                var service:string = window.location.protocol+"//"+window.location.host + "/redirect-to-cas/" + encodeURIComponent(pathname); // http://localhost:3000/redirect-to-cas/%2Fview-and-edit
                var cas_url:string = this.userService.getCasSiteUrl() + '&service=' + encodeURIComponent(service);
                if (this.model.email) {
                    cas_url += '&email='+this.model.email+'&message='+this.translate.instant('Please sign in to continue.');
                }
                location.href = cas_url;
                return;
            }
            this.phantomLoginSwitchIsOn=false; // real Login Modal
        }


        this.title = 'Sign In';
        this.formType = 'SIGN-IN';
        if(!this.isShown){
            //noinspection TypeScriptUnresolvedFunction
            this.signModal.show();
        }else{
            this.error = '';
        }
    }
    public openLinkMore(){
        //if(this.baseUrlIsPDFEditor){
            window.open(this.globalService.getPdfEditorUrl() + '?trackingId=pdfeditor-online','_blank',"menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
        //}else{
        //    window.open('https://www.foxitsoftware.com/pdf-reader/?trackingId=reader-online','_blank',"menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
        //}

        return false;
    }
    public showSignUpModal():void {
        if (this.globalService.currentUserToken) {
            location.reload();
            return;
        }

        this.phantomLoginSwitchIsOn=false;
        this.title = 'Sign Up';
        this.formType = 'SIGN-UP';
        if(!this.isShown){
            //noinspection TypeScriptUnresolvedFunction
            this.signModal.show();
        }else{
            this.error = '';
        }
    }

    public hideModal():void {
        //noinspection TypeScriptUnresolvedFunction
        this.signModal.hide();
    }

    public submit():void {
        if(!this.globalService.isEmail(this.model.email)){
            this.error = this.translate.instant("Email is not a valid email address.");
            return;
        }
        this.loading = true;
        if (this.formType == 'SIGN-IN') {
            this.authenticationService.login(this.model.email, this.model.password, this.model.rememberMe)
                .subscribe(
                    data => this.handleResponse(data),
                    error => {
                        this.loading = false;
                        this.error = "Incorrect email or password";
                        console.log("login error: ");
                        console.log(error);
                    }
                );
            this.globalService.sendGaEvent('phantomPDF online web','click sign in button','sign in remember-me:'+this.model.rememberMe);
        } else if (this.formType == 'SIGN-UP') {
            var tempPassword:string = (Math.floor(Math.random()*10e6)).toString();
            this.authenticationService.signUp(this.model.email, tempPassword)
                .subscribe(
                    data => this.handleResponse(data),
                    error => {
                        this.loading = false;
                        this.error = error;
                    });
            this.globalService.sendGaEvent('phantomPDF online web','click sign up button','sign up');
        } else {
            console.log('form type error.' + this.formType);
        }
    }
    public onShow () {
        this.isShown = true;
    }
    public onHide () {
        this.isShown = false;
    }
    private handleResponse (data :any){
        this.loading = false;
        this.googleLoading = false;
        let __this = this;
        if (data.ret != 0) {
            if(data.ret == '100005') {
                this.error = this.translate.instant("The email address you entered already registered in our system. Please sign in now.");
            }else if (data.ret == '100004') {
                this.error = this.translate.instant("Email is not a valid email address.");
            }else if(data.ret == '100001'){
                this.error = data.message;
            }else{
                this.error = data.message||data.msg;
            }
        } else {
            this.hideModal();
            this.userService.getCurrentInfo().subscribe(
                data => {
                    //noinspection TypeScriptUnresolvedVariable
                    if (data.ret != 0) {
                        console.log('token error');
                        // token error.
                    } else {
                        this.sharedService.broadcast({
                            name: 'login-event',
                            data: data.data
                        });

                        var iframe:any   = document.getElementById('preview-frame');
                        if(iframe && iframe.contentWindow && iframe.contentWindow.PhantomOnline){
                            if(window.previewFrame.PhantomOnline && window.previewFrame.PhantomOnline.signincallback && typeof window.previewFrame.PhantomOnline.signincallback=='function'){
                                window.previewFrame.PhantomOnline.signincallback();
                            }
                        }

                        if(this.globalService && this.globalService.signSuccfromLoginIntergration && typeof this.globalService.signSuccfromLoginIntergration=='function'){
                            this.globalService.signSuccfromLoginIntergration();
                        }
                    }
                },
                error => {
                    console.log('token error');
                }
            );
        }
    }

    ngAfterViewInit() {
        var __this = this;
        function initClient() {
            // Initialize the client with API key and People API, and initialize OAuth with an
            // OAuth 2.0 client ID and scopes (space delimited string) to request access.
            gapi.client.init({
                apiKey: 'AIzaSyDtY5DdYYd_nnowtLCwgvkJJpwc2em0AQw',
                discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
                clientId: '944385146570-km3v35n3mv41canmgf8r1ga3m17bjp16.apps.googleusercontent.com',
                scope: 'profile'
            }).then(function () {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            });
        }
        function updateSigninStatus(isSignedIn: any) {
            // When signin status changes, this function is called.
            // If the signin status is changed to signedIn, we make an API call.
            if (isSignedIn) {
                __this.makeGoogleApiCall();
            }
        }
        //if(gapi.load){
        //    gapi.load('client:auth2', initClient);
        //}
    }
    public makeGoogleApiCall () {
        this.loading = true;
        this.googleLoading = true;
        var user = gapi.auth2.getAuthInstance().currentUser.get();
        var token = user.getAuthResponse().access_token;
        this.authenticationService.googleLogin(token, this.model.rememberMe)
            .subscribe(
                data => this.handleResponse(data),
                error => {
                    this.googleLoading = false;
                    this.loading = false;
                    this.error = error;
                }
            );
    }
    public googleSignIn (){
        var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        if(isSignedIn){
            this.makeGoogleApiCall();
        }else{
            gapi.auth2.getAuthInstance().signIn();
        }
        this.globalService.sendGaEvent('phantomPDF online web','click googleLogin button','google account login');
    }
    public showGoogleButton ():boolean{
        return false;
        //return typeof gapi.auth2 != 'undefined';
    }
}