
var CommonUtil = {
};

CommonUtil.ConvertType = {
  UNKNOWN : -1,
  PDFTOCPDF : 0,
  IMGTOPDF : 1,
  OPTIMIZER : 2,
  WATERMARK : 3,
  MERGEPDF : 4,
  PDFTOTXT : 5,
  PDFTOIMG : 6,
  PDFPROTECT : 7,
  PDFREDACTOR : 8,
  PDFHEADERFOOTER : 9,
  ROTATEPDF : 10,
  PDFTOWORD : 11,
  SPLITPDF : 12,
  PAGEORGANIZER : 13,
  PDFTOEXCEL : 14,
  PDFTOHTML : 15,
  WORDTOPDF : 16,
  PDFFLATTEN : 17,
  EXCELTOPDF : 18,
  PPTTOPDF : 19,
  TEXTTOPDF : 20,
  HTML2PDF : 21,
  PDFTOPPT : 22
}

CommonUtil.getGAToolNameByType = function (type) {
  var name = "";
  switch (type){
    case CommonUtil.ConvertType.PDFTOCPDF:{
      name = "online_pdf_to_cpdf";
      break;
    }
    case CommonUtil.ConvertType.IMGTOPDF:{
      name = "online_image_to_pdf";
      break;
    }
    case CommonUtil.ConvertType.OPTIMIZER:{
      name = "online_compress_pdf";
      break;
    }
    case CommonUtil.ConvertType.WATERMARK:{
      name = "online_watermark";
      break;
    }
    case CommonUtil.ConvertType.MERGEPDF:{
      name = "online_merge_pdf";
      break;
    }
    case CommonUtil.ConvertType.PDFTOTXT:{
      name = "online_pdf_to_text";
      break;
    }
    case CommonUtil.ConvertType.PDFTOIMG:{
      name = "online_pdf_to_image";
      break;
    }
    case CommonUtil.ConvertType.PDFPROTECT:{
      name = "online_password_protect";
      break;
    }
    case CommonUtil.ConvertType.PDFREDACTOR:{
      name = "online_redact_pdf";
      break;
    }
    case CommonUtil.ConvertType.PDFHEADERFOOTER:{
      name = "online_header_footer";
      break;
    }
    case CommonUtil.ConvertType.ROTATEPDF:{
      break;
    }
    case CommonUtil.ConvertType.PDFTOWORD:{
      name = "online_pdf_to_word";
      break;
    }
    case CommonUtil.ConvertType.SPLITPDF:{
      name = "online_split_pdf";
      break;
    }
    case CommonUtil.ConvertType.PAGEORGANIZER:{
      name = "online_page_organizer";
      break;
    }
    case CommonUtil.ConvertType.PDFTOEXCEL:{
      name = "online_pdf_to_excel";
      break;
    }
    case CommonUtil.ConvertType.PDFTOHTML:{
      name = "online_pdf_to_html";
      break;
    }
    case CommonUtil.ConvertType.WORDTOPDF:{
      name = "online_word_to_pdf";
      break;
    }
    case CommonUtil.ConvertType.PDFFLATTEN:{
      name = "online_flatten_pdf";
      break;
    }
    case CommonUtil.ConvertType.EXCELTOPDF:{
      name = "online_excel_to_pdf";
      break;
    }
    case CommonUtil.ConvertType.PPTTOPDF:{
      name = "online_ppt_to_pdf";
      break;
    }
    case CommonUtil.ConvertType.TEXTTOPDF:{
      name = "online_text_to_pdf";
      break;
    }
    case CommonUtil.ConvertType.HTML2PDF:{
      name = "online_html_to_pdf";
      break;
    }
    case CommonUtil.ConvertType.PDFTOPPT:{
      name = "online_pdf_to_ppt";
      break;
    }
    case CommonUtil.ConvertType.UNKNOWN:{
      break;
    }
    default:
      break;
  }
  return name;
}

CommonUtil.FileAddress = {
  Location:0,
  FoxitDrive:1,
  Box: 2,
  Dropbox: 3,
  GoogleDrive: 4,
  OneDrive: 5
}

CommonUtil.addGAInfoByType = function(type){
  var gaToolName = CommonUtil.getGAToolNameByType(type);
  if (!CommonUtil.isNullOrUndefined(gaToolName)){
    if (ga && typeof ga === 'function') {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Foxit Tools',
        eventAction: gaToolName+ '_click',
        eventLabel: gaToolName
        //eventValue: window.location.href
      });
    }
  }
}

CommonUtil.isNavigateToWebPDF = function(type){
  if(type == CommonUtil.ConvertType.PDFREDACTOR ||
     type == CommonUtil.ConvertType.PAGEORGANIZER){
    return true;
  }
  return false;
}

CommonUtil.isNeedAutoDownloadMode = function(type, isOnline){
  if(type == CommonUtil.ConvertType.IMGTOPDF ||
    type == CommonUtil.ConvertType.MERGEPDF)
    return false;
  if(!isOnline)
    return true;
  return false;
  /*

  if( type == CommonUtil.ConvertType.OPTIMIZER ||
    type == CommonUtil.ConvertType.WATERMARK ||
    type == CommonUtil.ConvertType.PDFPROTECT ||
    type == CommonUtil.ConvertType.PDFREDACTOR ||
    type == CommonUtil.ConvertType.PDFHEADERFOOTER ||
    type == CommonUtil.ConvertType.ROTATEPDF ||
    type == CommonUtil.ConvertType.PAGEORGANIZER ||
    type == CommonUtil.ConvertType.WORDTOPDF ||
    type == CommonUtil.ConvertType.PPTTOPDF ||
    type == CommonUtil.ConvertType.EXCELTOPDF ||
    type == CommonUtil.ConvertType.TEXTTOPDF ||
    type == CommonUtil.ConvertType.PDFFLATTEN){
    return false;
  }
  return true;*/
}

CommonUtil.isNeedToBePreview = function(type, isOnline){
  switch (type){
    case CommonUtil.ConvertType.SPLITPDF:
    case CommonUtil.ConvertType.PDFTOTXT:
    case CommonUtil.ConvertType.PDFTOIMG:
    case CommonUtil.ConvertType.PDFTOWORD:
    case CommonUtil.ConvertType.PDFTOEXCEL:
    case CommonUtil.ConvertType.PDFTOHTML:
    case CommonUtil.ConvertType.PDFTOPPT:
    case CommonUtil.ConvertType.UNKNOWN:{
      return false;
    }
    default:
        break;
  }
  return true;
}

CommonUtil.isUploadMultiFiles = function(type){
  if(type == CommonUtil.ConvertType.IMGTOPDF ||
    type == CommonUtil.ConvertType.MERGEPDF ){
    return true;
  }
  return false;
}

CommonUtil.isNeedShowConfigPanel = function(type){
  if(type == CommonUtil.ConvertType.PDFHEADERFOOTER ||
    type == CommonUtil.ConvertType.PDFPROTECT ||
    type == CommonUtil.ConvertType.WATERMARK ||
    type == CommonUtil.ConvertType.SPLITPDF){
    return true;
  }
  return false;
}


CommonUtil.isModifyOnPDF = function(type){
  if(type == CommonUtil.ConvertType.PDFTOCPDF ||
    //type == CommonUtil.ConvertType.OPTIMIZER ||
    type == CommonUtil.ConvertType.WATERMARK ||
    //type == CommonUtil.ConvertType.PDFPROTECT ||
    type == CommonUtil.ConvertType.PDFREDACTOR ||
    type == CommonUtil.ConvertType.PDFHEADERFOOTER ||
    type == CommonUtil.ConvertType.ROTATEPDF ||
    type == CommonUtil.ConvertType.PAGEORGANIZER ||
    type == CommonUtil.ConvertType.PDFFLATTEN) {
    return true;
  }
  return false;
}

CommonUtil.getCodeByStatus = function(ret,isAllPages){
  switch (ret){
    case "0":
      if(!isAllPages)
        return "71000005";
      else
        return "71000000";
    case "-2":
    case "83000004":
    case "83000005":
    case "83000006":
      return "71000001";
    case "81000014":
    case "83000007":
    case "83000008":
    case "81000029":
    case "81000033":
    case "81000035":
    case "81000041":
    case "81000011":
    case "81000037":
    case "81000039":
    case "81000022":
    case "81000020":
    case "81000001":
      return "71000002";
    case "81000019":
    case "81000021":
    case "81000038":
    case "81000036":
    case "81000012":
    case "81000040":
    case "81000032":
    case "81000028":
    case "81000015":
      return "71000003";
    case "81000034":
      return "71000004";
    default:
      return "-999";
  }
}

CommonUtil.getCurrentDate = function(){
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth()+1;
  month = (Array(2).join(0)+month).slice(-2)
  var day = myDate.getDate();
  day = (Array(2).join(0)+day).slice(-2);
  var hour = myDate.getHours();
  hour = (Array(2).join(0)+hour).slice(-2);
  var min = myDate.getMinutes();
  min = (Array(2).join(0)+min).slice(-2);
  var sec = myDate.getSeconds();
  sec = (Array(2).join(0)+sec).slice(-2);
  var minS = myDate.getMilliseconds();
  minS = (Array(3).join(0)+minS).slice(-3);

  return year + month + day + hour + min + sec + minS;
}

CommonUtil.getOutputFileName = function (type, srcFileName, isExtractPages) {
  var _output = "";
  var myFileName = srcFileName.substr(0, srcFileName.lastIndexOf('.'))
  switch (type){
    case CommonUtil.ConvertType.WORDTOPDF:
    case CommonUtil.ConvertType.EXCELTOPDF:
    case CommonUtil.ConvertType.PPTTOPDF:
    case CommonUtil.ConvertType.TEXTTOPDF:
    case CommonUtil.ConvertType.HTML2PDF: {
      _output = myFileName + ".pdf";
      break;
    }
    case CommonUtil.ConvertType.PDFTOTXT:{
      _output = myFileName + ".txt";
      break;
    }
    case CommonUtil.ConvertType.PDFTOIMG:{
      _output = myFileName + ".zip";
      break;
    }
    case CommonUtil.ConvertType.SPLITPDF:  {
      _output = myFileName + ".zip";
      if(isExtractPages){
        _output = srcFileName;
      }
      break;
    }
    case CommonUtil.ConvertType.PDFTOWORD:{
      _output = myFileName + ".docx";
      break;
    }
    case CommonUtil.ConvertType.PDFTOEXCEL:{
      _output = myFileName + ".xlsx";
      break;
    }
    case CommonUtil.ConvertType.PDFTOPPT:{
      _output = myFileName + ".pptx";
      break;
    }
    case CommonUtil.ConvertType.PDFTOHTML:{
      _output = myFileName + ".html";
      break;
    }
    default:{
      _output = srcFileName;
    }
  }

  return _output;
}

/*
* params={}
* params.cloudUrl;
* params.token;
* params.docId;
* params.fileName;
* params.autoRename;
* params.type;
*
* successCallBack(json);
* errorCallBack(json);
* json: {ret:0; msg: "xxx" , docId?: ""};
* cloudUrl,token, docId, fileName, fileUrl, autoRename, type
* */
CommonUtil.saveToCloud = function( params, callBack){
  var cloudUrl = params.cloudUrl;
  var token = params.token;
  var docId = params.docId;
  var fileName = params.fileName;
  var isExtractPages = params.isExtractPages;
  var onlineDocPath = params.onlineDocPath;

  var autoRename = params.autoRename;
  var type = params.type;
  var isLocalFile = params.isLocalFile;

  if (type == CommonUtil.ConvertType.UNKNOWN){
    console.log("upload file to cmis, type is unknown, failed.")
    return;
  }

  var serverUrl = cloudUrl + "api/v3/document/cmis?access-token=";
  serverUrl += token;
  if (docId != null ){
    //data.append('id', docId);
    if(CommonUtil.isModifyOnPDF(type))
      serverUrl += "&id=" + window.encodeURIComponent(docId);
  }

  if(!CommonUtil.isNullOrUndefined(onlineDocPath)){
    serverUrl += "&path=" + window.encodeURIComponent(onlineDocPath);
  }

  var xhr = new XMLHttpRequest();
  xhr.open('post', serverUrl, true);
  var data = new FormData();

  fileName = CommonUtil.getOutputFileName(type, fileName, isExtractPages);

  if( CommonUtil.isNullOrUndefined(isLocalFile)){
    var fileUrl = params.fileUrl;
    data.append('file_url', fileUrl);
  }else {
    var file = params.file;
    data.append('file', file);
  }

  data.append('name', fileName);
  data.append('auto_rename', autoRename);

  xhr.onload = function(ev) {
    //console.log("upload file to cmis, success. " + this.responseText)
    var json = CommonUtil.commonJsonParser(ev.currentTarget.responseText);
    // response error
    if ( ev.currentTarget.status != 200
      || CommonUtil.isNullOrUndefined(json)
      || (json.code != undefined && json.code != null) ){
      var err = "84000002";
      var msg = "cloud error.";
      if(!CommonUtil.isNullOrUndefined(json) && !CommonUtil.isNullOrUndefined(json.code) ){
        if(json.code == 200011)
          err = "84000001";
        msg = json.message;
      }
      console.log("upload file info  to cmis, error. msg:" + ev.currentTarget.responseText)
      if(callBack != undefined && callBack != null){
        var result = {ret:err, msg: msg};
        callBack(result);
      }

    }else if(json.doc_id != undefined && json.doc_id != null){
      //console.log("upload file info  to cmis, success. name:" + json.properties["cmis:name"]);
      var properties = json.properties;
      console.log("upload file info  to cmis, success."+ "doc_id=" + json.doc_id +", name:" + properties["cmis:name"]);
      if(callBack != undefined && callBack != null){
        var result = {ret:"0", msg:"success.", docId: json.doc_id};
        callBack(result);
      }
    }

  }
  xhr.onerror = function() {
    console.log("upload file to cmis, failed. " + this.responseText)
    if(callBack != undefined && callBack != null){
      var result = {ret:"84000002", msg:"Network error."};
      callBack(result);
    }
  }

  try{
    xhr.send(data);
  }catch(e) {
    var result = {ret:"84000002", msg:"Network error."};
    callBack(result);
  };
}

CommonUtil.isNullOrUndefined = function(obj){
  if (obj == null || obj == undefined || obj == '')
    return true;
  return false;
}

/**
 * @brief json data parser
 */
CommonUtil.commonJsonParser = function(data) {
  if(data == '' || data == "")
    return data;
  if (typeof (data) == "object")
    return data;
  var obj = null;
  if (window.JSON) {
    try {
      obj = JSON.parse(data);
    }catch (e) {
      obj = null;
    }
  } else {
    obj = eval("(" + data + ")");
  }
  return obj;
}

/**
 *
 */
CommonUtil.commonBase64Encode = function(szInput) {
  if (undefined == window.btoa) {
    return CommonUtil.base64Encode(szInput);
  } else {
    return window.btoa(szInput);
  }
}

/**
 *
 */
CommonUtil.commonBase64Decode = function(szInput) {
  if (undefined == window.atob) {
    return CommonUtil.base64Decode(szInput);
  } else {
    return window.atob(szInput);
  }
}

/**
 *
 */
CommonUtil.base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
CommonUtil.base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1,
  63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
  50, 51, -1, -1, -1, -1, -1);

/**
 * base64 encode
 *
 * @param {Object}
 *            szInput
 */
CommonUtil.base64Encode = function(szInput) {
  var c1, c2, c3;
  var szOutput;
  var index;
  var len;

  len = szInput.length;
  index = 0;
  szOutput = "";
  while (index < len) {
    c1 = szInput.charCodeAt(index++) & 0xff;
    if (index == len) {
      szOutput += CommonUtil.base64EncodeChars.charAt(c1 >> 2);
      szOutput += CommonUtil.base64EncodeChars.charAt((c1 & 0x3) << 4);
      szOutput += "==";
      break;
    }
    c2 = szInput.charCodeAt(index++);
    if (index == len) {
      szOutput += CommonUtil.base64EncodeChars.charAt(c1 >> 2);
      szOutput += CommonUtil.base64EncodeChars.charAt(((c1 & 0x3) << 4)
        | ((c2 & 0xF0) >> 4));
      szOutput += CommonUtil.base64EncodeChars.charAt((c2 & 0xF) << 2);
      szOutput += "=";
      break;
    }
    c3 = szInput.charCodeAt(index++);
    szOutput += CommonUtil.base64EncodeChars.charAt(c1 >> 2);
    szOutput += CommonUtil.base64EncodeChars.charAt(((c1 & 0x3) << 4)
      | ((c2 & 0xF0) >> 4));
    szOutput += CommonUtil.base64EncodeChars.charAt(((c2 & 0xF) << 2)
      | ((c3 & 0xC0) >> 6));
    szOutput += CommonUtil.base64EncodeChars.charAt(c3 & 0x3F);
  }
  return szOutput;
}

/**
 * base64 encode
 *
 * @param {Object}
 *            szInput
 */
CommonUtil.base64Decode = function(szInput) {
  var c1, c2, c3, c4;
  var szOutput;
  var index;
  var len;

  len = szInput.length;
  index = 0;
  szOutput = "";
  while (index < len) {
    /* c1 */
    do {
      c1 = CommonUtil.base64DecodeChars[szInput.charCodeAt(index++) & 0xff];
    } while (index < len && c1 == -1);
    if (c1 == -1)
      break;
    /* c2 */
    do {
      c2 = CommonUtil.base64DecodeChars[szInput.charCodeAt(index++) & 0xff];
    } while (index < len && c2 == -1);
    if (c2 == -1)
      break;
    szOutput += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    /* c3 */
    do {
      c3 = szInput.charCodeAt(index++) & 0xff;
      if (c3 == 61)
        return szOutput;
      c3 = CommonUtil.base64DecodeChars[c3];
    } while (index < len && c3 == -1);
    if (c3 == -1)
      break;
    szOutput += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
    /* c4 */
    do {
      c4 = szInput.charCodeAt(index++) & 0xff;
      if (c4 == 61)
        return szOutput;
      c4 = CommonUtil.base64DecodeChars[c4];
    } while (index < len && c4 == -1);
    if (c4 == -1)
      break;
    szOutput += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return szOutput;
}

/**
 * utf16 to utf8
 *
 * @param {Object}
 *            str
 */
CommonUtil.utf16_to_utf8 = function(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

/**
 * utf8 to utf16
 *
 * @param {Object}
 *            szInput
 */
CommonUtil.utf8_to_utf16 = function(szInput) {
  var out, i, len, c;
  var char2, char3;
  out = "";
  len = szInput.length;
  i = 0;
  while (i < len) {
    c = szInput.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += szInput.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = szInput.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx10xx xxxx10xx xxxx
        char2 = szInput.charCodeAt(i++);
        char3 = szInput.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12)
          | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
        break;
    }
  }
  return out;
}

CommonUtil.base64EncodeAfterComponent = function(szInput){
  return CommonUtil.commonBase64Encode(window.encodeURIComponent(szInput));
}

CommonUtil.base64DecodeAfterComponent = function(szInput){
  return window.decodeURIComponent(CommonUtil.commonBase64Decode(szInput));
}

CommonUtil.getBrowserInfo = function() {
  var agent = navigator.userAgent.toLowerCase();
  var regStr_ie = /msie [\d.]+;/gi;

  var regStr_ff = /firefox\/[\d.]+/gi;
  var regStr_chrome = /chrome\/[\d.]+/gi;
  var regStr_saf = /safari\/[\d.]+/gi;
  var regStr_oprera = /opr\/[\d.]+/gi;
  var regStr_edge = /edge\/[\d.]+/gi;

  var browser_name = "";
  var browser_info = "";

  /*
   * if(agent.indexOf("msie") > 0){ //IE browser_name = "IE"; browser_info =
   * agent.match(regStr_ie) ; }else{
   */
  var rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
  var match = rMsie.exec(agent);
  if (match != null) {
    browser_name = "IE";
    browser_info = match[2] || "0";
  } else if (agent.indexOf("firefox") > 0) {
    // firefox
    browser_name = "FireFox";
    browser_info = agent.match(regStr_ff);
  } else if (agent.indexOf("opr") > 0) {
    // Opera
    browser_name = "Chrome";
    browser_info = agent.match(regStr_oprera);
  } else if (agent.indexOf("edge") > 0) {
    // Edge
    browser_name = "Chrome";
    browser_info = agent.match(regStr_oprera);
  } else if (agent.indexOf("chrome") > 0) {
    // Chrome
    browser_name = "Chrome";
    browser_info = agent.match(regStr_chrome);
  } else if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
    // safari
    browser_name = "Safari";
    browser_info = agent.match(regStr_saf);
  } else {
    browser_name = "Other_Browser";
    browser_info = "0";
  }
  var verinfo = (browser_info + "").replace(/[^0-9.]/ig, "");

  var ip = browser_name + "-" + verinfo;

  return ip;
}

CommonUtil.ResetFileName = function(fileName,newLenght){
  var newFileName = "";
  if(fileName.length < newLenght || newLenght < 7)
    return fileName;

  var pos = fileName.lastIndexOf('.');
  if(pos > 0){
    var tmpName = fileName.substring(0,pos);
    if(pos-3 <=0)
      return fileName;
    var endName = fileName.substring(pos-3,fileName.length);

    var startNameLen = newLenght - endName.length - 3;
    if(startNameLen <= 0)
      return fileName;
    var startName = fileName.substring(0, startNameLen);

    newFileName = startName + "..." + endName;
  }
  return newFileName;
}

CommonUtil.getFileSize = function(size) {
  if (!size)
    return "";

  var num = 1024.00; //byte

  if (size < num)
    return size + "B";
  if (size < Math.pow(num, 2))
    return (size / num).toFixed(2) + "KB"; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + "GB"; //G
  return (size / Math.pow(num, 4)).toFixed(2) + "TB"; //T
}

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

CommonUtil.getDateByFormat = function(format){
  var formatTime = new Date().Format(format);
  return formatTime;
}

CommonUtil.GetFileExtension = function(fileName){
  var nPos=fileName.lastIndexOf(".");
  if(nPos <= 0)
    return "";
  var nFileLen=fileName.length;
  var suffix=fileName.substring(nPos+1,nFileLen);//后缀名
  return suffix;
}

CommonUtil.isSupportedFile = function(fileName,convertMode){
  var extName = CommonUtil.GetFileExtension(fileName);
  if(extName == "")
    return false;
  extName = extName.toLowerCase();
  // return true;
  if(convertMode == CommonUtil.ConvertType.IMGTOPDF){
    if(extName == "jpg" || extName == "jpeg" ||
    extName == "bmp" || extName == "png" || extName == "gif" ||
    extName == "tiff" || extName == "jpx" || extName == "tif"){
      return true;
    }
  }else if(convertMode == CommonUtil.ConvertType.PPTTOPDF){
    if(extName == "ppt" || extName == "pptx") {
      return true;
    }
  }else if(convertMode == CommonUtil.ConvertType.WORDTOPDF){
    if(extName == "doc" || extName == "docx"){
      return true;
    }
  }else if(convertMode == CommonUtil.ConvertType.EXCELTOPDF){
    if(extName == "xls" || extName == "xlsx"){
      return true;
    }
  }else if(convertMode == CommonUtil.ConvertType.TEXTTOPDF){
    if(extName == "txt")
      return true;
  } else if(extName == "pdf"){
    return true;
  }

  return false;

}

// CommonUtil.getOutputFileName = function (type, srcFileName, isExtractPages)
CommonUtil.getResultFileNameByMode = function(fileName, mode){
  var extName = ".pdf";
  if(mode == CommonUtil.ConvertType.PDFTOTXT)
    extName = ".txt";
  else if(mode == CommonUtil.ConvertType.PDFTOEXCEL)
    extName = ".xlsx";
  else if(mode == CommonUtil.ConvertType.PDFTOHTML)
    extName = ".html";
  else if(mode == CommonUtil.ConvertType.PDFTOWORD)
    extName = ".docx";
  else if(mode == CommonUtil.ConvertType.PDFTOIMG || mode == CommonUtil.ConvertType.SPLITPDF)
    extName = ".zip";
  else if(mode == CommonUtil.ConvertType.IMGTOPDF)
    return "Image.pdf";
  else if(mode == CommonUtil.ConvertType.MERGEPDF)
    return "Merge.pdf";
  else
    return fileName;

  var pos = fileName.lastIndexOf(".");
  var newName = fileName.substring(0,pos) + extName;

  return newName;
}

