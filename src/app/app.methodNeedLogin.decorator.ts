/**
 * Created by wangwei on 17/4/11.
 */

//import { CookieService } from 'angular2-cookie/core';
//import { GlobalService } from './services/global.service';

//import { ReflectiveInjector } from '@angular/core';

//var injector = ReflectiveInjector.resolveAndCreate([
//    CookieService,
    //GlobalService
//]);
//var cookieService = injector.get(CookieService);
//var globalService = injector.get(GlobalService);
// 上面的 写法 ng build --prod 会报错  主要是  --build-optimizer  这个打包会报错  --aot 是不会报错的
// 所以以后  ng build --prod报错 第一步查看 dev 的代码有没有错 再看 --aot 打包的有没有错 再看  --build-optimizer --aot 的有没有错
function getCookie(name)
{
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
declare var window: any;

export function MethodNeedLoginDecorator() {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        var originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            console.log('====needLogin====');
            console.log(phantomOnlineGlobalConfig);
            console.log(phantomOnlineGlobalConfig.methodNeedLogin);
            if(phantomOnlineGlobalConfig.methodNeedLogin){
                if(!getCookie('currentToken')){
                    window.angularHeaderComponent.zone.run(()=>{
                        window.parent.angularHeaderComponent.showSignInModal(true);
                    });
                }else{
                    originalMethod.apply(this, args);
                }

            }else{
                originalMethod.apply(this, args);
                return ;
            }
        };
        return descriptor;
    };

}