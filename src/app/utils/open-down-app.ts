import { device } from './device'

function mobileOpenWith ({androidOpenAppUrl, androidDownAppUrl, iosOpenAppUrl, iosDownAppUrl, uwpDownAppUrl, otherUrl} :
  {androidOpenAppUrl:string, androidDownAppUrl:string, iosOpenAppUrl:string, iosDownAppUrl:string, uwpDownAppUrl:string, otherUrl:string}) {
  let open: Function;
  if (device.androidPhone() || device.androidTablet()) {
    open = function () {
      // 安卓暂不支持从浏览器打开app
      if (!androidOpenAppUrl) {
        return window.location.href = androidDownAppUrl;
      }
      window.location.href = androidOpenAppUrl; /***打开app的协议，有安卓同事提供***/
      window.setTimeout(function(){
        window.location.href = androidDownAppUrl; /***下载app的地址***/
      },2000);
    }
  } else if (device.iphone() || device.ipad()) {
    open = function () {
      var ifr = document.createElement("iframe");
      ifr.src = iosOpenAppUrl; /***打开app的协议，有ios同事提供***/
      ifr.style.display = "none";
      document.body.appendChild(ifr);
      window.setTimeout(function(){
        document.body.removeChild(ifr);
        window.location.href = iosDownAppUrl; /***下载app的地址***/
      },2000)
    }
  } else if (device.windowsPhone() || device.windowsTablet()) {
    open = function () {
      window.location.href = uwpDownAppUrl;
    }
  } else {
    open = function () {
      window.location.href = otherUrl;
    }
  }
  return open;
}

export {mobileOpenWith}
