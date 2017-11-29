/**
 * Created by wangwei on 17/8/30.
 */

(function(){
    var ua = navigator.userAgent.toLowerCase();
    var t;
    var config = {
        /*scheme:必须*/
        scheme_IOS: 'sinaweibo://home',
        scheme_Adr: 'sinaweibo://splash',
        download_url: document.getElementById('J-download-app').value,
        timeout: 600
    };

    function openclient() {
        var startTime = Date.now();


        var ifr = document.createElement('iframe');
        //ifr.src = 'sinaweibo://sendweibo';
        ifr.src = ua.indexOf('os') > 0 ? config.scheme_IOS : config.scheme_Adr;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        var t = setTimeout(function() {
            var endTime = Date.now();
            if (!startTime || endTime - startTime < config.timeout + 200) { //如果装了app并跳到客户端后，endTime - startTime 一定> timeout + 200
                window.location = config.download_url;

            }
        }, config.timeout);

        window.onblur = function() {
            clearTimeout(t);
        }
    }
    window.addEventListener("DOMContentLoaded", function(){
        document.getElementById("J-call-app").addEventListener('click',openclient,false);

    }, false);
})()