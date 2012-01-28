// Main player
//
function Player () {
  this.ui = UI;
}

Player.prototype = {

  version: '@VERSION',

  start: function () {
    for (var x in this) {
      if (this[x] && this[x].init) {
        this[x].app = this;
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
      files[index].filetype = file.type.match (self.filetypes.audio.regexp) ? self.filetypes.audio.string
                            : file.type.match (self.filetypes.video.regexp) ? self.filetypes.video.string : '';
    });
    var mediafiles = [].filter.call (files, function (file) {
      return file.filetype !== '';
    });
    var mediafileslength = mediafiles.length;
    var playindex = self.shuffle.value === 'false'
                  ? self.musics.length
                  : self.musics.length + Math.floor (Math.random () * Math.min (30, mediafiles.length));
    var ml = self.musics.length;
    self.interruptflag = false;
    self.asyncread (0, mediafiles, playindex - ml);
  },

  interrupt: function () {
    this.interruptflag = true;
  },

  asyncread: function (index, files, playindex) {
    var file = files[index];
    var last = (index === files.length - 1) || this.interruptflag;
    var play = (index === playindex);
    this.readOneFile (file, play, last);
    var self = this;
    if (index < files.length && !self.interruptflag) {
      setTimeout (function () {
        self.asyncread (index + 1, files, playindex);
      }, index < 60 ? 0 : index < 150 ? 100 : 150);
    } else {
      self.interruptflag = false;
      if (self.order.shuffle.value === 'true') {
        self.order.shuffleOn ();
      }
    }
  },

  readOneFile: function (file, play, last) {
    var self = this;
    var n = self.musics.length;
    self.files = self.files || [];
    self.files[n] = file;
    self.order.concat (n);
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
      // if (!self.playing) {
        if (self.playing.tags && !self.playing.tags.picture) {
          self.playing.readpicture ();
        }
        self.playing.play (self.volume.value / 256, function () { self.next (); });
        self.ui.play (index);
        if (self.playing.filetype === 'video') {
          self.ui.popupvideo ();
        } else {
          self.ui.hidevideo ();
        }
      // } else {
      //   self.next ();
      // }
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
    this.ui.slideZero ();
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
    if (chrome && chrome.extension) {
      chrome.extension.onRequest.addListener (function (e, sender, sendResponse) {
        switch (e.type) {
          case 'globalkeydown-bg':
            log (e);
            self.app.key.keydown (e);
            break;
          case 'changescheme':
            self.app.ui.colorset ();
            break;
          default:
            break;
        }
      });
    }
  }
};

Player.prototype.vim = {
  visual: new Enumcycle ([false, true], false, function (visual) {
    // TODO
  })
};

var player = new Player ();
window.onload = function (e) {
  player.start ();
};



