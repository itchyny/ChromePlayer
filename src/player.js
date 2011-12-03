// Main player
//   !!!!!実装に妥協しない!!!!!!
//    使いやすく  読みやすく
//
// 優先
// TODO: keyconfigを各自で設定できるように
// TODO: ソート
// TODO: album art from id3 tag https://github.com/aadsm/JavaScript-ID3-Reader
// TODO: menu for right click http://www.trendskitchens.co.nz/jquery/contextmenu/ http://phpjavascriptroom.com/?t=ajax&p=jquery_plugin_contextmenu
// TODO: 別タブのキーボードがなんか効かなくなる? -> キーが無かったら返してdefaultを実行的な
// TODO: background pageにする
//
// TODO: キーだけでファイルの入れ替え ファイル入れ替えた時のplayer.orderを更新
// TODO: s-pgupがバグ
// TODO: 読めないタグ
// TODO: vim, visual mode
// TODO: ファイル順入れ替えた時にorder更新
// TODO: C-zで削除キャンセルなど
// TODO: fixed first row of table
// TODO: フルスクリーン時のUIについて. volumeとかどうする... カーソル消す
// TODO: 音楽のフルスクリーン時のインターフェース, アルバムアートなど
// TODO: ui.jsのaddfile高速化
// TODO: id3タグの読み込みをUArrayってやつで高速化
// TODO: title="..."にゴミが入る ?
// TODO: filesystem API
// 3) save playlists implement some sort of media library, so we don't have to add files every time
// 6) allow us to "pop-out" the media player to a new, smaller window, always-on-top if possible.
function Player () {
  this.ui = UI;
}

Player.prototype = {

  version: '@VERSION',

  start: function () {
logfn ('Player.prototype.start');
    for (var x in this) {
      if (this[x] && this[x].init) {
        this[x].init (this);
        log ("init: " + x);
      }
    }
  },

  files: [],

  musics: [],

  tags: [],

  playing: null,

  nowplaying: 0,

  filetypes: {
    audio: { regexp: /audio\/(mp3|wav|ogg|m4a)/
           , string: 'audio'
    },
    video: { regexp: /video\/(mp4)/
           , string: 'video'
    }
  },

  /* file reading */
  readFiles: function (files) {
logfn ('Player.prototype.readFiles');
    var self = this;
    var first = true;
    [].forEach.call (files, function (file, index) {
      log ('filetype: ' + file.type);
      files[index].filetype = file.type.match (self.filetypes.audio.regexp) ? self.filetypes.audio.string
                            : file.type.match (self.filetypes.video.regexp) ? self.filetypes.video.string : '';
    });
    var mediafiles = [].filter.call (files, function (file) {
      return file.filetype !== '';
    });
    var playindex = self.shuffle.value === 'false'
                  ? self.musics.length
                  : self.musics.length + Math.floor (Math.random () * mediafiles.length);
    [].forEach.call (mediafiles, function (file, index, files) {
        setTimeout ( (function (file, first, last) {
          return self.readOneFile (file, first, last);
        }) (file
           , false
           , index === files.length - 1)
        , 10 * index);
    });
    if (!self.playing) {
      self.play (playindex);
    }
  },

  readOneFile: function (file, first, last) {
logfn ('Player.prototype.readOneFile');
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
      if (self.order.shuffle.value === 'true') {
        self.order.shuffleOn ();
      }
    }
  },

  /* basic player operations */
  play: function (index) {
logfn ('Player.prototype.play');
console.log ('- player.prototype.play---');
console.log ('index: ' + index);
    var self = this;
    if (index === undefined) {
      index = 0;
    }
    console.dir (self.order);
    self.order.atfromEnum (index);
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
logfn ('Player.prototype.pause');
    this.ui.pause ();
    if (this.playing) {
      this.playing.pause ();
    }
  },

  toggle: function () {
logfn ('Player.prototype.toggle');
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
logfn ('Player.prototype.next');
    console.dir (this.order);
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
      if (index === undefined) return;
    }
    this.play (index);
  },

  prevundefinedcount: 0,
  prev: function () {
logfn ('Player.prototype.prev');
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
      if (index === undefined) return;
    }
    this.play (index);
  },

  seekAt: function (position /* 0 - 1 */ ) {
logfn ('Player.prototype.seekAt');
    if (this.playing !== undefined && this.playing.audio) {
      position = Math.max (0, Math.min (1, position));
      this.playing.audio.currentTime = this.playing.audio.duration * position;
      return true;
    }
    return false;
  },

  seekBy: function (sec) {
logfn ('Player.prototype.seekBy');
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
logfn ('Player.prototype.updatevolume');
    this.volume.at (this.ui.getvolume ());
  },

  mute: function () {
logfn ('Player.prototype.mute');
    this.prevol = this.volume.value;
    this.volume.setToMin ();
  },

  resume: function () {
logfn ('Player.prototype.resume');
    this.volume.at (this.prevol);
    delete this.prevol;
  },

  togglemute: function () {
logfn ('Player.prototype.togglemute');
    if (this.ismute ()) {
      this.resume ();
    } else {
      this.mute ();
    }
  },

  ismute: function () {
logfn ('Player.prototype.ismute');
    return this.volume.value === 0 && this.prevol !== undefined;
  },

  volumeup: function () {
logfn ('Player.prototype.volumeup');
    this.volume.increase ();
  },

  volumedown: function () {
logfn ('Player.prototype.volumedown');
    this.volume.decrease ();
  },

  remove: function (index) {
logfn ('Player.prototype.remove');
    this[index] = null;
    log ("removing:::" + index);
    this.order.remove (index);
    log (this.order);
    log (this.order.array);
  },

  order: new Enumdinamic ([], null, function (order) {})

};

Player.prototype.repeat = new Enumcycle ( ['false', 'true', 'one']
  , function () { return local.get('repeat') || 'false'; }
  , function (repeat, app) {
   local.set ('repeat', repeat);
   app.ui.setrepeat (repeat);
   if (repeat === 'one') {
     app.order.repeatOne ();
   } else if (repeat === 'true') {
     app.order.repeatOn ();
   } else {
     app.order.repeatOff ();
   }
});

Player.prototype.shuffle = new Enumcycle ( ['false', 'true']
  , function () { return local.get('shuffle') || 'false'; }
  , function (shuffle, app) {
    local.set ('shuffle', shuffle);
    app.ui.setshuffle (shuffle);
    if (shuffle === 'true') {
      app.order.shuffleOn ();
    } else {
      app.order.shuffleOff ();
    }
});

Player.prototype.volume = new Limited (0, 256, 16
  , function () {
   var vol = parseInt (local.get ('volume'), 10);
   return vol !== undefined ? vol : 128;  // vol can be 0
  }
  , function (volume, app) {
   local.set ('volume', volume);
   app.ui.setvolume (volume);
   if (app.playing) {
     app.playing.setvolume (volume / 256);
   }
});

Player.prototype.vim = {
  visual: new Enumcycle ([false, true], false, function (visual) {
    // TODO
  })
};

var player = new Player ();
window.onload = function () {
  player.start ();
};



