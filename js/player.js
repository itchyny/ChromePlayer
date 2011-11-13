// Main player
// TODO: flacが入ってきたらダメ
// TODO: そろそろorderをnew Enumstateしよう

function Player () {
  var self = this;
  self.ui = UI;
  self.key = new Key (self, keyconfig);
  this.repeat = new Enumstate (['false', 'true', 'one'],
    function () { return local.get ('repeat') || 'false'; },
    function (repeat) {
      local.set ('repeat', repeat);
      self.ui.setrepeat (repeat);
    });
  this.shuffle = new Enumstate (['false', 'true'],
    function () { return local.get ('shuffle') || 'false'; },
    function (shuffle) {
      local.set ('shuffle', shuffle);
      self.ui.setshuffle (shuffle);
    });
}

Player.prototype = {

  version: '1.60',

  start: function () {
    this.ui.start (this);
    this.key.start ();
    this.repeat.init ();
    this.shuffle.init ();
  },

  files: [],

  musics: [],

  tags: [],

  playing: null,

  nowplaying: 0,

  readFiles: function (files) {
    var self = this;
    for (var i = 0, l = files.length, n = this.musics.length; i < l; i++, n++) {
      setTimeout (
        (function (i, n) {
          return function () {
            if (files[i].type.match (/audio\/.*(mp3|ogg|m4a|mp4)/)) {
              self.files[n] = files[i];
              self.musics[n] = new Music (files[i]);
              self.musics[n].tagread (
                (function (j) {
                  return function (tags) {
                    self.tags[j] = tags;
                    self.ui.ontagread (tags, j);
                  };
                })(n));
              self.ui.addfile (files[i], n);
              self.order.concat ([n]);
              if (!self.playing) {
                self.play ();
              }
            }
            if (i === l - 1) {
              self.ui.selectableSet ();
            }
          }
        }) (i, n)
      , 10 * i);
    }
  },

  play: function (index) {
    if (index === undefined) {
      index = this.order.at (0);
    }
    var self = this;
    self.pause ();
    if (self.playing) {
      self.playing.release ();
    }
    if (index != undefined) {
      self.nowplaying = index;
      self.playing = self.musics[index];
      self.playing.play (self.volume / 256, function () { self.next (); });
      self.ui.play (index);
    }
  },

  pause: function () {
    this.ui.pause ();
    if (this.playing) {
      this.playing.pause ();
    }
  },

  toggle: function () {
    var self = this;
    if (!self.playing) return;
    if (self.playing.paused ()) {
      self.playing.play (self.volume / 256, function () { self.next (); });
      self.ui.play (self.nowplaying);
    } else {
      self.pause ();
    }
  },

  next: function () {
    this.ui.pause ();
    var index = this.order.next (); //this.nowplaying + 1; // TODO
    if (!this.musics[index]) index = this.order.at (0);
    this.play (index);
    // log('--  next  --');
  },

  prev: function () {
  },

  get volume () {
    if (this._volume === undefined) {
      var vol = local.get ('volume');
      this._volume = vol === undefined ? 128 : vol;
    }
    local.set ('volume', this._volume);
    return this._volume;
  },

  set volume (volume) {
    var volume = volume % 257;
    this.ui.volume = volume;
    local.set ('volume', volume);
    this._volume = volume;
    this.playing && this.playing.setvolume (volume / 258);
  },

  updatevolume: function () {
    this.volume = this.ui.volume;
  },

  mute: function () {
    this.predvol = this.volume;
    this.volume = 0;
  },

  resume: function () {
    this.volume = this.predvol;
    delete this.predvol;
  },

  volumeup: function () {
    this.volume = Math.min (this.volume + 16, 256);
  },

  volumedown: function () {
    this.volume = Math.max (this.volume - 16, 0);
  },

  remove: function (index) {
    this[index] = null;
    this.order.remove (index);
  },

  order: new Enumstate ([]),

  repeat: new Enumstate (['false', 'true', 'one']),

  shuffle: new Enumstate (['false', 'true']),

}

window.onload = function () {
  window.player = (new Player).start ();
};

