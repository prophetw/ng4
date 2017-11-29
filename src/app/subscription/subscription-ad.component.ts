/**
 * Created by linc on 2017/9/20.
 */
import { Component, OnInit, NgZone, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
declare var window: any;

@Component({
  moduleId: module.id,
  selector: 'subscription-ad',
  templateUrl: './subscription-ad.component.html',
  styleUrls: ['./subscription-ad.component.css']
})
export class SubscriptionAdComponent implements OnInit {
  position:any = {};
  in: boolean;
  hover: boolean;
  leaveTimer: any;
  willHideTimer: any;
  willShowTimer: any;

  constructor () {

  }

  ngOnInit () {

  }

  mouseenter () {
    clearTimeout(this.willShowTimer)
    this.in = false;
    //clearTimeout(this.leaveTimer);
    //this.hover = true;
  }

  mouseleave () {
    clearTimeout(this.willShowTimer)
    this.in = false;
    //this.leaveTimer = setTimeout(() => {
    //  this.hover = false;
    //}, 500);
  }

  show (position:any) {
    //clearTimeout(this.willHideTimer);
    this.position = position;
    //this.in = true;
    this.willShowTimer = setTimeout(() => {
      this.in = true;
    }, 1500);
  }

  willHide () {
    //this.willHideTimer = setTimeout(() => {
    //  this.in = false;
    //}, 500);
    clearTimeout(this.willShowTimer)
    this.in = false;
  }

  showSubscriptionDialog () {
    this.in = false;
    this.hover = false;
    try {
      window.angularMainComponent.showSubscriptionDialog({source: 'online', tabName: 'right'})
    } catch (ex){}
  }
}
