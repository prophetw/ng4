import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service'
import { UserService } from '../../services/user.service'
import { mobileOpenWith } from '../../utils/open-down-app'

declare var phantomOnlineGlobalConfig: any;

@Component({
  moduleId: module.id,
  selector: 'mobile-index',
  templateUrl: './mobile-index.component.html',
  styleUrls: ['./mobile-index.component.css']
})
export class MobileIndexComponent implements OnInit {
  loginUrl: string;
  private openWitch: Function;
  constructor(private globalService: GlobalService, private userService: UserService) {
    // 参考 header.component.ts 有充足的提升空间, sign.component.ts showSignInModal
    //let pathname: string = '/m/login';
    let pathname: string = '/foxit-drive';
    var service:string = window.location.protocol+"//"+window.location.host + '/redirect-to-cas/' + encodeURIComponent(pathname);
    var cas_url:string = userService.getCasSiteUrl() + '&service=' + encodeURIComponent(service);
    this.loginUrl = cas_url;
    this.globalService.showHeader=false;

    let androidDownAppUrl: string;
    // 中国区和美国，安卓下载地址不同
    let hostname = location.hostname;
    if (/(-cn\.)|(\.cn$)/.test(hostname)) {
      androidDownAppUrl = phantomOnlineGlobalConfig.androidChinaDownAppUrl;
    } else {
      androidDownAppUrl = phantomOnlineGlobalConfig.androidDownAppUrl;
    }

    this.openWitch = mobileOpenWith({
      androidOpenAppUrl: phantomOnlineGlobalConfig.androidOpenAppUrl,
      androidDownAppUrl: androidDownAppUrl,
      iosOpenAppUrl: phantomOnlineGlobalConfig.iosOpenAppUrl,
      iosDownAppUrl: phantomOnlineGlobalConfig.iosDownAppUrl,
      uwpDownAppUrl: phantomOnlineGlobalConfig.uwpDownAppUrl,
      otherUrl: this.loginUrl
    });
  }

  ngOnInit() {
  }

  open () {
    this.openWitch()
  }

}
