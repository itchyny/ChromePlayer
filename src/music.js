// Music file

function Music (file) {
  this.file = file;
  this.type = file.type;
  this.name = file.name;
}

Music.prototype = {

  musicread: function (vol, next, startplay) {
    var self = this;
    var createObjectURL 
      = window.createObjectURL
        ? function (file) { return window.createObjectURL (file); }
        : window.webkitURL.createObjectURL
          ? function (file) { return window.webkitURL.createObjectURL (file); }
          : undefined;
    if (createObjectURL) {
      self.audio = new Audio (createObjectURL (self.file));
      self.audio.volume = vol;
      self.audio.addEventListener ('ended', function () {
          self.release ();
          next ();
      });
      if (startplay) {
        self.audio.play ();
      }
    } else {
      var reader = new FileReader ();
      reader.onerror = function (e) {
        log ("onerror"); log (e);
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
    }
  },

  ontagload: function (e, f) {
    this.tags = new ID3 (e.target.result).read();
    f (this.tags);
  },

  tagread: function (f) {
    var self = this;
    var binaryReader = new FileReader();
    binaryReader.onload = function (e) {
      self.ontagload (e, f);
    };
    binaryReader.readAsBinaryString (this.file.webkitSlice(0, 1000));
    // binaryReader.readAsBinaryString (this.file.slice(0, 1000));
  },

  play: function (vol, next) {
    var self = this;
    if (self.audio) {
      self.audio.volume = vol;
      self.audio.addEventListener ('ended',
        function () {
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

