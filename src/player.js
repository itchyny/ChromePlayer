// Main player
// TODO  !!!!!実装に妥協しない!!!!!! TODO
// TODO   使いやすく  読みやすく     TODO
//
// TODO: シャッフル, リピート
// TODO: 読めないタグ
// TODO: ui.jsのaddfile高速化
// TODO: play/pauseのボタンがおかしい
// TODO: tableクリックでslideからのfocus out
// TODO: album art from id3 tag
// TODO: menu for right click http://www.trendskitchens.co.nz/jquery/contextmenu/
// http://phpjavascriptroom.com/?t=ajax&p=jquery_plugin_contextmenu
// TODO: keyconfigを各自で設定できるように
// TODO: キーだけでファイルの入れ替え
// TODO: ファイル順入れ替えた時にorder更新
// TODO: ソート
// TODO: C-zで削除キャンセルなど
// TODO: title="..."にゴミが入る
// TODO: fixed first row of table
// TODO: Enterでplayした時に, orderをどうするか
// DONE: スキップされた時に, nextを消す <- 次々とスキップしていくと, 大量の曲が一気に流れる
// DONE: ファイル削除した時にnextしたときスキップされる

function Player () {
  var self = this;
  self.ui = UI;
  self.key = new Key (self, keyconfig);
  self.repeat = new Enumstate (['false', 'true', 'one'],
    function () { return local.get('repeat') || 'false'; },
    function (repeat) {
      local.set ('repeat', repeat);
      self.ui.setrepeat (repeat);
    });
  self.repeat.repeatOn ();
  self.shuffle = new Enumstate (['false', 'true'],
    function () { return local.get ('shuffle') || 'false'; },
    function (shuffle) {
      local.set ('shuffle', shuffle);
      self.ui.setshuffle (shuffle);
    });
  self.shuffle.repeatOn ();
  self.volume = new Limited (0, 256, 16,
    function () {
      var vol = local.get ('volume');
      return vol !== undefined ? vol : 127;  // vol can be 0
    },
    function (volume) {
      local.set ('volume', volume);
      self.ui.setvolume (volume);
      if (self.playing) {
        self.playing.setvolume (volume / 256);
      }
    });
  self.start ();
}

Player.prototype = {

  version: '1.60',

  start: function () {
    this.key.start ();
    this.ui.start (this);
    this.repeat.init ();
    this.shuffle.init ();
    this.volume.init ();
  },

  files: [],

  musics: [],

  tags: [],

  playing: null,

  nowplaying: 0,

  /* file reading */
  readFiles: function (files) {
    var self = this;
    var first = true;
    for (var i = 0, l = files.length; i < l; i++) {
      if (files[i].type.match (/audio\/.*(mp3|ogg|m4a|mp4)/)) {
        setTimeout ( (function (file, first, last) {
          return self._readFiles (file, first, last);
        }) (files[i], first, i === l - 1)
        , 100 * i);
        first = false;
      }
    }
  },

  _readFiles: function (file, first, last) {
    var self = this;
    var n = self.musics.length;
    self.files[n] = file;
    self.musics[n] = new Music (file);
    self.musics[n].tagread (
      (function (self, j, starttoplay) {
        return function (tags) {
          self.tags[j] = tags;
          self.ui.ontagread (tags, j);
          if (starttoplay) {
            self.play ();
          }
        };
    }) (self, n, !self.playing && first));
    self.ui.addfile (file, n);
    self.order.concat ([n]);
    if (last) {
      self.ui.selectableSet ();
      self.ui.setdblclick ();
      self.order.shuffleOn (); // TODO
    }
  },

  /* basic player operations */
  play: function (index) {
    var self = this;
    if (index === undefined) {
      index = this.order.at (0);
    }
    self.pause ();
    if (self.playing) {
      self.playing.release ();
    }
    if (index != undefined) {
      self.nowplaying = index;
      self.playing = self.musics[index];
      self.playing.play (self.volume.value / 256, function () { self.next (); });
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
      self.playing.play (self.volume.value / 256, function () { self.next (); });
      self.ui.play (self.nowplaying);
    } else {
      self.pause ();
    }
  },

  next: function () {
    this.ui.pause ();
    var index = this.order.next ();
    if (index === undefined) return;
    if (!this.musics[index]) {
      index = this.order.at (0);
    }
    log ("next: " + index);
    this.play (index);
  },

  prev: function () {
    // TODO
  },

  seekAt: function (position /* 0 - 1 */ ) {
    if (this.playing !== undefined && this.playing.audio) {
      position = Math.max (0, Math.min (1, position));
      this.playing.audio.currentTime = this.playing.audio.duration * position;
      return true;
    }
    return false;
  },

  seekBy: function (sec) {
    if (this.nowplaying !== undefined && this.playing && this.playing.audio) {
      var prev = this.playing.seekBy (sec);
      if (prev) {
        this.prev ();
      }
    }
  },

  /* volume operations */
  volume: new Limited (0, 256, 16, 127),

  updatevolume: function () {
    this.volume.at (this.ui.volume);
  },

  mute: function () {
    this.predvol = this.volume;
    this.volume.setToMin ();
  },

  resume: function () {
    this.volume.at (this.predvol);
    delete this.predvol;
  },

  togglemute: function () {
    if (this.volume.value === 0 && this.prevol !== undefined) {
      this.resume ();
    } else {
      this.mute ();
    }
  },

  volumeup: function () {
    this.volume.increase ();
  },

  volumedown: function () {
    this.volume.decrease ();
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
  var player = new Player ();
};

