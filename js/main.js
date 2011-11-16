/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
 *
 *    Chrome Player 1.60
 *
 *    author      : itchyny
 *    last update : Thu Nov 17 00:50:25 2011 +0900
 *    source code : https://github.com/itchyny/ChromePlayer
 *
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function () {

function log (x) {
  console.dir (x);
}

Array.prototype.shuffle = function () {
  var i = this.length, j, t;
  var mathRandom = Math.random;
  var mathFloor = Math.floor;
  while (i) {
    j = mathFloor( mathRandom() * i );
    t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
};

Array.prototype.unique = function () {
  var ans = [], i, j, l, m, f;
  for(i = -1, l = this.length; ++i < l;) {
    for(j = -1, m = ans.length, f = true; ++j < m;) {
      if(ans[j] === this[i]) {
        j = m + 1;
        f = false;
      }
    }
    if(f){
      ans.push(this[i]);
    }
  }
  return ans;
};

$.fn.unique = Array.prototype.unique;

$.fn.join = Array.prototype.join;

$.fn.texttitle = function (t) {
  return this.text(t).attr('title', t);
};

function aboutEqual (x, y) {
  return Math.abs (x - y) < 1e-9;
}

function viewname (x) {
  if (typeof test === "function") {
    var line = "================================";
    var space = "   ";
    test (line + space + x + space + line, function () {});
  }
}

// Limited number

function Limited (min, max, step, initializer, callback) {
  if (min > max) min = [max, max = min][0];
  this.min = min;
  this.max = max;
  this.step = step;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
  this.init ();
}

Limited.prototype = {

  value: undefined,

  at: function (x) {
    if (x === undefined || isNaN (x)) {
      if (this.value === undefined) {
        this.value = (this.min + this.max) / 2;
      } else {
        this.value = this.assert (this.value);
      }
    } else {
      this.value = this.assert (x);
    }
    this.callback (this.value);
    return this;
  },

  assert: function (x) {
    return Math.min (Math.max (x, this.min), this.max);
  },

  increase: function (x) {
    if (x === undefined || isNaN (x)) {
      x = this.step;
    }
    return this.at (this.value + x);
  },

  decrease: function (x) {
    if (x === undefined || isNaN (x)) {
      x = this.step;
    }
    return this.increase (-x);
  },

  init: function (x) {
    if (x !== undefined) {
      this.at (x);
    } else if (typeof this.initializer === 'function') {
      this.at (this.initializer ());
    } else {
      this.at (this.initializer);
    }
  },

  setToMin: function () {
    return this.at (this.min);
  },

  setToMax: function () {
    return this.at (this.max);
  },

};



// Enum data class

function Enum (array) {
  this.array = array;
  this.init ();
}

Enum.prototype = {

  array: [],

  length: undefined,

  head: undefined,

  last: undefined,

  init: function () {
    this.length = this.array.length;
    this.head = this.array[0];
    this.last = this.array[this.array.length - 1];
  },

  succ: function (x) {
    return this.toEnum (+ 1 + this.fromEnum (x));
  },

  pred: function (x) {
    return this.toEnum (- 1 + this.fromEnum (x));
  },

  toEnum: function (i) {
    if (0 <= i && i < this.length) {
      return this.array[i];
    } else {
      return undefined;
    }
  },

  fromEnum: function (x) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this.array[i] === x) return i;
    }
    return undefined;
  },

  enumFrom: function (x) {
    return this.enumFromTo (x, this.last);
  },

  enumFromThen: function (x, y) {
    var i = this.fromEnum (x);
    var j = this.fromEnum (y);
    var ans = [];
    for (var k = i; 0 <= k && k < this.length; k += (j - i)) {
      ans = ans.concat (this.array[k]);
    }
    return ans;
  },

  enumFromTo: function (x, y) {
    return this.enumFromThenTo (x, this.succ (x), y);
  },

  enumFromThenTo: function (x, y, z) {
    var i = this.fromEnum (x);
    var j = this.fromEnum (y);
    var k = this.fromEnum (z);
    var d = j - i;
    var ans = [];
    if (0 === d) {
      ans = ans.concat (this.array[i]);
    } else if (0 < d) {
      for (var l = i; l <= k && l < this.length; l += d) {
        ans = ans.concat (this.array[l]);
      }
    } else {
      for (var l = i; l >= k && l >= 0; l += d) {
        ans = ans.concat (this.array[l]);
      }
    }
    return ans;
  },

  concat: function (arr) {
    this.array = this.array.concat (arr);
    this.init ();
  },

  splice: function (start, count) {
    this.array.splice (start, count);
    this.init ();
  },

};

// Enumerable (ordered) state

function Enumstate (array, initializer, callback) {
  this.array = array;
  this._enumclass = this.enumclass = new Enum (array);
  this.length = array.length;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
  this.at (0);
}

Enumstate.prototype = {

  index: 0,

  value: undefined,

  history: [],

  shuffle: false,

  length: 0,

  at: function (i) {
    if (i === undefined) return this.value;
    this.index = i;
    this.value = this.enumclass.toEnum (i);
    this.history = this.history.concat (i);
    return this.value;
  },

  next: function (j) {
    if (j === undefined) j = 1
    this.index += j;
    this.value = this.enumclass.toEnum (this.index);
    if (this.value === undefined) {
      if (this.shuffle) {
        this.enumclass = new Enum (this.enumclass.array.shuffle ());
      }
      this.at (0);
    } else {
      this.at (this.index);
    }
    this.callback (this.value);
    return this.value;
  },

  pred: function (j) {
    return this.next (-1);
  },

  shuffleOn: function () {
    this.shuffle = true;
    this._enumclass = this.enumclass;
    this.enumclass = new Enum (this.enumclass.array.shuffle ());
    return this;
  },

  shuffleOff: function () {
    this.shuffle = false;
    this.enumclass = this._enumclass;
    return this;
  },

  shuffleToggle: function () {
    if (this.shuffle) {
      return this.shuffleOff ();
    } else {
      return this.shuffleOn ();
    }
  },

  init: function (x) {
    if (x !== undefined) {
      this.at (this.enumclass.fromEnum (x));
    } else if (typeof this.initializer === 'function') {
      this.at (this.enumclass.fromEnum (this.initializer ()));
    } else {
      this.at (this.enumclass.fromEnum (this.initializer));
    }
    this.callback (this.value);
  },

  concat: function (arr) {
    this.enumclass.concat (arr);
  },

  splice: function (start, count) {
    this.enumclass.splice (start, count);
  },

  remove: function (value) {
    var index = this.enumclass.fromEnum (value);
    this.splice (index, 1);
  },

};


// id3 tag reader

String.prototype.toBin = function () {
  var ans = [], i = 9, b = this;
  while (--i) {
    ans.push (b & 128);
    b <<= 1;
  }
  return ans.join ("");
};

String.prototype.unsynchsafe = function () {
  return ( (this.charCodeAt (0) & 0x7f) << 21
          |(this.charCodeAt (1) & 0x7f) << 14
          |(this.charCodeAt (2) & 0x7f) << 7
          |(this.charCodeAt (3) & 0x7f));
};

function decode (chars) {
  switch (chars.charCodeAt(0)) {
    case 0: { // ISO-8859-1
      // log("ISO-8859-1"); // UTF-16?
      // console.log(chars);
      var a = "";
      for (var i = -1; i < chars.length; ) { // TODO
        // console.log(chars.charCodeAt(i++))
        // console.log(chars.charCodeAt(i++))
        // console.log(" --- ")
        a += String.fromCharCode((chars.charCodeAt(i++))
                                |chars.charCodeAt(i++))<<8;
      };
      // return a;
      return chars.toString();
    }
    case 2: { // UTF-16BE without BOM
      // log("UTF-16BE without BOM");
    }
    case 1: { // UTF-16 with BOM
           // log("UTF-16 with BOM");
      var a = "", StringfromCharCode = String.fromCharCode, kind;
      for(var i = 1, charslen = chars.length; i < charslen; ) {
        if(kind === 1 || ((chars.charCodeAt(i) & 0xff) === 0xff)) { // 2bytes
          if(!kind) {
            i += 2;
            kind = 1;
          }
          a += StringfromCharCode( chars.charCodeAt(i++)
                                  |(chars.charCodeAt(i++)<<8));
        } else if(kind === 2 || ((chars.charCodeAt(i) & 0xfe) === 0xfe)) { // 2bytes
          if(!kind) {
            i += 2;
            kind = 2;
          }
          a += StringfromCharCode( (chars.charCodeAt(i++)<<8)
                                  |chars.charCodeAt(i++));
        } else { // 1byte
          a += chars[i++];
        }
      }
      return a;
    }
    case 3: { // UTF-8
           // log("UTF-8");
      var a = "", StringfromCharCode = String.fromCharCode;
      for(var i = 1, charslen = chars.length; i < charslen; ) {
        var charsi = chars.charCodeAt(i);
        if(charsi & 128) {
          if(charsi & 32) {
            if(charsi & 16) {
              if(charsi & 8) {
                if(charsi & 4) { // U+04000000 .. U+7FFFFFFF
                  a += StringfromCharCode( (chars.charCodeAt(i++)&1)<<30
                                          |(chars.charCodeAt(i++)&63)<<24
                                          |(chars.charCodeAt(i++)&63)<<18
                                          |(chars.charCodeAt(i++)&63)<<12
                                          |(chars.charCodeAt(i++)&6)
                                          |(chars.charCodeAt(i++)) );
                } else { // U+00200000 .. U+03FFFFFF
                  a += StringfromCharCode( (chars.charCodeAt(i++)&3)<<24
                                          |(chars.charCodeAt(i++)&63)<<18
                                          |(chars.charCodeAt(i++)&63)<<12
                                          |(chars.charCodeAt(i++)&6)
                                          |(chars.charCodeAt(i++)) );
                }
              } else { // U+010000 .. U+1FFFFF
                a += StringfromCharCode( (chars.charCodeAt(i++)&7)<<18
                                        |(chars.charCodeAt(i++)&63)<<12
                                        |(chars.charCodeAt(i++)&6)
                                        |(chars.charCodeAt(i++)) );
              }
            } else { // U+0800 .. U+FFFF
              a += StringfromCharCode( (chars.charCodeAt(i++)&15)<<12
                                      |(chars.charCodeAt(i++)&63)<<6
                                      |(chars.charCodeAt(i++)&63) );
            }
          } else { // U+0080 .. U+07FF
            a += StringfromCharCode((chars.charCodeAt(i++)&31)<<6
                                    |chars.charCodeAt(i++)&63);
          }
        } else { // U+00 .. U+7F
          a += chars[i++];
        }
      }
      return a;
    }
  }
}

function ID3 (result) {
  this.result = result;
  this.i = 0;
}

ID3.prototype = {

  read: function () {
    // log ("id3 read")
    this.header();
    this.extendedheader();
    this.frames();
    return this.tags;
  },

  header: function () {
    // 10bytes header
    //    log("------    header   ------");
    this.header = this.result.slice (this.i, this.i += 10);
    this.headerid = this.header.slice(0, 3);
    //    log("headerid: " + this.headerid);
    this.version = [this.header.charCodeAt(3), this.header.charCodeAt(4)];
    //    log("tagver : " + this.version);
    this.flags = this.header.slice(5, 6).toBin();
    //    log("flags : " + this.flags);
    this.tagsize = this.header.slice(6, 10).unsynchsafe();
    //    log("tagsize : " + this.tagsize);
  },

  extendedheader: function () {
    // ??bytes extended header
    //    log("------    extended header   ------");
    if(this.flags[1] === "1") {
      var extendedsize = this.result.slice(this.i, this.i += 4).unsynchsafe();
      //      log("extendedsize: " + extendedsize);
      var extendedheader = this.result.slice(this.i, this.i += extendedsize);
      //      log("extendedheader: " + extendedheader);
    }
  },

  frames: function () {
    // ??bytes frames
    //    log("------    frames   ------");
    var tags = {};
    var i = this.i;
    var ldecode = decode;
    var lparseInt = parseInt;
    while (i < this.tagsize) {
      var flameid = this.result.slice(i, i += 4);
      // console.log(flameid);
      var flamesize = ( function (x) {return lparseInt(x.charCodeAt(3), 10);})(this.result.slice(i, i += 4));
      var flameflg = this.result.slice(i, i += 2).toBin();
      var flametext = ldecode(this.result.slice(i, i += flamesize));
      if(flamesize) {
        //        log("flame id: " + flameid);
        //        log("flame size: " + flamesize);
        //        log("flame flg: " + flameflg);
        //        log("flame text: " + flametext);
        if(flametext) tags[flameid] = flametext;
      }
    }
    this.tags = tags;
  },

};



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
    if (this.audio) {
      this.audio.pause ();
    }
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
  },

};

// Easy wrapper for localStorage

var local = {

  get: function (key) {
    return localStorage[key];
  },

  set: function (key, val) {
    localStorage.setItem (key, val);
    return localStorage[key];
  },

  remove: function (key) {
    localStorage.removeItem (key);
  },

  clear: function () {
    localStorage.clear ();
  }

};


// color scheme configuration

var scheme = {
  'classic-default': {
    'background-color': {
      'div#wrapper': '#aaa',
      'div#info': '#eee',
      'div#playlist': '#fff',
      'thead tr': '#ddd',
      'div#musicSlider': '#aaa',
      'div#musicSlider a': '#666',
      'div#musicSlider a:focus': '#333',
      'div#volumeSlider': '#eee',
      'tbody tr:nth-child(odd) ': '#fff',
      'tbody tr:nth-child(even) ': '#ddf',
      'tbody tr.nP': '#aaf',
      'tbody tr.ui-selected': '#08f'
    },
    'color': {
      'tbody tr.ui-selected': '#fff'
    }
  },
  'classic-pink': {
    'background-color': {
      'div#wrapper': '#f66',
      'div#info': '#fbb',
      'thead tr': '#f99',
      'div#musicSlider': '#f66',
      'div#musicSlider a': '#844',
      'div#musicSlider a:focus': '#622',
      'div#volumeSlider': '#f88',
      'tbody tr:nth-child(odd) ': '#fdd',
      'tbody tr:nth-child(even) ': '#fbb',
      'tbody tr.nP': '#f77',
      'div#playlist': '#fdd',
      'tbody tr.ui-selected': '#f22'
    },
    'color': {
      'tbody tr.ui-selected': '#fff'
    }
  },
  'classic-yellow': {
    'background-color': {
      'div#wrapper': '#ff0',
      'div#info': '#ff8',
      'thead tr': '#ff8',
      'div#musicSlider': '#ff0',
      'div#musicSlider a': '#880',
      'div#musicSlider a:focus': '#640',
      'div#volumeSlider': '#ff8',
      'tbody tr:nth-child(odd) ': '#ff7',
      'tbody tr:nth-child(even) ': '#ff6',
      'tbody tr.nP': '#ff4',
      'div#playlist': '#ffb',
      'tbody tr.ui-selected': '#ff0'
    },
    'color': {
      'tbody tr.ui-selected': '#000!important'
    }
  },
  'classic-orange': {
    'background-color': {
      'div#wrapper': '#f80',
      'div#info': '#fb8',
      'thead tr': '#fb8',
      'div#musicSlider': '#f80',
      'div#musicSlider a': '#840',
      'div#musicSlider a:focus': '#620',
      'div#volumeSlider': '#fb8',
      'tbody tr:nth-child(odd) ': '#ff8',
      'tbody tr:nth-child(even) ': '#fd6',
      'tbody tr.nP': '#fa0',
      'div#playlist': '#fdb',
      'tbody tr.ui-selected': '#f60'
    },
    'color': {
      'tbody tr.ui-selected': '#000'
    }
  },
  'classic-lime': {
    'background-color': {
      'div#wrapper': '#6f6',
      'div#info': '#bfb',
      'div#playlist': '#fff',
      'thead tr': '#9f9',
      'div#musicSlider': '#6f6',
      'div#musicSlider a': '#484',
      'div#musicSlider a:focus': '#262',
      'div#volumeSlider': '#8f8',
      'tbody tr:nth-child(odd) ': '#dfd',
      'tbody tr:nth-child(even) ': '#bfb',
      'tbody tr.nP': '#7f7',
      'div#playlist': '#dfd',
      'tbody tr.ui-selected': '#2f2'
    },
    'color': {
      'tbody tr.ui-selected': '#fff'
    }
  },
  'classic-lblue': {
    'background-color': {
      'div#wrapper': '#66f',
      'div#info': '#bbf',
      'thead tr': '#99f',
      'div#musicSlider': '#66f',
      'div#musicSlider a': '#448',
      'div#musicSlider a:focus': '#226',
      'div#volumeSlider': '#88f',
      'tbody tr:nth-child(odd) ': '#ddf',
      'tbody tr:nth-child(even) ': '#bbf',
      'tbody tr.nP': '#77f',
      'div#playlist': '#ddf',
      'tbody tr.ui-selected': '#22f'
    },
    'color': {
      'tbody tr.ui-selected': '#fff'
    }
  },
  'classic-purple': {
    'background-color': {
      'div#wrapper': '#f0f',
      'div#info': '#f8f',
      'thead tr': '#f8f',
      'div#musicSlider': '#f0f',
      'div#musicSlider a': '#808',
      'div#musicSlider a:focus': '#604',
      'div#volumeSlider': '#f8f',
      'tbody tr:nth-child(odd) ': '#f7f',
      'tbody tr:nth-child(even) ': '#f6f',
      'tbody tr.nP': '#f4f',
      'div#playlist': '#fbf',
      'tbody tr.ui-selected': '#f0f'
    },
    'color': {
      'tbody tr.ui-selected': '#000'
    }
  },
  'classic-dark': {
    'background-color': {
      'div#wrapper': '#000',
      'div#info': '#333',
      'thead tr': '#333',
      'div#musicSlider': '#000',
      'div#musicSlider a': '#666',
      'div#musicSlider a:focus': '#999',
      'div#volumeSlider': '#333',
      'div#volumeSlider a': '#666',
      'div#volumeSlider a:focus': '#666',
      'tbody tr:nth-child(odd) ': '#222',
      'tbody tr:nth-child(even) ': '#292929',
      'tbody tr.nP': '#444',
      'div#playlist': '#111',
      'tbody tr.ui-selected': '#080808'
    },
    'color': {
      'div#wrapper': '#fff'
    }
  }
};

// UI

var UI = {

  start: function (player) {
    var self = this;
    self.player = player;
    self.div = (function (a, x) {
      a.forEach(function (b) { x[b] = $('#' + b); });
      return x;
    })(['about', 'conf', 'config', 'current', 'filename', 'fileselect',
    'firstrow', 'globalcontrol', 'help', 'musicSlider', 'mute', 'next',
    'open', 'pause', 'play', 'playlist', 'prev', 'property', 'remain',
    'repeat', 'scheme', 'shuffle', 'tablebody', 'tablediv', 'tagread',
    'volumeSlider', 'volumeon', 'wrapper', 'filter', 'filterword', 'matchnum'],
    {tbody: $('#tbody'), thead: $('thead'), table: $('table')});
    self.initdrop ();
    self.initbuttons ();
    self.colorset ();
    self.initsize ();
    self.initslider ();
    self.initschemes ();
    self.initsplitter ();
    self.resizableSet ();
    self.selectableSet ();
    $(window).resize(function () { self.initsize (); });
    $('div#appname a').text('Local Player v' + player.version);
  },

  initdrop: function () {
    var self = this;
    document.body.ondragover = function (e) {
      e.preventDefault();
    };
    document.body.ondrop = function (e) {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files)
      self.player.readFiles (e.dataTransfer.files);
    };
  },

  initbuttons: function () {
    var self = this;
    var player = self.player;
    self.div.open.click(function () { self.div.fileselect.click(); });
    self.div.fileselect.change(function (e) { player.readFiles(e.target.files); });
    self.div.play.click(function () { player.toggle (); });
    self.div.pause.click(function () { player.toggle (); });
    self.div.prev.click(function () { player.prev (); });
    self.div.next.click(function () { player.next (); });
    self.div.mute.click(function () { player.mute (); });
    self.div.volumeon.click(function () { player.resume (); });
    self.div.repeat.click(function () { player.repeat.next (); });
    self.div.shuffle.click(function () { player.shuffle.next (); });
    self.div.conf.click(function () { self.div.config.fadeToggle(200); });
    $('img.lbutton, img.rbutton')
    .mouseup(function (e) { $(this).css({ 'top': '50%' }); })
    .mousedown(function (e) { $(this).css({ 'top': parseInt($(this).css('top'), 10) * 1.03 + '%' }); });
  },

  initsize: function () {
    var tbodyWdt = this.div.tbody.width(),
        fontSize = 12 * (window.innerWidth - 1280) / 2360 + 12;
    this.div.wrapper.css({ 'font-size': fontSize });
    this.div.playlist
      .height(window.innerHeight - this.div.playlist.offset().top - fontSize);
    this.div.tablediv
      .height(window.innerHeight - this.div.tablediv.offset().top - fontSize);
    this.div.tablebody
      .height(window.innerHeight - this.div.tablebody.offset().top - fontSize);
    // this.div.table
    //   .height(window.innerHeight - this.div.tablebody.offset().top - fontSize);
    // this.div.tbody
    //   .height(window.innerHeight - this.div.tablebody.offset().top - fontSize);
    $('tr').css({ 'width': tbodyWdt });
  },

  initsplitter: function () {
    var w;
    if(local.get ('splitter') === undefined) {
      w = {
        'now': 0.05,
        'filename': 0.10,
        'artist': 0.20,
        'title': 0.30,
        'track': 0.05,
        'album': 0.25
      };
    } else {
      w = JSON.parse (local.get ('splitter'));
      w.now = 0.05;
    }
    for(var thname in w) {
      $('th.' + thname).width (w[thname] * (this.div.thead.width()));
    }
  },

  initschemes: function () {
    var theme = local.get ('scheme') || 'classic-default';
    var self = this;
    for(var s in scheme) {
      $('<a />')
        .attr('scheme', s)
        //.text(s.replace(/classic-/, ''))
        .css({
          'color': scheme[s]['color']['div#wrapper'] || 'black',
          'background-color': scheme[s]['background-color']['div#wrapper']
        })
        .addClass( theme === s ? 'currentScheme' : '')
        .click(function () { self.setscheme($(this).attr('scheme')); })
        .appendTo(this.div.scheme);
      }
  },

  initslider: function () {
    var self = this;
    this.div.volumeSlider
      .slider({
        'min': 0,
        'max': 256,
        'step': 8,
        'value': self.player.volume.value,
        'slide': function () { self.player.updatevolume (); },
        'stop': function () { self.player.updatevolume (); }
      });
    this.div.musicSlider
      .slider({
        'min': 0,
        'max': 1,
        'step': 0.01,
        'start': function (e, ui) { self.startSlide (e, ui); },
        'stop': function (e, ui) { self.stopSlide (e, ui); }
      })
      .slider('disable');
  },

  startSlide: function (e, ui) {
    if (this.seeking) {
      clearInterval (this.seeking);
    }
  },

  stopSlide: function (e, ui) {
    console.dir (e);
    console.dir (ui);
    var self = this;
    if (self.player.seekAt (ui.value)) {
      self.seeking = setInterval (function () { self.seek (); }, 1000);
    }
  },

  addfile: function (file, index) {
    var html = [];
    var trs = '<td></td>'
            + '<td><div class="artist"></div></td>'
            + '<td></td>'
            + '<td><div class="title"></div></td>'
            + '<td></td>'
            + '<td><div class="track"></div></td>'
            + '<td></td>'
            + '<td><div class="album"></div></td>'
            + '</tr>';
    var h = -1;
    var tbodyWdt = this.div.tbody.width();
    html[++h] = '<tr class="music" number="';
    html[++h] = index;
    html[++h] = '" style="width:';
    html[++h] = tbodyWdt;
    html[++h] = 'px;">';
    html[++h] = '<td class="now">';
    html[++h] = '<td></td>';
    html[++h] = '<td><div class="filename" title="';
    html[++h] = file.name;
    html[++h] = '" >';
    html[++h] = file.name;
    html[++h] = '</div></td>';
    html[++h] = trs;
    this.div.tbody[0].innerHTML += html.join('');
  },

  ontagread: function (tags, index) {
    $('tr[number=' + index + ']')
    .find('.artist')
    .texttitle(tags['TPE1'] || '')
    .end()
    .find('.track')
    .texttitle(tags['TRCK'] || '')
    .end()
    .find('.title')
    .texttitle(tags['TIT2'] || '')
    .end()
    .find('.album')
    .texttitle(tags['TALB'] || '');
  },

  setdblclick : function () {
    var self = this;
    $('tr.music').dblclick (
      function (e) {
        self.div.musicSlider.slider ({ 'value': 0 });
        var index = parseInt( $(e.target).closest('tr').attr('number') || e.closest('tr').attr('number') || e.attr('number'), 10 );
        self.player.pause ();
        self.player.play (index);
    });
  },

  get volume () {
    return parseInt(this.div.volumeSlider.slider('value'), 10);
  },

  setvolume: function (volume) {
    if (this.div && this.div.volumeSlider) {
      this.div.volumeSlider.slider({ 'value': volume });
    }
  },

  play: function (index) {
    var self = this;
    self.div.musicSlider.slider ('enable');
    self.showFileName (self.player.playing.name, index);
    $('tr.nP')
      .removeClass('nP')
      .find('img')
      .remove();
    $('tr[number=' + index.toString() + ']')
      .addClass('nP')
      .find('.now')
      .append( '<img src="./img/now.png">' );
    var $selected = $('tr.ui-selected');
    if ($selected.size() < 2) {
      $selected.UNSELECT(true);
      $('tr.nP').SELECT().LASTSELECT();
    }
    if (self.seeking) {
      clearInterval (self.seeking);
    }
    self.seeking = setInterval (function () { self.seek (); }, 1000);
    setTimeout (function () { self.reflesh (); }, 50);
    setTimeout (function () { self.reflesh (); }, 500);
  },

  pause: function () {
    var self = this;
    if (this.seeking) {
      clearInterval (this.seeking);
    }
    this.reflesh (false);
    setTimeout (function () { self.reflesh (); }, 50);
  },

  reflesh: function (b) {
    log ("reflesh");
    log ("this.player.playing" + this.player.playing);
    log ("this.player.playing !== undefined:" + this.player.playing !== undefined);
    if (this.player.playing) log ("this.player.playing.paused (): " + this.player.playing.paused ());
    this.div.play.attr(
      b === false || (this.player.playing !== undefined && this.player.playing.paused ()) ? {
        'src': './img/play.png',
        'title': 'Play'
      } : {
        'src': './img/pause.png',
        'title': 'Pause'
    });
  },

  seek: (function () {
    var convertTime = function (sec) {
      sec = parseInt(sec, 10);
      if (isNaN(sec)) return '00:00';
      var min = parseInt((sec / 60) % 60, 10),
          hour = parseInt(sec / 3600, 10);
      sec %= 60;
      if (hour > 0) {
        return hour.toString() + ':' + (min < 10 ? '0' : '') + min.toString() + ':' + (sec < 10 ? '0' : '') + sec.toString();
      } else {
        return (min < 10 ? '0' : '') + min.toString() + ':' + (sec < 10 ? '0' : '') + sec.toString();
      }
    };
    return function () {
      if (this.player.playing != undefined && this.player.playing.audio) {
        var audioCurrentTime = this.player.playing.audio.currentTime,
            audioDuration = this.player.playing.audio.duration;
        this.div.musicSlider.slider ({ 'value': audioCurrentTime / audioDuration });
        this.div.current.text (convertTime (audioCurrentTime));
        this.div.remain.text ('-' + convertTime (audioDuration - audioCurrentTime));
      }
    };
  })(),

  colorset: function () {
    var theme = local.get ('scheme') || 'classic-default';
    var colorscheme = scheme[theme];
    $('a.currentScheme').removeClass('currentScheme');
    $('a[scheme=' + theme + ']').addClass('currentScheme');
    var styles = [];
    for(var attr in colorscheme) {
      for(var selector in colorscheme[attr]) {
        styles.push( selector + ' { ' + attr + ':' + colorscheme[attr][selector] + ';}' );
      }
    }
    $('style#sch').text(styles.join('\n')).size()
      || $('<style />', {'id': 'sch'}).text(styles.join('\n')).appendTo($('head'));
  },

  setscheme: function (scheme) {
    local.set ('scheme', scheme);
    this.colorset ();
  },

  resizableSet: function () {
    var self = this;
    $('th:not(.splitter)+th:not(.splitter)', this.div.thead)
      .each(function (i) {
        var flg = false;
        var splitter = $('<th />', {'class': 'splitter'}).mousedown(function (e) { flg = true; }).insertBefore($(this));
        if (i === 0) return; // First column is unresizable.
        $(window)
          .mouseup(function (e) {
            if (flg) {
              flg = false;
              self.afterResize();
            }
          })
          .mousemove(function (e) {
            if (flg) {
              var prevWidth, totalWidth = splitter.prev().width() + splitter.next().width();
              splitter.prev().width( prevWidth = -splitter.prev().offset().left + e.clientX);
              splitter.next().width( totalWidth - prevWidth );
            }
          });
      });
  },

  afterResize: function () {
    var s = [], data = {}, theadWidth = this.div.thead.width();
    $('th:not(.splitter)').each(function (i, th) {
      var w = $(this).width() / (theadWidth - 0);
      s.push('td:nth-child(' + (i + 1) + ') {width:' + w * 100 + '%!important;}');
      data[$(this).attr('class')] = w;
    });
    local.set('splitter', JSON.stringify(data));
    this.selectableSet();
  },

  selectableSet: function () {
    // Clone trs every time on setting selectable.
    // This function is called when
    //   Input files.
    //   Sort the file list.
    //   Multi drag & drop action.
    var tbodyWdt = UI.div.tbody.width();
    var self = this;
    $('tr', self.div.tbody)
    .each(function () {
      var $self = $(this),
      n = $('<tr />')
      .attr({
        'number': $self.attr('number')
      })
      .append($self.children())
      .click(function (e) {
        var $last = $('tr.last-select');
        if(e.shiftKey && !e.altKey && $last.size()) {
          if(e.ctrlKey) {
            var selected = $('tr.ui-selected');
            setTimeout(
              function () {
              selected.SELECT(true);
            }, 20);
          }
          if(e.clientY < $last.position().top) {
            setTimeout(
              function () {
              $last
              .SELECT(true)
              .LASTSELECT()
              .prevAll()
              .filter(function () { return $(this).position().top > e.clientY; })
              .SELECT(true);
            }, 20);
          } else {
            setTimeout(
              function () {
              $last
              .SELECT(true)
              .LASTSELECT()
              .nextAll()
              .filter(function () { return $(this).position().top < e.clientY; })
              .SELECT(true);
            }, 20);
          }
        }
      })
      .dblclick (
        function (e) {
          var index = parseInt( $(e.target).closest('tr').attr('number') || e.closest('tr').attr('number') || e.attr('number'), 10 );
          self.player.pause ();
          self.player.play (index);
      })
      .width(tbodyWdt)
      .addClass( $self.hasClass('nP') ? 'nP': '' )
      .addClass( $self.hasClass('moved') ? 'ui-selected moved': '' )
      .addClass( $self.hasClass('ui-selected') ? 'ui-selected': '' )
      .appendTo(UI.div.tbody);
      if($self.ISSELECTED()) {
        setTimeout(function () {n.SELECT(true);}, 30);
      }
    })
    .remove();
    // Initialization of drag & drop multi select.
    $.fn.drag_drop_multi_select.unique=0;
    $.fn.drag_drop_multi_select.stack=[];
    $.fn.drag_drop_multi_select.settings=[];
    this.div.tbody.drag_drop_multi_select({
      'element_to_drag_drop_select': 'tr, this.div.tbody',
      'elements_to_drop': this.div.tbody,
      'moveOpacity': 0.7
    });
  },

  setrepeat: function (r) {
    if (this.div && this.div.repeat) {
      this.div.repeat
        .css({ 'opacity': (r === 'false' ? 0.4 : '') })
        .attr({ 'src': (r === 'one' ? './img/one.png' : './img/repeat.png') });
    }
  },

  setshuffle: function (s) {
    if (this.div && this.div.shuffle) {
      this.div.shuffle
        .css({
          'opacity': (s.toString() === 'true' ? '' : 0.4)
        });
    }
  },

  showFileName: function (filename, index) {
    var tags = this.player.musics[index].tags;
    if(tags && tags['TIT2']) {
      document.title =  (tags['TIT2'] || '') + ' - ' + (tags['TPE1'] || '') + ',' + (tags['TALB'] || '');
      filename = tags['TPE1'] + ' - ' + tags['TIT2'];
    }
    document.title = filename;
    this.div.filename.texttitle(filename);
  },

  selectDown: function () {
    var $selected = $('tr.ui-selected'),
        $last = $('tr.last-select');
    if($selected.size()) {
      $selected
        .UNSELECT(true)
        .next()
        .andSelf()
        .last()
        .SELECT()
        .LASTSELECT();
    } else if($last.size()) {
      $last
        .last()
        .SELECT()
        .LASTSELECT();
    } else {
      $('tr.nP')
        .next()
        .andSelf()
        .last()
        .SELECT()
        .LASTSELECT()
        .size()
        || $('tr', UI.div.tbody)
            .first()
            .SELECT()
            .LASTSELECT();
    }
  },

  expandDown: function () {
    var $last = $('tr.last-select');
    if($last.size()) {
      if($last.prev().ISSELECTED()) {
        $last
          .prevAll()
          .filter( ( function () {var flg = true; return function () {return flg && (flg = $(this).ISSELECTED());} })() )
          .last()
          .UNSELECT();
      } else {
        $last
          .nextAll()
          .filter( ( function () {var flg = true; return function () {return flg && (flg = $(this).prev().ISSELECTED());} })() )
          .last()
          .SELECT();
      }
    }
  },

  selectUp: function () {
    var $selected = $('tr.ui-selected'),
        $last = $('tr.last-select');
    if($selected.size()) {
      $selected
        .UNSELECT(true)
        .prev()
        .andSelf()
        .first()
        .SELECT()
        .LASTSELECT();
    } else if($last.size()) {
      $last
        .first()
        .SELECT()
        .LASTSELECT();
    } else {
      $('tr.nP')
        .prev()
        .andSelf()
        .first()
        .SELECT()
        .LASTSELECT()
        .size()
        || $('tr', UI.div.tbody)
            .last()
            .SELECT()
            .LASTSELECT();
    }
  },

  expandUp: function () {
    var $last = $('tr.last-select');
    if($last.size()) {
      if($last.next().ISSELECTED()) {
        $last
          .nextAll()
          .filter( ( function () {var flg = true; return function () {return flg && (flg = $(this).ISSELECTED());} })() )
          .last()
          .UNSELECT();
      } else {
        $last
          .prevAll()
          .filter( ( function () {var flg = true; return function () {return flg && (flg = $(this).next().ISSELECTED());} })() )
          .last()
          .SELECT();
      }
    }
  },

  selectHome: function () {
    $('tr.ui-selected')
      .UNSELECT(true);
    UI.div.tbody.children()
    .first()
      .SELECT()
      .LASTSELECT();
  },

  expandToHome: function () {
    $('tr.ui-selected')
      .removeClass('ui-selected ddms_selected');
    $('tr.last-select')
      .SELECT(true)
    .prevAll()
      .SELECT(true)
    .last()
      .SELECT();
  },

  selectEnd: function () {
    $('tr.ui-selected')
      .UNSELECT(true);
    UI.div.tbody.children()
    .last()
      .SELECT()
      .LASTSELECT();
  },

  expandToEnd: function () {
    $('tr.ui-selected')
      .removeClass('ui-selected ddms_selected');
    $('tr.last-select')
      .SELECT(true)
    .nextAll()
      .SELECT(true)
    .last()
      .SELECT();
  },

  selectAll: function () {
    UI.div.tbody
      .children()
      .SELECT(true)
      .last()
      .LASTSELECT();
  },

  unselectAll: function () {
    UI.div.tbody
      .children()
      .UNSELECT(true);
  },

  toggleHelp: function () {
    UI.div.help.fadeToggle(200);
    if($('div#help:hidden').size()) {
      div.tablebody.focus();
    }
  },

  toggleAbout: function () {
      UI.div.about.fadeToggle(200);
  },

  deleteSelected: function () {
    var player = this.player;
    $('tr.ui-selected').last().next().LASTSELECT();
    $('tr.ui-selected').first().prev().LASTSELECT(true);
    $('tr.ui-selected')
      .map(
        function (i, tr) {
          return player.remove ( parseInt($(tr).attr('number'), 10) );
      });
    $('tr.ui-selected').remove();
  },

  pageDown: function () {
    UI.div.tablebody.scrollTop( UI.div.tablebody.scrollTop() + UI.div.tablebody.height() * 0.8 );
    $('tr.ui-selected')
      .UNSELECT(true);
    var h = window.innerHeight;
    $('tr', DIV.tbody)
      .filter( function () { return $(this).position().top < h; } )
      .last()
      .SELECT()
      .LASTSELECT();
  },

  expandPageDown: function () {
    UI.div.tablebody.scrollTop( UI.div.tablebody.scrollTop() + UI.div.tablebody.height() * 0.8 );
    if($('tr.last-select').prev().ISSELECTED()) {
      $('tr.ui-selected')
        .filter( function () { return $(this).position().top < UI.div.thead.position().top + 40; } )
        .UNSELECT(true);
    } else {
      var h = window.innerHeight;
      $('tr.last-select')
        .nextAll()
        .filter( function () { return $(this).position().top < h; } )
        .SELECT(true)
        .last()
        .SELECT();
    }
  },

  pageUp: function () {
    UI.div.tablebody.scrollTop( UI.div.tablebody.scrollTop() - UI.div.tablebody.height() * 0.8 );
    $('tr.ui-selected')
      .UNSELECT(true);
    $('tr', UI.div.tbody)
      .filter( function () { return $(this).position().top > 0; } )
      .first()
      .SELECT()
      .LASTSELECT();
  },

  expandPageUp:  function () {
    UI.div.tablebody.scrollTop( UI.div.tablebody.scrollTop() - UI.div.tablebody.height() * 0.8 );
    var h = window.innerHeight,
        $last = $('tr.last-select', UI.div.tbody);
    if($last.next().ISSELECTED()) {
      $('tr.ui-selected')
        .filter( function () { return $(this).position().top > h - 50; })
        .UNSELECT(true);
    } else {
      $last
        .prevAll()
        .filter( function () { return $(this).position().top > 0; } )
        .SELECT(true)
        .last()
        .SELECT();
    }
  },

  defaultEnter: function () {
    switch($('div#help:visible,div#config:visible,div#about:visible,div#property:visible').size()) {
      case 0:
        $('tr.ui-selected')
          .UNSELECT(true)
        .first()
        .children()
        .first()
        .dblclick();
        return;
      default:
        UI.div.config.add(UI.div.help).add(UI.div.property).add(UI.div.about)
          .filter( function () { return $(':visible', this).size(); })
          .last()
          .fadeOut(200);
        return;
      }
  },

  viewInformation: function (player) {
    UI.div.property.fadeIn(200);
    if (/* player.data.tagread === 'true' &&*/ player.tags) {
      var m = {
        'TALB': 'album',
        'TIT2': 'title',
        'TPE1':'artist',
        'TRCK': 'track',
        'TDRC': 'year'
      },
      tags = $('tr.ui-selected').map( function (i, tr) {return player.tags[parseInt($(tr).attr('number'), 10)];});
      for(var flameid in m) {
        $('dd#id' + m[flameid])
          .text('　' + tags.map( function (i, x) {return x[flameid]}).unique().join());
      }
    }
  },

  escape: function () {
    switch($('#help:visible,#config:visible,#about:visible,#property:visible,#filter:visible').size()) {
      case 0:
        if($('div#musicSlider a:focus, div#volumeSlider a:focus').size()) {
          // player.key.tab(0);
          $('div#musicSlider a, div#volumeSlider a').focusout();
        } else {
          $('tr.ui-selected').UNSELECT(true);
        }
        return;
      default:
        UI.div.config.add(UI.div.help).add(UI.div.property).add(UI.div.about)
          .filter( function () { return $(':visible', this).size(); })
          .last()
          .fadeOut(200);
        // player.filter.end();
        return;
      };
  },

  toggleMute: function (player) { // player.toggleMute
    if (player.volume === 0 && player.predvol !== undefined)
      this.click ('volumeon');
    else
      this.click ('mute');
  },

  click: function (t) {
    var i = UI.div[t] || $('img#' + t);
    i.mousedown ().click();
    setTimeout ( function () {
      i.mouseup ();
    }, 200 );
  },

};

$.fn.SELECT = function (flg, anime) {
  if(this.size()) {
    this
      .addClass('ui-selected ddms_selected');
    if(flg) {
      // If flg is true, not scroll. Default is false(Scroll follows).
      return this;
    }
    var offsetTop = this.offset().top,
        firstRow = UI.div.tablebody.offset().top,
        rm = offsetTop - 30 - firstRow,
        ex = offsetTop + 60 - UI.div.tablediv.height() - firstRow;
     if(rm < 0) {
       if (anime) {
         UI.div.tablebody.animate({scrollTop: '+=' + rm}, {duration: 'fast', easing: 'linear'});
       } else {
         UI.div.tablebody.scrollTop(UI.div.tablebody.scrollTop() + rm);
       }
     } else if(ex > 0) {
       if(anime) {
         UI.div.tablebody.animate({scrollTop: '+=' + ex}, {duration: 'fast', easing: 'linear'});
       } else {
         UI.div.tablebody.scrollTop(UI.div.tablebody.scrollTop() + ex);
         //tablebody.scrollTop += ex;
       }
     }
  }
  return this;
};

$.fn.UNSELECT = function (flg) {
  if(!flg) this.SELECT();
  return this.removeClass('ui-selected ddms_selected last-select');
};

$.fn.LASTSELECT = function (flg) {
  if(!flg) {
    $('tr.last-select', UI.div.tbody)
      .removeClass('last-select');
  }
  return this.addClass('last-select');
};

$.fn.ISSELECTED = function () {
  return this.hasClass('ui-selected');
};

$.fn.drag_drop_multi_select.defaults.after_drop_action = function ($item, $old, $new, e, ui) {
  var itemNum = $item.first().attr('number'),
      trHgtHlf = $('tr', UI.div.tbody).first().height() / 2,
      eY = e.clientY,
      $target = $('tr', UI.div.tbody)
                .filter(function () { var d = eY - $(this).offset().top; return -trHgtHlf <= d && d < trHgtHlf; } )
                .first();
  if(itemNum === $target.attr('number')) {
    var $next = $item.last().next();
    $item
      .insertBefore($next)
      .addClass('ui-selected moved');
  } else {
    $item
      .insertBefore($target)
      .addClass('ui-selected moved');
  }
  setTimeout(function () { UI.selectableSet(); }, 30);
  setTimeout(
    function () {
      $('tr.ui-selected', UI.div.tbody)
        .removeClass('ui-selected moved last-select');
      // player.order.set();
    }, 1000
  );
};

////             this.div.help.click(function () {
////               this.div.help.fadeOut(200);
////               key.tab(0);
////             });
////             this.div.config.click(function (e) {
////               if(['a', 'input'].indexOf(e.target.localName) < 0) {
////                 this.div.config.fadeOut(200);
////                 key.tab(0);
////               }
////             });
////             this.div.about.click(function (e) {
////               if(e.target.localName !== 'a') {
////                 this.div.about.fadeOut(200);
////                 key.tab(0);
////               }
////             });
////             this.div.property.click(function (e) {
////               if(e.target.localName !== 'a') {
////                 this.div.property.fadeOut(200);
////                 key.tab(0);
////               }
////             });
////             //this.div.firstrow.click(order.sort);
////             this.div.thead
////             .find('th')
////             .each(function (i, th) {
////               $(this).click( (function () {
////                 var order = 1;
////                 return function () {
////                   order.sort(i, order);
////                   order *= -1;
////                 };
////               })())
////             });
////             this.div.filename
////             .click(function () {
////               $('tr.ui-selected').UNSELECT();
////               $('tr.nP').SELECT().LASTSELECT();
////               key.tab(0);
////             });
////             this.div.globalcontrol
////             .attr({'checked':data.globalcontrol==='true'})
////             .change(function (e) {
////               L.globalcontrol = data.globalcontrol = e.target.checked.toString();
////             });
////             this.div.tagread
////             .attr({'checked':data.tagread==='true'})
////             .change(function (e) {
////               L.tagread = data.tagread = e.target.checked.toString();
////             });
////             //$('tr', this.div.thead)
////             //  .sortable();
////             //.children()
////             //.resizable({ handles: 'e, w' });
////             //.resizable();
////             this.div.filterword.keydown(filter.start);
// Order

function Order (arr) {
  this.arr = arr;
}

Order.prototype = {

  arr: [],

  index: 0,

  history: [],

  historyindex: 0,

  shuffleflg: false,

  reset: function () {
    this.index = 0;
    this.arr = this.arr.filter (function (x) { return x !== undefined; });
    if (this.shuffleflg)
      this.shuffle ();
  },

  shuffleon: function () {
    this.shuffleflg = true;
  },

  shuffleoff: function () {
    this.shuffleflg = false;
  },

  setshuffle: function (shuffle) {
    this.shuffleflg = shuffle !== "false" && shuffle;
  },

  sort: function () {
    this.arr = this.arr.sort (function (x, y) { return x - y; });
  },

  reverse: function () {
    this.arr = this.arr.reverse ();
  },

  shuffle: function () {
    this.arr.shuffle ();
  },

  next: function () {
    var ans = undefined;
    if (this.history.length === this.historyindex) {
      for (var i = this.index; i < this.arr.length; ++i) {
        ans = this.arr[i];
        if (ans !== undefined) break;
      }
      if (undefined !== ans) {
        this.history.concat (ans);
        this.historyindex = this.historyindex + 1;
      } else {
        this.reset ();
        if (!this.arr[this.index]) ans = this.index;
        this.history.concat (ans);
        this.historyindex = this.historyindex + 1;
      }
    } else {
      ans = this.history[this.historyindex];
      this.historyindex = this.historyindex + 1;
    }
    return ans;
  },

  append: function (i) {
    this.arr = this.arr.concat (i);
  },

  delete: function (x) {
    for (var i = 0; i < this.arr.length; ++i) {
      if (this.arr[i] === x) {
        this.arr[i] = undefined;
      }
    }
  },


};


// Key maneger

function Key (app, config) {
  this.app = app;
  if (config) {
    for (var key in config) {
      this.set (this.parse (key), config[key]);
    }
  }
}

Key.prototype = {

  start: function () {
    var self = this;
    $(window).keydown (function (e) {
      var f = self.callback [self.convert (e)];
      if (f) {
        self.prevent (e);
        f (self.app, e);
      }
    });
  },

  prevent: function (e) {
    if (e.preventDefault)
      e.preventDefault();
  },

  convert: function (e) {
    var meta = this.meta (e);
    var key = '<' + (meta ? meta + '-' : '') + this.keyCode (e.keyCode) + '>';
    return key;
  },

  meta: function (e) {
    return (e.global ? 'g' : '')
         + (e.ctrlKey || e.metaKey ? 'c' : '')
         + (e.shiftKey ? 's' : '')
         + (e.altKey ? 'a' : '');
  },

  parse: function (key) {
    return key.toLowerCase ();
  },

  set: function (key, callback) {
    this.callback [key] = callback;
  },

  callback: [],

  codes: {
      8: 'backspace',
      9: 'tab',
     13: 'enter',
     16: 'shift',
     17: 'ctrl',
     18: 'alt',
     27: 'esc',
     32: 'space',
     33: 'pgup',
     34: 'pgdn',
     35: 'end',
     36: 'home',
     37: 'left',
     38: 'up',
     39: 'right',
     40: 'down',
     45: 'insert',
     46: 'delete',
     91: '^', // TODO
    106: '*',
    107: '+',
    111: '/',
    144: 'numlock',
    186: ':',
    187: ';',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '@',
    219: '[',
    220: '\\',
    221: ']',
    222: '^',
  },

  keyCode: function (keyCode) {
    if (this.codes[keyCode])
      return this.codes[keyCode];
    if (48 <= keyCode && keyCode <= 57)
      return keyCode - 48;
    if (65 <= keyCode && keyCode <= 90)
      return String.fromCharCode(keyCode).toLowerCase();
    if (96 <= keyCode && keyCode <= 105)
      return keyCode - 96;
    if (112 <= keyCode && keyCode <= 123)
      return 'f' + (keyCode - 111);
    console.log ('unknown key: ' + keyCode);
  },

};


// key configuration for player

var keyconfig = {

  '<c-space>': function (player) { player.ui.click ('play'); },
  '<a-space>': function (player) { player.ui.click ('play'); },
  '<space>': function (player) { player.ui.click ('play'); },
  '<c-r>': function (player) { player.ui.click ('repeat'); },
  '<c-o>': function (player) { player.ui.click ('open'); },
  '<c-u>': function (player) { player.ui.click ('shuffle'); },
  '<c-a>': function (player) { player.ui.selectAll (); },
  '<cs-a>': function (player) { player.ui.unselectAll (); },
  '<s-/>': function (player) { player.ui.toggleHelp (); },
  '<f1>': function (player) { player.ui.toggleAbout (); },
  '<esc>': function (player) { player.ui.escape (); },
  '<delete>': function (player) { player.ui.deleteSelected (); },
  '<d>': function (player) { player.ui.deleteSelected (); },
  '<down>': function (player) { player.ui.selectDown (); },
  '<j>': function (player) { player.ui.selectDown (); },
  '<s-down>': function (player) { player.ui.expandDown (); },
  '<s-j>': function (player) { player.ui.expandDown (); },
  '<c-down>': function (player) { player.volumedown (); },
  '<c-j>': function (player) { player.volumedown (); },
  '<9>': function (player) { player.volumedown (); },
  '<c-up>': function (player) { player.volumeup (); },
  '<0>': function (player) { player.volumeup (); },
  '<c-k>': function (player) { player.volumeup (); },
  '<ca-down>': function (player) { player.ui.toggleMute (); },
  '<up>': function (player) { player.ui.selectUp (); },
  '<k>': function (player) { player.ui.selectUp (); },
  '<s-up>': function (player) { player.ui.expandUp (); },
  '<s-k>': function (player) { player.ui.expandUp (); },
  'gg': function (player) { player.ui.selectHome (); }, // TODO
  '<home>': function (player) { player.ui.selectHome (); },
  '<s-home>': function (player) { player.ui.expandToHome (); },
  '<end>': function (player) { player.ui.selectEnd (); },
  '<s-end>': function (player) { player.ui.expandToEnd (); },
  '<s-g>': function (player) { player.ui.selectEnd (); },
  '<right>': function (player) { player.seekBy (10); },
  '<s-right>': function (player) { player.seekBy (30); },
  '<left>': function (player) { player.seekBy (-10); },
  '<s-left>': function (player) { player.seekBy (-30); },
  '<l>': function (player) { player.seekBy (10); },
  '<w>': function (player) { player.seekBy (30); },
  '<h>': function (player) { player.seekBy (-10); },
  '<b>': function (player) { player.seekBy (-30); },
  '<enter>': function (player) { player.ui.defaultEnter (); },
  '<a-enter>': function (player) { player.ui.viewInformation (); },
  '<pgdn>': function (player) { player.ui.pageDown (); },
  '<s-pgdn>': function (player) { player.ui.expandPageDown (); },
  '<pdup>': function (player) { player.ui.pageUp (); },
  '<s-pgup>':  function (player) { player.ui.expandPageUp (); },
  '<^>':  function (player) { player.seekBy (-10000); }, // TODO
  '<s-4>':  function (player) { player.seekBy (10000); },

};



// map <c-space> PlayPause
// map <a-space> PlayPause
// map <space> PlayPause
// map <c-r> ToggleRepeat
// map <c-o> OpenFile
// map <c-u> ToggleShuffle
// map <c-a> SelectAll
// map <cs-a> SelectNone
// map <s-/> ToggleHelp
// map <enter> PlaySelected
// map <up> SelectUp
// map <down> SelectDown
// map <s-up> SelectShiftUp
// map <s-down> SelectShiftDown
// map <home> SelectHome
// map <end> SelectEnd
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

} ) ();
