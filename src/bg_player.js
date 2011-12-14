
function Player() {
  // body...
}

Player.prototype = {

  start: function () {
    notification.createNotification ('../icon_128.png', 'Local Player', 'Background page created');
    for (var x in this) {
      if (this[x] && this[x].init) {
        this[x].init (this);
        this[x].app = this;
        log ("init: " + x);
      }
    }
  }
};

Player.prototype.message = {
  init: function (app) {
    chrome.extension.onRequest.addListener (function (e, sender, sendResponse) {
      console.dir (e);
      switch (e.type) {
        case 'notification':
          notification.createNotification (e.icon, e.title, e.message);
          break;
        case 'globalkeydown':
          var g = local.getSetting ('globalcontrol');
          if (g === undefined || g === 'false') {
            return;
          }
          var newe = e;
          newe.type = 'globalkeydown-bg';
          chrome.extension.sendRequest (newe);
          break;
        default:
          break;
      }
    });
  }
};

Player.prototype.version = {
  toString: function () {
    return '@VERSION';
  },
  init: function (app) {
    this.app = app;
    var version = this.app.version.toString ();
    var prevver = local.get ('version');
    this.app.version.notify (prevver !== version);
    setTimeout (function () {
      local.set ('version', version);
    }, 1000);
  },
  notify: function (b) {
    if (b) {
      notification.createNotification ('../icon_128.png', 'Local Player', 'Updated to version ' + this.app.version);
    }
  }
};

var player = new Player ();
window.onload = function (e) {
  player.start ();
};

