/**
 * Created by wangwei on 17/11/27.
 */

import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareComponent } from './modules/share/share.component'
import {TermsOfUseComponent} from "./components/terms-of-use/terms-of-use.component"
import {
    PageHeaderComponent,
    MainComponent,
    OpenFileComponent,
    ViewEditComponent,
    MergePDFComponent,
    OrganizePagesComponent,
    LoginComponent,
    SignFormComponent,
    WebToolConvertComponent,
    WebToolHeaderFooterComponent,
    WebToolProtectPDFComponent,
    WebToolWatermarkComponent,
    WebToolSplitPDFComponent,
    SortableTableComponent,
    WebtoolNetdrive,
    MobileIndexComponent,
    HomePageComponent,
    PrivatePolicyComponent,
} from './components/index';
import {BookshelfComponent} from "./modules/bookshelf/bookshelf.component";
export const routes: Routes = [
    //{path: '', redirectTo: 'pdf-reader', pathMatch: 'full'},
    {path: 'login/:token/:url', component: LoginComponent},
    {path: 'login/:token/:url/:lang', component: LoginComponent},
    {path: 'login/:token/:url/', component: LoginComponent},
    {path: 'login-integration/:url', component: LoginComponent},
    {path: 'login-integration/:url/:token', component: LoginComponent},
    {path: 'site/:siteaction', component: ShareComponent},
    {path: 'site/:siteaction/:redirect_url', component: ShareComponent},
    {path: 'redirect-to-cas/:target_url', component: ShareComponent},
    {path: 'view-and-edit', component: OpenFileComponent},
    {path: 'view-edit', component: ViewEditComponent},
    {path: 'merge-pdfs', component: MergePDFComponent},
    {path: 'organize-pages', component: OrganizePagesComponent},
    {path: 'term-of-use', component: TermsOfUseComponent},
    {path: 'privacy-policy', component: PrivatePolicyComponent},
    {path: 'foxit-drive', loadChildren: './modules/bookshelf/bookshelf.module#BookshelfModule'},
    {
        path: 'mobile-index',
        component: MobileIndexComponent
    },
    {path: '**', component: HomePageComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}