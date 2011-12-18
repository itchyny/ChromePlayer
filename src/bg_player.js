
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
          message.send (newe);
          break;
        case 'get-globalkeybind':
          var ans = { type: 'ans-globalkeybind'
                    , ans: ''// TODO
                    , to: e.from
          };
          message.send (ans);
          break;
        default:
          break;
      }
    });
  }
};

Player.prototype.setting = {
  defaultSetting: {
    notification: true,
    notificationmsec: 5000,
    globalcontrol: true,
    scheme: "classic-default",
    playerrc:
      [ ""
      , "# This is configuration of Local Player"
      , ""
      , "# Vim like keymappings"
      , "map j <down>"
      , "map k <up>"
      , "map gg <home>"
      , "map <s-g> <end>"
      , "map <c-f> PageDown"
      , "map <c-b> PageUp"
      , ""
      , "unmap f"
      , ""
    ].join ('\n')
  },
  init: function () {
    // initialized within this constructor
    // if the key was already set, it is ignored
    this.settings = new Store ("settings", this.defaultSetting);
  },
  reset: function () {
    this.settings.fromObject (this.defaultSetting);
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


// The only stuff which should be exposed to window
// because this function is called from fancu-settings/source/setting.js
this.resetSettings = function () {
  player.setting.reset ();
};

