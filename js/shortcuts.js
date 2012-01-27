//
// This is the content script for Chrome Player.
//

var messageid;
var globalkeybind;

function randomstr (num) {
  num = num || 10;
  var strarr = 'abcdefghijklmnopqrstuvwxyz';
  var len = strarr.length;
  var s = '';
  for (var i = 0; i < num; i++) {
    s += strarr[Math.floor(Math.random() * len)];
  }
  return s;
}

chrome.extension.onRequest.addListener (function (e, sender, sendResponse) {
  switch (e.type) {
    case 'ans-globalkeybind':
      if (e.to === messageid) {
        globalkeybind = e.ans;
      }
      break;
    default:
      break;
  }
});
chrome.extension.sendRequest ( { type: 'get-globalkeybind', from: (messageid = randomstr (30)) });
window.addEventListener('keypress', function (e) {
    switch (e.target.localName) {
      case 'input': case 'textarea': return;
      default:
        // TODO
        var keys = [ 32, 37, 38, 39, 40, 119, 120, 121, 173, 174, 175, 176, 177, 178, 179 ];
        if (keys.indexOf(e.keyCode) >= 0) {
            chrome.extension.sendRequest(
              { keyCode: e.keyCode
              , shiftKey: e.shiftKey
              , ctrlKey: e.ctrlKey
              , altKey: e.altKey
              , global: true
              , type: 'globalkeydown'
              });
        }
  }
});
