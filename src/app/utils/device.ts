// https://github.com/matthewhudson/device.js/blob/master/lib/device.js

let device: any,
  find: Function,
  userAgent: string;

device = {};

// The client user agent string.
// Lowercase, so we can use the more efficient indexOf(), instead of Regex
userAgent = window.navigator.userAgent.toLowerCase();

// Main functions
// --------------

device.osName = function () {
  if (device.windows()){
    if (device.windowsPC()){
      return "WindowsPC";
    } else if (device.windowsPhone()){
      return "WindowsPhone";
    } else if (device.windowsTablet()){
      return "WindowsTablet";
    }
    return "Windows";
  } else if (device.mac()){
    return "Mac";
  } else if (device.ios()){
    return "ios";
  }  else if (device.linux()){
    if (device.android()){
      return "android";
    }
    return "Linux";
  } else if (device.blackberry()){
    return "blackberry";
  } else if (device.mobile()){
    return "mobile";
  }else if (device.tablet()){
    return "tablet";
  }
  return "unknown";
}

device.ios = function () {
  return device.iphone() || device.ipod() || device.ipad();
};

device.mac = function () {
  return find('macintosh');
};

device.linux = function () {
  return find('linux');
};

device.iphone = function () {
  return !device.windows() && find('iphone');
};

device.ipod = function () {
  return find('ipod');
};

device.ipad = function () {
  return find('ipad');
};

device.android = function () {
  return !device.windows() && find('android');
};

device.androidPhone = function () {
  return device.android() && find('mobile');
};

device.androidTablet = function () {
  return device.android() && !find('mobile');
};

device.blackberry = function () {
  return find('blackberry') || find('bb10') || find('rim');
};

device.blackberryPhone = function () {
  return device.blackberry() && !find('tablet');
};

device.blackberryTablet = function () {
  return device.blackberry() && find('tablet');
};

device.windows = function () {
  return find('windows');
};

device.windowsPC = function () {
  return find('windows') && device.desktop();
}

device.windowsPhone = function () {
  return device.windows() && find('phone');
};

device.windowsTablet = function () {
  return device.windows() && (find('touch') && !device.windowsPhone());
};

device.fxos = function () {
  return (find('(mobile;') || find('(tablet;')) && find('; rv:');
};

device.fxosPhone = function () {
  return device.fxos() && find('mobile');
};

device.fxosTablet = function () {
  return device.fxos() && find('tablet');
};

device.meego = function () {
  return find('meego');
};

//device.cordova = function () {
//  return window.cordova && location.protocol === 'file:';
//};
//
//device.nodeWebkit = function () {
//  return typeof window.process === 'object';
//};

device.mobile = function () {
  return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
};

device.tablet = function () {
  return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
};

device.desktop = function () {
  return !device.tablet() && !device.mobile();
};

device.television = function() {
  var i: number, television = [
    "googletv",
    "viera",
    "smarttv",
    "internet.tv",
    "netcast",
    "nettv",
    "appletv",
    "boxee",
    "kylo",
    "roku",
    "dlnadoc",
    "roku",
    "pov_tv",
    "hbbtv",
    "ce-html"
  ];

  i = 0;
  while (i < television.length) {
    if (find(television[i])) {
      return true;
    }
    i++;
  }
  return false;
};

device.portrait = function () {
  return (window.innerHeight / window.innerWidth) > 1;
};

device.landscape = function () {
  return (window.innerHeight / window.innerWidth) < 1;
};

// Private Utility Functions
// -------------------------

// Simple UA string search
find = function (needle: string) {
  return userAgent.indexOf(needle) !== -1;
};

export {device};
