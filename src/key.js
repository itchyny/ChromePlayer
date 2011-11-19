// Key maneger
// TODO: expansion of commands :: String

function Key (app, config) {
  var key;
  this.app = app;
  if (config) {
    for (key in config) {
      if (config.hasOwnProperty (key)) {
        if (config[key]) {
          this.set (this.parse (key), config[key]);
          this.keys.push (key);
        }
      }
    }
  }
  this.keys = this.keys.sort ();
}

Key.prototype = {

  keys: [],

  callback: {},

  start: function () {
    var self = this;
    $(window).keypress (function (e) {
      self.prevent (e);
    });
    $(window).keydown (function (e) {
      self.keydown (e);
      if (self.callback [ self.convert (e) ]) {
        self.prevent (e);
      }
    });
  },

  keydown: function (e) {
    var self = this;
    if (!self.onlyMeta (e)) {
      self.keyqueue.push (self.convert (e));
      if (self.triggerTimer) {
        clearTimeout (self.triggerTimer);
        self.triggerTimer = undefined;
      }
      if (self.triggerInstantly ()) {
        self.trigger (e);
      } else {
        self.triggerTimer = setTimeout (function () {
          self.trigger (e);
        }, self.watingTime);
      }
    }
  },

  triggerInstantly: function () {
    var key = this.keyqueue.join ('');
    var index = this.keys.indexOf (key);
    if (index < 0) {
      return false;
    }
    if (this.keys[index + 1] !== undefined && this.keys[index + 1].indexOf (key) < 0) {
      return true;
    }
    return false;
  },

  onlyMeta: function (e) {
    switch (this.codes [e.keyCode]) {
      case 'alt': case 'ctrl': case 'shift':
        return true;
      default:
        return false;
    }
  },

  trigger: function (e) {
    var self = this;
    var f = self.callback [self.keyqueue.join ('')];
    log (self.keyqueue.join (''));
    if (f) {
      self.prevent (e);
      f (self.app, e);
    }
    self.keyqueue = [];
  },

  keyqueue: [],

  triggerTimer: undefined,

  watingTime: 300,

  prevent: function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
  },

  convert: function (e) {
    var meta = this.meta (e);
    var key = (meta !== '' || this.codes[e.keyCode]) ? '<' + meta + this.keyCode (e.keyCode) + '>'
                                                     :              this.keyCode (e.keyCode);
    return key;
  },

  meta: function (e) {
    return ((e.global ? 'g-' : '') + (e.ctrlKey || e.metaKey ? 'c-' : '') + (e.shiftKey ? 's-' : '') + (e.altKey ? 'a-' : ''));
  },

  parse: function (key) {
    return key.toLowerCase ();
  },

  set: function (key, callback) {
    this.callback [key] = callback;
  },

  codes: {
      8: 'backspace',
      9: 'tab',
     13: 'enter',
     16: 'shift',
     17: 'ctrl',
     18: 'alt',
     27: 'esc',
     32: 'space',
     33: 'pgup',
     34: 'pgdn',
     35: 'end',
     36: 'home',
     37: 'left',
     38: 'up',
     39: 'right',
     40: 'down',
     45: 'insert',
     46: 'delete',
     91: 'ctrl',
    106: '*',
    107: '+',
    111: '/',
    144: 'numlock',
    186: ':',
    187: ';',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '@',
    219: '[',
    220: '\\',
    221: ']',
    222: '^',
    132: 'f1',
    133: 'f2',
    134: 'f3',
    135: 'f4',
    136: 'f5',
    137: 'f6',
    138: 'f7',
    139: 'f8',
    140: 'f9',
    141: 'f10',
    142: 'f11',
    143: 'f12'
  },

  keyCode: function (keyCode) {
    if (this.codes[keyCode]) {
      return this.codes[keyCode];
    }
    if (48 <= keyCode && keyCode <= 57) {
      return keyCode - 48;
    }
    if (65 <= keyCode && keyCode <= 90) {
      return String.fromCharCode(keyCode).toLowerCase();
    }
    if (96 <= keyCode && keyCode <= 105) {
      return keyCode - 96;
    }
    console.log ('unknown key: ' + keyCode);
  }

};

