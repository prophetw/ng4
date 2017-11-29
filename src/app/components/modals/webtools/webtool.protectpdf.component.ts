/**
 * Created by rzg on 2017/6/3.
 */

import {
  Component, ViewChild, Input, Output, EventEmitter, HostListener, OnInit, ElementRef
} from '@angular/core';
import {ModalDirective, BsDropdownDirective, BsDropdownToggleDirective , TooltipDirective} from 'ngx-bootstrap';
import {TranslateService} from '@ngx-translate/core';

declare var $: any;
declare var phantomOnlineGlobalConfig: any;
declare var CommonUtil:any;

@Component({
  moduleId: module.id,
  selector: 'webtool-protectpdf',
  templateUrl: './webtool.protectpdf.convert.html',
  styleUrls: ['./webtool.protectpdf.convert.css']
})
export class WebToolProtectPDFComponent implements OnInit {
  @ViewChild('webtool_protectpdf') webtool_protectpdf:ModalDirective;
  ngOnInit(){
  }

  constructor(private translate: TranslateService) {
  }


  public srcPassword:string = "";
  public ConfirmPassword:string = "";
  private encryptionMode:string = "";
  private postParamConf:any = null;
  public ErrorWarning:string = "";

  public showProtectPDFPage(callbackFunc:any){
    this.webtool_protectpdf.show();
    this.postParamConf = callbackFunc;
  }

  public hideProtectPDFPage(){
    this.webtool_protectpdf.hide();
  }

  public changePasswordTextBorder(){
    $("#reset_protect_pwd").css("border-color","");
    $("#set_protect_pwd").css("border-color","");
    this.ErrorWarning = "";
    /*$("#pwd_nomatch").text("");*/
  }

  public changePasswordConfirmTextBorder(){
    if(this.srcPassword.length < 6){
      $("#set_protect_pwd").css("border-color","red");
      this.translate.get('Webtools.ProtectPDF.LengthIsInvalid').subscribe( (value:string) => {
        this.ErrorWarning = value;
      } );

      /*var lenghtInfo = "The password must be between 6 and 20 characters.";
      $("#pwd_nomatch").text(lenghtInfo);*/
    } else{
      $("#set_protect_pwd").css("border-color","");
      this.ErrorWarning = "";
      /*$("#pwd_nomatch").text("");*/
    }

    $("#reset_protect_pwd").css("border-color","");

  }

  public ignoreInvalidCharater(text:any){
    var pattern = /[<>&]/g;
    if(pattern.test(text.value))
    {
      text.value = text.value.replace(pattern,"");
    }
  }

  private getProtectParameterInfo(){
    if(this.srcPassword.length > 20 || this.srcPassword.length <6 ){
      /*var lenghtInfo = "The password must be between 6 and 20 characters.";*/

      this.translate.get('Webtools.ProtectPDF.LengthIsInvalid').subscribe( (value:string) => {
        this.ErrorWarning = value;
      } );

      /*$("#pwd_nomatch").text(lenghtInfo);*/
      return "";
    }

    if(this.ConfirmPassword != this.srcPassword){
      /*var compareInfo = "The two passwords don't match.";
      $("#pwd_nomatch").text(compareInfo);*/
      this.translate.get('Webtools.ProtectPDF.Password_NoMatch').subscribe( (value:string) => {
        this.ErrorWarning = value;
      } );

      $("#reset_protect_pwd").css("border-color","red");
      return "";
    }

    var encryption_type = $("#encryption_type").find("option:selected")[0].value;

    var jsonInfo = "{" +"\"user_pwd\":"+"\""+this.srcPassword+"\",\"pwd_mode\":\""+ encryption_type+"\"}";
    return jsonInfo;
  }

  public addPasswordProtect(){
    let paramConf = this.getProtectParameterInfo();
    if(paramConf == "")
      return;
    this.hideProtectPDFPage();
    this.postParamConf(paramConf,false);
  }
}
