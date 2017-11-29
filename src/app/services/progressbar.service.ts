/**
 * Created by wangwei on 17/3/3.
 */
import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { GlobalService } from './global.service';

declare var ProgressBar:any;
declare var window: any;
declare var $:any;
// https://kimmobrunfeldt.github.io/progressbar.js
@Injectable()
export class ProgressBarService {
    constructor(private router: Router, private globalService: GlobalService,private zone:NgZone) {
        // clear alert message on route change
        window.angularProgressbarComponent = {
            zone: this.zone,
            insertProgressBarHtml: () => this.insertProgressBarHtml(),
            ShowModal: (type:any) => this.ShowModal(type),
            CloseModal: () => this.CloseModal(),
            component: this
        };
    }
    public insertProgressBarHtml(){
        var html:any;
        //html = '<div style="background: rgba(0,0,0,0.4);position: fixed;z-index: 10000;top: 0;width: 100%;height: 100%;left: 0;" id="progressbar-modal-tt" class="progressbar-modal-tt hide">' +
        //    '<div class="progressbar-modal" style="width: 400px;height: 250px;background: #565656;position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;">' +
        //    '<div class="progressbar-modal-header" style="height: 50px;padding: 10px 20px;line-height: 30px;background: #383838;color: #b5b5b5;font-size:14px">' +
        //    '<p>Upload Status <i onclick="$(\'#progressbar-modal-tt\').addClass(\'hide\')" class="fa fa-times pull-right close-progress-modal-btn" style="cursor: pointer;margin-top: 6px"></i></p>' +
        //    '</div>'+
        //    '<div class="progressbar-modal-body" style="padding: 10px;">' +
        //    '<div class="progressbar" style="width:170px;margin: 0 auto;"></div>' +
        //    '</div>'+
        //    '<div class="progressbar-modal-footer"></div>'+
        //    '</div>' +
        //    '</div>';
        html = '<div style="background: rgba(0,0,0,0.4);position: fixed;z-index: 10000;top: 0;width: 100%;height: 100%;left: 0;" id="progressbar-modal-tt" class="progressbar-modal-tt hide">' +
            '<div class="spinner-container" style="height: 20px;width:100%;left: 0;right: 0;top: 0;bottom: 0;margin: auto;text-align:center;position: absolute;color:white;">Uploading...<i style="font-size: 20px" class="fa fa-spinner fa-pulse"></i></div>'+
            '</div>';
        $('body').append(html);
        console.log('=====insert progress html ok====');
    }
    public ShowModal(type:any){
        var progressbar:any;
        //if(!type || type=='circle'){
        //    $('.progressbar').empty();
        //    progressbar = this.Circle('.progressbar');
        //}else{
        //    $('.progressbar').empty();
        //    progressbar = this.Circle('.progressbar');
        //}
        $('.progressbar-modal-tt').removeClass('hide');
        return progressbar;
    }
    public CloseModal(){
        $('.progressbar-modal-tt').addClass('hide');
    }
    public Circle(selector:any,options?:any){
        //  selector  '#container' '.hello'
        //  options.beginProgress num  default '0%'
        //  options.strokeColor  default '#838080'
        var strokeColor:any='#838080';
        var beginProgress:any='0%';
        if(options){
            if(options.beginProgress){
                beginProgress = options.beginProgress + '%';
            }else{
                beginProgress = '0%';
            }
            if(!options.strokeColor) strokeColor='#838080';
        }
        var circle:any;
        if(!circle){
            circle = new ProgressBar.Circle(selector, {
                color: strokeColor,
                strokeWidth: 3,
                trailWidth: 1,
                text: {
                    value: beginProgress
                }
            });
        }else{
            circle = null;
            $('.progress-percent').empty();
            circle = new ProgressBar.Circle('.progress-percent', {
                color: strokeColor,
                strokeWidth: 3,
                trailWidth: 1,
                text: {
                    value: beginProgress
                }
            });
        }
        //  circle.setText(percentNum+'%');
        //  circle.animate(percentComplete);
        return circle;
    }


}


//   http://jsfiddle.net/kimmobrunfeldt/a1osxLdj/3/


//<div class="progress-percent">
//
//</div>

//  example code
//if(!circle){
//    circle = new ProgressBar.Circle('.progress-percent', {
//        color: '#838080',
//        strokeWidth: 3,
//        trailWidth: 1,
//        text: {
//            value: '0%'
//        }
//    });
//}else{
//
//    circle=null;
//    $('.progress-percent').empty();
//
//    circle = new ProgressBar.Circle('.progress-percent', {
//        color: '#838080',
//        strokeWidth: 3,
//        trailWidth: 1,
//        text: {
//            value: '0%'
//        }
//    });
//
//}
//$.ajax
//({
//    xhr: function() {
//        var xhr = new window.XMLHttpRequest();
//        xhr.upload.addEventListener("progress", function(evt) {
//            if (evt.lengthComputable) {
//                var percentComplete = evt.loaded / evt.total;
//                var percentNum = parseInt(percentComplete*100);
//                circle.setText(percentNum+'%');
//                circle.animate(percentComplete);
//            }
//        }, false);
//
//        xhr.addEventListener("progress", function(evt) {
//            if (evt.lengthComputable) {
//                var percentComplete = evt.loaded / evt.total;
//                //Do something with download progress
//            }
//        }, false);
//
//        return xhr;
//    },
//    type: "POST",
//    url: postUrl,
//    data:data,
//    beforeSend: function (xhr) {
//        xhr.setRequestHeader ("Authorization", "Basic " + token);
//    },
//    contentType:false,
//    processData: false,
//    success: function (data){
//        if(successfulCallback && typeof successfulCallback === 'function'){
//            successfulCallback(data)
//        }
//    },
//    error: function(data){
//        if(errCallback && typeof errCallback === 'function'){
//            errCallback(data)
//        }
//    }
//});