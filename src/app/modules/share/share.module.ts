import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { ShareComponent }       from './share.component';
import { SharedWithMeComponent } from './shared-with-me.component';
import { RouterModule, Routes } from '@angular/router';
import { ShareService } from '../../services/share.service';
//import { MaterialModule } from '@angular/material';
//import 'hammerjs';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';
import { HttpModule, Http } from '@angular/http';
import { SizePipe } from '../../shared/size.pipe'
//import { ContextMenuModule } from 'angular2-contextmenu'
import {ToastyModule} from 'ng2-toasty';
import { BsDropdownModule,ModalModule } from 'ngx-bootstrap';
// lang file do not have the key
export class MyMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        return params['key'];
    }
}

// AoT requires an exported function for factories
// https://github.com/ngx-translate/http-loader
export function HttpLoaderFactory(http: Http) {
    //return new TranslateHttpLoader(http);
}

const appRoutes: Routes = <Routes> [
    {path: 'shared-with-me', component: SharedWithMeComponent},
    {path: 'share/:code', component: ShareComponent},
    {path: 'share/:code/:extra_params', component: ShareComponent},
    // PRO-3133:
    {path: 'share-phantompdf/:code', component: ShareComponent},
    {path: 'share-phantompdf/:code/:extra_params', component: ShareComponent},
];

@NgModule({
    imports:      [ CommonModule, RouterModule.forChild(appRoutes), TranslateModule, ToastyModule.forRoot(),
      //ContextMenuModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
    ],
    declarations: [ ShareComponent , SharedWithMeComponent,
      SizePipe,
    ],
    providers : [ ShareService ]
})
export class ShareModule { }
