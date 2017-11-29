/**
 * Created by rzg on 2017/7/4.
 */
import {Injectable} from '@angular/core';


declare var $: any;
declare var phantomOnlineGlobalConfig: any;
declare var CommonUtil:any;

@Injectable()
export class WebToolEntryService {
  EntryInfo = {
    ConvertInfo:"",
    PermissionInfo:"",
    SaveInfo:"",
    IsOnline:false
  };

  modeNameArray = new Map();

  public initEntryInfo = function(){
    this.EntryInfo.ConvertInfo = "";
    this.EntryInfo.PermissionInfo = "";
    this.EntryInfo.SaveInfo = "";
  }

  public initModeName = function(){
    this.modeNameArray[-1] = "";
    this.modeNameArray[0] = "PDF2CPDF";
    this.modeNameArray[1] = "Img2PDF";
    this.modeNameArray[2] = "CompressPDF";
    this.modeNameArray[3] = "Watermark";
    this.modeNameArray[4] = "MergePDF";
    this.modeNameArray[5] = "PDF2Text";
    this.modeNameArray[6] = "PDF2Img";
    this.modeNameArray[7] = "ProtectPDF";
    this.modeNameArray[8] = "RedactPDF";
    this.modeNameArray[9] = "HeaderFooter";
    this.modeNameArray[11] = "PDF2Word";
    this.modeNameArray[12] = "SplitPDF";
    this.modeNameArray[13] = "PageOrganizer";
    this.modeNameArray[14] = "PDF2Excel";
    this.modeNameArray[15] = "PDF2HTML";
    this.modeNameArray[16] = "Word2PDF";
    this.modeNameArray[17] = "PDFFlatten";
    this.modeNameArray[18] = "Excel2PDF";
    this.modeNameArray[19] = "PPT2PDF";
    this.modeNameArray[20] = "Text2PDF";
    this.modeNameArray[22] = "PDF2PPT";
  }

  constructor(){
    this.initModeName();
  }

  public getCodeByStatus = function(ret:any,isAllPages:any) {
    switch (ret) {
      case "0":
        if (!isAllPages)
          return "71000005";//page number large than 200
        else
          return "71000000";//success
      case "-2":
      case "83000002":
      case "83000004":
      case "83000005":
      case "83000006":
        return "71000001";//fail to upload
      case "84000001":
      case "84000002":
      case "84000003":
      case "84000004":
      case "84000005":
      case "84000006":
      case "82000020":
      case "82000021":
        return ret;  //other error,refer to the log file
      case "83000007":
      case "83000008":
      case "81000002":
      case "81000004":
      case "81000005":
      case "81000010":
      case "81000011":
      case "81000014":
      case "81000016":
      case "81000020":
      case "81000022":
      case "81000024":
      case "81000029":
      case "81000033":
      case "81000035":
      case "81000037":
      case "81000039":
      case "81000041":
      case "81000042":
      case "81000044":
      case "86000002":
      case "86000031":
      case "86000032":
      case "86000033":
      case "81000049":
      case "81000046":
      case "87000032":
        return "71000002";//fail to convert
      case "81000001":
      case "81000012":
      case "81000015":
      case "81000017":
      case "81000019":
      case "81000021":
      case "81000023":
      case "81000028":
      case "81000032":
      case "81000036":
      case "81000038":
      case "81000040":
      case "81000043":
      case "81000045":
      case "81000047":
      case "86000003":
      case "87000031":
        return "71000003";// file is encrypted
      case "81000034":
      case "81000048":
        return "71000004";// file is xfa
      case "86000060":
      case "86000062":
      case "86000064":
        return "71000007";
      case "86000061":
      case "86000063":
      case "86000065":
        return "71000008";
      default:
        return "-999"; // unknown error information
    }
  }

  public GetModeName = function(convertMode:any){
    let modeName = this.modeNameArray[convertMode];
    if(modeName == "" || modeName == null)
      return "";
    let entryLabel = 'Webtools.' + modeName + '.Title';
    return entryLabel;
  /*switch (convertMode) {
    case CommonUtil.ConvertType.PDFTOWORD:
      return 'Webtools.PDF2Word.Title';
    case CommonUtil.ConvertType.PDFTOEXCEL:
      return 'Webtools.PDF2Excel.Title';
    case CommonUtil.ConvertType.PDFTOTXT:
      return 'Webtools.PDF2Text.Title';
    case CommonUtil.ConvertType.PDFTOIMG:
      return 'Webtools.PDF2Img.Title';
    case CommonUtil.ConvertType.OPTIMIZER:
      return 'Webtools.CompressPDF.Title';
    case CommonUtil.ConvertType.SPLITPDF:
      return 'Webtools.SplitPDF.Title';
    case CommonUtil.ConvertType.WATERMARK:
      return 'Webtools.Watermark.Title';
    case CommonUtil.ConvertType.PDFHEADERFOOTER:
      return 'Webtools.HeaderFooter.Title';
    case CommonUtil.ConvertType.MERGEPDF:
      return 'Webtools.MergePDF.Title';
    case CommonUtil.ConvertType.IMGTOPDF:
      return 'Webtools.Img2PDF.Title';
    case CommonUtil.ConvertType.PDFTOHTML:
      return 'Webtools.PDF2HTML.Title';
    case CommonUtil.ConvertType.PDFTOCPDF:
      return 'Webtools.PDF2CPDF.Title';
    case CommonUtil.ConvertType.PDFPROTECT:
      return 'Webtools.ProtectPDF.Title';
    case CommonUtil.ConvertType.PDFREDACTOR:
      return 'Webtools.RedactPDF.Title';
    case CommonUtil.ConvertType.PAGEORGANIZER:
      return 'Webtools.PageOrganizer.Title';
    default:
      return "";
  }*/
  }

  public getSuccessInformation = function(convertMode:any){
    let modeName = this.modeNameArray[convertMode];
    if(modeName == "" || modeName == null)
      return "";
    let entryLabel = 'Webtools.' + modeName + '.Success';
    return entryLabel;

  /*switch (convertMode) {
    case CommonUtil.ConvertType.PDFTOWORD:
      return 'Webtools.PDF2Word.Success';
    case CommonUtil.ConvertType.PDFTOEXCEL:
      return 'Webtools.PDF2Excel.Success';
    case CommonUtil.ConvertType.PDFTOTXT:
      return 'Webtools.PDF2Text.Success';
    case CommonUtil.ConvertType.PDFTOIMG:
      return 'Webtools.PDF2Img.Success';
    case CommonUtil.ConvertType.OPTIMIZER:
      return 'Webtools.CompressPDF.Success';
    case CommonUtil.ConvertType.SPLITPDF:
      return 'Webtools.SplitPDF.Success';
    case CommonUtil.ConvertType.WATERMARK:
      return 'Webtools.Watermark.Success';
    case CommonUtil.ConvertType.PDFHEADERFOOTER:
      return 'Webtools.HeaderFooter.Success';
    case CommonUtil.ConvertType.MERGEPDF:
      return 'Webtools.MergePDF.Success';
    case CommonUtil.ConvertType.IMGTOPDF:
      return 'Webtools.Img2PDF.Success';
    case CommonUtil.ConvertType.PDFTOHTML:
      return 'Webtools.PDF2HTML.Success';
    case CommonUtil.ConvertType.PDFTOCPDF:
      return 'Webtools.PDF2CPDF.Success';
    case CommonUtil.ConvertType.PDFPROTECT:
      return 'Webtools.ProtectPDF.Success';
    case CommonUtil.ConvertType.PAGEORGANIZER:
      return 'Webtools.PageOrganizer.Success';
    default:
      return "";
  }*/
  }

  public getFailureInformation = function(convertMode:any){
    let modeName = this.modeNameArray[convertMode];
    if(modeName == "" || modeName == null)
      return "";
    let entryLabel = 'Webtools.' + modeName + '.FailConvert';
    return entryLabel;

  /*switch (convertMode) {
    case CommonUtil.ConvertType.PDFTOWORD:
      return 'Webtools.PDF2Word.FailConvert';
    case CommonUtil.ConvertType.PDFTOEXCEL:
      return 'Webtools.PDF2Excel.FailConvert';
    case CommonUtil.ConvertType.PDFTOTXT:
      return 'Webtools.PDF2Text.FailConvert';
    case CommonUtil.ConvertType.PDFTOIMG:
      return 'Webtools.PDF2Img.FailConvert';
    case CommonUtil.ConvertType.OPTIMIZER:
      return 'Webtools.CompressPDF.FailConvert';
    case CommonUtil.ConvertType.SPLITPDF:
      return 'Webtools.SplitPDF.FailConvert';
    case CommonUtil.ConvertType.WATERMARK:
      return 'Webtools.Watermark.FailConvert';
    case CommonUtil.ConvertType.PDFHEADERFOOTER:
      return 'Webtools.HeaderFooter.FailConvert';
    case CommonUtil.ConvertType.MERGEPDF:
      return 'Webtools.MergePDF.FailConvert';
    case CommonUtil.ConvertType.IMGTOPDF:
      return 'Webtools.Img2PDF.FailConvert';
    case CommonUtil.ConvertType.PDFTOHTML:
      return 'Webtools.PDF2HTML.FailConvert';
    case CommonUtil.ConvertType.PDFTOCPDF:
      return 'Webtools.PDF2CPDF.FailConvert';
    case CommonUtil.ConvertType.PDFPROTECT:
      return 'Webtools.ProtectPDF.FailConvert';
    case CommonUtil.ConvertType.PAGEORGANIZER:
      return 'Webtools.PageOrganizer.FailConvert';
    default:
      return "";
  }*/
  }

  public getLimitPageSizeInformation = function(convertMode:any) {
    let modeName = this.modeNameArray[convertMode];
    if (modeName == "" || modeName == null)
      return "";
    let entryLabel = 'Webtools.' + modeName + '.LimitPageSize';
    return entryLabel;
  }

  public getDrmNoLogginInformation = function(convertMode:any) {
    let modeName = this.modeNameArray[convertMode];
    if (modeName == "" || modeName == null)
      return "";
    let entryLabel = 'Webtools.' + modeName + '.Drm_NoLoggin';
    return entryLabel;
  }

  public getDrmNoPermissionInformation = function(convertMode:any) {
    let modeName = this.modeNameArray[convertMode];
    if (modeName == "" || modeName == null)
      return "";
    let entryLabel = 'Webtools.' + modeName + '.Drm_NoPermission';
    return entryLabel;
  }

  public getErrorEntry = function(ret:any,isAllPages:any,convertMode:any, isOnline:boolean){
    this.initEntryInfo();
    var result = this.getCodeByStatus(ret,isAllPages);
    var entry = "";
    var convertFail = "Webtools.Error.71000001";
    var permission = "Webtools.Error.71000003";
    var xfa = "Webtools.Error.71000004";
    var pageNumberIsOverstep = "Webtools.Common.PageNumberIsOverstep";
    var SaveInfo = isOnline?"Webtools.SaveFile.Tip.SaveTo":"";
    switch (result){
      case "71000000":{
        entry = this.getSuccessInformation(convertMode);
        this.EntryInfo.ConvertInfo = entry;
        this.EntryInfo.SaveInfo = SaveInfo;
        if(isOnline)
          this.EntryInfo.IsOnline = true;
        break;
      }
      case "71000001":{
        this.EntryInfo.ConvertInfo = convertFail;
        break;
      }
      case "71000002":{
        entry = this.getFailureInformation(convertMode);
        this.EntryInfo.ConvertInfo = entry;
        break;
      }
      case "71000003":{
        entry = this.getFailureInformation(convertMode);
        this.EntryInfo.ConvertInfo = entry;
        this.EntryInfo.PermissionInfo = permission;
        break;
      }
      case "71000004":{
        entry = this.getFailureInformation(convertMode);
        this.EntryInfo.ConvertInfo = entry;
        this.EntryInfo.PermissionInfo = xfa;
        break;
      }
      case "71000005":{
        entry = this.getSuccessInformation(convertMode);
        this.EntryInfo.ConvertInfo = entry;
        this.EntryInfo.PermissionInfo = pageNumberIsOverstep;
        this.EntryInfo.SaveInfo = SaveInfo;
        if(isOnline)
          this.EntryInfo.IsOnline = true;
        break;
      }
      case "71000007":{
        entry = this.getDrmNoLogginInformation(convertMode);
        this.EntryInfo.ConvertInfo = entry;
        break;
      }
      case "71000008":{
        entry = this.getDrmNoPermissionInformation(convertMode);
        this.EntryInfo.ConvertInfo = entry;
        break;
      }

      case "82000020":{
        this.EntryInfo.ConvertInfo = "Webtools.Error." + result;
        break;
      }
      case "82000021":{
        entry = this.getFailureInformation(convertMode);
        this.EntryInfo.ConvertInfo = entry;
        this.EntryInfo.PermissionInfo = this.getLimitPageSizeInformation(convertMode);
        break;
      }
      case "84000001":
      case "84000002":
      case "84000003":
      case "84000004":
      case "84000005":
      case "84000006":{
        entry = this.getSuccessInformation(convertMode);
        this.EntryInfo.ConvertInfo = entry;
        this.EntryInfo.SaveInfo = "Webtools.Error." + result;
        break;
      }
    }

    return this.EntryInfo;
  }

  public getSolidInfoByType = function(type:any){
    let modeName = this.modeNameArray[type];
    if(modeName == "" || modeName == null)
      return "";
    let entryLabel = 'Webtools.' + modeName + '.SolidInfo';
    return entryLabel;
  }
}
