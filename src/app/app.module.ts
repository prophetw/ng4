import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
//import { ModalModule , AlertModule,TooltipModule } from 'ng2-bootstrap';
import { CookieService, CookieOptions} from 'angular2-cookie/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { FileUploadModule } from "ng2-file-upload/file-upload/file-upload.module";
import {ToastyModule} from 'ng2-toasty';
import { BsDropdownModule,ModalModule,AlertModule,TooltipModule } from "ngx-bootstrap";
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';
import { AppRoutingModule } from './app-routering'
import {MainComponent} from "./components/main/main.component";
import {LoginComponent} from "./components/login/login.component";
import {OpenFileComponent} from "./components/open-file/open-file.component";
import {ViewEditComponent} from "./components/view-edit/view-edit.component";
import {MergePDFComponent} from "./components/merge-pdfs/merge-pdfs.component";
import {OrganizePagesComponent} from "./components/organize-pages/organize-pages.component";
import {TermsOfUseComponent} from "./components/terms-of-use/terms-of-use.component";
import {PrivatePolicyComponent} from "./components/private-policy/private-policy.component";
import {PageHeaderComponent} from "./components/header/header.component";
import {SignFormComponent} from "./components/modals/sign-form/sign.component";
import {WebToolConvertComponent} from "./components/modals/webtools/webtool.component";
import {WebToolHeaderFooterComponent} from "./components/modals/webtools/webtools.headerfooter.component";
import {WebToolProtectPDFComponent} from "./components/modals/webtools/webtool.protectpdf.component";
import {WebToolSplitPDFComponent} from "./components/modals/webtools/webtool.splitpdf.component";
import {MobileIndexComponent} from "./components/mobile-index/mobile-index.component";
import {WebtoolNetdrive} from "./components/modals/webtools/webtool.netdrive.component";
import {HomePageComponent} from "./components/home-page/home-page.component";
import {WebToolWatermarkComponent} from "./components/modals/webtools/webtool.watermark.component";
import {LeftAsideComponent} from "./components/left-aside/left-aside.component";
import {MobileLeftPanelComponent} from "./components/mobile-left-panel/mobile-left-panel.component";
import {ShareModule} from "./modules/share/share.module";
import {SubscriptionModule} from "./subscription/subscription.module";
import {SortableTableComponent} from "./components/commons/sortable-list/sortable-list.component";
import {UserService} from "./services/user.service";
import {GlobalService} from "./services/global.service";
import {AuthenticationService} from "./services/authentication.service";
import {AlertService} from "./services/alert.service";
import {WebpdfService} from "./services/webpdf.service";
import {VerifyService} from "./services/verify.service";
import {WebToolUrls} from "./services/webtool.service";
import {WebToolFileInfo} from "./services/webtool.service";
import {WebToolMultiFileInfos} from "./services/webtool.service";
import {WebToolService} from "./services/webtool.service";
import {WebToolEntryService} from "./services/webtool.entry.service";
import {SharedService} from "./services/shared.service";
import {ProgressBarService} from "./services/progressbar.service";
import {BookshelfModule} from "./modules/bookshelf/bookshelf.module";
import {WebpdfPreviewModule} from "./modules/webpdf-preview/webpdf-preview.module";
import {AppComponent} from "./app.component";
// lang file do not have the key
export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return params['key'];
  }
}

// AoT requires an exported function for factories
// https://github.com/ngx-translate/http-loader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
      MainComponent,
      LoginComponent,
      OpenFileComponent,
      ViewEditComponent,
      MergePDFComponent,
      OrganizePagesComponent,
      PrivatePolicyComponent,
      PageHeaderComponent,
      SignFormComponent,
      WebToolConvertComponent,
      WebToolHeaderFooterComponent,
      WebToolProtectPDFComponent,
      WebToolWatermarkComponent,
      WebToolSplitPDFComponent,
      MobileIndexComponent,
      WebtoolNetdrive,
      HomePageComponent,
      LeftAsideComponent,
      OpenFileComponent,
      TermsOfUseComponent,
      MobileLeftPanelComponent,
      SortableTableComponent,
      AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId:'phantom-online'}),
      ShareModule,
      FormsModule,
      SubscriptionModule,
    AppRoutingModule,
      BookshelfModule,
      WebpdfPreviewModule,
      HttpClientModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
      ToastyModule.forRoot(),
    TranslateModule.forRoot({
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler},
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
      UserService,
      GlobalService,
      AuthenticationService,
      AlertService,
      WebpdfService,
      VerifyService,
      WebToolUrls,
      CookieService,
      WebToolFileInfo,
      { provide: CookieOptions, useValue: false },
      WebToolMultiFileInfos,
      WebToolService,
      WebToolEntryService,
      SharedService,
      ProgressBarService
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
