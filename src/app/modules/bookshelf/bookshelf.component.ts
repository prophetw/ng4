import { Component , ViewChild} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {SignFormComponent} from "../../components/modals/sign-form/sign.component";
import {SharedService} from '../../services/shared.service';
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  moduleId: module.id,
  templateUrl: './cloud-reading.html',
  styleUrls:['cloud-reading.css']
})
export class BookshelfComponent  {
    hideSignUp:boolean=false;
    @ViewChild(SignFormComponent) public signModal:SignFormComponent;
  constructor(public globalService:GlobalService,
              private sharedService: SharedService,
              private route: ActivatedRoute,
              private router: Router,
  ) {
    console.log('#######comes here 1233413123');
    this.globalService.showAside = true;
    this.globalService.isCloudReading = true;
    this.globalService.needLoadTool = true;
    this.hideSignUp = this.globalService.hideSignUp;
      this.route
        .params
        .subscribe(params => {
          var targetFolderId:string;
          if(params['id']){
            targetFolderId = params['id'];
            localStorage.setItem('ls.lastAnchor','/folder/'+targetFolderId);
            this.router.navigate(['foxit-drive']);
          }else{
              return false;
          }
        });
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
