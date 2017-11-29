import { Component , ViewChild , EventEmitter,TemplateRef} from '@angular/core';
import { GlobalService } from "../../services/global.service";
import { ShareService } from "../../services/share.service";
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {TranslateService} from '@ngx-translate/core';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap';
import { CookieService } from 'angular2-cookie/core';
@Component({
  moduleId: module.id,
  templateUrl: './shared-with-me.html',
  styleUrls: ["./shared-with-me.css"]
})
export class SharedWithMeComponent {
  sharedWithMeList:any = null;
  hideSignUp: boolean=false;
  isMobile: boolean;
  selectedItem: any;
  infoContainerActive: boolean = false;
  viewType: string;
  sortType: string = 'nameAsc';
  public deletingItem: boolean=false;
  public modalRef: BsModalRef;

  constructor(public globalService:GlobalService,
              private cookieService: CookieService,
              private router:Router,
              private sharedService:SharedService,
              private userService:UserService,
              private translate:TranslateService,
              private shareService:ShareService,
              private toastyService:ToastyService,
              private modalService: BsModalService,
              private toastyConfig: ToastyConfig
  ) {

    this.isMobile = globalService.isMobile;
    this.globalService.showAside = true;
    this.globalService.isCloudReading = false;
    this.hideSignUp = this.globalService.hideSignUp;
    if (this.globalService.currentUserEmail) {
      this.loadSharedWithMe();
    } else {

    }
    this.sharedService.on('login-event', (event:any) => {
      this.loadSharedWithMe();
    });
    this.sharedService.on('refresh-shared-list', (event:any)=>{
      this.refresh();
    })
    this.sharedService.on('logout-event', (event:any) => {
      this.shareService.sharedWithMeList = null;
    });
    //
    this.viewType = this.cookieService.get('shared-with-me-view-type')||'list';
    if(this.isMobile ) {
      this.viewType = 'card';
    }
  }

  public loading:boolean;
  public addToastr(type:any,title:any,msg?:any){
    // Or create the instance of ToastOptions
    let toastOptions:ToastOptions = {
      title: title,
      msg: msg||'',
      showClose: true,
      timeout: 2000,
      theme: 'bootstramp',
      onAdd: (toast:ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function(toast:ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
      }
    };
    // Add see all possible types in one shot
    switch(type){
      case 'info':
        this.toastyService.info(toastOptions);
        break;
      case 'success':
        this.toastyService.success(toastOptions);
        break;
      case 'error':
        this.toastyService.error(toastOptions);
        break;
      case 'warning':
        this.toastyService.warning(toastOptions);
        break;
      case 'wait':
        this.toastyService.wait(toastOptions);
        break;
      default:
        this.toastyService.default(toastOptions);
        break;
    }
  }
  private loadSharedWithMe(force:boolean = false):void {
    var __this = this;
    this.loading = true;
    this.shareService.getSharedWithMe(force).subscribe(
      data => {
        this.loading = false;
        //noinspection TypeScriptUnresolvedVariable
        if (data.ret == 0) {
          this.sharedWithMeList = data.data.objectList;
          for (var i in this.sharedWithMeList) {
            (function (i) {
              __this.shareService.getCmisDocumentById(__this.sharedWithMeList[i].id, force).subscribe(
                data => {
                  // 动图换成缩略图 PRO-668
                  // __this.sharedWithMeList[i].thumbnail_url = data.data.thumbnail_url;
                  //__this.sharedWithMeList[i].thumbnail_url = data.data.thumbnail_static_url;
                  __this.sharedWithMeList[i].cmisDocument = data.data;
                }
              );
            })(i);
          }
          // 获取分享者用户名
          let getUserInfoObserves:Array<Observable<any>> = [];
          for (let i = this.sharedWithMeList.length; i--;) {
            getUserInfoObserves[i] = this.userService.getUserInfoByEmail(this.sharedWithMeList[i].properties['cmis:createdBy']);
          }
          Observable.forkJoin(...getUserInfoObserves).subscribe((arr) => {
            for (let i = arr.length; i--;) {
              this.sharedWithMeList[i].createdUserInfo = arr[i];
            }
          })
        } else {

        }
      }
    );
  }

  public preview(cmisObj:any):void {
    console.log(cmisObj);
    var type:any=cmisObj.properties['cmis:contentStreamMimeType'];
    console.log(type);
    if(type !== 'application/pdf'){
      //var appName = this.translate.instant(this.globalService.appName);
      var warningMsg = this.translate.instant('can_not_preview',{appName:this.translate.instant(this.globalService.appName)});
      this.addToastr('warning',warningMsg);
      //alert(warningMsg);
    }else{
      this.router.navigate(['/preview/cmis/' + cmisObj.id]);
    }
    //
  }
  public download(item:any):void{

  }
  public refresh():void {
    this.selectedItem = null;
    this.loadSharedWithMe(true);
    this.infoContainerActive=false;
    this.globalService.sendGaEvent('phantomPDF online web', 'Refresh list', 'share-with-me')
  }

  public change(event:any):void {
    this.globalService.gridSize = event.value;
    this.globalService.sendGaEvent('phantomPDF online web', 'Change grid size', 'share-with-me')
  }

  public input(event:any):void {
    console.log("input");
    console.log(event);
  }

  public showSignInModal():void {
    this.sharedService.broadcast({
      name: 'showSignInModal'
    });
  }

  public showSignUpModal():void {
    this.sharedService.broadcast({
      name: 'showSignUpModal'
    });
  }

  toggleInfo (bool:boolean = !this.infoContainerActive) {
    this.infoContainerActive = bool;
  }
  authority (list: Array<any>) {
    let email = this.globalService.currentUserEmail;
    for (let i = list.length; i--;) {
      if (email !== list[i].principalId) {
        continue
      }
      let permissions = list[i].permissions;
      for (let j = permissions.length; j--;) {
        if ('cmis:write' === permissions[j]) {
          return 'authority1'
        }
      }
      return 'authority0'
    }
    return 'authority0';
  }
  setSelected (item:any) {
    console.log(item);
    this.selectedItem = item;
  }
  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  public delete(template: TemplateRef<any>){
    this.deletingItem=true;
    this.shareService.removeSharedWithMeFile(this.selectedItem.id).subscribe((data) => {
      for (var i = this.sharedWithMeList.length; i--;) {
        if (this.selectedItem === this.sharedWithMeList[i]) {
          this.sharedWithMeList.splice(i, 1);
          this.selectedItem = null;
          this.deletingItem=false;
          this.modalRef.hide();
          return;
        }
      }
    }, function (err) {
      this.deletingItem=false;
      this.modalRef.hide();
    })
  }
  removeConfirm(template: TemplateRef<any>) {
    this.openModal(template);
  }
  changeType () {
    this.viewType = {view:'list',list:'view'}[this.viewType];
    this.cookieService.put('shared-with-me-view-type',this.viewType);
  }
  trackBy (index: number, item: any) {
    return item.id;
  }
  sortToggle (name: string) {
    let asc = name + 'Asc';
    let desc = name + 'Desc';

    if (this.sortType === asc) {
      this.sortType = desc;
      this.sortList(name, 1)
    } else {
      this.sortType = asc;
      this.sortList(name, -1)
    }
  }

  private sortList (name:string, type:number = 1) {
    name = {'name': 'cmis:name', 'date': 'cmis:lastModificationDate', 'user': 'cmis:createdBy'}[name];
    this.sharedWithMeList.sort(function (obj1:any, obj2:any) {
      let value1 = obj1.properties[name];
      let value2 = obj2.properties[name];
      if (name === 'cmis:createdBy') {
        value1 = (obj1.createdUserInfo || {}).display_name || value1;
        value2 = (obj2.createdUserInfo || {}).display_name || value2;
      }
      if (value1 === value2) {
        return 0;
      }
      return type * [-1, 1][+(value1 > value2)];
    })
  }
}
