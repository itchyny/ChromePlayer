/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
 *
 *    Chrome Player 2.0
 *
 *    author      : itchyny
 *    last update : 2011/11/23 11:15:59 (GMT)
 *    source code : https://github.com/itchyny/ChromePlayer
 *
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function () {

function log (x) {
  console.dir (x);
}

Array.prototype.clone = function () {
    return Array.apply (null,this);
};

Array.prototype.shuffle = function () {
  var xs = this.clone ();
  var i = xs.length, j, t;
  var mathRandom = Math.random;
  var mathFloor = Math.floor;
  while (i) {
    j = mathFloor( mathRandom() * i );
    t = xs[--i];
    xs[i] = xs[j];
    xs[j] = t;
  }
  return xs;
};

Array.prototype.unique = function () {
  var ans = [], i, j, l, m, f;
  for(i = -1, l = this.length; i < l; ++i) {
    for(j = -1, m = ans.length, f = true; j < m; ++j) {
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

if (typeof $ !== 'undefined') {

  $.fn.texttitle = function (t) {
    return this.text(t).attr('title', t);
  };

}

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

// export Enumstate class
this.log = log;





// Limited data class
//
// Limited can be used for changing number,
// which has minBound and maxBound.
//

function Limited (min, max, step, initializer, callback) {
  if (min > max) {
    min = [max, max = min][0]; // swap
  }
  this.min = min;
  this.max = max;
  this.step = step;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
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
    return this.value;
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
  }

};



// Enum data class
//
// An instance of Enum is just a data type,
// which has the nature of Enum.
//

// Enum Constructor
function Enum (array) {
  this.array = array;
}

Enum.prototype = {

  array: [], //:: [A]

  succ: function (x) {
    return this.toEnum (+ 1 + this.fromEnum (x));
  },

  pred: function (x) {
    return this.toEnum (- 1 + this.fromEnum (x));
  },

  toEnum: function (i) {
    /*! return undefined if index is out of array */
    if (0 <= i && i < this.array.length) {
      return this.array[i];
    } else {
      return undefined;
    }
  },

  fromEnum: function (x) {
    /*! return undefined if value is not found in array */
    for (var i = 0, l = this.array.length; i < l; i++) {
      if (this.array[i] === x) return i;
    }
    return undefined;
  },

  enumFrom: function (x) {
    return this.enumFromTo (x, this.array[this.array.length - 1]);
  },

  enumFromThen: function (x, y) {
    var i = this.fromEnum (x);
    var j = this.fromEnum (y);
    var ans = [];
    for (var k = i; 0 <= k && k < this.array.length; k += (j - i)) {
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
      for (var l = i; l <= k && l < this.array.length; l += d) {
        ans = ans.concat (this.array[l]);
      }
    } else {
      for (var l = i; l >= k && l >= 0; l += d) {
        ans = ans.concat (this.array[l]);
      }
    }
    return ans;
  }

};

// export Enum 
this.Enum = Enum;





// Enum linear, which is been bounded
// return undefined when move over its bound


// requirements
if (typeof window === 'undefined') {
  var Enum = require('./enum').Enum;
}


// An instance of Enumlinear has current position.
// initializer can be a function
function Enumlinear (array, initializer, callback) {
  this.enumclass = new Enum (array);
  this.array = this.enumclass.array;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
}

Enumlinear.prototype = {

  index: 0, //:: Number

  value: undefined, //:: Value

  history: [], //:: [Value]

  head: function () {
    return this.at (0);
  },

  last: function () {
    return this.at (this.enumclass.array.length - 1);
  },

  nonvalidIndex: function (index) {
    return index === undefined || isNaN (index) || typeof index !== 'number';
  },

  at: function (index) {
    /*! return value; return undefined if index if out of array */
    if (this.nonvalidIndex (index)) {
      index = this.index;
    }
    var value = this.enumclass.toEnum (index);
    if (value === undefined) {
      return undefined;
    }
    this.value = value;
    this.index = index;
    this.history = this.history.concat (this.value);
    this.callback (this.value);
    return this.value;
  },

  atfromEnum: function (value) {
    /*! return value; return undefined if value is not found in array */
    var index = this.enumclass.fromEnum (value);
    if (index === undefined) {
      return undefined;
    }
    return this.at (index);
  },

  next: function (j) {
    /*! return undefined if out of array after moving */
    if (this.nonvalidIndex (j)) {
      j = 1;
    }
    return this.at (this.index + j);
  },

  prev: function (j) {
    /*! return undefined if out of array after backward */
    if (this.nonvalidIndex (j)) {
      j = -1;
    }
    return this.next (j);
  },

  init: function (value) {
    /*! return value; return undefined if value is not found in array */
    if (value === undefined) {
      if (typeof this.initializer === 'function') {
        try {
          value = this.initializer ();
        } catch (e) {
          value = this.array[0];
        }
      } else {
        value = this.initializer;
      }
    }
    value = this.atfromEnum (value);
    // If initialization fails, begin at head of the array, with no error.
    if (value === undefined) {
      return this.at (0);
    }
  },

  concat: function (arr) {
    return this.changeArray (this.enumclass.array.concat (arr));
  },

  splice: function (start, count) {
    return this.changeArray (this.enumclass.array.splice (start, count));
  },

  remove: function (value) {
    return this.splice (this.enumclass.fromEnum (value), 1);
  },

  changeArray: function (array) {
    this.enumclass = new Enum (array);
    this.array = this.enumclass.array;
    return this;
  }

};




// export Enumlinear
this.Enumlinear = Enumlinear;





// Enum cycle, whose bound is connected


// requirements
if (typeof window === 'undefined') {
  var Enumlinear = require('./enumlinear').Enumlinear;
}

// Enumcycle provides exactly same functions as Enumlinear does.
// What is different from Enumlinear is, that
// prototype.(at|next|prev) never returns undefined.
// Only function which can fail is prototype.init (when
// initializer was not found in the array.)
function Enumcycle (array, initializer, callback) {
  var self = this;
  this.enumclass = new Enum (array);
  this.array = this.enumclass.array;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
  callback = callback || function (x) { };
  this.enumlinear = new Enumlinear
                  ( array
                  , initializer
                  , (function (f) {
                      return function (value) {
                        self.index = self.enumlinear.index;
                        self.value = value;
                        self.history = self.history.concat (self.value);
                        f (value);
                      };
                  } (callback)));
  for (var x in this.enumlinear) {
    if (this.enumlinear.hasOwnProperty (x)) {
      this[x] = this.enumlinear[x]; 
    }
  }
}

Enumcycle.prototype = new Enumlinear ();
// prototype.at never fails with its circulant structure.
// Note that if argument was not a Number, status
// doesn't change with no Error.
Enumcycle.prototype.at = function (index) {
  if (this.nonvalidIndex (index)) {
    index = this.index;
  }
  var length = this.array.length;
  index = ((index % length) + length) % length;
  return this.enumlinear.at (index);
};
Enumcycle.prototype.changeArray = function (array) {
  this.enumlinear.changeArray (array);
  this.array = this.enumlinear.array;
  this.enumclass = this.enumlinear.enumclass;
};


// export Enumcycle
this.Enumcycle = Enumcycle;






// Enum dinamic
//


// requirements
if (typeof window === 'undefined') {
  require ('./prelude');
  var Enum = require('./enum').Enum;
  var Enumlinear = require('./enumlinear').Enumlinear;
  var Enumcycle = require('./enumcycle').Enumcycle;
}



function Enumdinamic (array, initializer, callback) {
  var self = this;
  this.enumclass = new Enum (array);
  this.array = this.enumclass.array;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
  callback = callback || function (x) { };
  this.enumlinear = new Enumlinear
                  ( array
                  , initializer
                  , (function (f) {
                      return function (value) {
                        self.index = self.enumlinear.index;
                        self.value = value;
                        self.history = self.history.concat (self.value);
                        self.array = self.enumlinear.array;
                        self.enumclass = self.enumlinear.enumclass;
                        f (self.value);
                      };
                  } (callback)));
  for (var x in this.enumlinear) {
    if (this.enumlinear.hasOwnProperty (x)) {
      this[x] = this.enumlinear[x]; 
    }
  }
  this.repeat = new Enumcycle ( ['false', 'true', 'one'], 'false'
              , function (repeat) {
              });
  this.shuffle = new Enumcycle ( ['false', 'true']
               , 'false'
               , function (shuffle) {
                switch (shuffle) {
                  case 'true':
                    if (!self.orderedarray) {
                      self.orderedarray = self.enumclass.array;
                    }
                    self.changeArray (self.orderedarray.shuffle ());
                    self.at (self.enumclass.fromEnum (self.value));
                    break;
                  default:
                    self.changeArray (self.orderedarray);
                    delete self.orderedarray;
                    self.at (self.enumclass.fromEnum (self.value));
                }
               })
}

Enumdinamic.prototype = new Enumlinear ();
Enumdinamic.prototype.at = function (index) {
  if (this.nonvalidIndex (index)) {
    index = this.index;
  }
  return this.enumlinear.at (index);
};
Enumdinamic.prototype.next = function (j) {
  /*! when goes out of the array:
   *                |                               repeat                            |
   *                |   false                        |   true     |    one            |
   * ---------------+--------------------------------+------------+-------------------+
   *         false  | undefined                      |     %      | always same index |
   * shuffle -------+--------------------------------+------------+-------------------+
   *          true  | shuffle array again, undefined | shuffle, % | always same index |
   * ---------------+--------------------------------+------------+-------------------+
   */
  if (j === undefined || isNaN (j)) {
    j = 1;
  }
  var index = this.index + j;
  switch (this.repeat.value) {
    case 'one': index = this.index; break;
    case 'true':
      var value = this.enumclass.toEnum (index);
      if (value === undefined) {
        switch (this.shuffle.value) {
          case 'true':
            this.enumclass = new Enum (this.enumclass.array.shuffle ());
          default:
            var length = this.array.length;
            index = ((index % length) + length) % length;
        }
      }
      break;
    default:
      var value = this.enumclass.toEnum (index);
      if (value === undefined) {
        switch (this.shuffle.value) {
          case 'true':
            this.enumclass = new Enum (this.enumclass.array.shuffle ());
            var length = this.array.length;
            index = ((index % length) + length) % length;
          default:
            return undefined;
        }
      }
  }
  this.at (index);
  return this.value;
};
Enumdinamic.prototype.concat = function (arr) {
  var basearray = this.array || [];
  return this.changeArray (basearray.concat (arr));
};
Enumdinamic.prototype.changeArray = function (array) {
  this.enumlinear.changeArray (array);
  this.array = this.enumlinear.array || [];
  this.enumclass = this.enumlinear.enumclass;
};

Enumdinamic.prototype.setRepeat = function (repeat) { this.repeat.atfromEnum (repeat); };
Enumdinamic.prototype.repeatOff = function (repeat) { this.repeat.atfromEnum ('false'); };
Enumdinamic.prototype.repeatOn = function (repeat) { this.repeat.atfromEnum ('true'); };
Enumdinamic.prototype.repeatOne = function (repeat) { this.repeat.atfromEnum ('one'); };
Enumdinamic.prototype.repeatToggle = function (repeat) { this.repeat.next (); };
Enumdinamic.prototype.repeatToggleOnOff = function (repeat) { this.repeat.atfromEnum (this.repeat.value === 'false' ? 'true' : 'false'); };

Enumdinamic.prototype.setShuffle = function (shuffle) { this.shuffle.atfromEnum (shuffle); };
Enumdinamic.prototype.shuffleOff = function (shuffle) { this.shuffle.atfromEnum ('false'); };
Enumdinamic.prototype.shuffleOn = function (shuffle) { this.shuffle.atfromEnum ('true'); };
Enumdinamic.prototype.shuffleToggle = function (shuffle) { this.shuffle.next (); };
Enumdinamic.prototype.shuffleToggleOnOff = function (shuffle) { this.shuffle.atfromEnum (this.shuffle.value === 'false' ? 'true' : 'false'); };






// export Enumdinamic
this.Enumdinamic = Enumdinamic;













// Enumerable (ordered) state


// requirements
if (typeof window === 'undefined') {
  var Enum = require('./enum').Enum;
}


// An instance of Enumstate has current position.
function Enumstate (array, initializer, callback) {
  this.array = array;
  this.enumclass = new Enum (array);
  this.enumarray = array;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
  this.shuffle = false;
  this.repeat = false;
  this.repeatone = false;
}

Enumstate.prototype = {

  index: 0,

  value: undefined,

  history: [],

  enumarray: [],

  shuffle: false,

  repeat: false,

  repeatone: false,

  head: function () {
    return this.at (0);
  },

  last: function () {
    return this.at (this.enumclass.array.length - 1);
  },

  fromEnum: function (x) {
    var index = this.enumclass.fromEnum (x);
    if (index === undefined) {
      return undefined;
    }
    this.at (index);
  },

  at: function (index) {
    console.log('at:');
    if (index === undefined || isNaN (index)) {
      index = this.index;
    }
    this.index = index;
    this.value = this.enumclass.toEnum (index);
    this.history = this.history.concat (index);
    this.callback (this.value);
    log ('enumstate.js: value:' + this.value);
    log ('enumstate.js: array:' + this.enumclass.array);
    return this.value;
  },

  next: function (j) {
    console.log('next:');
    if (this.repeatone) {
      this.index = this.index;
    } else {
      if (j === undefined || isNaN (j)) {
        j = 1;
      }
      if (isNaN (this.index)) {
        this.index = 0;
      }
      this.index += j;
      this.value = this.enumclass.toEnum (this.index);
      if (this.value === undefined) {
        if (this.shuffle) {
          this.enumclass = new Enum (this.enumclass.array.shuffle ());
        }
        if (this.repeat) {
          var array = this.enumclass.array;
          this.index = (this.index + array.length * 100) % array.length;
        } else {
          return undefined;
        }
      }
    }
    this.at (this.index);
    return this.value;
  },

  prev: function (j) {
    console.log('prev:');
    return this.next (-1);
  },

  shuffleOn: function () {
    console.log('shuffleOn:');
    this.shuffle = true;
    this.enumarray = this.enumclass.array;
    log ('enumstate.js: prevarray:' + this.enumarray);
    this.enumclass = new Enum (this.enumarray.shuffle ());
    this.index = this.enumclass.fromEnum (this.value);
    log ('enumstate.js: value:' + this.value);
    log ('enumstate.js: array:' + this.enumclass.array);
    log ('enumstate.js: prevarray:' + this.enumarray);
    return this;
  },

  shuffleOff: function () {
    console.log('shuffleOff:');
    this.shuffle = false;
    this.enumclass = new Enum (this.enumarray.clone ());
    this.index = this.enumclass.fromEnum (this.value);
    log ('enumstate.js: value:' + this.value);
    log ('enumstate.js: array:' + this.enumclass.array);
    log ('enumstate.js: prevarray:' + this.enumarray);
    return this;
  },

  shuffleToggle: function () {
    console.log('shuffleToggle:');
    if (this.shuffle) {
      return this.shuffleOff ();
    } else {
      return this.shuffleOn ();
    }
  },

  repeatOn: function () {
    console.log('repeatOn:');
    this.repeat = true;
    this.repeatone = false;
  },

  repeatOff: function () {
    console.log('repeatOff:');
    this.repeat = false;
    this.repeatone = false;
  },

  repeatToggle: function () {
    console.log('repeatToggle:');
    if (this.repeat) {
      return this.repeatOff ();
    } else {
      return this.repeatOn ();
    }
  },

  repeatOne: function () {
    console.log('repeatOne:');
    this.repeatone = true;
  },

  init: function (x) {
    if (x !== undefined) {
      this.at (this.enumclass.fromEnum (x));
    } else if (typeof this.initializer === 'function') {
      this.at (this.enumclass.fromEnum (this.initializer ()));
    } else {
      this.at (this.enumclass.fromEnum (this.initializer));
    }
    return this;
  },

  concat: function (arr) {
    return this.changeEnumArray (this.enumclass.array.concat (arr));
  },

  splice: function (start, count) {
    return this.changeEnumArray (this.enumclass.array.splice (start, count));
  },

  remove: function (value) {
    return this.splice (this.enumclass.fromEnum (value), 1);
  },

  changeEnumArray: function (array) {
    this.array = array;
    this.enumclass = new Enum (array);
    this.enumarray = array.clone ();
    if (this.shuffle) {
      this.shuffleOn ();
    }
    return this;
  },

};

// export Enumstate
this.Enumstate = Enumstate;





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
    case 0:  // ISO-8859-1
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
      return chars.toString ();
    case 2: { // UTF-16BE without BOM
      // log("UTF-16BE without BOM");
    }
    case 1: { // UTF-16 with BOM
           // log("UTF-16 with BOM");
      var a = "", StringfromCharCode = String.fromCharCode, kind;
      for (var i = 1, charslen = chars.length; i < charslen; ) {
        if (kind === 1 || ((chars.charCodeAt(i) & 0xff) === 0xff)) { // 2bytes
          if (!kind) {
            i += 2;
            kind = 1;
          }
          a += StringfromCharCode( chars.charCodeAt(i++)
                                  |(chars.charCodeAt(i++)<<8));
        } else if (kind === 2 || ((chars.charCodeAt(i) & 0xfe) === 0xfe)) { // 2bytes
          if (!kind) {
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
        if (charsi & 128) {
          if (charsi & 32) {
            if (charsi & 16) {
              if (charsi & 8) {
                if (charsi & 4) { // U+04000000 .. U+7FFFFFFF
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

function _ID3 (result) {
  this.result = result;
  this.i = 0;
}

_ID3.prototype = {

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
    if (this.flags[1] === "1") {
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
      if (flamesize) {
        //        log("flame id: " + flameid);
        //        log("flame size: " + flamesize);
        //        log("flame flg: " + flameflg);
        //        log("flame text: " + flametext);
        if (flametext) {
          tags[flameid] = flametext;
          if (this.shortcuts[flameid]) {
            tags[this.shortcuts[flameid]] = flametext;
          }
        }
      }
    }
    this.tags = tags;
  },

  shortcuts: {
    TIT2: "title",
    TPE1: "artist",
    TALB: "album",
    TYER: "year",
    COMM: "comment",
    TRCK: "track",
    TCON: "genre",
    APIC: "picture",
    USLT: "lyrics"
  }

};



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

// Easy wrapper for localStorage

var local = {

  get: function (key) {
    return localStorage.getItem (key);
  },

  set: function (key, val) {
    localStorage.setItem (key, val);
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
// dragenter等々を調べる

var UI = {

  start: function (player) {
    var self = this;
    self.player = player;
    self.div = (function (a, x) {
      a.forEach(function (b) { x[b] = $('#' + b); });
      return x;
    }) (['about'     , 'conf'         , 'config'  , 'current'    , 'filename' , 'fileselect', 
         'firstrow'  , 'globalcontrol', 'help'    , 'musicSlider', 'mute'     , 'next'      , 
         'open'      , 'pause'        , 'play'    , 'playlist'   , 'prev'     , 'property'  , 
         'remain'    , 'repeat'       , 'scheme'  , 'shuffle'    , 'tablebody', 'tablediv'  , 
         'tagread'   , 'volumeSlider' , 'volumeon', 'wrapper'    , 'filter'   , 'filterword', 'matchnum'], 
      { tbody: $('#tbody'),
        thead: $('thead'),
        table: $('table'),
        video: document.getElementsByTagName('video')[0]
    });
    self.initdrop ();
    self.initbuttons ();
    self.colorset ();
    self.initsize ();
    self.initslider ();
    self.initschemes ();
    self.initsplitter ();
    self.resizableSet ();
    self.selectableSet ();
    self.initFilter ();
    $(window).resize(function () { self.initsize (); });
    $('div#appname a').text('Local Player v' + player.version);
  },

  initdrop: function () {
    var self = this;
    document.body.ondragover = function (e) {
      // e.stopPropagation();
      e.preventDefault();
    };// TODO
    // document.body.dragenter = function (e) {
    //   e.stopPropagation();
    //   e.preventDefault();
    // };
    document.body.ondrop = function (e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files) {
        self.player.readFiles (e.dataTransfer.files);
      }
    };
  },

  initbuttons: function () {
    var self = this;
    var player = self.player;
    self.div.open.click(        function ()  { self.div.fileselect.click(); });
    self.div.fileselect.change( function (e) { player.readFiles(e.target.files); });
    self.div.play.click(        function ()  { player.toggle (); });
    self.div.pause.click(       function ()  { player.toggle (); });
    self.div.prev.click(        function ()  { player.prev (); });
    self.div.next.click(        function ()  { player.next (); });
    self.div.mute.click(        function ()  { player.mute (); });
    self.div.volumeon.click(    function ()  { player.resume (); });
    self.div.repeat.click(      function ()  { player.repeat.next (); });
    self.div.shuffle.click(     function ()  { player.shuffle.next (); });
    self.div.conf.click(        function ()  { self.div.config.fadeToggle(200); });
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
    if (!this.fullScreenOff) {
      this.fullScreenOff ();
    }
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
    .texttitle(tags.artist || '')
    .end()
    .find('.track')
    .texttitle(tags.track || '')
    .end()
    .find('.title')
    .texttitle(tags.title || '')
    .end()
    .find('.album')
    .texttitle(tags.album || '');
  },

  setdblclick: function () {
    var self = this;
    $('tr.music').dblclick (
      function (e) {
        self.div.musicSlider.slider ({ 'value': 0 });
        var index = parseInt( $(e.target).closest('tr').attr('number') || e.closest('tr').attr('number') || e.attr('number'), 10 );
        self.player.pause ();
        self.player.play (index);
        // TODO: この時, player.orderをどう動かすか
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

  popupvideo: function () {
      this.div.video.parentNode.style.visibility = 'visible';
  },

  hidevideo: function () {
      this.div.video.parentNode.style.visibility = 'hidden';
  },

  showAlbumArt: function (file) {
    var art = $('img#art')[0];
    if (file.picture) {
      var image = file.picture;
      art.src = "data:" + image.format + ";base64," + Base64.encodeBytes(image.data);
      art.style.display = "block";
      log ("displaying image")
    } else {
      art.style.display = "none";
      log ("hiding image")
    }
  },

  play: function (index) {
    var self = this;
    self.div.musicSlider.slider ('enable');
    var file = self.player.playing;
    self.showAlbumArt (file);
    self.showFileName (file.name, index);
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
    this.div.play.attr(
      b === false || (this.player.playing !== undefined
                                && this.player.playing.paused ()) ? {
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
    var self = this;
    var tbodyWdt = self.div.tbody.width();
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
      .appendTo(self.div.tbody);
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
    var self = this;
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
        || $('tr', self.div.tbody)
            .first()
            .SELECT()
            .LASTSELECT();
    }
  },

  extendDown: function () {
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
    var self = this;
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
        || $('tr', self.div.tbody)
            .last()
            .SELECT()
            .LASTSELECT();
    }
  },

  extendUp: function () {
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
    var self = this;
    $('tr.ui-selected')
      .UNSELECT(true);
    self.div.tbody.children()
    .first()
      .SELECT()
      .LASTSELECT();
  },

  extendToHome: function () {
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
    var self = this;
    $('tr.ui-selected')
      .UNSELECT(true);
    self.div.tbody.children()
    .last()
      .SELECT()
      .LASTSELECT();
  },

  extendToEnd: function () {
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
    var self = this;
    self.div.tbody
      .children()
      .SELECT(true)
      .last()
      .LASTSELECT();
  },

  unselectAll: function () {
    var self = this;
    self.div.tbody
      .children()
      .UNSELECT(true);
  },

  toggleHelp: function () {
    var self = this;
    self.div.help.fadeToggle(200);
    if($('div#help:hidden').size()) {
      div.tablebody.focus();
    }
  },

  toggleAbout: function () {
    var self = this;
      self.div.about.fadeToggle(200);
  },

  toggleConfig: function () {
    var self = this;
      self.div.config.fadeToggle(200);
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
    var self = this;
    self.div.tablebody.scrollTop( self.div.tablebody.scrollTop() + self.div.tablebody.height() * 0.8 );
    $('tr.ui-selected')
      .UNSELECT(true);
    var h = window.innerHeight;
    $('tr', self.div.tbody)
      .filter( function () { return $(this).position().top < h; } )
      .last()
      .SELECT()
      .LASTSELECT();
  },

  extendPageDown: function () {
    var self = this;
    self.div.tablebody.scrollTop( self.div.tablebody.scrollTop() + self.div.tablebody.height() * 0.8 );
    if($('tr.last-select').prev().ISSELECTED()) {
      $('tr.ui-selected')
        .filter( function () { return $(this).position().top < self.div.thead.position().top + 40; } )
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
    var self = this;
    self.div.tablebody.scrollTop( self.div.tablebody.scrollTop() - self.div.tablebody.height() * 0.8 );
    $('tr.ui-selected')
      .UNSELECT(true);
    $('tr', self.div.tbody)
      .filter( function () { return $(this).position().top > 0; } )
      .first()
      .SELECT()
      .LASTSELECT();
  },

  extendPageUp:  function () {
    var self = this;
    self.div.tablebody.scrollTop( self.div.tablebody.scrollTop() - self.div.tablebody.height() * 0.8 );
    var h = window.innerHeight,
        $last = $('tr.last-select', self.div.tbody);
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
    var self = this;
    if ($('textarea#shortcuts:focus').size()) {
      return;
    }
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
        self.div.config.add(self.div.help).add(self.div.property).add(self.div.about)
          .filter( function () { return $(':visible', this).size(); })
          .last()
          .fadeOut(200);
        return;
      }
  },

  viewInformation: function (player) {
    var self = this;
    self.div.property.fadeIn(200);
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
    var self = this;
    self.player.key.unlockAll ();
    self.filterEnd ();
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
        self.div.config.add(self.div.help).add(self.div.property).add(self.div.about)
          .filter( function () { return $(':visible', this).size(); })
          .last()
          .fadeOut(200);
        // player.filter.end();
        return;
      };
  },

  // toggleMute: function () { // player.toggleMute
  //   if (player.volume.value === 0 && player.predvol !== undefined) {
  //     this.click ('volumeon');
  //   } else {
  //     this.click ('mute');
  //   }
  // },

  click: function (t) {
    var self = this;
    var i = self.div[t] || $('img#' + t);
    i.mousedown ().click();
    setTimeout ( function () {
      i.mouseup ();
    }, 200 );
  },


  focusIndex: 0,

  focusElements: function () {
    return [ $('#tbody')
           , $('div#musicSlider a')
           , $('div#volumeSlider a')
           ];
  },

  focusUpdate: function () {
    this.focusElements ()[this.focusIndex].focus();
    if (this.focusIndex === 0) {
      $('tr.ui-selected')
        .first()
        .SELECT()
        .size()
        || $('tr.nP')
            .SELECT()
            .LASTSELECT();
    }
  },

  focusToggle: function () {
    this.focusIndex = (this.focusIndex + 1) % 3;
    this.focusUpdate ();
  },

  focusToggleReverse: function () {
    this.focusIndex = (this.focusIndex - 1 + this.focusElements().length) % 3;
    this.focusUpdate ();
  },

  fullScreen: false,

  setVideoSize: function (width, height) {
    this.div.video.style.width = width + 'px';
    this.div.video.style.marginLeft = (- width / 2) + 'px';
    this.div.video.style.height = height + 'px';
    this.div.video.style.marginTop = (- height / 2) + 'px';
  },

  fullScreenOn: function () {
    this.fullScreen = true;
    if (this.div.video.webkitRequestFullScreen) {
      this.div.video.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else {
      this.setVideoSize (window.outerWidth, window.outerHeight);
    }
  },

  fullScreenOff: function () {
    this.fullScreen = false;
    var width;
    if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else {
      this.setVideoSize (width = window.outerWidth * 0.6, width / 16 * 9);
    }
  },

  fullScreenToggle: function () {
    if (this.fullScreen) {
      this.fullScreenOff ();
    } else {
      this.fullScreenOn ();
    }
  },

  initFilter: function () {
    var self = this;
    this.div.filterword.keydown(function (e) { self.filterKeydown (e); });
  },

  filterStart: function () {
    var tags = [], trs = [], index = 0, selected = $('ui-selected');
    this.div.filter.fadeIn(200);
    var input = this.div.filterword.focus()[0];//.val('');
    input.selectionStart = 0;
    input.selectionEnd = input.value.length;
    $('tr', this.div.tbody).each(function (i, x) {
      tags[i] = ((function (x) {
        var a = [];
        for (i in x) {
          a.push(x[i])
        }
        return a;
      })(self.player.musics[$(x).attr('number')].tags)).join('__').toLowerCase();
    });
    this.div.matchnum.text('');
    this.filterTags = tags;
  },

  filterKeydown: function (e) {
    var self = this;
    setTimeout( function () {
      if (e.keyCode === 13) { self.filterBlink (); return; };
      if (e.keyCode === 27) { self.filterEnd (); return; };
      var s = (e.target.value).toLowerCase();
      var matched = [];
      var $trs = $('tr', self.div.tbody);
      $('tr.ui-selected', self.div.tbody).UNSELECT(true);
      if (!s) {
        self.div.matchnum.text(0 + '/' + $trs.length);
        return;
      }
      try {
      self.filterTags.forEach(function (t, i) {
        if (t.match(s) !== null) {
          matched.push(i);
        }
      });
      matched.forEach(function (n) {
        $trs.eq(n).SELECT(true);
      });
      self.div.matchnum.text(matched.length + '/' + $trs.length);
      var selected = $('tr.ui-selected');
      } catch (e){};
      //if (matched.length < 3) $trs.eq(matched[0]).SELECT().LASTSELECT();
    }, 20);
  },

  filterEnd: function () {
    this.div.filter.fadeOut(200);
    this.div.filterword.focusout ();
    // this.div.table.focusin ();
    this.focusUpdate ();
  },

  filterIndex: 0,
  filterBlink: function () {
    log ('filterBlink');
    if (isNaN(this.filterIndex)) {
      this.filterIndex = 0;
    };
    var selected = $('tr.ui-selected');
    var x = selected.eq(this.filterIndex).UNSELECT(true);
    setTimeout( function () { x.SELECT(false, true); }, 200);
    this.filterIndex = (++this.filterIndex) % selected.size();
  }

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
// Key maneger
// TODO: expansion of commands :: String

function Key (app, config) {
  var key;
  this.app = app;
  if (config) {
    for (key in config) {
      if (config.hasOwnProperty (key)) {
        if (config[key]) {
          var keyformatted = this.parse (key);
          this.set (keyformatted, config[key]);
          this.keys.push (keyformatted);
        }
      }
    }
  }
  this.keys = this.keys.sort ();
}

Key.prototype = {

  keys: [],

  callback: {},

  start: function () {
    var self = this;
    $(window).keypress (function (e) {
      switch (e.target.localName) {
        case 'input': case 'textarea': return;
        default:
          self.prevent (e);
      }
    });
    $(window).keydown (function (e) {
      log (e.target.localName);
      switch (e.target.localName) {
        case 'input': case 'textarea': return;
        default:
          self.keydown (e);
          if (self.callback [ self.convert (e) ]) {
            self.prevent (e);
          }
      }
    });
  },

  keydown: function (e) {
    if (!this.onlyMeta (e)) {
      this.keydownstr (this.convert (e), e);
    }
  },

  keydownstr: function (s, e) {
    var self = this;
    self.keyqueue.push (s);
    if (self.triggerTimer) {
      clearTimeout (self.triggerTimer);
      self.triggerTimer = undefined;
    }
    if (self.triggerInstantly ()) {
      self.trigger (e);
    } else {
      self.triggerTimer = setTimeout (function () {
        self.trigger (e);
      }, self.watingTime);
    }
  },

  triggerInstantly: function () {
    var key = this.keyqueue.join (' ');
    var index = this.keys.indexOf (key);
    if (index < 0) {
      return false;
    }
    if (this.keys[index + 1] !== undefined && this.keys[index + 1].indexOf (key) < 0) {
      return true;
    }
    return false;
  },

  onlyMeta: function (e) {
    switch (this.codes [e.keyCode]) {
      case 'alt': case 'ctrl': case 'shift':
        return true;
      default:
        return false;
    }
  },

  trigger: function (e) {
    var self = this;
    var f = self.callback [self.keyqueue.join (' ')];
    log (self.keyqueue.join (' '));
    if (f) {
      self.prevent (e);
      f (self.app, e);
    }
    self.keyqueue = [];
  },

  keyqueue: [],

  triggerTimer: undefined,

  watingTime: 480,

  prevent: function (e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  },

  convert: function (e) {
    var meta = this.meta (e);
    var key = (meta !== '' ||
               this.codes[e.keyCode] && this.codes[e.keyCode].length > 1)
            ? '<' + meta + this.keyCode (e.keyCode) + '>'
            :              this.keyCode (e.keyCode);
    return key;
  },

  meta: function (e) {
    return ((e.global ? 'g-' : '')
          + (e.ctrlKey || e.metaKey || this.lockconfig.ctrlKey ? 'c-' : '')
          + (e.shiftKey || this.lockconfig.shiftKey ? 's-' : '')
          + (e.altKey || this.lockconfig.altKey ? 'a-' : ''));
  },

  parse: function (key) {
    key = key.toLowerCase ().replace (/ /g, '');
    var arr = [];
    var onekey = [];
    while (key) {
      if (!(onekey = key.match (/^<[^<>]*>/))) {
        onekey = [key[0]];
      }
      arr = arr.concat (onekey);
      key = key.slice (onekey[0].length);
    }
    return arr.join (' ');
  },

  set: function (key, callback) {
    var self = this;
    if (typeof callback === 'function') {
      self.callback [key] = callback;
    } else if (typeof callback === 'string') {
      self.callback [key] = (function (env) {
        return function () {
          var keyseq = self.parse (callback).split (' ');
          for (var i = 0; i < keyseq.length; i++) {
            setTimeout ( (function (i) { return function () {
              self.keydownstr (keyseq [i]);
            };}) (i)
            , 10);
          }
        };
      }) (self.callback);
    }
  },

  lock: function (key) {
    if (this.lockconfig[key] !== undefined) {
    log ('lock' + key);
      this.lockconfig[key] = true;
    }
    return this;
  },

  lockAll: function () {
    for (var key in this.lockconfig) {
      if (this.lockconfig.hasOwnProperty (key)) {
        this.lockconfig[key] = true;
      }
    }
  },

  unlock: function (key) {
    if (this.lockconfig[key] !== undefined) {
      this.lockconfig[key] = false;
    }
    return this;
  },

  unlockAll: function () {
    for (var key in this.lockconfig) {
      if (this.lockconfig.hasOwnProperty (key)) {
        this.lockconfig[key] = false;
      }
    }
  },

  togglelock: function (key) {
    if (this.lockconfig[key] !== undefined) {
      this.lockconfig[key] = !this.lockconfig[key];
    }
    return this;
  },

  lockconfig: {
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false
  },

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
     91: 'ctrl',
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
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12'
  },

  keyCode: function (keyCode) {
    if (this.codes[keyCode]) {
      return this.codes[keyCode];
    }
    if (48 <= keyCode && keyCode <= 57) {
      return keyCode - 48;
    }
    if (65 <= keyCode && keyCode <= 90) {
      return String.fromCharCode(keyCode).toLowerCase();
    }
    if (96 <= keyCode && keyCode <= 105) {
      return keyCode - 96;
    }
    console.log ('unknown key: ' + keyCode);
  }

};


// commands
// TODO: arguments
var command = {

  /* operate player */
  PlayPause:          function (opt) { return function (app) { app.ui.click ('play'); }; },
  OpenFile:           function (opt) { return function (app) { app.ui.click ('open'); }; },
  NextMusic:          function (opt) { return function (app) { app.next (); }; },
  PreviousMusic:      function (opt) { return function (app) { app.prev (); }; },
  SeekForward:        function (opt) { return function (app) { app.seekBy (opt[0]); }; },
  SeekBackward:       function (opt) { return function (app) { app.seekBy (-opt[0]); }; },
  SeekPercent:        function (opt) { return function (app) { app.seekAt (opt[0]); }; },

  /* change setting */
  ToggleRepeat:       function (opt) { return function (app) { app.ui.click ('repeat'); }; },
  ToggleShuffle:      function (opt) { return function (app) { app.ui.click ('shuffle'); }; },

  /* volume */
  VolumeUp:           function (opt) { return function (app) { app.volumeup (); }; },
  VolumeDown:         function (opt) { return function (app) { app.volumedown (); }; },
  VolumeMute:         function (opt) { return function (app) { app.ui.click ('mute'); }; },
  VolumeResume:       function (opt) { return function (app) { app.ui.click ('volumeon'); }; },
  VolumeToggleMute:   function (opt) { return function (app) { app.ui.click (app.ismute () ? 'volumeon' : 'mute'); }; },


  /* select, extend */
  SelectDown:         function (opt) { return function (app) { app.ui.selectDown (); }; },
  ExtendDown:         function (opt) { return function (app) { app.ui.extendDown (); }; },
  SelectUp:           function (opt) { return function (app) { app.ui.selectUp (); }; },
  ExtendUp:           function (opt) { return function (app) { app.ui.extendUp (); }; },
  SelectHome:         function (opt) { return function (app) { app.ui.selectHome (); }; },
  ExtendToHome:       function (opt) { return function (app) { app.ui.extendToHome (); }; },
  SelectEnd:          function (opt) { return function (app) { app.ui.selectEnd (); }; },
  ExtendToEnd:        function (opt) { return function (app) { app.ui.extendToEnd (); }; },
  SelectAll:          function (opt) { return function (app) { app.ui.selectAll (); }; },
  UnselectAll:        function (opt) { return function (app) { app.ui.unselectAll (); }; },
  PageDown:           function (opt) { return function (app) { app.ui.pageDown (); }; },
  ExtendPageDown:     function (opt) { return function (app) { app.ui.extendPageDown (); }; },
  PageUp:             function (opt) { return function (app) { app.ui.pageUp (); }; },
  ExtendPageUp:       function (opt) { return function (app) { app.ui.extendPageUp (); }; },
  DeleteSelected:     function (opt) { return function (app) { app.ui.deleteSelected (); }; },
  ShiftLock:          function (opt) { return function (app) { app.key.lock ('shiftKey'); }; },
  CtrlLock:           function (opt) { return function (app) { app.key.lock ('ctrlKey'); }; },
  AltLock:            function (opt) { return function (app) { app.key.lock ('altKey'); }; },
  ShiftUnlock:        function (opt) { return function (app) { app.key.unlock ('shiftKey'); }; },
  CtrlUnlock:         function (opt) { return function (app) { app.key.unlock ('ctrlKey'); }; },
  AltUnlock:          function (opt) { return function (app) { app.key.unlock ('altKey'); }; },
  ShiftToggleLock:    function (opt) { return function (app) { app.key.togglelock ('shiftKey'); }; },
  CtrlToggleLock:     function (opt) { return function (app) { app.key.togglelock ('ctrlKey'); }; },
  AltToggleLock:      function (opt) { return function (app) { app.key.togglelock ('altKey'); }; },

  /* vim setting */
  VisualModeOn:       function (opt) { return function (app) { app.vim.visual.at (1); }; },
  VisualModeoff:      function (opt) { return function (app) { app.vim.visual.at (0); }; },

  /* toggle popup menu */
  ToggleHelp:         function (opt) { return function (app) { app.ui.toggleHelp (); }; },
  ToggleAbout:        function (opt) { return function (app) { app.ui.toggleAbout (); }; },
  ToggleConfig:       function (opt) { return function (app) { app.ui.toggleConfig (); }; },
  DefaultEnter:       function (opt) { return function (app) { app.ui.defaultEnter (); }; },
  ViewInformation:    function (opt) { return function (app) { app.ui.viewInformation (); }; },
  Escape:             function (opt) { return function (app) { app.ui.escape (); }; },
  FocusToggle:        function (opt) { return function (app) { app.ui.focusToggle (); }; },
  FocusToggleReverse: function (opt) { return function (app) { app.ui.focusToggleReverse (); }; },
  FullScreenOn:       function (opt) { return function (app) { app.ui.fullScreenOn (); }; },
  FullScreenOff:      function (opt) { return function (app) { app.ui.fullScreenOff (); }; },
  FullScreenToggle:   function (opt) { return function (app) { app.ui.fullScreenToggle (); }; },

  /* filter interface */
  FilterStart:        function (opt) { return function (app) { app.ui.filterStart (); }; },

  /* Special commands */
  Nop:                function (opt) { return function (app) {}; },
  Define:             function (opt) { return function (app) {}; } // TODO

};

// key configuration for player

var keyconfig = {

  /* operate player */
  '<space>':     command.PlayPause (),
  '<c-space>':   '<space>',
  '<c-right>':   command.NextMusic (),
  '<c-left>':    command.PreviousMusic (),
  '<c-o>':       command.OpenFile (),
  ':o':          '<c-o>', // vim
  ':e':          '<c-o>', // vim
  '<right>':     command.SeekForward ([10]),
  '<s-right>':   command.SeekForward ([30]),
  'l':           '<right>', // vim
  'w':           '<s-right>', // vim
  '<left>':      command.SeekBackward ([10]),
  '<s-left>':    command.SeekBackward ([30]),
  'h':           '<left>', // vim
  'b':           '<s-left>', // vim
  '0':           command.SeekPercent ([0]), // vim
  '<s-4>':       command.SeekPercent ([100]), // vim

  /* change sett ing */
  '<c-r>':       command.ToggleRepeat (),
  '<c-u>':       command.ToggleShuffle (),

  /* volume */
  '<c-up>':      command.VolumeUp (),
  '<c-down>':    command.VolumeDown (),
  '<c-a-down>':  command.VolumeToggleMute (),
  '9':           command.VolumeDown (), // mplayer
  // '0':        command.VolumeUp (), // mplayer

  /* select, exp and */
  '<down>':      command.SelectDown (),
  'j':           '<down>', // vim
  '<s-down>':    command.ExtendDown (),
  '<s-j>':       '<s-down>', // vim
  '<up>':        command.SelectUp (),
  'k':           '<up>', // vim
  '<s-up>':      command.ExtendUp (),
  '<s-k>':       '<s-up>', // vim
  '<home>':      command.SelectHome (),
  'gg':          '<home>', // vim
  '<s-home>':    command.ExtendToHome (),
  '<end>':       command.SelectEnd (),
  '<s-g>':       '<end>', // vim
  '<s-end>':     command.ExtendToEnd (),
  '<c-a>':       command.SelectAll (),
  '<c-s-a>':     command.UnselectAll (),
  '<pgdn>':      command.PageDown (),
  // '<c-f>':       '<pgdn>', // vim
  '<s-pgdn>':    command.ExtendPageDown (),
  '<pdup>':      command.PageUp (),
  '<c-b>':       '<pgup>', // vim
  '<s-pdup>':    command.ExtendPageUp (),
  // 'v':           command.ShiftLock (), // vim // TODO

  /* toggle popu p menu, ui */
  '<s-/>':       command.ToggleHelp (),
  '<f1>':        command.ToggleAbout (),
  '[':           '<f1>',
  '<c-,>':       command.ToggleConfig (),
  '<delete>':    command.DeleteSelected (),
  '<backspace>': '<delete>',
  'd':           '<delete>', // vim
  '<esc>':       command.Escape (),
  '<s-esc>':     '<esc>',
  '<c-[>':       '<esc>', // vim
  '<c-s-[>':     '<esc>', // vim
  '<enter>':     command.DefaultEnter (),
  '<a-enter>':   command.ViewInformation (),
  '<tab>':       command.FocusToggle (),
  '<s-tab>':     command.FocusToggleReverse (),
  'f':           command.FullScreenToggle (),
  '<c-s-f>':     command.FullScreenToggle (),

  /* filter interface */
  '<c-f>':       command.FilterStart (),
  '/':           '<c-f>', // vim

  /* special command */
  '<nop>':       command.Nop ()

};


// Main player
//   !!!!!実装に妥協しない!!!!!!
//    使いやすく  読みやすく
//
// 優先
// TODO: 曲を<delete>で消した時にorderから消えてない
// TODO: keyconfigを各自で設定できるように
// TODO: シャッフル, リピート がいまいち
// TODO: ソート
// TODO: album art from id3 tag https://github.com/aadsm/JavaScript-ID3-Reader
// TODO: menu for right click http://www.trendskitchens.co.nz/jquery/contextmenu/ http://phpjavascriptroom.com/?t=ajax&p=jquery_plugin_contextmenu
// TODO: tableクリックでslideからのfocus out
//
// TODO: 読めないタグ
// TODO: vim, visual mode
// TODO: キーだけでファイルの入れ替え
// TODO: ファイル順入れ替えた時にorder更新
// TODO: C-zで削除キャンセルなど
// TODO: fixed first row of table
// TODO: Enterでplayした時に, orderをどうするか
// TODO: フルスクリーン時のUIについて. volumeとかどうする...
// TODO: 音楽のフルスクリーン時のインターフェース, アルバムアートなど
// TODO: F1, delがmacで効かない
// TODO: ui.jsのaddfile高速化
// TODO: id3タグの読み込みをUArrayってやつで高速化
// TODO: title="..."にゴミが入る ? 

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
  self.shuffle = new Enumcycle ( ['false', 'true']
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
                return vol !== undefined ? vol : 128;  // vol can be 0
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

  version: '2.0',

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
    audio: { regexp: /audio\/(mp3|wav|ogg|m4a|x-matroska)/
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
      log ('filetype: ' + file.type);
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
        , 10 * index);
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
    this.prevol = this.volume.value;
    this.volume.setToMin ();
  },

  resume: function () {
    this.volume.at (this.prevol);
    delete this.prevol;
  },

  togglemute: function () {
    if (this.ismute ()) {
      this.resume ();
    } else {
      this.mute ();
    }
  },

  ismute: function () {
    return this.volume.value === 0 && this.prevol !== undefined;
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

  order: new Enumdinamic ([], null, function (order) {}),

  repeat: new Enumcycle (['false', 'true', 'one']),

  shuffle: new Enumcycle (['false', 'true']),

};


Player.prototype.vim = {
  visual: new Enumcycle ([false, true], false, function (visual) {
    // TODO
  }),
};

var player = new Player ();
window.onload = function () {
  player.start ();
};



})();
/*jslint devel: true, browser: true, continue: true, sloppy: true, vars: true, white: true, passfail: false, plusplus: true, maxerr: 50, indent: 2 */
