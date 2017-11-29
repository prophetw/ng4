/* SystemJS module definition */
declare var module: NodeModule;
declare var phantomOnlineGlobalConfig:phantomOnlineGlobalConfig;
//import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
//import {TranslateHttpLoader} from '@ngx-translate/http-loader';
//import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';
interface NodeModule {
  id: string;
}
interface phantomOnlineGlobalConfig{
  apiUrl: string;
  accountApiUrl: string;
  cwsApiUrl: string;
  webpdfApiUrl: string;
  cloudApiUrl: string;
  //cwebtoolsApiUrl: 'https://cwebtools.connectedpdf.com/convert.jsp' // WebTools prod site
  cwebtoolsApiUrl: string;
  cwebtoolsApi: string;
  cwebtoolsHttpApi: string;
  methodNeedLogin: boolean;
  // https://jira.foxitsoftware.cn/browse/PRO-2055
  androidOpenAppUrl: string;
  androidDownAppUrl: string;
  androidChinaDownAppUrl: string;
  iosOpenAppUrl: string;
  iosDownAppUrl: string;
  uwpDownAppUrl: string;
}
