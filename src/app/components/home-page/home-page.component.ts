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
export class HomePageComponent  {
    hideSignUp:boolean=false;
    @ViewChild(SignFormComponent) public signModal:SignFormComponent;
  constructor(
      public globalService:GlobalService,
              private sharedService: SharedService,
              private route: ActivatedRoute,
              private router: Router
  ) {

    if (this.globalService.isMobile) {
      if (this.globalService.currentUserEmail) {
        this.router.navigateByUrl('foxit-drive');
      } else {
        this.router.navigateByUrl('mobile-index');
      }
      return;
    }
    //隐藏页面不需要的部分
    this.globalService.showAside = false;
    this.globalService.isCloudReading = false;
    this.globalService.isHomePage = true;
    //this.globalService.showHeader = false;
    //this.hideSignUp = this.globalService.hideSignUp;

      function adjustSize(){
          var MaxHeight=0,
              MaxWidth=0;
          $('.app-brief .text-container').each(function(index:any,target:any){
              $(target).height('auto');
              $(target).width('auto');
              MaxHeight = $(target).height()>MaxHeight?$(target).height():MaxHeight;
              MaxWidth = $(target).width()>MaxWidth?$(target).width():MaxWidth;
          });
          $('.app-brief .text-container').each(function(index:any,target:any){
              $(target).height(MaxHeight);
          })
      }
      $(document).ready(function(){
          if(timer){
              window.clearTimeout(timer)
          }else{
              var timer = window.setTimeout(function(){
                  adjustSize();
              },200)
          }
      });
      window.onresize = function(){
          if(timer){
              window.clearTimeout(timer)
          }else{
              var timer = window.setTimeout(function(){
                  adjustSize();
              },200)
          }
      };
  }
    public goTo(router: any):void{
        // 暂时 appstore 没有合并过来 合并过来 下面的 app-store 代码可以删除
        if(router === 'app-store'){
            window.open('https://cloud.connectedpdf.com/appstore/app-list');
        }else if(router === 'site'){
            var siteUrl=this.globalService.getSiteUrl();
            window.open(siteUrl);
        }else if(router === 'privacy'){
            var privacyUrl = this.globalService.getPrivacyUrl()
            window.open(privacyUrl);
        }else{
            this.router.navigate([router]);
        }
    }
    public openLinkInNewTab(toolName:any):void{

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
