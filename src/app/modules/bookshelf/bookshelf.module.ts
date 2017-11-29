import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { BookshelfComponent } from './bookshelf.component';
import { Routes, RouterModule } from '@angular/router';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';
import { HttpModule, Http } from '@angular/http';
import {HttpClientModule, HttpClient} from '@angular/common/http';
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
    imports:      [
        CommonModule ,
        TranslateModule ,
        RouterModule.forChild([
            { path: '', component: BookshelfComponent, pathMatch: 'full'}
        ])
    ],

    declarations: [ BookshelfComponent ],
    //exports:      [ BookshelfComponent ],
})
export class BookshelfModule { }
