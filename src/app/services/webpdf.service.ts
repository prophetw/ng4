/**
 * Created by wangwei on 17/3/3.
 */
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { GlobalService } from './global.service';
//import '../../foxit-webpdf-web/webapp/scripts/phantomOnline.js';
//import '../../foxit-webpdf-web/webapp/scripts/jquery-1.10.2.min.js'
declare var WebPDF: any;
declare var $: any;

@Injectable()
export class WebpdfService {
    public preparedFile:any;
    constructor(private router: Router, private globalService: GlobalService) {
        // clear alert message on route change

    }
    public prepareWebpdf(file:any,fileUrl?:any){
        this.preparedFile = file;
        WebPDF.setServerBaseUrl(this.globalService.webpdfApiUrl);
        //   注意 这个地方 回调采用了  () => this.isReady() 这种写法  可以解决 this 的指向问题 否则需要 手动传递 作用域
        //  否则 function(){}  这种写法 回调 会创建 一个新的this 指向 function 自身
        //  angularjs2 官方文档中提到 回调中所用的 ES2015 箭头函数 比等价的函数表达式更加简洁，能优雅的处理 this 指针。
        //  angularjs2 官方文档中 https://angular.cn/docs/ts/latest/tutorial/toh-pt4.html
        //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        //WebPDF.isReady(() => this.isReady())

        this.router.navigate(['/preview']);
        return false;

        //this.isReady();
    }
    public isReady(){
        console.log('Uploading...');
        //__this.getUUID_successCallback({result: "f107111f6eec457ea6c58e89b6bb3f1b"});
        var userInfo:any;
        var currentUser = this.globalService.currentUser || null;
        if (currentUser){
            userInfo = {
                email: currentUser.email,
                userInfo:{'user_id':currentUser.user_id}
            };
        }
        var path:string = 'C:\\fakepath\\' + this.preparedFile.name;
        if (this.preparedFile){
            WebPDF.getUUID(this.preparedFile,userInfo,path,(uuid:any) => this.getUUID_successCallback(uuid)
            ,this.getUUID_failCallback);
        }
    }
    public getUUID_successCallback(uuid:any){
        console.log('---->');
        //console.log(this.route)
        console.log(uuid); // Object {result: "f107111f6eec457ea6c58e89b6bb3f1b"}
        this.router.navigate(['/preview/uuid/'+uuid.result]);
    }

    public getUUID_failCallback(){

    }

}