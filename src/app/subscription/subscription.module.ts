/**
 * Created by linc on 2017/9/19.
 */
import { NgModule } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
//import { ModalModule } from 'ngx-bootstrap';
import { ActivationSubscriptionComponent } from './activation-subscription.component'
import { SubscriptionComponent } from './subscription.component'
import { LicenseCodeComponent } from './license-code.component'
import { SubscriptionNowComponent } from './subscription-now.component'
import { SubscriptionAdComponent } from './subscription-ad.component'
import { SubscriptionService } from './subscription.service'
import {ToastyModule} from 'ng2-toasty';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ModalModule.forRoot(),
    HttpModule,
    ToastyModule.forRoot()
  ],
  providers: [
    SubscriptionService
  ],
  declarations: [
    ActivationSubscriptionComponent,
    SubscriptionComponent,
    LicenseCodeComponent,
    SubscriptionNowComponent,
    SubscriptionAdComponent,
  ],
  exports: [
    ActivationSubscriptionComponent,
    SubscriptionComponent,
    LicenseCodeComponent,
    SubscriptionNowComponent,
    SubscriptionAdComponent,
  ],
  entryComponents: [
    //ActivationSubscriptionComponent
  ]
})
export class SubscriptionModule { }
