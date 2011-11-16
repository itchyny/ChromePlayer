// Main player
// TODO  !!!!!実装に妥協しない!!!!!! TODO
// TODO   使いやすく  読みやすく     TODO
//
// TODO: シャッフル, リピート
// TODO: 読めないタグ
// TODO: ui.jsのaddfile高速化
// TODO: play/pauseのボタンがおかしい
// TODO: tableクリックでslideからのfocus out
// TODO: 3 tabs / cycle
// TODO: album art from id3 tag
// TODO: menu for right click http://www.trendskitchens.co.nz/jquery/contextmenu/
// http://phpjavascriptroom.com/?t=ajax&p=jquery_plugin_contextmenu
// TODO: keyconfigを各自で設定できるように
// TODO: キーだけでファイルの入れ替え
// TODO: 入れ替えた時にorder更新
// TODO: ソート
// TODO: ファイル削除した時にnextしたときスキップされる
// TODO: C-zで削除キャンセルなど
// TODO: スキップされた時に, nextを消す <- 次々とスキップしていくと, 大量の曲が一気に流れる
// TODO: -> <- キーが効かない
// TODO: title="..."にゴミが入る


function Player () {
  var self = this;
  self.ui = UI;
  self.key = new Key (self, keyconfig);
  self.repeat = new Enumstate (['false', 'true', 'one'],
    function () { return local.get ('repeat') || 'false'; },
    function (repeat) {
      local.set ('repeat', repeat);
      self.ui.setrepeat (repeat);
    });
  self.shuffle = new Enumstate (['false', 'true'],
    function () { return local.get ('shuffle') || 'false'; },
    function (shuffle) {
      local.set ('shuffle', shuffle);
      self.ui.setshuffle (shuffle);
    });
  self.volume = new Limited (0, 256, 16,
    function () {
      var vol = local.get ('volume');
      return vol !== undefined ? vol : 127;
    },
    function (volume) {
      self.ui.setvolume (volume);
      local.set ('volume', volume);
      if (self.playing) {
        self.playing.setvolume (volume / 256);
      }
    });
}

Player.prototype = {

  version: '1.60',

  start: function () {
    this.key.start ();
    this.repeat.init ();
    this.shuffle.init ();
    this.volume.init ();
    this.ui.start (this); // call after all the staff are initialized
  },

  files: [],

  musics: [],

  tags: [],

  playing: null,

  nowplaying: 0,

  _readFiles: function (file, last) {
    var self = this;
    var n = self.musics.length;
    if (file.type.match (/audio\/.*(mp3|ogg|m4a|mp4)/)) {
      self.files[n] = file;
      self.musics[n] = new Music (file);
      self.musics[n].tagread (
        (function (j) {
        return function (tags) {
          self.tags[j] = tags;
          self.ui.ontagread (tags, j);
        };
      }) (n));
      self.ui.addfile (file, n);
      self.order.concat ([n]);
      if (!self.playing) {
        self.play ();
      }
    }
    if (last) {
      self.ui.selectableSet ();
      self.order.shuffleOn (); // TODO
    }
  },

  readFiles: function (files) {
    var self = this;
    for (var i = 0, l = files.length; i < l; i++) {
      setTimeout ( (function (file, last) {
        return self._readFiles (file, last);
      }) (files[i], i === l - 1)
      , 100 * i);
    }
  },

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
    if (!this.musics[index]) {
      index = this.order.at (0);
    }
    this.play (index);
    // log('--  next  --');
  },

  prev: function () {
    // TODO
  },

  volume: new Limited (0, 256, 16, 127),

  updatevolume: function () {
    this.volume.at (this.ui.volume);
  },

  mute: function () {
    this.predvol = this.volume;
    this.volume.at (0);
  },

  resume: function () {
    this.volume.at (this.predvol);
    delete this.predvol;
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

  seekAt: function (position /* 0 - 1 */ ) {
    if (this.playing !== undefined && this.playing.audio) {
      this.playing.audio.currentTime = this.playing.audio.duration * position;
      return true;
    }
    return false;
  },

  order: new Enumstate ([]),

  repeat: new Enumstate (['false', 'true', 'one']),

  shuffle: new Enumstate (['false', 'true']),

  seekBy: function (sec) {
    if (this.nowplaying !== undefined && this.playing.audio) {
      var prev = this.playing.seekBy (sec);
      if (prev) {
        this.prev ();
      }
    }
  },

}

window.onload = function () {
  var player = (new Player).start ();
};

