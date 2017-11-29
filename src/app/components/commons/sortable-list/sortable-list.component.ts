/**
 * Created by congting_zheng on 2017/5/31 0031.
 */
import {
  Component, ViewChild, Input, Output, EventEmitter, HostListener, OnInit, ElementRef
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  AuthenticationService, AlertService, GlobalService, UserService, SharedService
} from '../../../services/index';
import {WebToolService, WebToolFileInfo, WebToolMultiFileInfos} from '../../../services/webtool.service';
//import {} from '../../../../foxit-webtool/libs/Sortable.min.js'

declare var Sortable: any;
declare var CommonUtil: any;
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'combined-docs',
  templateUrl: './sortable-list.html',
  styleUrls: ['./sortable-list.css']
})
export class SortableTableComponent implements OnInit {
  public fileItems:Array<any> = [];
  public filesFromLocal:Array<any> = [];
  public filesFromOnline:Array<any> = [];
  // count local files include deleted file
  public fileTotalCountFromLocal:number = 0;
  public firstFileInfo:any = null;

  constructor(private sharedService: SharedService,
              private globalService: GlobalService,
              private translate: TranslateService,){
  }
  ngOnInit() {
    //this.initEntryInfo(); add
    this.translate.instant('Webtools.Common.From');
    this.translate.instant('Webtools.Common.FoxitDrive');
    this.translate.instant('Webtools.Common.LocalDocument');
    this.translate.instant('Webtools.Common.OneDrive');


    var _this = this;
    Sortable.create(document.getElementById("sortable-handle-list"), {
      handle: ".drag-handle",
      animation: 150,
      filter: ".remove-handle",
      onFilter: function (evt:any) {
        var item = evt.item,
          ctrl = evt.target;

        if (Sortable.utils.is(ctrl, ".remove-handle")) {  // Click on remove button
          let id:string = item.getElementsByClassName("drag-file-id")[0].innerText;
          let index:string = item.getElementsByClassName("drag-file-isonline")[0].innerText;
          _this.doRemoveItem(id, index);

          item.parentNode.removeChild(item); // remove sortable item
        }
        /*else if (Sortable.utils.is(ctrl, ".js-edit")) {  // Click on edit link
         // ...
         }*/
      }
    });
  }

  public cleanFileItem(){
    this.fileTotalCountFromLocal = 0;
    this.fileItems.splice(0,this.fileItems.length);
    this.filesFromLocal.splice(0,this.filesFromLocal.length);
    this.filesFromOnline.splice(0,this.filesFromOnline.length);
  }

  public removeById(arr:Array<any>, id:string) {
    for(var i=0; i<arr.length; i++) {
      if(arr[i].fileId == id) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  public getFileTotalCountFromLocal(){
    return this.fileTotalCountFromLocal;
  }

  public getFileAddress(mode:number){
    let from:string = "";
    if(mode == CommonUtil.FileAddress.FoxitDrive){
      from = this.translate.instant('Webtools.Common.FoxitDrive');
    }else if(mode == CommonUtil.FileAddress.Box){
      from = this.translate.instant('Box');
    }else if(mode == CommonUtil.FileAddress.Dropbox){
      from = this.translate.instant('Dropbox');
    }else if(mode == CommonUtil.FileAddress.GoogleDrive){
      from = this.translate.instant('Google Drive');
    }else if(mode == CommonUtil.FileAddress.OneDrive){
      from = this.translate.instant('OneDrive');
    }else {
      from = this.translate.instant('Webtools.Common.LocalDocument');
    }

    return from;
  }

  // fileId: from local : index; from online: doc-id
  public doAddItem(fileName:string, fileSize:number, fileId:string, fileAddress:number ){
    let _from:string = this.translate.instant('Webtools.Common.From') + " ";
    /*let _cloud:string = this.translate.instant('Webtools.Common.FoxitDrive');
    let _local:string = this.translate.instant('Webtools.Common.LocalDocument');
    let from:string = isOnline ? (_from + _cloud) :(_from + _local);*/
    let from = _from + this.getFileAddress(fileAddress);
    let isOnline = (fileAddress == CommonUtil.FileAddress.FoxitDrive)?1:0;
    let fileInfo = {
      fileName:fileName,
      fileSize:CommonUtil.getFileSize(fileSize),
      fileId:fileId,
      index:0,
      from:from,
      isOnline:isOnline? 1:0
    };
    fileInfo.index = isOnline? 1:0;
    if(!isOnline){
      fileInfo.index = this.fileTotalCountFromLocal;
      this.filesFromLocal.push(fileInfo);
      this.fileTotalCountFromLocal ++;
    }
    else {
      this.filesFromOnline.push(fileInfo);
    }

    this.fileItems.push(fileInfo);
  }

  public doRemoveItem(fileId:string, isOnline:string){
    let _isOnline:boolean = isOnline == "1"? true:false;

    if(!isOnline){
      this.removeById(this.filesFromLocal, fileId)
    }
    else{
      this.removeById(this.filesFromOnline, fileId)
    }
    this.removeById(this.fileItems, fileId)
  }

  public checkFileExistInOnline(id:string): boolean{
    for (let doc of this.filesFromOnline){
      if (doc.fileId == id){
        return true;
      }
    }
    return false;
  }

  public getOnlineFileInfo(id:string): any{
    for (let doc of this.filesFromOnline){
      if (doc.fileId == id){
        return doc;
      }
    }
    return null;
  }

  public getLocalFileInfo(index:number): any{
    for (let doc of this.filesFromLocal){
      if (doc.index == index){
        return doc;
      }
    }
    return null;
  }

  public getOnlineDocsInfo(): Array<any> {
    let length:number = $("#sortable-handle-list>li").length;
    let index:number = 0;
    let _this = this;
    for (let i = 0; i < length; i++){
      let child = $($("#sortable-handle-list>li")[i]);
      let isOnline:string = child.find(".drag-file-isonline")[0].innerText ;
      if (isOnline =="1") {
        let id: string = child.find(".drag-file-id")[0].innerText;
        let _fileInfo:any = _this.getOnlineFileInfo(id);
        _fileInfo.index = _this.fileTotalCountFromLocal + index;
        index++;
      }
    }
    return this.filesFromOnline;
  }

  public getFileIndexList():string{
    let fileSeqList:string = "";
    let index:number = 0;
    let _this = this;
    let length:number = $("#sortable-handle-list>li").length;
    let _fileInfo:any = null;
    let id: string = "";
    for (let i = 0; i < length; i++){
      let child = $($("#sortable-handle-list>li")[i]);
      let isOnline:string = child.find(".drag-file-isonline")[0].innerText ;
      if (isOnline =="1") {
        id = child.find(".drag-file-id")[0].innerText;
        _fileInfo = _this.getOnlineFileInfo(id);
        fileSeqList += _fileInfo.index ;

      } else {
        id = child.find(".drag-file-id")[0].innerText;
        _fileInfo = _this.getLocalFileInfo(parseInt(id));
        fileSeqList += _fileInfo.index ;
      }

      if(i == 0){
        this.firstFileInfo = _fileInfo;
      }

      index++;
      if(index <length)
        fileSeqList += "_";
    }
    return fileSeqList;
  }

  public doSetIndexToItems(){

  }
}
