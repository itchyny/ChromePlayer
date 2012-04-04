// Key maneger


if (typeof window === 'undefined') {
  var Rc = require ('./rc').Rc;
}

function Key (config) {
  if (config) {
    for (var key in config) {
      if (config.hasOwnProperty (key)) {
        if (config[key]) {
          var keyformatted = this.parse (key).join (' ');
          this.set (keyformatted, config[key]);
          this.keys.push (keyformatted);
        }
      }
    }
  }
  this.keys = this.keys.sort ();
}

Key.prototype = {

  keys: [],

  callback: {},

  init: function (app) {
    this.app = app;
    var self = this;
    $(window).keypress (function (e) {
      switch (e.target.localName) {
        case 'input': case 'textarea': if (e.target.id !== 'hidden') return;
        default:
          self.prevent (e);
      }
    });
    $(window).keydown (function (e) {
      console.dir(e.target);
      console.dir(e.target.id);
      switch (e.target.localName) {
        case 'input': case 'textarea': if (e.target.id !== 'hidden') return;
        default:
          self.keydown (e);
          if (self.callback [ self.convert (e) ]) {
            self.prevent (e);
          }
      }
    });
    self.viewshortcuts ();
  },

  keydown: function (e) {
    if (!this.onlyMeta (e)) {
      this.app.ui.keyview (this.keyqueue.join(' ')+this.convert(e));
      this.keydownstr (this.convert (e), e);
    }
  },

  keydownstr: function (s, e) {
    var self = this;
    self.keyqueue.push (s);
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
  },

  triggerInstantly: function () {
    var key = this.keyqueue.join (' ');
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
    var keys = self.keyqueue.join (' ');
    var f = self.callback [keys];
    if (f) {
      self.prevent (e);
      f.fn (self.app, e);
    }
    self.keyqueue = [];
  },

  keyqueue: [],

  triggerTimer: undefined,

  watingTime: 480,

  prevent: function (e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  },

  convert: function (e) {
    var meta = this.meta (e);
    var key = (meta !== '' ||
               this.codes[e.keyCode] && this.codes[e.keyCode].length > 1)
            ? '<' + meta + this.keyCode (e.keyCode) + '>'
            :              this.keyCode (e.keyCode);
    return key;
  },

  meta: function (e) {
    return ((e.global ? 'g-' : '')
          + (e.ctrlKey || e.metaKey || this.lockconfig.ctrlKey ? 'c-' : '')
          + (e.shiftKey || this.lockconfig.shiftKey ? 's-' : '')
          + (e.altKey || this.lockconfig.altKey ? 'a-' : ''));
  },

  // TODO
  parse: function (key) {
    var result = Rc.parsekey (key);
    return result;
  },
  // parse: function (key) {
  //   key = key.toLowerCase ().replace (/ /g, '');
  //   var arr = [];
  //   var onekey = [];
  //   while (key) {
  //     if (!(onekey = key.match (/^<[^<>]*>/))) {
  //       onekey = [key[0]];
  //     }
  //     arr = arr.concat (onekey);
  //     key = key.slice (onekey[0].length);
  //   }
  //   return arr.join (' ');
  // },

  keyinfo: [],

  numcommand: 10,

  set: function (key, callback) {
    if (typeof callback.fn === 'function') {
      this.setfunction (key, callback);
    } else if (typeof callback === 'string') {
      this.setstring (key, callback);
    }
  },

  setfunction: function (key, callback) {
    this.callback [key] = callback;
    if (callback.str !== "") {
      var dt = 0;
      var id = callback.id;
      var offset = id * this.numcommand;
      while (dt < this.numcommand && this.keyinfo[offset + dt]) dt++;
      if (dt < this.numcommand) {
        this.keyinfo [offset + dt] = { callback: callback, key: key, opt: callback.opt };
      }
    }
  },

  setstring: function (key, callback) {
    var self = this;
    self.callback [key] = (function (env) {
      var keyseq = self.parse (callback);
      if (keyseq.length === 1 && env[keyseq[0]]) {
        var eqkey = keyseq[0];
        var newcallback = env[eqkey];
        var id = newcallback.id;
        var opt = newcallback.opt;
        var str = newcallback.str;
        var offset = id * self.numcommand;
        if (id && str !== '' && !/g-/.test(key)) {
          var dt = 0;
          while (dt < self.numcommand && self.keyinfo[offset + dt]) dt++;
          if (dt < self.numcommand) {
            self.keyinfo [offset + dt] = { callback: newcallback, key: key, opt: opt };
          }
        } else { // if (key.replace('g-', '') === eqkey) {
          var keywithoutglobal = key.replace ('g-', '');
          for (var dt = 0; dt < self.numcommand; dt++) {
            if (self.keyinfo [offset + dt]) {
              if (self.keyinfo [offset + dt].key === keywithoutglobal) {
                self.keyinfo [offset + dt].key = key;
              }
            }
          }
        }
      }
      return { fn: function () {
        for (var i = 0; i < keyseq.length; i++) {
          setTimeout ( (function (i) { return function () {
            self.keydownstr (keyseq [i]);
          };}) (i)
          , 5 * i);
        }
      }, callback: newcallback, key: key, opt: opt };
    }) (self.callback);
  },

  viewshortcuts: function () {
    var self = this;
    var div = $('<div />');
    var dls = [];
    var checked = [];
    for (var i = 0; i < self.keyinfo.length; i++) {
      if (!checked[i]) {
        checked[i] = true;
        var info = self.keyinfo[i];
        if (info !== undefined) {
          var keys = Rc.parsekey (info.key)
                       .map (function (x) { return new Onekey (x); });
          var keyshtml = keys.map (function (x) { return x.toHTML (); }).join ('');
          for (var j = i - parseInt(i/self.numcommand) * self.numcommand; j < self.numcommand; j++) {
            if (!checked[i + j]) {
              var _info = self.keyinfo[i + j];
              if (_info && _info.opt.deepEqual(info.opt)) {
                checked[i+j] = true;
                var _keys = Rc.parsekey (_info.key)
                         .map (function (x) { return new Onekey (x); });
                keyshtml += ' / ';
                keyshtml += _keys.map (function (x) { return x.toHTML (); }).join ('');
              }
            }
          }
          var key = new Onekey (info.key);
          var str = info.callback.str;
          var type = info.callback.type;
          var dt = $('<dt />')
            .append (keyshtml);
          var dd = $('<dd />')
            .text (str);
          if (!dls[type]) {
            dls[type] = $('<dl />');
          }
          dls[type].append(dt).append(dd);
        }
      }
    }
    $('div.keygroup').remove();
    for (var i = 0; i < dls.length; i++) {
      var dl = dls[i];
      if (dl) {
        $('div.keygroups').append(
          $('<div class="keygroup"/>').append(dl)
        );
      }
    }
  },

  lock: function (key) {
    if (this.lockconfig[key] !== undefined) {
      this.lockconfig[key] = true;
    }
    return this;
  },

  lockAll: function () {
    for (var key in this.lockconfig) {
      if (this.lockconfig.hasOwnProperty (key)) {
        this.lockconfig[key] = true;
      }
    }
  },

  unlock: function (key) {
    if (this.lockconfig[key] !== undefined) {
      this.lockconfig[key] = false;
    }
    return this;
  },

  unlockAll: function () {
    for (var key in this.lockconfig) {
      if (this.lockconfig.hasOwnProperty (key)) {
        this.lockconfig[key] = false;
      }
    }
  },

  togglelock: function (key) {
    if (this.lockconfig[key] !== undefined) {
      this.lockconfig[key] = !this.lockconfig[key];
    }
    return this;
  },

  lockconfig: {
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false
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
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12'
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
    log ('unknown key: ' + keyCode);
  }

};

function Command () {
  // TODO
}

// TODO
function KeySequence (str) {
  // body...
};
KeySequence.prototype = {
};

function Onekey (str) {
  this.ctrl = this.alt = this.meta = this.shift = this.global = null;
  if (!Rc.regex.onekey.test (str)) throw "Don't pass unvalid key into Onekey!";
  this.parse (str);
};
Onekey.prototype = {

  parse: function (str) {
    var r;
    if (r = Rc.regex.number.exec (str)) {
      this.key = r[0];
    } else if (r = Rc.regex.smallalphabets.exec (str)){
      this.key = r[0];
    } else if (r = Rc.regex.specialkeys.exec (str)){
      this.key = r[0];
    } else if (r = Rc.regex.keygroup.exec (str)){
      str = str.slice (1).slice (0, -1);
      r = Rc.regex.metakeypyphen.exec (str);
      while (r) {
        str = str.slice (r[0].length);
        r = r[0][0];
        switch (r) {
          case 'c': this.ctrl = true; break;
          case 'a': this.alt = true; break;
          case 'm': this.meta = true; break;
          case 's': this.shift = true; break;
          case 'g': this.global = true; break;
          default: break;
        }
        r = Rc.regex.metakeypyphen.exec (str);
      }
      this.key = str;
    } else {
      log ("unknown key:" + str);
    }
  },

  toHTML: function () {
    var ans = [];
    if (this.ctrl) ans.push (this.wrapmetakey ('Ctrl'));
    if (this.alt) ans.push (this.wrapmetakey ('Alt'));
    if (this.shift) ans.push (this.wrapmetakey ('Shift'));
    var key = this.toUpperCase (this.key)
                  .replace (/Left/, '←')
                  .replace (/Right/, '→')
                  .replace (/Up/, '↑')
                  .replace (/Down/, '↓');
    ans.push (this.wrapkey (key));
    return this.wrapglobalkey (ans.join (' + '));
  },

  wrapkey: function (key) {
    return '<span class="key">' + this.wrapltgt (key) + '</span>';
  },

  wrapltgt: function (key) {
    return key.length > 1 ? '&lt;' + key + '&gt;' : key;
  },

  wrapmetakey: function (key) {
    return this.wrapkey (this.toUpperCase (key));
  },

  wrapglobalkey: function (html) {
    return '<span ' + (this.global ? 'class="global"' : '') + '>' +
                '<span>' + (html) + '</span>' +
           '</span>';
  },

  toUpperCase: function (key) {
    return key[0].toUpperCase() + key.slice(1);
  }

};




