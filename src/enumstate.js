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





