/**
 * Created by linc on 2017/9/20.
 */
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GlobalService } from '../services/global.service'
import { UserService } from '../services/user.service'

declare var window: any;

@Component({
  moduleId: module.id,
  selector: 'subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  backdrop: boolean = false;
  closeCallback: Function = function () {};
  private gaSource:string;
  private gaTab:string;

  @ViewChild('staticModal') staticModal: ModalDirective;

  constructor (private globalService: GlobalService, private userService: UserService) {
  }

  ngOnInit () {

  }

  showModal ({closeCallback = function (){}, source = 'online', tabName = ''}:{closeCallback: Function, source: string, tabName: string} = {closeCallback : function (){}, source : 'online', tabName : ''}) {
    this.closeCallback = closeCallback;
    this.staticModal.show();
    this.gaSource = source;
    this.gaTab = tabName;
  }

  subscribeNow () {
    if (!this.globalService.currentUserToken) {
      // PRO-3825  未登录
      // 参考 sign.component.ts showSignInModal
      var pathname:string = window.location.pathname + '?open-subscription-now-dialog=true&f=' + (this.gaSource === 'online' ? '0' : '1');
      var service:string = window.location.protocol+"//"+window.location.host + "/redirect-to-cas/" + encodeURIComponent(pathname);
      var cas_url:string = this.userService.getCasSiteUrl() + '&service=' + encodeURIComponent(service);
      location.href = cas_url;
      return
    }
    this.staticModal.hide();
    try {
      let trackingId:string = '';
      if (this.gaSource === 'online') {
        trackingId = 'Foxit Online Subscribe ';
      } else {
        trackingId = 'Phantom Online Subscribe ';
      }
      trackingId += this.gaTab;
      trackingId = 'trackingId=' + encodeURIComponent(trackingId);
      window.angularMainComponent.showSubscriptionNowDialog({trackingId: trackingId, source: this.gaSource, tabName: this.gaTab});
      this.globalService.sendGaEvent('Subscribe', this.gaSource + '_subscribe_now_' + this.gaTab, '');
    } catch (ex) {}
  }

  showActivateLicenseCodeDialog () {
    if (!this.globalService.currentUserToken) {
      // PRO-4629  未登录
      // 参考 sign.component.ts showSignInModal
      var pathname:string = window.location.pathname + '?open-activate-license-dialog=true&f=' + (this.gaSource === 'online' ? '0' : '1');
      var service:string = window.location.protocol+"//"+window.location.host + "/redirect-to-cas/" + encodeURIComponent(pathname);
      var cas_url:string = this.userService.getCasSiteUrl() + '&service=' + encodeURIComponent(service);
      location.href = cas_url;
      return
    }
    this.staticModal.hide();
    try {
      window.angularMainComponent.showActivateLicenseCodeDialog({
        source: this.gaSource,
        tabName: this.gaTab,
        closeCallback: () => {
          this.staticModal.show();
        }
      });
      this.globalService.sendGaEvent('Subscribe', this.gaSource + '_redeem_' + this.gaTab, '');
    } catch (ex) {}
  }

  onShow () {
    this.backdrop = true;
  }
  onHide () {
    this.backdrop = false;
  }
  close () {
    this.staticModal.hide();
    this.closeCallback();
  }
}
