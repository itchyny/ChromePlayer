
function Player() {
  // body...
}

Player.prototype = {

  start: function () {
    notification.createNotification ('../icon_128.png', 'Local Player', 'Background page created');
    for (var x in this) {
      if (this[x] && this[x].init) {
        this[x].init (this);
        log ("init: " + x);
      }
    }
  },

  message: {
    init: function (app) {
      this.app = app;
      chrome.extension.onRequest.addListener (function (e, sender, sendResponse) {
        switch (e.type) {
          case 'notification':
            notification.createNotification (e.icon, e.title, e.message);
            break;
          default:
            break;
        }
      });
    }
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

