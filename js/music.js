// Music file

function Music (file) {
  this.file = file;
  this.type = file.type;
  this.name = file.name;
}

Music.prototype = {

  musicread: function (vol, next, startplay) {
    var self = this;
    var reader = new FileReader ();
    reader.onerror = function (e) {
      log ("onerror"); log (e);
    };
    reader.onload = function (e) {
      self.audio = new Audio (e.target.result);
      self.audio.volume = vol;
      self.audio.addEventListener ('ended',
        function () {
          self.release ();
          next ();
        });
      if (startplay)
        self.audio.play ();
    };
    reader.readAsDataURL (self.file);
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
    this.audio && this.audio.pause ();
  },

  paused: function () {
    return !this.audio || this.audio.paused
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

  resume: function () {
    this.setvolume (this.predvol);
  },

  release: function () {
    if (this.audio) {
      delete this.audio;
    }
  },

};

