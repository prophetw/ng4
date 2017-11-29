import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { WebpdfPreviewComponent } from './webpdf-preview.component';
import { RouterModule, Routes } from '@angular/router';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';
import { HttpModule, Http } from '@angular/http';

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
    {path: 'phantompdf', component: WebpdfPreviewComponent},
    {path: 'phantompdf/', component: WebpdfPreviewComponent},
    {path: 'reader', component: WebpdfPreviewComponent},
    {path: 'preview', component: WebpdfPreviewComponent},   // upload file
    {path: 'preview/:extra_params', component: WebpdfPreviewComponent},   // upload file
    //{path: 'preview/uuid/:uuid', component: WebpdfPreviewComponent},   // upload file @Deprecated
    {path: 'reader/cmis/:cmisid', component: WebpdfPreviewComponent}, //  reader cmis preview
    {path: 'phantompdf/cmis/:cmisid', component: WebpdfPreviewComponent}, //  phantompdf cmis preview
    {path: 'preview/cmis/:cmisid', component: WebpdfPreviewComponent}, //
    {path: 'preview/cmis/:cmisid/:extra_params', component: WebpdfPreviewComponent}, //
    //{path: 'preview/netdrive/:drive_name/:file_id/:path', component: WebpdfPreviewComponent}, //
    {path: 'preview/netdrive/:drive_name/:file_id/:extra_params', component: WebpdfPreviewComponent}, //
    {path: 'preview/netdrive/:drive_name/:file_id/:extra_params/:path', component: WebpdfPreviewComponent}, //
    //{path: 'preview/url/:url/:name/:cmisid', component: WebpdfPreviewComponent}, // cloud-reading @Deprecated
    {path: 'preview/url/:url/:name', component: WebpdfPreviewComponent}, // online file preview with filename
    {path: 'preview/url/:url', component: WebpdfPreviewComponent}, // online file preview
    {path: 'preview/customparameters/:params', component: WebpdfPreviewComponent}, // online file preview
    {path: 'reader/customparameters/:params', component: WebpdfPreviewComponent}, // online file preview
    {path: 'phantompdf/customparameters/:params', component: WebpdfPreviewComponent}, // online file preview
];

@NgModule({
    imports:      [ CommonModule ,RouterModule.forChild(appRoutes), TranslateModule],
    declarations: [ WebpdfPreviewComponent ],
})
export class WebpdfPreviewModule { }
