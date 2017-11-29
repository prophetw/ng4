var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by linc on 2017/9/19.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ng2-bootstrap';
import { HttpModule } from '@angular/http';
//import { ModalModule } from 'ngx-bootstrap';
import { ActivationSubscriptionComponent } from './activation-subscription.component';
import { SubscriptionComponent } from './subscription.component';
import { LicenseCodeComponent } from './license-code.component';
import { SubscriptionNowComponent } from './subscription-now.component';
import { SubscriptionAdComponent } from './subscription-ad.component';
import { SubscriptionService } from './subscription.service';
import { ToastyModule } from 'ng2-toasty';
var SubscriptionModule = (function () {
    function SubscriptionModule() {
    }
    SubscriptionModule = __decorate([
        NgModule({
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
            entryComponents: []
        })
    ], SubscriptionModule);
    return SubscriptionModule;
}());
export { SubscriptionModule };
