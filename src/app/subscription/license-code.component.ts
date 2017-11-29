/**
 * Created by linc on 2017/9/20.
 */
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SubscriptionService } from './subscription.service'
import { ToastyService } from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core'
import { GlobalService } from '../services/global.service'
import { UserService } from '../services/user.service'

declare var window: any;

@Component({
  moduleId: module.id,
  selector: 'license-code',
  templateUrl: './license-code.component.html',
  styleUrls: ['./license-code.component.css']
})
export class LicenseCodeComponent implements OnInit {
  backdrop: boolean = false;
  closeCallback: Function = function(){};
  subMessage: string;
  subBackdrop: boolean = false;
  private gaSource:string;
  private gaTab:string;

  @ViewChild('staticModal') staticModal: ModalDirective;
  @ViewChild('subModal') subModal: ModalDirective;

  constructor (private subscriptionService: SubscriptionService,
               private toastyService:ToastyService,
               private translate: TranslateService,
               private userService: UserService,
               private globalService: GlobalService
  ) {

  }

  ngOnInit () {

  }

  showModal ({closeCallback = function (){}, source = 'online', tabName = ''} : {closeCallback: Function, source: string, tabName: string} = {closeCallback : function (){}, source : 'online', tabName : ''}) {
    this.closeCallback = closeCallback;
    this.staticModal.show();
    this.gaSource = source;
    this.gaTab = tabName;
  }

  activate (licenseCode:string) {
    // CVAS-1690
    this.subscriptionService.licenseCodeRedeem(licenseCode.replace(/^\s*/, '').replace(/\s*$/, ''), this.gaSource, this.gaTab).subscribe((res) => {
      switch (res.ret) {
        case 0:
          this.translate.get('licenseCodeRedeemCode0').subscribe((msg: string) => {
            this.toastyService.success(msg)
          });
          this.staticModal.hide();
          this.callPreviewAfterSubscribed();
          break;
        case 111009:
          this.translate.get('licenseCodeRedeemCode111009').subscribe((msg: string) => {
            this.showSubModal(msg)
          });
          break;
        case 111010:
          this.translate.get('licenseCodeRedeemCode111010').subscribe((msg: string) => {
            this.showSubModal(msg)
          });
          break;
        case 111011:
          this.translate.get('licenseCodeRedeemCode111011').subscribe((msg: string) => {
            this.showSubModal(msg)
          });
          break;
        case 111012:
          this.translate.get('licenseCodeRedeemCode111012').subscribe((msg: string) => {
            this.showSubModal(msg)
          });
          break;
        case 111013:
          this.translate.get('licenseCodeRedeemCode111013').subscribe((msg: string) => {
            this.showSubModal(msg)
          });
          break;
        case 111014:
          this.translate.get('licenseCodeRedeemCode111014').subscribe((msg: string) => {
            this.showSubModal(msg)
          });
          break;
        case 111015:
          this.translate.get('licenseCodeRedeemCode111015').subscribe((msg: string) => {
            this.showSubModal(msg)
          });
          break;
        case 999999:
        default:
          this.translate.get('licenseCodeRedeemCode999999').subscribe((msg: string) => {
            this.showSubModal(msg)
          });
          break;
      }
    }, () => {
      this.translate.get('licenseCodeRedeemCode999999').subscribe((msg: string) => {
        this.showSubModal(msg)
      });
    });
    this.globalService.sendGaEvent('Subscribe', this.gaSource + '_activation_' + this.gaTab, '');
  }

  onShow () {
    this.backdrop = true;
  }
  onHide () {
    this.backdrop = false;
  }

  private callPreviewAfterSubscribed () {
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
  }

  close () {
    this.staticModal.hide();
    this.closeCallback();

    this.globalService.sendGaEvent('Subscribe', this.gaSource + '_activation_cancel_' + this.gaTab, '');
  }

  showSubModal (msg: string) {
    this.subMessage = msg;
    this.subModal.show();
  }
  onSubShow () {
    this.subBackdrop = true;
  }
  onSubHide () {
    this.subBackdrop = false;
  }
  purchase () {
    this.subModal.hide();
    this.staticModal.hide();

    try {
      let trackingId:string = '';
      if (this.gaSource === 'online') {
        trackingId = 'Foxit Online Purchase ';
      } else {
        trackingId = 'Phantom Online Purchase ';
      }
      trackingId += this.gaTab;
      trackingId = 'trackingId=' + encodeURIComponent(trackingId);
      window.angularMainComponent.showSubscriptionNowDialog({trackingId: trackingId, source: this.gaSource, tabName: this.gaTab});
      this.globalService.sendGaEvent('Subscribe', this.gaSource + '_purchase_' + this.gaTab, '');
    } catch (ex) {}

  }
  hideSubModal () {
    this.subModal.hide();
    this.globalService.sendGaEvent('Subscribe', this.gaSource + '_purchase_cancel_' + this.gaTab, '');
  }
}
