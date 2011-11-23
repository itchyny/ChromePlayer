// Music file

function Music (file, videoElement) {
  this.file = file;
  this.type = file.type;
  this.name = file.name;
  this.filetype = file.filetype;
  if (file.filetype === 'video' && videoElement) {
    this.videoElement = videoElement;
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
      = window.URL && window.URL.createObjectURL ?
         function (file) { return window.URL.createObjectURL (file); } :
         window.webkitURL && window.webkitURL.createObjectURL ?
           function (file) { return window.webkitURL.createObjectURL (file); } :
           undefined;
    if (createObjectURL) {
      if (self.file.filetype === 'audio') {
        self.audio = new Audio (createObjectURL (self.file));
        self.audio.volume = vol;
        self.audio.addEventListener ('ended', function () {
            self.release ();
            next ();
        });
        if (startplay) {
          self.audio.play ();
        }
      } else if (self.file.filetype === 'video') {
        var url = self.videoElement.src = createObjectURL (self.file);
        self.audio = self.videoElement;
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
    binaryReader.readAsBinaryString (this.file.webkitSlice(0, 1000));
  },

  tagread: function (f) {
    var self = this;
    var url = webkitURL.createObjectURL (this.file);
    self.mytagreader (f);
    ID3.loadTags (url, function () {
                   var tags = ID3.getAllTags(url);
                   log (tags);
                   if (tags && tags.picture) {
                     self.picture = tags.picture;
                   }
                 }, { tags: [ //"artist", "title", "album", "year", "comment", "track", "genre", "lyrics",
                   "picture"]
                    , dataReader: FileAPIReader (this.file)
                 });
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
          return true; // TODO: previous music
        }
      } else if (cT + sec > dr) {
        this.audio.currentTime = dr;
      } else {
        this.audio.currentTime += sec;
      }
    }
  }

};

