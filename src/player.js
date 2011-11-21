// Main player
//   !!!!!実装に妥協しない!!!!!!
//    使いやすく  読みやすく
//
// TODO: シャッフル, リピート がいまいち
// TODO: 読めないタグ
// TODO: ui.jsのaddfile高速化
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
// TODO: muteにバグ
// TODO: ui.prototype.fullScreenOn がんばる?
// TODO: not only mp4, but mkv ...
// TODO: フルスクリーン時のUIについて. volumeとかどうする...
// TODO: filter機能
// TODO: F1がmacで効かない

function Player () {
  var self = this;
  self.ui = UI;
  self.key = new Key (self, keyconfig);
  self.repeat = new Enumcycle ( ['false', 'true', 'one']
              , function () { return local.get('repeat') || 'false'; }
              , function (repeat) {
                local.set ('repeat', repeat);
                self.ui.setrepeat (repeat);
                if (repeat === 'one') {
                  self.order.repeatOne ();
                } else if (repeat === 'true') {
                  self.order.repeatOn ();
                } else {
                  self.order.repeatOff ();
                }
              });
  self.shuffle = new Enumcycle ( ['false', 'true' ]
               , function () { return local.get('shuffle') || 'false'; }
               , function (shuffle) {
                 local.set ('shuffle', shuffle);
                 self.ui.setshuffle (shuffle);
                 if (shuffle === 'true') {
                   self.order.shuffleOn ();
                 } else {
                   self.order.shuffleOff ();
                 }
               });
  self.volume = new Limited (0, 256, 16
              , function () {
                var vol = parseInt (local.get ('volume'), 10);
                return vol !== undefined ? vol : 127;  // vol can be 0
              }
              , function (volume) {
                local.set ('volume', volume);
                self.ui.setvolume (volume);
                if (self.playing) {
                  self.playing.setvolume (volume / 256);
                }
              });
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

  filetypes: {
    audio: { regexp: /audio\/(mp3|ogg|m4a|x-matroska)/
           , string: 'audio'
    },
    // video: { regexp: /video\/(mp4|mkv|x-matroska)/
    video: { regexp: /video\/(mp4)/
           , string: 'video'
    }
  },

  /* file reading */
  readFiles: function (files) {
    var self = this;
    var first = true;
    [].forEach.call (files, function (file, index) {
      log (file.type);
      files[index].filetype = file.type.match (self.filetypes.audio.regexp) ? self.filetypes.audio.string
                            : file.type.match (self.filetypes.video.regexp) ? self.filetypes.video.string : '';
    });
    var mediafiles = [].filter.call (files, function (file) {
      return file.filetype !== '';
    });
    [].forEach.call (mediafiles, function (file, index, files) {
        setTimeout ( (function (file, first, last) {
          return self.readOneFile (file, first, last);
        }) (file
           , (self.shuffle.value.toString () === 'false' ? index === 0 : index === parseInt (files.length / 2))
           , index === files.length - 1)
        , 100 * index);
    });
  },

  readOneFile: function (file, first, last) {
    var self = this;
    var n = self.musics.length;
    self.files[n] = file;
    self.musics[n] = new Music (file, file.filetype === 'video' ? self.ui.div.video : null);
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
      if (self.order.shuffle) {
        self.order.shuffleOn ();
      }
    }
  },

  /* basic player operations */
  play: function (index) {
    var self = this;
    if (index === undefined) {
      index = 0;
    }
    self.order.at (index);
    self.pause ();
    if (self.playing) {
      self.playing.release ();
    }
    if (index !== undefined) {
      self.nowplaying = index;
      self.playing = self.musics[index];
      self.playing.play (self.volume.value / 256, function () { self.next (); });
      self.ui.play (index);
      if (self.playing.filetype === 'video') {
        self.ui.popupvideo ();
      } else {
        self.ui.hidevideo ();
      }
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
    if (!self.playing) {
      return;
    }
    if (self.playing.paused ()) {
      self.playing.resume ();
      self.ui.play (self.nowplaying);
    } else {
      self.pause ();
    }
  },

  nextundefinedcount: 0,
  next: function () {
    this.pause ();
    var index = this.order.next ();
    if (index === undefined) {
      if (this.playing) {
        this.playing.release ();
      }
      this.nextundefinedcount++;
      if (this.nextundefinedcount < 3) return;
      this.nextundefinedcount = 0;
      index = this.order.head ();
    }
    this.play (index);
  },

  prevundefinedcount: 0,
  prev: function () {
    this.pause ();
    var index = this.order.prev ();
    if (index === undefined) {
      if (this.playing) {
        this.playing.release ();
      }
      this.prevundefinedcount++;
      if (this.prevundefinedcount < 3) return;
      this.prevundefinedcount = 0;
      index = this.order.last ();
    }
    this.play (index);
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

  repeat: new Enumcycle (['false', 'true', 'one']),

  shuffle: new Enumcycle (['false', 'true'])

};

var player = new Player ();
window.onload = function () {
  player.start ();
};



