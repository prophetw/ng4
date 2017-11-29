/**
 * Created by linc on 2017/9/20.
 */
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { GlobalService } from '../services/global.service'
import { UserService } from '../services/user.service'
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core'
import { device } from './../utils/device'

declare var window: any;
declare var location: any;

@Component({
  moduleId: module.id,
  selector: 'subscription-now',
  templateUrl: './subscription-now.component.html',
  styleUrls: ['./subscription-now.component.css']
})
export class SubscriptionNowComponent implements OnInit {
  subscriptionUrl: SafeResourceUrl;
  backdrop: boolean = false;
  closeCallback: Function = function (){}

  @ViewChild('staticModal') staticModal: ModalDirective;

  constructor (private sanitizer: DomSanitizer,
               private globalService: GlobalService,
               private zone: NgZone,
               private userService: UserService,
               private toastyService:ToastyService,
               private translate: TranslateService
  ) {

  }

  ngOnInit () {

  }

  showModal ({closeCallback = function(){}, trackingId = '', source = 'online', tabName = ''}: {closeCallback: Function, trackingId: string, source: string, tabName: string}={closeCallback : function(){}, trackingId : '', source: 'online', tabName: ''}) {
    this.closeCallback = closeCallback;
    let cid = '__subscription_callback__';
    window[cid] = (params:any) => {
      this.zone.runOutsideAngular(() => {
        let isManuallyBack = (params.is_manually_back === 'true');
        delete window[cid];

        this.zone.run(() => {
          this.staticModal.hide();
          if (isManuallyBack) {
            try {
              window.angularMainComponent.showSubscriptionDialog({source: source, tabName: tabName});
            } catch (ex){}
            return;
          }
          this.translate.get('subscriptionSuccessTip').subscribe((msg: string) => {
            this.toastyService.success(msg)
          });
          this.userService.getUserPhantomOnlineSubscription(this.globalService.currentUserToken).subscribe(
              data => {
              if (data.ret == 0) {
                // 2. save data:
                this.userService.userPhantomOnlineSubscription = data.data;
                try {
                  let iframe:any = document.getElementById('preview-frame');
                  iframe.contentWindow.WebPDF.afterSubscribed();
                } catch(ex){}
              }
            },
              error => {
            }
          );
        });
      });
    };
    let locationHref = location.href;
    let osName = device.osName();
    if (osName == "unknown")
      osName='foxitonline';
    let returnUrl: string = locationHref.slice(0, locationHref.lastIndexOf(location.pathname)) + '/assets/url-callback.html?cid=' + cid;
    let url:string = this.globalService.apiUrl + 'appstore/multiple-apps?app_code_list=phantom_ga_business%2Cphantom_ga_standard%2Cphantom_ga_education'
      + '&majorVersion='
      + '&minorVersion='
      + '&lang=' + this.globalService.getLanguage()
      + '&osName=' + osName
      + '&osPlatform='
      + '&deviceType='
      + '&deviceDetail='
      + '&access_token=' + (this.globalService.currentUserToken || '')
      + '&return=' + encodeURIComponent(returnUrl);

    if (!trackingId) {
      trackingId = encodeURIComponent('Foxit Online default');
    }
    url += ('&' + trackingId);

    this.subscriptionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.staticModal.show();
  }

  onShow () {
    this.backdrop = true;
  }
  onHide () {
    this.backdrop = false;
    window.angularMainComponent.doCheckUserSubscription();
  }
  close () {
    this.staticModal.hide();
    this.closeCallback();
  }
}
