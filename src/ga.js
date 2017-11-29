/**
 * Created by wangwei on 17/11/28.
 */

;(function (){
    var notEnterpriseSite,
        isEnterpriseSite=true;
    notEnterpriseSite=[
        '10.0.90.188',
        'localhost',
        'foxitsoftware.com',
        'foxitsoftware.cn',
        'connectedpdf.com'
    ];
    for(var index=0;index<notEnterpriseSite.length;index++){
        if(window.location.href.indexOf(notEnterpriseSite[index])!==-1){
            isEnterpriseSite=false;
            break;
        }
    }
    if(isEnterpriseSite){
        $('meta[name=apple-itunes-app]').remove();
    }
    // PRO-3867
    if(window.location.href.indexOf('/phantompdf')>-1 || window.location.href.indexOf('/preview')>-1) {
        $('.shortcut.icon').remove();
        $('head').append('<link rel="shortcut icon" href="/assets/img/favicon-phantompdf.ico">');
    }else{
        $('.shortcut.icon').remove();
        $('head').append('<link rel="shortcut icon" href="/assets/img/favicon.ico">');
    }
})()
;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

var _vds=_vds||[];window._vds=_vds,function(){_vds.push(["setAccountId","ac7ef5359d19c616"]),function(){var b,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=("https:"==document.location.protocol?"https://":"http://")+"assets.growingio.com/vds.js",b=document.getElementsByTagName("script")[0],b.parentNode.insertBefore(a,b)}()}();

$(document).ready(function(){
    try {
        // mobile 只有在 setItem 的时候才会报错
        if(localStorage && localStorage.setItem && localStorage.setItem('test','123')){
            console.log('########## support localStorage.setItem');
        }
    }catch (e){
        // not support localStorage.setItem
        console.log('########## not support localStorage.setItem');
        console.log(e);
        $('.not-support-in-private-mode').removeClass('hide');
        if(navigator.language==='zh-CN'){
            $(".not-support-in-private-mode .not-support-txt").text( "您无法访问福昕阅读器网页版，因您浏览器当前是处于“无痕浏览”模式。" );
        }else if(navigator.language==='en-US'){
            $(".not-support-in-private-mode .not-support-txt").text( "Please exit private browsing mode to use Foxit Reader Online." );
        }else{
            $(".not-support-in-private-mode .not-support-txt").text( "Please exit private browsing mode to use Foxit Reader Online." );
        }
    }
    handleOrientation()
});
function handleOrientation(){
    if(window.orientation===0){
        // 竖屏
        $('.not-support-orientation').addClass('hide');
        $('main-container').css('visibility','visible');
    }else if(window.orientation===-90 || window.orientation===90){
        // 横屏
        $('.not-support-orientation').removeClass('hide');
        $('main-container').css('visibility','hidden');
    }else{
        $('.not-support-orientation').addClass('hide');
        $('main-container').css('visibility','visible');
    }
}
$(window).on( "orientationchange", function( event ) {
    handleOrientation();
    if(navigator.language==='zh-CN'){
        $( "#orientation" ).text( "翻转到竖屏获得更好的体验" );
    }else if(navigator.language==='en-US'){
        $( "#orientation" ).text( "Switch to the Portrait for a better experience");
    }else{
        $( "#orientation" ).text( "Switch to the Portrait for a better experience");
    }
});