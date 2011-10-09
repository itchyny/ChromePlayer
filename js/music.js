;
// Music file
function Music (file) {
  this.file = file;
  this.type = file.type;
  this.name = file.name;
}

Music.prototype = {

  start: function (self, vol, next) {
    self.musicread (self, vol, next, true);
  },

  musicread: function (self, vol, next, startplay) {
    var reader = new FileReader ()
    reader.onerror = function (e) {
      log ("onerror");
      log (e);
    };
    reader.onload = function (e) {
      self.audio = new Audio (e.target.result);
      self.audio.volume = vol;
      self.audio.addEventListener ('ended', next);
      if (startplay)
        self.audio.play ();
    };
    reader.readAsDataURL (self.file);
  },

  onload: function (e, f) {
    var result = e.target.result;
    var id3 = new ID3 (result);
    this.tags = id3.read();
    f (this.tags);
  },

  tagread: function (f) {
    var binaryReader = new FileReader();
    var self = this;
    binaryReader.onload = function (e) {
      self.onload (e, f);
    };
    try {
      binaryReader.readAsBinaryString (this.file.slice(0, 1000));
    } catch (e) {
      binaryReader.readAsBinaryString (this.file.webkitSlice(0, 1000));
    }
  },

  play: function () {
    this.audio && this.audio.play ();
  },

  pause: function () {
    this.audio && this.audio.pause ();
  },

  paused: function () {
    return this.audio.paused;
  },

  setvolume: function (vol) {
    this.audio.volume = vol;
  },

  mute: function () {
    this.predvol = this.audio.volume;
    this.setvolume (0);
  },

  resume: function () {
    this.setvolume (this.predvol);
  },

  release: function () {
    delete this.audio;
  },

};



