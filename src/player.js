// Main player
//
// sendRequestに関して分かったこと:
//   sendRequestでFile/Blobを送ってもObjectになり, createObjectURLがtype errorを起こす
//   blob:/// のurlは, メインのページが死んでもbackground-pageが生きていれば生き続けられる しかしChromeを再起動したら死ぬ
//   sendRequestしたらみんながonRequestを受ける
//   sendRequestで一意なもの(例: 時刻+乱数)を情報として入れて, 共有メモリーに未実行として登録, onRequestでそれをチェック
//   実行したら共有メモリーから外せば, 一回だけ実行ができる → localStorageで実装
//   notificationを発行するのは, 必ずbackground pageを介して
//
//
// 1: どうもid3-...js がlengthエラー
// 1: もう一回backgroundとかcontents scriptとかを見直す
//    もうちょっとconnectとかを見てから実装したほうがいいかも
// 1: background pageにする
//      background pageにするのはいいけど, アプリ画面を複数開いた時どうするかなぁ...
// 1: オプションページ作る
// 1: keyconfigを各自で設定できるように
// 1: shuffleoff -> readfiles -> sort by track -> shuffle on -> shuffle off -> おかしくなる
// 1: remove duplicated command
//
// 2: fullscreeにするのは, 動画→音楽でも変化なしというか... fullscreenのままdivを動かして動画にしたり
// 2: 別タブ, キーが無かったら返してdefaultを実行的な
// 2: menu for right click http://www.trendskitchens.co.nz/jquery/contextmenu/ http://phpjavascriptroom.com/?t=ajax&p=jquery_plugin_contextmenu
//   http://code.google.com/chrome/extensions/contextMenus.html
// 2: C-zで削除キャンセルなど
// 2: 常にポップアップを表示し続ける → notification html ver
// 3: album art from id3 tag ::: reading code https://github.com/aadsm/JavaScript-ID3-Reader
// 3: property にalbum art (もしあれば)
// 4: 読めないタグ title="..."にゴミが入る ?
// 7: キーだけでファイルの入れ替え ファイル入れ替えた時のplayer.orderを更新
// 7: vim, visual mode
// 7: fixed first row of table
// 7: フルスクリーン時のUIについて. volumeとかどうする... カーソル消す
// 9: id3タグの読み込みをUArrayってやつで高速化
// 9: filesystem API
function Player () {
  this.ui = UI;
}

Player.prototype = {

  version: '@VERSION',

  start: function () {
    for (var x in this) {
      if (this[x] && this[x].init) {
        this[x].init (this);
        this[x].app = this;
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
      files[index].filetype = file.type.match (self.filetypes.audio.regexp) ? self.filetypes.audio.string
                            : file.type.match (self.filetypes.video.regexp) ? self.filetypes.video.string : '';
    });
    var mediafiles = [].filter.call (files, function (file) {
      return file.filetype !== '';
    });
    var playindex = self.shuffle.value === 'false'
                  ? self.musics.length
                  : self.musics.length + Math.floor (Math.random () * Math.min (30, mediafiles.length));
    var ml = self.musics.length;
    self.order.concat (mediafiles.map (function (file, index, files) {
      return ml + index;
    }));
    if (self.order.shuffle.value === 'true') {
      self.order.shuffleOn ();
    }
    [].forEach.call (mediafiles, function (file, index, files) {
        setTimeout ( (function (file, play, last) {
            return function () { self.readOneFile (file, play, last); };
          }) (file, ml + index === playindex, index === files.length - 1)
        , 10 * index);
    });
  },

  readOneFile: function (file, play, last) {
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
            self.play (n);
          }
        };
    }) (self, n, !self.playing && play));
    self.ui.addfile (file, n);
    if (last) {
      self.ui.selectableSet ();
      self.ui.setdblclick ();
    }
  },

  /* basic player operations */
  play: function (index) {
logfn ('Player.prototype.play');
    var self = this;
    if (index === undefined) {
      index = 0;
    }
    self.order.atfromEnum (index);
    self.pause ();
    if (self.playing) {
      self.playing.release ();
    }
    if (index !== undefined) {
      self.nowplaying = index;
      self.playing = self.musics[index];
      if (!self.playing.tags.picture) {
        self.playing.readpicture ();
      }
      self.playing.play (self.volume.value / 256, function () { self.next (); });
      self.ui.play (index);
      if (self.playing.filetype === 'video') {
        self.ui.popupvideo ();
      } else {
        self.ui.hidevideo ();
      }
      // setTimeout (function () {
      //   self.playing.pause ();
      //   chrome.extension.sendRequest(
      //     { url: (self.playing.url)
      //     }
      //   );
      // }, 50);
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

Player.prototype.message = {
  init: function (app) {
    var self = this;
    chrome.extension.onRequest.addListener (function (e, sender, sendResponse) {
      switch (e.type) {
        case 'globalkeydown-bg':
          self.app.key.keydown (e);
          break;
        default:
          break;
      }
    });
  }
};,

Player.prototype.vim = {
  visual: new Enumcycle ([false, true], false, function (visual) {
    // TODO
  })
};

var player = new Player ();
window.onload = function (e) {
  player.start ();
};



