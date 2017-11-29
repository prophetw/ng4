/**
 * Created by rzg on 2017/6/7.
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
  selector: 'webtool-splitpdf',
  templateUrl: './webtool.splitpdf.convert.html',
  styleUrls: ['./webtool.splitpdf.convert.css']
})
export class WebToolSplitPDFComponent implements OnInit {
  @ViewChild('webtool_splitpdf') webtool_splitpdf: ModalDirective;

  private isSplitFullPages:boolean = true;
  private isValidSplitRange:boolean =false;
  private isValidExtractRange:boolean = false;
  private pageCount:number = 0;
  private global_rangeinfo: string = "";

  public example:string = 'Webtools.SplitPDF.Example';

  public SplitMaxPageText:string = "";
  public SplitExtractRangeText:string = "";

  public TotalPageInfo ="(Total pages:0)";
  private setSplitConfigureFunc:any = null;

  private SplitButtonStyle_Normal:string = "background-color: #f7f7f7;color: #666666;border-color:#d1d1d1;";
  private SplitButtonStyle_Hover:string  = "background-color: #eaeaea;color: #666666;border-color:#d1d1d1;";
  private SplitButtonStyle_Active:string = "background-color: #e1e1e1;color: #666666;border-color:#c3c3c3;";
  private SplitButtonStyle_Unused:string = "background-color: #f7f7f7;color: #cccccc;border-color:#d1d1d1;";

  ngOnInit() {
    this.initSplitPage();
  }

  constructor(private translate: TranslateService) {
  }

  private initSplitPage(){
    $("#extract_range").attr("disabled",true);
    $("#extract_range").css("border-color","");
    $("#split_range").attr("disabled",false);
    $("#setExtractInfo p").css("opacity","0.5");
    $("#setSplitInfo p").css("opacity","1");
    $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
  }

  public SelectSplitMode_FromReader(){
    $("#extract_range").attr("disabled",true);
    $("#extract_range").css("border-color","");
    $("#split_range").attr("disabled",false);
    $("#setExtractInfo p").css("opacity","0.5");
    $("#setSplitInfo p").css("opacity","1");
    if(this.isValidSplitRange){
      $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
    }else{
      $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
    }

    this.isSplitFullPages = true;
}

  public SelectExtractMode_FromReader(){
    $("#split_range").attr("disabled",true);
    $("#split_range").css("border-color","");
    $("#extract_range").attr("disabled",false);
    $("#setSplitInfo p").css("opacity","0.5");
    $("#setExtractInfo p").css("opacity","1");
    if(this.isValidExtractRange){
      $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
    }else{
      $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
    }
    this.isSplitFullPages = false;
  }

  public CheckSplitRange(){
    var pattern = /[^0-9]/g;
    if(pattern.test(this.SplitMaxPageText))
    {
      this.SplitMaxPageText = this.SplitMaxPageText.replace(pattern,"");
      (<HTMLInputElement>event.target).value = this.SplitMaxPageText;
      if(this.SplitMaxPageText == ""){
        $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
        this.isValidSplitRange = false;
      }
      return;
    }
    var count = Number(this.SplitMaxPageText);
    if(count > this.pageCount || count == 0){
      $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Unused);
      this.isValidSplitRange = false;
    }else{
      $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
      this.isValidSplitRange = true;
    }
  }

  private setButtonColor(idName:any){
    if(this.global_rangeinfo == ""){
      this.isValidExtractRange = false;
      $(idName).attr("style", this.SplitButtonStyle_Unused);
    }else{
      this.isValidExtractRange = true;
      if(idName == "#SplitPDFButton"){
        $(idName).attr("style", this.SplitButtonStyle_Normal);
      }else{
        $(idName).attr("style", this.SplitButtonStyle_Normal);
      }
    }
  }

  public CheckExtractRange(){
    var pattern = /[^0-9-,]/g;
    if(pattern.test(this.SplitExtractRangeText))
    {
      (<HTMLInputElement>event.target).value = this.SplitExtractRangeText.replace(pattern,"");
      return;
    }
    this.global_rangeinfo = "";
    var rangeArray= new Array();
    rangeArray=this.SplitExtractRangeText.split(",");

    for (var i=0;i<rangeArray.length ;i++ )
    {
      var rangeInfo = rangeArray[i];
      if(rangeInfo == ""){
        continue;
      }

      var pageNum = new Array();
      pageNum = rangeInfo.split("-");
      if(pageNum.length > 2)
        continue;
      if(pageNum.length == 2){
        if(pageNum[0]=="" || pageNum[1]=="")
          continue;
        else{
          var firstValue = Number(pageNum[0]);
          var secondValue = Number(pageNum[1]);
          if(firstValue > secondValue)
            continue;
          if(firstValue == 0 || secondValue ==0)
            continue;

          if(secondValue > this.pageCount)
            continue;
          this.global_rangeinfo += rangeInfo + ",";
        }
      }
      else{
        var value = Number(pageNum[0]);
        if(value == 0 || value > this.pageCount)
          continue;
        this.global_rangeinfo += rangeInfo + ",";
      }
    }

    if(this.global_rangeinfo.length != 0 && this.global_rangeinfo[this.global_rangeinfo.length-1] == ','){
      this.global_rangeinfo = this.global_rangeinfo.substring(0, this.global_rangeinfo.length-1);
    }

    this.setButtonColor("#SplitPDFButton");
  }

  private getDataJsonFromExtractPagesMode(){
    var jsonData = "";
    jsonData += "{\"splitmode\":\"extractpages\",";
    jsonData += "\"maxpage\":\"1\",";
    jsonData += "\"rangeinfo\":\"" + this.global_rangeinfo +"\"}";

    return jsonData;
  }

  private getDataJsonFromSplitPDFMode_Reader(){
    var jsonData = "";

    var maxpage = this.SplitMaxPageText;
    if(maxpage == undefined || maxpage == "") {
      return "";
    } else if(parseInt(maxpage) == 0) {
      return "";
    } else {
      if(parseInt(maxpage) > this.pageCount){
        return "";
      }
      jsonData += "{\"splitmode\":\"splitpage\",\"maxpage\":\"" + maxpage + "\"}";
    }

    return jsonData;
  }

  private getSplitDataJson() {
    if(!this.isSplitFullPages && this.global_rangeinfo == "")
      return "";

    var jsonData = "";
    if(this.isSplitFullPages){
      jsonData = this.getDataJsonFromSplitPDFMode_Reader();
    }else{
      jsonData = this.getDataJsonFromExtractPagesMode();
    }

    return jsonData;
  }

  public showSplitPDFPage(pageCount:number,callbackFunc:any){
    this.pageCount = pageCount;

    this.translate.get('Webtools.SplitPDF.TotalPage').subscribe( (value:string) => {
      this.TotalPageInfo = value + pageCount;
    } );
    /*this.TotalPageInfo = "Total page:" + pageCount;*/
    this.setSplitConfigureFunc = callbackFunc;
    this.webtool_splitpdf.show()
  }

  public hideSplitPDFPage(){
    this.webtool_splitpdf.hide();
  }

  public onStartSplitPDF(){
    var conf = this.getSplitDataJson();
    if(conf == "")
      return;

    $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Active);
    this.hideSplitPDFPage();
    this.setSplitConfigureFunc(conf, this.isSplitFullPages);
  }

  public mouseEnterEvent(){
    if(this.isSplitFullPages){
      if(this.isValidSplitRange){
        $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Hover);
      }
    }else{
      if(this.isValidExtractRange){
        $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Hover);
      }
    }
  }

  public mouseLeaveEvent(){
    if(this.isSplitFullPages){
      if(this.isValidSplitRange){
        $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
      }
    }else{
      if(this.isValidExtractRange){
        $("#SplitPDFButton").attr("style", this.SplitButtonStyle_Normal);
      }
    }
  }
}
