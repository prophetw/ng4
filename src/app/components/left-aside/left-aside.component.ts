import { Component, OnInit, ViewChild, Input, EventEmitter} from '@angular/core';

import { SignFormComponent } from '../modals/sign-form/sign.component';
import {TranslateService} from '@ngx-translate/core';
import { AuthenticationService , GlobalService} from '../../services/index';
import {User} from "../../models/user";
import {SharedService} from "../../services/shared.service";
import { UserService } from '../../services/user.service'
declare var phantomOnlineGlobalConfig:any;
declare var ga:any;
declare var window:any;
declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'left-aside',
    templateUrl: "./left-aside.html",
    styleUrls:['./left-aside.css']
})
export class LeftAsideComponent {
    public adsIsShow:boolean=true;
    public chinaArea:boolean=false;
    public isMobile:boolean=false;
    constructor(public globalService:GlobalService,
                public translate:TranslateService,
                public sharedService:SharedService,
                public userService: UserService
    ){
        this.chinaArea = this.translate.getBrowserLang()==='zh'; // e.g., en
        console.log('====chinaArea====');
        console.log(this.chinaArea);
        this.sharedService.on('change-language',(event:any)=>{
            this.chinaArea = this.translate.getBrowserLang()==='zh'; // e.g., en
        });
        $('.left-aside').click(function(){
            window.angularHeaderComponent.clearFoxitDriveSelection();
        })
    }
    public closeAds(){
        this.adsIsShow=false;
    }
    public openAds(trackId:string){
        this.globalService.openAds(trackId);
    }
  public showSubscriptionDialog () {
    try {
      window.angularMainComponent.showSubscriptionDialog({source: 'online', tabName: 'left'});
      this.globalService.sendGaEvent('Subscribe', 'online_subscribe_left', '');
    } catch (ex) {}
  }

  public doDownloadPhantomPDFClient () {
    try {
      window.angularMainComponent.doDownloadPhantomPDFClient();
      let date = new Date().toISOString() ;// "2017-11-22T09:34:29.546Z"
      let eventCategory = "Desktop Promotion";
      let eventAction = this.globalService.currentUserEmail + "_"
        + "download" + "_"
        + date + "_"
        + "FOLeft";
      let eventLabel = ""
      this.globalService.sendGaEvent(eventCategory, eventAction, eventLabel);
    } catch (ex) {}
  }
}
