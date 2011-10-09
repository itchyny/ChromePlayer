;
// Key maneger

function Key (app, config) {
  this.app = app;
  if (config) {
    for (var key in config) {
      this.set (this.parse (key), config[key]);
    }
  }
}

Key.prototype = {

  start: function () {
    var self = this;
    $(window).keydown (function (e) {
      var f = self.callback [self.convert (e)];
      if (f) {
        self.prevent (e);
        f (self.app, e);
      }
    });
  },

  prevent: function (e) {
    if (e.preventDefault)
      e.preventDefault();
  },

  convert: function (e) {
    var meta = this.meta (e);
    var key = "<" + (meta ? meta + "-" : "") + this.keyCode (e.keyCode) + ">";
    return key;
  },

  meta: function (e) {
    return (e.global ? 'g' : '')
         + (e.ctrlKey || e.metaKey ? 'c' : '')
         + (e.shiftKey ? 's' : '')
         + (e.altKey ? 'a' : '');
  },

  parse: function (key) {
    return key.toLowerCase ();
  },

  set: function (key, callback) {
    this.callback [key] = callback;
  },

  callback: [],

  codes: {
      8: "backspace",
      9: "tab",
     13: "enter",
     16: "shift",
     17: "ctrl",
     18: "alt",
     27: "esc",
     32: "space",
     33: "pgup",
     34: "pgdn",
     35: "end",
     36: "home",
     37: "left",
     38: "up",
     39: "right",
     40: "down",
     45: "insert",
     46: "delete",
    106: "*",
    107: "+",
    111: "/",
    144: "numlock",
    186: ":",
    187: ";",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "@",
    219: "[",
    220: "\\",
    221: "]",
    222: "^",
  },

  keyCode: function (keyCode) {
    if (this.codes[keyCode]) return this.codes[keyCode];
    if (48 <= keyCode && keyCode <= 57) return keyCode - 48;
    if (65 <= keyCode && keyCode <= 90) return String.fromCharCode(keyCode).toLowerCase();
    if (96 <= keyCode && keyCode <= 105) return keyCode - 96;
    if (112 <= keyCode && keyCode <= 123) return "f" + (keyCode - 111);
    throw keyCode + "?"
  },

};


