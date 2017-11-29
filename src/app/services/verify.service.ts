/**
 * Created by wangwei on 17/3/3.
 */
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import {MethodNeedLoginDecorator} from '../app.methodNeedLogin.decorator';

@Injectable()
export class VerifyService {

    constructor(private router: Router) {
        // clear alert message on route change

    }
    public getFileExt(fileName:string){
        var fileExt = '';
        var index = fileName.lastIndexOf('.');
        if (index!==-1){
            fileExt = fileName.slice(index+1)
        }
        return fileExt.toLowerCase();
    }
    @MethodNeedLoginDecorator()
    public verifyWebPdfFile(file:any,successfulCallback?:any,errorCallback?:any){

        //lastModified
        //    :
        //    1486715237000
        //lastModifiedDate
        //    :
        //    Fri Feb 10 2017 16:27:17 GMT+0800 (CST)
        //name
        //    :
        //    "5.29combine(1).pdf"
        //size
        //    :
        //    793315
        //type
        //    :
        //    "application/pdf"
        //webkitRelativePath
        //    :
        //
        //   ""

        //  https://jira.foxitsoftware.cn/browse/WEBPDF-4995
        // <30M
        //  It is not a PDF file, please choose a PDF file.
        //if (successfulCallback && typeof successfulCallback=='function') {
        //    successfulCallback()
        //}
        //return ;


        /* for PRO-1731
        if (file.size && file.size>=50*1024*1024){
            //alert('Too Large');
            if(errorCallback){
                errorCallback(' Sorry, only support uploading files less than 50MB at present.');
            }
            return ;
        }
        */
        if (file.type && file.type!=='application/pdf'){
            if(errorCallback){
                errorCallback('NOT_PDF');
            }
            return ;
        }

        if (file.name && this.getFileExt(file.name)!=='pdf'){
                if(errorCallback){
                    errorCallback('NOT_PDF');
                }
            return ;
        }

        if (successfulCallback && typeof successfulCallback=='function') {
            successfulCallback()
        }
    }

}