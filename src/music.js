// Music file

function Music (file, htmlElement) {
  this.file = file;
  this.type = file.type;
  this.name = file.name;
  this.filetype = file.filetype;
  if (file.filetype === 'video' && htmlElement) {
    this.htmlElement = htmlElement;
  }
}

Music.prototype = {

  toString: function () {
    return JSON.stringify ({ type      : this.type
                           , name      : this.name
                           , filetype  : this.filetype
                           , src       : this.audio.src
    });
  },

  musicread: function (vol, next, startplay) {
    var self = this;
    var createObjectURL
      = window.URL && window.URL.createObjectURL
        ? function (file) { return window.URL.createObjectURL (file); }
        : window.webkitURL && window.webkitURL.createObjectURL
          ? function (file) { return window.webkitURL.createObjectURL (file); }
          : undefined;
    if (createObjectURL) {
      if (self.file.filetype === 'audio') {
        self.audio = new Audio ( self.url = createObjectURL (self.file));
        if (self.htmlElement) {
          self.htmlElement.src = self.audio.src;
        }
        self.audio.volume = vol;
        self.audio.addEventListener ('ended', function () {
            self.release ();
            next ();
        });
        if (startplay) {
          self.audio.play ();
        }
      } else if (self.file.filetype === 'video') {
        var url = createObjectURL (self.file);
        if (self.htmlElement) {
          self.htmlElement.src = self.url = url;
        }
        self.audio = self.htmlElement;
        self.audio.volume = vol;
        self.audio.addEventListener ('ended', function () {
          self.release ();
          next ();
        });
        if (startplay) {
          self.audio.play ();
        }
      }
    } else {
      if (self.file.filetype === 'audio') {
        var reader = new FileReader ();
        reader.onerror = function (e) {
          log (e);
        };
        reader.onload = function (e) {
          self.audio = new Audio (e.target.result);
        if (self.htmlElement) {
          self.htmlElement.src = self.audio.src;
        }
          self.audio.volume = vol;
          self.audio.addEventListener ('ended', function () {
            self.release ();
            next ();
          });
          if (startplay) {
            self.audio.play ();
          }
        };
        reader.readAsDataURL (self.file);
      } else {
        next ();
      }
    }
  },

  ontagload: function (e, f) {
    this.tags = new _ID3 (e.target.result).read();
    this.tags.type = this.type;
    this.tags.name = this.name;
    f (this.tags);
  },

  mytagreader: function (f) {
    var self = this;
    var binaryReader = new FileReader();
    binaryReader.onload = function (e) {
      self.ontagload (e, f);
    };
    binaryReader.readAsBinaryString (this.file.webkitSlice(0, 200000));
  },

  tagread: function (f) {
    this.mytagreader (f);
  },

  readpicture: function () {
    var self = this;
    var url = webkitURL.createObjectURL (this.file);
    try {
    ID3.loadTags (url, function () {
                   var tags = ID3.getAllTags(url);
                   if (tags && tags.picture) {
                     self.tags.picture = tags.picture;
                   }
                 }, { tags: [ //"artist", "title", "album", "year", "comment", "track", "genre", "lyrics",
                   "picture"]
                    , dataReader: FileAPIReader (this.file)
                 });
    } catch (e) {
      log (e);
    };
  },

  play: function (vol, next) {
    var self = this;
    if (self.audio) {
      self.audio.volume = vol;
      self.audio.addEventListener ('ended', function () {
        self.release ();
        next ();
      });
      self.audio.play ();
    } else {
      self.musicread (vol, next, true);
    }
  },

  pause: function () {
    if (this.audio) {
      this.audio.pause ();
    }
  },

  resume: function () {
    if (this.audio) {
      this.audio.play ();
    }
  },

  paused: function () {
    return !this.audio || this.audio.paused;
  },

  setvolume: function (vol) {
    if (this.audio) {
      this.audio.volume = vol;
    }
  },

  mute: function () {
    this.predvol = this.audio.volume;
    this.setvolume (0);
  },

  release: function () {
    if (this.audio) {
      delete this.audio;
    }
  },

  seekBy: function (sec) {
    if (this.audio) {
      var cT = this.audio.currentTime;
      var dr = this.audio.duration;
      if (sec < 0 && cT < -sec) {
        this.audio.currentTime = 0;
        if (cT < -sec / 4) {
          return true;
        }
      } else if (cT + sec > dr) {
        this.audio.currentTime = dr;
      } else {
        this.audio.currentTime += sec;
      }
    }
  }

};

