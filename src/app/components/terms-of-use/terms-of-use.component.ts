import { Component , ViewChild} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {SignFormComponent} from "../../components/modals/sign-form/sign.component";
import {SharedService} from '../../services/shared.service';
import { ActivatedRoute,Router } from '@angular/router';
declare var $:any;
@Component({
  moduleId: module.id,
  templateUrl: './home-page-common.html',
  styleUrls:['home-page.css']
})
export class TermsOfUseComponent  {
    hideSignUp:boolean=false;
    @ViewChild(SignFormComponent) public signModal:SignFormComponent;
  constructor(public globalService:GlobalService,
              private sharedService: SharedService,
              private route: ActivatedRoute,
              private router: Router
  ) {

    //隐藏页面不需要的部分
    this.globalService.showAside = false;
    this.globalService.isCloudReading = false;
    this.globalService.isHomePage = true;
    //this.globalService.showHeader = false;
    //this.hideSignUp = this.globalService.hideSignUp;
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
}
