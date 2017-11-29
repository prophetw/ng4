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
  selector: 'webtool-watermark',
  templateUrl: './webtool.watermark.convert.html',
  styleUrls: ['./webtool.watermark.convert.css']
})
export class WebToolWatermarkComponent implements OnInit {
  @ViewChild('webtool_watermark') webtool_watermark: ModalDirective;

  private postParameterConf:any = null;
  public wmkTextColor:string = "#ff0000";
  public wmkRotateText:string = "45";
  private wmkDefaultScale:number = 0.3;
  private wmkTextIsEmpty:boolean = false;
  public wmkTextInfo:string = "foxitsoftware";
  private tmpWmkTextInfo:string = "";
  private resultWmkTextInfo:string = "foxitsoftware";
  public wmkAlphaPercentage:string = "50%";
  private scale:any = null;


  ngOnInit() {
    this.initColorBox();
    this.initScale('btn','bar','title');
  }

  constructor(private translate: TranslateService) {
  }

  private initScale(scroll:any, bar:any, mask:any){
    let _this = this;
    var _btn = document.getElementById(scroll);
    var _bar = document.getElementById(bar);
    var _title = document.getElementById(mask);
    var _step = _bar.getElementsByTagName('div')[0];
    init();
    function init() {
      _btn.onmousedown = function (e: any) {
        var x = (e || window.event).clientX;
        var l = _btn.offsetLeft;
        var max = _bar.offsetWidth - _btn.offsetWidth;

        document.onmousemove = function (e: any) {
          var thisX = (e || window.event).clientX;
          var to = Math.min(max, Math.max(-2, l + (thisX - x)));
          _btn.style.left = to + 'px';
          ondrag(Math.round(Math.max(0, to / max) * 100), to);
          window.getSelection() ? window.getSelection().removeAllRanges() : document.getSelection().empty();
        };

        document.onmouseup = function (e: any) {
          document.onmousemove = null;
        };
      }
    }

    function ondrag(pos:any,x:any){
       _step.style.width = Math.max(0,x) + 'px';
       var percent=pos+'%';
       _this.wmkAlphaPercentage = percent;

       var number = Number(pos);
       $("#watermark_text").css("opacity",number/100);
    }
  }

  private initColorBox(){
    let _this = this;
    $("#watermarkFontColor").spectrum({
      preferredFormat: "hex",
      showInput: true,
      color: "#f00",

      change:function(color:any){
        _this.updateWmkColor(color.toHexString());
      }
    });

    $(".sp-preview").attr("style"," width: 34px; height: 34px;");
    $(".sp-dragger").attr("style","display: block; top: -5px; left: 131px;");
  }

  private updateWmkColor(color:any){
    $("#watermark_text").css("color",color);
    this.wmkTextColor =  color;
  }

  public showWatermarkPage(callbackFunc:any){
    this.webtool_watermark.show();
    this.postParameterConf = callbackFunc;
  }

  public hideWatermarkPage(){
    this.webtool_watermark.hide();
  }

  //rotate
  public checkRotateValue(){
    if(this.wmkRotateText == ""){
      this.setWmkTextLocation();
      this.wmkRotateText = "0";
      var rotate = ' rotate(0deg)';
      $("#wmkText_control").css("transform",rotate);
    }
  }

  private setWmkTextLocation(){
    var wid = $("#watermark_text").width();
    var hei = $("#watermark_text").height();
    $("#wmk_control").css("width",wid);
    $("#wmk_control").css("height",hei);

    var srcWid = Number(wid)*this.wmkDefaultScale;
    var srcHei = Number(hei)*this.wmkDefaultScale;

    var fatherWid = $("#wmkText_control").width();
    var fatherHei = $("#wmkText_control").height();

    $("#wmk_control").css("margin-left",(srcWid-wid)/2 + (fatherWid-srcWid)/2);
    $("#wmk_control").css("margin-top",(fatherHei -hei)/2);
    $("#wmkText_control").css("padding-top",0);
  }

  public checkTextinfo(){
    if(this.wmkTextIsEmpty){
      this.wmkTextInfo = "";
      $("#wmk_text_info").css("color","#5c5c5c");
    }
  }

  public getTextInputInfo(){
    var pattern = /[<>&]/g;
    if(pattern.test(this.wmkTextInfo)){
      this.wmkTextInfo = this.wmkTextInfo.replace(pattern,"");
      (<HTMLInputElement>event.target).value = this.wmkTextInfo;
    }

    this.wmkTextIsEmpty = false;
    $("#wmkText_control").css("padding-top",0);
    var fatherHei = $("#wmkText_control").height();
    var element = $("span[id='watermark_text']");
    var temp =  this.wmkTextInfo.replace(/\n/g,'<br>');
    element.html(temp);

    this.tmpWmkTextInfo = this.wmkTextInfo.replace(/\n/g,'');
    this.tmpWmkTextInfo = this.tmpWmkTextInfo.replace(/\ +/g, '');

    this.setWmkTextLocation();

    this.resultWmkTextInfo = this.wmkTextInfo.replace(/\n/g,'<br/>');
  }

  public changeFontSize(){

    var strFontSize = $("#FontSize").find("option:selected").text();
    this.setWmkTextLocation();

    var scaleVal = Number(strFontSize) * 0.3;
    var fontSize = strFontSize + 'px';

    if(this.tmpWmkTextInfo =="foxitsoftware")
      this.resultWmkTextInfo = this.tmpWmkTextInfo;

    var text = this.resultWmkTextInfo;
    var element = $("span[id='watermark_text']");
    var wideWord = text.replace(/[^\x00-\xff]/g, '__');
    wideWord = wideWord.toString().replace(/\ +/g, '_');
    element.html(wideWord);

    $("#watermark_text").css("font-size",fontSize);

    this.setWmkTextLocation();
    element.html(this.resultWmkTextInfo);
  }

  public changeFontFamily(){
    var strFontName = $("#fontLists").find("option:selected").text();
    this.setWmkTextLocation();
    $("#watermark_text").css("font-family",strFontName);
    this.setWmkTextLocation();
  }

  //Opacity
  public checkOpacityValue(){
    if(this.wmkAlphaPercentage == "" || this.wmkAlphaPercentage == "%"){
      this.wmkAlphaPercentage = "50%";
      var scale = (242*50/100) + 'px';
      $("#btn").css("left",scale);
      $("#transparencyProgressBar").css("width",scale);
      $("#watermark_text").css("opacity",50/100);
    }
  }

  public checkOpacityInputValue(){

    var pattern = /[^0-9%]/g;
    if(pattern.test(this.wmkAlphaPercentage))
    {
      this.wmkAlphaPercentage = this.wmkAlphaPercentage.replace(pattern,"");
      (<HTMLInputElement>event.target).value = this.wmkAlphaPercentage;
    }

    var value = this.wmkAlphaPercentage;
    var extSize = this.wmkAlphaPercentage.indexOf('%');
    var fileLen = this.wmkAlphaPercentage.toString().length;
    if(extSize > -1 && extSize < fileLen-1){
      if(extSize == 0)
        value = "0";
      else
        value = this.wmkAlphaPercentage.substring(0,extSize);
    }

    var tmpValue = value.replace("%","");
    var validLen = tmpValue.length;
    if(validLen > 1){
      var headerWord = tmpValue.substring(0,1);
      if(headerWord == '0'){
        value = value.substring(1, validLen);
        tmpValue = value;
      }
    }

    var number = Number(tmpValue);
    if(number >100){
      value = "100";
      number = 100;
    }
    //this.wmkAlphaPercentage = value;
    (<HTMLInputElement>event.target).value = value;

    /*this.wmkAlphaPercentage = value;*/
    var scale = (242*number/100) + 'px';
    $("#btn").css("left",scale);
    $("#transparencyProgressBar").css("width",scale);
    $("#watermark_text").css("opacity",number/100);
  }

  public changeRorate(){
    $("#wmk_control").css("margin-left",0);
    this.setWmkTextLocation();
    var pattern = /[^0-9]/g;
    if(pattern.test(this.wmkRotateText)){
      this.wmkRotateText = this.wmkRotateText.replace(pattern,"");
      (<HTMLInputElement>event.target).value = this.wmkRotateText;
    }

    var newValue = this.wmkRotateText;
    var valueLen = this.wmkRotateText.toString().length;
    if(valueLen > 1){
      var header = this.wmkRotateText.toString().substring(0,1);
      if(header == '0')
        newValue = newValue.substring(1,valueLen);
    }

    var interValue = Number(newValue);
    if(interValue > 360)
      newValue = "360";

    interValue = 360-Number(newValue);
    var rotate = ' rotate(' + interValue + 'deg)';

    $("#wmkText_control").css("transform",rotate);
    this.setWmkTextLocation();
    //this.wmkRotateText = newValue;

    (<HTMLInputElement>event.target).value = newValue;
  }

  private setWarningInfoWhenTextIsEmpty(){
    this.wmkTextIsEmpty = true;
    /*var textValueInfo = "Please enter text to add a watermark.";
    this.wmkTextInfo = textValueInfo;*/
    this.translate.get('Webtools.Watermark.WmkTestIsEmpty').subscribe( (value:string) => {
      this.wmkTextInfo = value;
    } );
    $("#wmk_text_info").css("color","red");
  }

  private getWatermarkConfigure(){
    var conf = "";

    //get watermark text value
    var wmkText = this.wmkTextInfo;
    if(wmkText == "" || wmkText == undefined || this.wmkTextIsEmpty){
      this.setWarningInfoWhenTextIsEmpty();
      return "";
    }
    this.tmpWmkTextInfo = wmkText.replace(/\n/g,'');
    this.tmpWmkTextInfo = this.tmpWmkTextInfo.replace(/\ +/g, '');
    if(this.tmpWmkTextInfo == "" || this.tmpWmkTextInfo == undefined){
      this.setWarningInfoWhenTextIsEmpty();
      return "";
    }
    wmkText = wmkText.replace(/\n/g,'<br/>');

    //get opacity value
    var wmkOpacity = this.wmkAlphaPercentage;
    wmkOpacity = wmkOpacity.replace(/\%+/g, '');

    //get rotate value
    var wmkRotate = this.wmkRotateText;

    //get font size
    var wmkFontSize =  $("#FontSize").find("option:selected").text();

    //get font name
    var wmkFontName =  $("#fontLists").find("option:selected").text();

    //get font color
    var wmkColor = this.wmkTextColor;
    if(wmkColor == "")
      wmkColor = "#ff0000";

    wmkColor = wmkColor.substr(1);
    conf += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    conf += "<watermark Type=\"textObject\" Opacity=\"" + wmkOpacity + "\" ";
    conf += "Rotation=\"" + wmkRotate + "\" ";
    conf += "relativeScaleSelect=\"0\" scaleValue=\"100%\" ";
    conf += "offSetX=\"0\" offSetY=\"0\" OnTopOfPage=\"1\" NoPrint=\"0\" Invisible=\"0\" ShowKeep=\"0\" ";
    conf += "posx=\"1\" posy=\"1\" AllPage=\"true\" beginPage=\"1\" endPage=\"1\" SubSet=\"0\">";
    conf += "<textObject Size=\""+ wmkFontSize +"\" ";
    conf += "FontName=\"" + wmkFontName + "\" ";
    conf += "Color=\"" + "#ff" + wmkColor + "\" " + "UnderLine=\"false\">" + wmkText + "</textObject>";
    conf += "<fileObject pageNum=\"1\"></fileObject> </watermark>";

    return conf;
  }

  public addWatermark(){
    var conf = this.getWatermarkConfigure();
    if(conf == "")
      return;
    this.hideWatermarkPage();
    this.postParameterConf(conf,false);
  }
}
