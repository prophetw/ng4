/**
 * Created by linc on 2017/9/19.
 */
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { UserService } from '../services/user.service'
import { GlobalService } from '../services/global.service'
import { Router } from '@angular/router';
declare var window: any;

@Component({
  moduleId: module.id,
  selector: 'activation-subscription',
  templateUrl: './activation-subscription.component.html',
  styleUrls: ['./activation-subscription.component.css']
})
export class ActivationSubscriptionComponent implements OnInit {
  backdrop: boolean = false;
  subscribeTimeType: number;
  private gaSource:string;

  @ViewChild('staticModal') staticModal: ModalDirective;

  constructor (public user: UserService, private globalService: GlobalService, private router: Router) {
    this.gaSource = /^\/phantompdf(\?|$)/.test(this.router.url) ? 'phantompdf' : 'online';
    let userPhantomOnlineSubscription = user.userPhantomOnlineSubscription;
    if (userPhantomOnlineSubscription.phantom_online_trial_start_timestamp === userPhantomOnlineSubscription.current_timestamp) {
      this.subscribeTimeType = 0; // 刚刚订阅
    } else if (userPhantomOnlineSubscription.remain_days <= 0) {
      this.subscribeTimeType = 3; // 订阅过期
    } else if (userPhantomOnlineSubscription.remain_days <= 3) {
      this.subscribeTimeType = 2; // 订阅即将过期
    } else {
      this.subscribeTimeType = 1; // 正常订阅期间
    }
  }

  ngOnInit () {

  }

  showModal () {
    this.staticModal.show();
  }

  onShow () {
    this.backdrop = true;
  }
  onHide () {
    this.backdrop = false;
  }

  showSubscriptionDialog () {
    this.staticModal.hide();
    try {
      window.angularMainComponent.showSubscriptionDialog({
        source: this.gaSource,
        tabName: 'center',
        closeCallback: () => {
          this.staticModal.show();
        }
      });
      this.globalService.sendGaEvent('Subscribe', this.gaSource + '_subscribe_center', '');
    } catch (ex){}
  }

  showActivateLicenseCodeDialog () {
    this.staticModal.hide();
    try {
      window.angularMainComponent.showActivateLicenseCodeDialog({
        source: this.gaSource,
        tabName: 'center',
        closeCallback: () => {
          this.staticModal.show();
        }
      });
      this.globalService.sendGaEvent('Subscribe', this.gaSource + '_activation_center', '');
    } catch (ex) {}
  }

  closeModal () {
    this.staticModal.hide();
    this.globalService.sendGaEvent('Subscribe', this.gaSource + '_trial_center', '');
  }
}
