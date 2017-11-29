/**
 * Created by rzg on 2017/5/26.
 */


import {
  Component, ViewChild, Input, Output, EventEmitter, HostListener, OnInit, ElementRef
} from '@angular/core';
import {ModalDirective, BsDropdownDirective, BsDropdownToggleDirective , TooltipDirective} from 'ngx-bootstrap';
import {
  DomSanitizer, SafeResourceUrl, SafeUrl
} from '@angular/platform-browser';
import {
  AuthenticationService, AlertService, GlobalService, UserService, SharedService
} from '../../../services/index';

declare var $: any;
declare var phantomOnlineGlobalConfig: any;
declare var CommonUtil:any;

@Component({
  moduleId: module.id,
  selector: 'webtool-headerfooter',
  templateUrl: './webtool.headerfooter.convert.html',
  styleUrls: ['./webtool.headerfooter.convert.css']
})
export class WebToolHeaderFooterComponent implements OnInit {
  @ViewChild('webtool_headerfooter') public webtoolHeaderFooter: ModalDirective;
  @ViewChild('NumberAndDateConfigureModel') public NumberAndDateConfigureModel:ModalDirective;

  public headerFooterText ={
    headerLeftText:"",
    headerCenterText:"",
    headerRightText:"",
    footerLeftText:"",
    footerCenterText:"",
    footerRightText:""
  };

  public headerFooterPreviewText = {
    headerLeftPreviewText:"",
    headerCenterPreviewText:"",
    headerRightPreviewText:"",
    footerLeftPreviewText:"",
    footerCenterPreviewText:"",
    footerRightPreviewText:""
  };

  private fontColor = "#000000";
  private isUnline: boolean =false;
  private HF_FocusText: string = "0";
  private HF_PageNumberStyle_Current:string = "1";
  private HF_PageNumberStyleIndex_Current = "0";

  private HF_DataStyleIndex_Current:string = "0";
  private HF_DataStyle_Current:string = "dd/mm/yyyy";

  public fromPageIndex:string = "1";
  public toPageIndex:string = "1";
  private callbackFuntion:any = null;

  private previewTextIsEmpty:boolean = true;

  ngOnInit() {
    this.previewTextIsEmpty = true;
    $("#addHeaderFooterButton").css("background-color", "#f7f7f7");
    $("#addHeaderFooterButton").css("border-color", "#d1d1d1");
    $("#addHeaderFooterButton").css("color","#cccccc");
    /*$("#addHeaderFooterButton").css("opacity", "0.5");*/

    this.initColorBox();
  }

  private initColorBox(){
    let _this = this;
    $("#HeaderFooterColor").spectrum({
      preferredFormat: "hex",
      showInput: true,
      color: "#000",
      change: function (color: any) {
        _this.SetHFTextColor(color.toHexString());
      }
    });

    $("#HF_SelectAllPage").attr("checked",true);
    $("#HeaderFooter_FromPage").attr("disabled",true);
    $("#HeaderFooter_ToPage").attr("disabled",true);

    $(".sp-preview").attr("style", " width: 34px; height: 34px;");
    $(".sp-dragger").attr("style", "display: block; top: -5px; left: 131px;");
  }

  private SetHFTextColor(color: any) {
    this.fontColor = color;
    $(".HeaderFooterTextFontSize").css("color", color);
  }

  public showHeaderFooterPage(callback:any) {
    this.callbackFuntion = callback;
    this.webtoolHeaderFooter.show();
  }

  public hideHeaderFooterMode() {
    this.webtoolHeaderFooter.hide();
  }

  private StatisticsWordCount(srcString: any, reg: any) {
    var re = new RegExp(reg, "g");
    var arr = srcString.match(re);
    if (arr == null) {
      return 0;
    }
    return arr.length;
  }

  public setHeaderFooterFont() {
    var fontFamily = $("#HeaderFooterFont").find("option:selected").text();
    $(".HeaderFooterTextFontSize").css("font-family", fontFamily);
  }

  public SetUnlineForHeaderFooter() {
    if (!this.isUnline) {
      $("#HeaderFooterUnlineImage").attr("src", "./img/underline-selected.png");
      $(".HeaderFooterTextFontSize").css("text-decoration", "underline");
    } else {
      $("#HeaderFooterUnlineImage").attr("src", "./img/underline.png");
      $(".HeaderFooterTextFontSize").css("text-decoration", "none");
    }
    this.isUnline = !this.isUnline;
  }

  public setHeaderFooterFontSize() {
    var strFontSize = $("#HeaderFooterFontSize").find("option:selected").text();
    var fontSize = Number(strFontSize);
    var changeTextFontSize = fontSize + "px";
    $(".HeaderFooterTextFontSize").css("font-size", changeTextFontSize);
    $(".HeaderFooterTextFontSize").css("line-height", changeTextFontSize);


    var headerLeftText = document.getElementById("HeaderPreview_Left").innerHTML;
    if (headerLeftText != "" && headerLeftText != undefined) {
      var count = this.StatisticsWordCount(headerLeftText, "<br>");
      $("#HeaderPreview_Left").css("height", (count + 1) * fontSize);
      var headerLeftHei = $("#HeaderPreview_Left").height();
      var HeaderLeftMarginTop = (40 - headerLeftHei) + "px";
      $("#HeaderPreview_Left").css("margin-top", HeaderLeftMarginTop);
    }else{
      $("#HeaderPreview_Left").css("margin-top", "40px");
    }

    var headerCenterText = document.getElementById("HeaderPreview_Center").innerHTML;
    if (headerCenterText != "" && headerCenterText != undefined) {
      var count = this.StatisticsWordCount(headerCenterText, "<br>");
      $("#HeaderPreview_Center").css("height", (count + 1) * fontSize);
      var headerCenterHei = $("#HeaderPreview_Center").height();
      var HeaderCenterMarginTop = (0 - headerCenterHei) + "px";
      $("#HeaderPreview_CenterBox").css("margin-top", HeaderCenterMarginTop);
      $("#HeaderPreview_CenterBox").css("height", headerCenterHei);
    }

    var headerRightText = document.getElementById("HeaderPreview_Right").innerHTML;
    if (headerRightText != "" && headerRightText != undefined) {
      var count = this.StatisticsWordCount(headerRightText, "<br>");
      $("#HeaderPreview_Right").css("height", (count + 1) * fontSize);
      var headerRightHei = $("#HeaderPreview_Right").height();
      var HeaderRightMarginTop = (0 - headerRightHei) + "px";
      $("#HeaderPreview_Right").css("margin-top", HeaderRightMarginTop);
    }

    var footerCenterText = document.getElementById("FooterPreview_Center").innerHTML;
    if (footerCenterText != "" && footerCenterText != undefined) {
      var count = this.StatisticsWordCount(footerCenterText, "<br>");
      $("#FooterPreview_CenterBox").css("height", (count + 1) * fontSize);
      var footerLeftHei = $("#FooterPreview_Left").height();
      $("#FooterPreview_CenterBox").css("margin-top", footerLeftHei * (-1));
    }

    var footerRightText = document.getElementById("FooterPreview_Right").innerHTML;
    if (footerRightText != "" && footerRightText != undefined) {
      var count = this.StatisticsWordCount(footerRightText, "<br>");
      $("#FooterPreview_Right").css("height", (count + 1) * fontSize);

      var footerCenterHei = $("#FooterPreview_Center").height();
      var footerLeftHei = $("#FooterPreview_Left").height();
      if (footerCenterHei == 0) {
        $("#FooterPreview_Right").css("margin-top", footerLeftHei * (-1));
      } else {
        $("#FooterPreview_Right").css("margin-top", footerCenterHei * (-1));
      }
    }
    return;
  }

  public HF_SelectAllPages() {
    $("#HeaderFooter_FromPage").attr("disabled", true);
    $("#HeaderFooter_ToPage").attr("disabled", true);
  }

  public HF_SelectPageRanges() {
    $("#HeaderFooter_FromPage").attr("disabled", false);
    $("#HeaderFooter_ToPage").attr("disabled", false);
  }

  public checkFromPage() {
    var pattern = /[^0-9]/g;
    if (pattern.test(this.fromPageIndex)) {
      this.fromPageIndex = this.fromPageIndex.replace(pattern, "");
      return;
    }
  }

  public checkToPage() {
    var pattern = /[^0-9]/g;
    if (pattern.test(this.toPageIndex)) {
      this.toPageIndex = this.toPageIndex.replace(pattern, "");
      return;
    }
  }

  public checkFromPageValid() {
    let fromNum = Number(this.fromPageIndex);
    if (this.fromPageIndex == "" || this.fromPageIndex == undefined || fromNum == 0) {
      this.fromPageIndex = "1";
    } else {
      if (this.toPageIndex != "" && this.toPageIndex != undefined) {
        var iToNum = Number(this.toPageIndex);
        if (fromNum > iToNum) {
          this.fromPageIndex = this.toPageIndex;
          return;
        }
      }
    }
  }

  public checkToPageValid() {
    var iToNum = Number(this.toPageIndex);
    if (this.toPageIndex == "" || this.toPageIndex == undefined) {
      this.toPageIndex = "9999";
    } else {

      var strFromNum = this.fromPageIndex;
      if (strFromNum != "" && strFromNum != undefined) {
        var iFromNum = Number(strFromNum);
        if (iFromNum > iToNum) {
          this.toPageIndex = strFromNum;
        }
      }
    }
    if (this.toPageIndex == "0") {
      this.fromPageIndex = "1";
    }
  }

  private getCurrentDate(mode: any) {
    var dates = new Date();
    var currentDate = "";
    var month = dates.getMonth() + 1;

    if (mode == 1) {
      currentDate = CommonUtil.getDateByFormat("dd/MM/yyyy");
      //currentDate = dates.getDate() + "/" + month + "/" + dates.getFullYear();
    } else if (mode == 2) {
      currentDate = CommonUtil.getDateByFormat("dd.MM.yyyy");
      //currentDate = dates.getDate() + "." + month + "." + dates.getFullYear();
    } else if (mode == 3) {
      currentDate = CommonUtil.getDateByFormat("MM/dd/yyyy");
      //currentDate = month + "/" + dates.getDate() + "/" + dates.getFullYear();
    } else if (mode == 4) {
      currentDate = CommonUtil.getDateByFormat("MM.dd.yyyy");
      //currentDate = month + "." + dates.getDate() + "." + dates.getFullYear();
    } else if (mode == 5) {
      currentDate = CommonUtil.getDateByFormat("yyyy-MM-dd");
      //currentDate = dates.getFullYear() + "-" + month + "-" + dates.getDate();
    }

    return currentDate;
  }

  private ReplaceTextWithPageNumberAndDateInfo(HFText: any, textReg: any, checkTextReg: any, replaceText: any) {
    HFText = HFText.replace(/&lt;/g, '<');
    var pos = HFText.search(checkTextReg);
    var r = HFText.match(checkTextReg);
    var textinfo = "";
    var resultText = "";
    while (pos >= 0) {
      textinfo = HFText.substring(0, pos + r[0].length);
      if ((pos > 0 && HFText[pos - 1] != '<') || pos == 0) {
        textinfo = textinfo.replace(textReg, replaceText);
        resultText += textinfo;
      } else {
        resultText += textinfo;
      }

      HFText = HFText.substring(pos + r[0].length);
      pos = HFText.search(checkTextReg);
    }

    resultText += HFText;
    resultText = resultText.replace(/</g, '&lt;');
    resultText = resultText.replace(/&lt;br/g, '<br');
    return resultText;
  }

  private ReplacePageNumberAndDataText(HFText: any) {

    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<1>>/, /(<<)*<<1>>/, "1");
    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<1\/[nN]>>/, /(<<)*<<1\/[nN]>>/, "1/1");
    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<1 [oO][fF] [nN]>>/, /(<<)*<<1 [oO][fF] [nN]>>/, "1 of 1");
    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<[pP][aA][gG][eE] 1>>/, /(<<)*<<[pP][aA][gG][eE] 1>>/, "Page 1");
    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<[pP][aA][gG][eE] 1 [oO][fF] [nN]>>/, /(<<)*<<[pP][aA][gG][eE] 1 [oO][fF] [nN]>>/, "Page 1 of 1");

    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<dd\/mm\/yyyy>>/, /(<<)*<<dd\/mm\/yyyy>>/, this.getCurrentDate(1));
    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<dd.mm.yyyy>>/, /(<<)*<<dd.mm.yyyy>>/, this.getCurrentDate(2));
    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<mm\/dd\/yyyy>>/, /(<<)*<<mm\/dd\/yyyy>>/, this.getCurrentDate(3));
    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<mm.dd.yyyy>>/, /(<<)*<<mm.dd.yyyy>>/, this.getCurrentDate(4));
    HFText = this.ReplaceTextWithPageNumberAndDateInfo(HFText, /\<<yyyy-mm-dd>>/, /(<<)*<<yyyy-mm-dd>>/, this.getCurrentDate(5));

    return HFText;
  }

  public setPreviewHeaderLeftText() {
    var value = this.headerFooterText.headerLeftText.replace(/\</g, "&lt;");
    value = value.replace(/\n/g, '<br>');
    //value = value.replace(/&/g, '&amp;');
    value = value.replace(/\s/g, "&ensp;");
    var fontSize = $("#HeaderFooterFontSize").find("option:selected").text();
    if (value != "" && value != undefined) {
      var count = this.StatisticsWordCount(value, "<br>");
      $("#HeaderPreview_Left").css("height", (count + 1) * fontSize);
    } else {
      $("#HeaderPreview_Left").css("height", 0);
    }

    this.headerFooterPreviewText.headerLeftPreviewText = this.ReplacePageNumberAndDataText(value);
    var leftHei = $("#HeaderPreview_Left").height();
    if(leftHei == 0){
      leftHei = 40 - fontSize;
    }else{
      leftHei = 40- leftHei;
    }
    $("#HeaderPreview_Left").css("margin-top",leftHei);

    var centerHei = $("#HeaderPreview_Center").height();
    var rightHei = $("#HeaderPreview_Right").height();

    if(this.headerFooterText.headerLeftText == "" || this.headerFooterText.headerLeftText == undefined){
      $("#HeaderPreview_CenterBox").css("margin-top",(centerHei-fontSize)*(-1));
      if(centerHei == 0){
        $("#HeaderPreview_Right").css("margin-top",(rightHei-fontSize)*(-1));
      }
    }
    else{
      $("#HeaderPreview_CenterBox").css("margin-top",centerHei*(-1));
      if(centerHei == 0){
        $("#HeaderPreview_Right").css("margin-top",0);
        $("#HeaderPreview_Right").css("margin-top",rightHei*(-1));
      }
    }

    this.SetHFButtonFormat();
  }

  public setPreviewHeaderCenterText(){
    var value = this.headerFooterText.headerCenterText.replace(/\</g,"&lt;");
    value = value.replace(/\n/g,'<br>');
    //value = value.replace(/&/g, '&amp;');
    value = value.replace(/\s/g,"&ensp;");
    this.headerFooterPreviewText.headerCenterPreviewText = this.ReplacePageNumberAndDataText(value);

    var fontSize = $("#HeaderFooterFontSize").find("option:selected").text();
    if(value != "" && value != undefined){
      var count = this.StatisticsWordCount(value,"<br>");
      $("#HeaderPreview_Center").css("height",(count+1)*fontSize);
    }else{
      $("#HeaderPreview_Center").css("height",0);
    }

    var left_height = $("#HeaderPreview_Left").height();
    var centerHei = $("#HeaderPreview_Center").height();
    var right_height = $("#HeaderPreview_Right").height();

    $("#HeaderPreview_CenterBox").css("height",centerHei);
    if(left_height == 0){
      var tt = (centerHei - fontSize).toString();
      tt = "-" + tt + "px";
      if(centerHei == 0){
        $("#HeaderPreview_CenterBox").css("margin-top","0px");
        $("#HeaderPreview_Right").css("margin-top",(right_height-fontSize)*(-1));
      }else{
        $("#HeaderPreview_CenterBox").css("margin-top",(centerHei - fontSize)*(-1));
        $("#HeaderPreview_Right").css("margin-top",right_height*(-1));
      }
    }else{
      centerHei = "-"+centerHei + "px";
      $("#HeaderPreview_CenterBox").css("margin-top",centerHei);
      $("#HeaderPreview_Right").css("margin-top",right_height*(-1));
    }

    this.SetHFButtonFormat();
  }

  public setPreviewHeaderRightText(){
    var value = this.headerFooterText.headerRightText.replace(/\</g,"&lt;");
    value = value.replace(/\n/g,'<br>');
    value = value.replace(/\s/g,"&ensp;");
    this.headerFooterPreviewText.headerRightPreviewText = this.ReplacePageNumberAndDataText(value);

    var fontSize = $("#HeaderFooterFontSize").find("option:selected").text();
    if(value != "" && value != undefined){
      var count = this.StatisticsWordCount(value,"<br>");
      $("#HeaderPreview_Right").css("height",(count+1)*fontSize);
    }else{
      $("#HeaderPreview_Right").css("height",0);
    }

    var centerHei = $("#HeaderPreview_Center").height();
    var leftHei = $("#HeaderPreview_Left").height();
    var rightHei = $("#HeaderPreview_Right").height();

    if(centerHei == 0){
      $("#HeaderPreview_CenterBox").css("height",0);
    }

    if(centerHei == 0 && leftHei == 0){
      var tt = (rightHei - fontSize).toString();
      tt = "-" + tt + "px";

      $("#HeaderPreview_CenterBox").css("margin-top",0);
      $("#HeaderPreview_Right").css("margin-top",tt);
    }else{
      rightHei = "-" + rightHei + "px";
      $("#HeaderPreview_Right").css("margin-top",rightHei);
    }

    this.SetHFButtonFormat();
  }

  public setPreviewFooterLeftText(){
    var value = this.headerFooterText.footerLeftText.replace(/\</g,"&lt;");
    value = value.replace(/\n/g,'<br>');
    value = value.replace(/\s/g,"&ensp;");
    this.headerFooterPreviewText.footerLeftPreviewText = this.ReplacePageNumberAndDataText(value);

    var fontSize = $("#HeaderFooterFontSize").find("option:selected").text();
    if (value != "" && value != undefined) {
      var count = this.StatisticsWordCount(value, "<br>");
      $("#FooterPreview_Left").css("height", (count + 1) * fontSize);
    } else {
      $("#HeaderPreview_Left").css("height", 0);
    }


    var leftHei = $("#FooterPreview_Left").height();
    var centerHei = $("#FooterPreview_Center").height();
    if(this.headerFooterText.footerLeftText == "" || this.headerFooterText.footerLeftText == undefined){
      $("#FooterPreview_CenterBox").css("margin-top","0px");
      if(centerHei == 0){
        $("#FooterPreview_Right").css("margin-top","0px");
      }
    } else{
      if(centerHei == 0){
        $("#FooterPreview_Right").css("margin-top",leftHei*(-1));
        $("#FooterPreview_CenterBox").css("margin-top",0);
      }else{
        $("#FooterPreview_CenterBox").css("margin-top",leftHei*(-1));
      }
    }

    this.SetHFButtonFormat();
  }

  public setPreviewFooterCenterText(){
    var value = this.headerFooterText.footerCenterText.replace(/\</g,"&lt;");
    value = value.replace(/\n/g,'<br>');
    value = value.replace(/\s/g,"&ensp;");
    this.headerFooterPreviewText.footerCenterPreviewText = this.ReplacePageNumberAndDataText(value);
    var LeftHei = $("#FooterPreview_Left").height();
    var CenterHei = $("#FooterPreview_Center").height();
    var RightHei = $("#FooterPreview_Right").height();

    $("#FooterPreview_CenterBox").css("height",CenterHei);
    $("#FooterPreview_CenterBox").css("margin-top",LeftHei*(-1));
    $("#FooterPreview_Right").css("margin-top",CenterHei*(-1));

    this.SetHFButtonFormat();
  }

  public setPreviewFooterRightText(){
    var value = this.headerFooterText.footerRightText.replace(/\</g,"&lt;");
    value = value.replace(/\n/g,'<br>');
    value = value.replace(/\s/g,"&ensp;");
    this.headerFooterPreviewText.footerRightPreviewText = this.ReplacePageNumberAndDataText(value);

    var leftHei = $("#FooterPreview_Left").height();
    var centerHei = $("#FooterPreview_Center").height();
    var rightHei = $("#FooterPreview_Right").height();

    if(leftHei == 0 && centerHei == 0){
      $("#FooterPreview_CenterBox").css("margin-top","0px");
      $("#FooterPreview_Right").css("margin-top","0px");
    }else if(leftHei == 0 && centerHei != 0){
      $("#FooterPreview_Right").css("margin-top",centerHei*(-1));
    }else if(leftHei != 0 && centerHei == 0){
      $("#FooterPreview_Right").css("margin-top",leftHei*(-1));
    }

    this.SetHFButtonFormat();
  }

  private CheckTextValueIsEmpty(){
    if(this.headerFooterText.headerLeftText != "" && this.headerFooterText.headerLeftText != undefined)
      return false;
    if(this.headerFooterText.headerCenterText != "" && this.headerFooterText.headerCenterText != undefined)
      return false;
    if(this.headerFooterText.headerRightText != "" && this.headerFooterText.headerRightText != undefined)
      return false;
    if(this.headerFooterText.footerLeftText != "" && this.headerFooterText.footerLeftText != undefined)
      return false
    if(this.headerFooterText.footerCenterText != "" && this.headerFooterText.footerCenterText != undefined)
      return false
    if(this.headerFooterText.footerRightText != "" && this.headerFooterText.footerRightText != undefined)
      return false;
    return true;
  }

  private SetHFButtonFormat(){
    if(this.CheckTextValueIsEmpty()){
      this.previewTextIsEmpty = true;
      $("#addHeaderFooterButton").attr("style", "background-color: #f7f7f7;border-color: #d1d1d1;color:#cccccc");
    }else{
      this.previewTextIsEmpty = false;
      $("#addHeaderFooterButton").attr("style", "background-color: #f7f7f7;border-color: #d1d1d1;");
     /* $("#addHeaderFooterButton").hover(function(){
        $("#addHeaderFooterButton").attr("style","background-color: #eaeaea;border-color: #d1d1d1;");
      },function(){
        $("#addHeaderFooterButton").attr("style","background-color: #f7f7f7;border-color: #d1d1d1;");
      });

      $("#addHeaderFooterButton").active(function(){
        $("#addHeaderFooterButton").attr("style","background-color: #e1e1e1;border-color: #c3c3c3;");
      },function(){
        $("#addHeaderFooterButton").attr("style","background-color: #f7f7f7;border-color: #d1d1d1;");
      });*/
    }
  }

  public mouseEnterEvent(){
    if(!this.previewTextIsEmpty){
      $("#addHeaderFooterButton").attr("style", "background-color: #eaeaea;border-color: #d1d1d1;color:#666666;");
    }
  }

  public mouseLeaveEvent(){
    if(!this.previewTextIsEmpty){
      $("#addHeaderFooterButton").attr("style", "background-color: #f7f7f7;border-color: #d1d1d1;color:#666666;");
    }
  }

  public GetModeIndex(mode: any) {
    this.HF_FocusText = mode;
  }

  private CheckTextLenght(textMode:any, format:any){
    var textInfo = this.getSourceText(textMode);
    /*var textInfo = document.getElementById(textMode).innerHTML;*/
    if((textInfo.length + format.length + 4) >100)
      return false;

    return true;
  }

  private getSourceText(fromText:any){
    if(fromText == "HeaderLeftText")
      return this.headerFooterText.headerLeftText;
    else if(fromText == "HeaderCenterText")
      return this.headerFooterText.headerCenterText;
    else if(fromText == "HeaderRightText")
      return this.headerFooterText.headerRightText;
    else if(fromText == "FooterLeftText")
      return this.headerFooterText.footerLeftText;
    else if(fromText == "FooterCenterText")
      return this.headerFooterText.footerCenterText;
    else if(fromText == "FooterRightText")
      return this.headerFooterText.footerRightText;

    return "";
  }

  private setSourceText(fromText:any,text:any){
    if(fromText == "HeaderLeftText")
      this.headerFooterText.headerLeftText = text;
    else if(fromText == "HeaderCenterText")
      this.headerFooterText.headerCenterText= text;
    else if(fromText == "HeaderRightText")
      this.headerFooterText.headerRightText= text;
    else if(fromText == "FooterLeftText")
      this.headerFooterText.footerLeftText= text;
    else if(fromText == "FooterCenterText")
      this.headerFooterText.footerCenterText= text;
    else if(fromText == "FooterRightText")
      this.headerFooterText.footerRightText= text;
  }

  private setPreviewText(fromText:any,text:any){
    if(fromText == "HeaderLeftText")
      this.headerFooterPreviewText.headerLeftPreviewText = text;
    else if(fromText == "HeaderCenterText")
      this.headerFooterPreviewText.headerCenterPreviewText= text;
    else if(fromText == "HeaderRightText")
      this.headerFooterPreviewText.headerRightPreviewText= text;
    else if(fromText == "FooterLeftText")
      this.headerFooterPreviewText.footerLeftPreviewText= text;
    else if(fromText == "FooterCenterText")
      this.headerFooterPreviewText.footerCenterPreviewText= text;
    else if(fromText == "FooterRightText")
      this.headerFooterPreviewText.footerRightPreviewText= text;
  }

  private setPreviewTextFromPageNumber(FromText:any, PageNumberStyle:any, ToText:any){
    var textInfo  = this.getSourceText(FromText);
    if(FromText == "HeaderLeftText" ||FromText == "HeaderCenterText" || FromText == "HeaderRightText"){
      var newText = textInfo.replace(/\n/g,'<br>');
      var textMode = ToText;
      if(FromText == "HeaderCenterText"){
        textMode = "HeaderPreview_CenterBox";
      }
    }
    textInfo = textInfo.replace(/&gt;/g,">");
    var value = textInfo + "<<" + PageNumberStyle + ">>"+ " ";
    /*document.getElementById(FromText).nodeValue = value;*/
   /* this.headerFooterText.headerLeftText = value;*/
    this.setSourceText(FromText,value);
    value = value.replace(/\</g,"&lt;");
    value = value.replace(/\n/g,'<br>');
    /*value = value.replace(/\s/g,"&ensp;");*/

    var previewText = this.ReplacePageNumberAndDataText(value);
    this.setPreviewText(FromText, previewText);
    /*document.getElementById(ToText).innerHTML = previewText;*/
  }

  public HF_AddPageNumberOrDate(mode:any){
    var addMode = "";
    var fontSize = $("#HeaderFooterFontSize").find("option:selected").text();
    if(mode == 0){
      addMode = this.HF_PageNumberStyle_Current;
    }else{
      addMode = this.HF_DataStyle_Current;
    }

    var header_left_height = $("#HeaderPreview_Left").height();
    var header_center_height = $("#HeaderPreview_Center").height();
    var header_right_height = $("#HeaderPreview_Right").height();
    var footer_left_height = $("#FooterPreview_Left").height();
    var footer_center_height = $("#FooterPreview_Center").height();
    var footer_right_height = $("#FooterPreview_Right").height();

    if(this.HF_FocusText == "0"){
      if(!this.CheckTextLenght("HeaderLeftText",addMode))
        return ;

      this.setPreviewTextFromPageNumber("HeaderLeftText", addMode, "HeaderPreview_Left");
      var heiLeft = $("#HeaderPreview_Left").height();
      var heiCenter = $("#HeaderPreview_Center").height();
      var heiRight = $("#HeaderPreview_Right").height();
      if(heiLeft == 0){
        heiLeft = fontSize;
        $("#HeaderPreview_Left").css("height",fontSize);
      }
      if(heiLeft == 0){
        $("#HeaderPreview_CenterBox").css("margin-top",0);
      }else{
        var centerLeft = $("#HeaderPreview_Center").height();
        $("#HeaderPreview_CenterBox").css("margin-top",centerLeft*(-1));
        if(centerLeft == 0){
          $("#HeaderPreview_Right").css("margin-top",heiRight*(-1));
        }
      }
    }else if(this.HF_FocusText == "1"){
      if(!this.CheckTextLenght("HeaderCenterText",addMode))
        return ;
      this.setPreviewTextFromPageNumber("HeaderCenterText", addMode, "HeaderPreview_Center");
      var heiCenter = $("#HeaderPreview_Center").height();
      var heiLeft = $("#HeaderPreview_Left").height();
      var heiRight = $("#HeaderPreview_Right").height();
      if(heiCenter == 0){
        heiCenter = fontSize;
        $("#HeaderPreview_Center").css("height",fontSize);
      }
      $("#HeaderPreview_CenterBox").css("height",heiCenter);
      if(heiCenter != 0){
        if(heiLeft == 0){
          $("#HeaderPreview_CenterBox").css("margin-top",(heiCenter-fontSize)*(-1));
        }else{
          $("#HeaderPreview_CenterBox").css("margin-top",heiCenter*(-1));
        }

        $("#HeaderPreview_Right").css("margin-top",heiRight*(-1));
      }else{
        $("#HeaderPreview_Right").css("margin-top",0);
      }
    }else if(this.HF_FocusText == "2"){
      if(!this.CheckTextLenght("HeaderRightText",addMode))
        return ;
      this.setPreviewTextFromPageNumber("HeaderRightText", addMode, "HeaderPreview_Right");
      var heiCenter = $("#HeaderPreview_Center").height();
      var heiLeft = $("#HeaderPreview_Left").height();
      var heiRight = $("#HeaderPreview_Right").height();
      if(heiRight == 0){
        heiRight = fontSize;
        $("#HeaderPreview_Right").css("height",fontSize);
      }
      if(heiCenter == 0 && heiLeft ==0){
        var tt = 40-fontSize;
        $("#HeaderPreview_Left").css("margin-top",tt);
        $("#HeaderPreview_CenterBox").css("margin-top",0);
        $("#HeaderPreview_Right").css("margin-top",0);
      }else {
        $("#HeaderPreview_Right").css("margin-top",heiRight*(-1));
      }
    }else if(this.HF_FocusText == "3"){
      if(!this.CheckTextLenght("FooterLeftText",addMode))
        return ;
      this.setPreviewTextFromPageNumber("FooterLeftText", addMode, "FooterPreview_Left");
      var heiLeft = $("#FooterPreview_Left").height();
      if(heiLeft == 0)
        heiLeft = fontSize;
      var heiCenter = $("#FooterPreview_Center").height();
      if(heiLeft == 0){
        $("#FooterPreview_CenterBox").css("margin-top",0);
        if(heiCenter == 0){
          $("#FooterPreview_Right").css("margin-top",0);
        }
      }else{
        heiLeft = "-"+heiLeft + "px";
        if(heiCenter != 0){
          $("#FooterPreview_CenterBox").css("margin-top",heiLeft);
        }else{
          $("#FooterPreview_CenterBox").css("margin-top",0);
          $("#FooterPreview_Right").css("margin-top",heiLeft);
        }
      }
    }else if(this.HF_FocusText == "4"){
      if(!this.CheckTextLenght("FooterCenterText",addMode))
        return ;
      this.setPreviewTextFromPageNumber("FooterCenterText", addMode, "FooterPreview_Center");
      var heiLeft = $("#FooterPreview_Left").height();
      var heiCenter = $("#FooterPreview_Center").height();
      if(heiCenter == 0)
        heiCenter = fontSize;
      $("#FooterPreview_CenterBox").css("height",heiCenter);
      if(heiCenter == 0){
        $("#FooterPreview_Right").css("margin-top",heiLeft);
      }else{
        if(heiLeft == 0){
          $("#FooterPreview_CenterBox").css("margin-top",0);
        }else{
          $("#FooterPreview_CenterBox").css("margin-top",heiLeft*(-1));
        }
        $("#FooterPreview_Right").css("margin-top",heiCenter*(-1));
      }
    }else if(this.HF_FocusText == "5"){
      if(!this.CheckTextLenght("FooterRightText",addMode))
        return ;
      this.setPreviewTextFromPageNumber("FooterRightText", addMode, "FooterPreview_Right");
      var heiLeft = $("#FooterPreview_Left").height();
      var heiCenter = $("#FooterPreview_Center").height();
      if(heiCenter == 0 && heiLeft == 0){
        $("#FooterPreview_CenterBox").css("margin-top",0);
        $("#FooterPreview_Right").css("margin-top",0);
      }
    }

    this.SetHFButtonFormat();
  }

  public openNumberAndDataConfigureModel(){
    this.NumberAndDateConfigureModel.show();
  }

  public closeNumberAndDataConfigureModel(){
    this.NumberAndDateConfigureModel.hide();
  }

  public setNumberAndDateConfigure(){
    this.HF_PageNumberStyle_Current = $("#HF_PageNumberInfo").find("option:selected").text();
    var pageIndex = $("#HF_PageNumberInfo").find("option:selected")[0].value;
    this.HF_PageNumberStyleIndex_Current = pageIndex;
    this.HF_DataStyle_Current = $("#HF_DataInfo").find("option:selected").text();
    var dateIndex = $("#HF_DataInfo").find("option:selected")[0].value;
    this.HF_DataStyleIndex_Current = dateIndex;

    this.NumberAndDateConfigureModel.hide();
  }

  private RGBToBGR(rgb:any){
    var r = rgb.substr(1,2);
    var g = rgb.substr(3,2);
    var b = rgb.substr(5,2);

    var bgr = "#" +b+g+r;
    return bgr;
  }

  public doReplaceCharWithESC(text: string):string{
    let out:string = text;
    out = out.replace(/&/g, '&amp;');
    out = out.replace(/\>/g,"&gt;");
    out = out.replace(/\</g,"&lt;");
    out = out.replace(/"/g,'&quot;');
    out = out.replace(/\n/g,'<br>');
    //out = out.replace(/\s/g,"&ensp;");
    //out = out.replace(/\\/g,"\\\\");
    return out;
  }

  public getHeaderFooterConfigure(){
    var configXml = "";
    configXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><headerFooter ";
    //1、获取字体
    var font = $("#HeaderFooterFont").find("option:selected").text();
    configXml += "FontName=\"" + font + "\" ";
    //2、获取字号
    var fontsize = $("#HeaderFooterFontSize").find("option:selected").text();
    configXml += "FontSize=\"" + fontsize + "\" ";

    //Charset暂定1
    configXml += "charset=\"1\" ";
    //页边距默认
    configXml += "Left=\"72\" Top=\"36\" Right=\"72\" Bottom=\"36\" ";

    //shrink and fixedprint 默认
    configXml += "shrink=\"0\" fixedprint=\"0\" ";

    //页码偏移量默认
    configXml += "offset=\"0\" ";

    //7、颜色表
    configXml += "Color=\"" + this.RGBToBGR(this.fontColor) + "\" ";
    //8、下划线
    if(this.isUnline){
      configXml += "UnderLine=\"1\" ";
    }else{
      configXml += "UnderLine=\"0\" ";
    }

    //3、获取页码：全局或者自定义
    if($("#HF_SelectAllPage").prop("checked")){
      configXml += "AllPages=\"1\" ";
    }else{
      configXml += "AllPages=\"0\" ";
      configXml += "nStart=\"" + this.fromPageIndex + "\" nEnd=\"" + this.toPageIndex + "\" ";
    }

    configXml += "OddEven=\"All pages in range\" ";
    //4、获取六个text

    var headerLeft   = this.doReplaceCharWithESC(this.headerFooterText.headerLeftText) ;
    var headerCenter = this.doReplaceCharWithESC(this.headerFooterText.headerCenterText);
    var headerRight  = this.doReplaceCharWithESC(this.headerFooterText.headerRightText);
    var footerLeft   = this.doReplaceCharWithESC(this.headerFooterText.footerLeftText);
    var footerCenter = this.doReplaceCharWithESC(this.headerFooterText.footerCenterText);
    var footerRight  = this.doReplaceCharWithESC(this.headerFooterText.footerRightText);

    configXml += "HeaderLeft=\"" + headerLeft + "\" ";
    configXml += "HeaderCenter=\"" + headerCenter + "\" ";
    configXml += "HeaderRight=\"" + headerRight + "\" ";
    configXml += "FooterLeft=\"" + footerLeft + "\" ";
    configXml += "FooterCenter=\"" + footerCenter + "\" ";
    configXml += "FooterRight=\"" + footerRight + "\" ";

    //5、获取Page Number 模式
    configXml += "PageNumFmt=\"" + this.HF_PageNumberStyleIndex_Current + "\" "
    //6、获取Data的模式
    configXml += "DateFormat=\"" + this.HF_DataStyleIndex_Current + "\" ";

    configXml += "/>";

    return configXml;
  }

  public mouseDownEvent(){
    if(this.previewTextIsEmpty)
      return;

    $("#addHeaderFooterButton").attr("style", "background-color: #e1e1e1;border-color: #c3c3c3;color:#666666;");
  }

  public addHeaderFooterFunc(){
    if(this.previewTextIsEmpty)
      return;

    let conf = this.getHeaderFooterConfigure();
    this.callbackFuntion(conf,false);
  }

}
