var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebpdfPreviewComponent } from './webpdf-preview.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// lang file do not have the key
var MyMissingTranslationHandler = (function () {
    function MyMissingTranslationHandler() {
    }
    MyMissingTranslationHandler.prototype.handle = function (params) {
        return params['key'];
    };
    return MyMissingTranslationHandler;
}());
export { MyMissingTranslationHandler };
// AoT requires an exported function for factories
// https://github.com/ngx-translate/http-loader
export function HttpLoaderFactory(http) {
    return new TranslateHttpLoader(http);
}
var appRoutes = [
    { path: 'phantompdf', component: WebpdfPreviewComponent },
    { path: 'phantompdf/', component: WebpdfPreviewComponent },
    { path: 'reader', component: WebpdfPreviewComponent },
    { path: 'preview', component: WebpdfPreviewComponent },
    { path: 'preview/:extra_params', component: WebpdfPreviewComponent },
    //{path: 'preview/uuid/:uuid', component: WebpdfPreviewComponent},   // upload file @Deprecated
    { path: 'reader/cmis/:cmisid', component: WebpdfPreviewComponent },
    { path: 'phantompdf/cmis/:cmisid', component: WebpdfPreviewComponent },
    { path: 'preview/cmis/:cmisid', component: WebpdfPreviewComponent },
    { path: 'preview/cmis/:cmisid/:extra_params', component: WebpdfPreviewComponent },
    //{path: 'preview/netdrive/:drive_name/:file_id/:path', component: WebpdfPreviewComponent}, //
    { path: 'preview/netdrive/:drive_name/:file_id/:extra_params', component: WebpdfPreviewComponent },
    { path: 'preview/netdrive/:drive_name/:file_id/:extra_params/:path', component: WebpdfPreviewComponent },
    //{path: 'preview/url/:url/:name/:cmisid', component: WebpdfPreviewComponent}, // cloud-reading @Deprecated
    { path: 'preview/url/:url/:name', component: WebpdfPreviewComponent },
    { path: 'preview/url/:url', component: WebpdfPreviewComponent },
    { path: 'preview/customparameters/:params', component: WebpdfPreviewComponent },
    { path: 'reader/customparameters/:params', component: WebpdfPreviewComponent },
    { path: 'phantompdf/customparameters/:params', component: WebpdfPreviewComponent },
];
var WebpdfPreviewModule = (function () {
    function WebpdfPreviewModule() {
    }
    WebpdfPreviewModule = __decorate([
        NgModule({
            imports: [CommonModule, RouterModule.forChild(appRoutes), TranslateModule],
            declarations: [WebpdfPreviewComponent],
        })
    ], WebpdfPreviewModule);
    return WebpdfPreviewModule;
}());
export { WebpdfPreviewModule };
