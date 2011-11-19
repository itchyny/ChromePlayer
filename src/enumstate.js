// Enumerable (ordered) state

function Enumstate (array, initializer, callback) {
  this.array = array;
  this._enum = this.enum = new Enum (array);
  this.length = array.length;
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

  shuffle: false,

  repeat: false,

  repeatone: false,

  length: 0,

  at: function (i) {
    if (i === undefined || isNaN (i)) {
      i = this.index;
    }
    this.index = i;
    this.value = this.enum.toEnum (i);
    this.history = this.history.concat (i);
    this.callback (this.value);
    return this.value;
  },

  next: function (j) {
    if (this.repeatone) {
      this.index = this.index;
    } else {
      if (j === undefined || isNaN (j)) {
        j = 1;
      }
      this.index += j;
      this.value = this.enum.toEnum (this.index);
      if (this.value === undefined) {
        if (this.shuffle) {
          this.enum = new Enum (this.enum.array.shuffle ());
        }
        if (this.repeat) {
          this.index = 0;
          this.at (0);
        } else {
          return undefined;
        }
      }
    }
    this.at (this.index);
    return this.value;
  },

  pred: function (j) {
    return this.next (-1);
  },

  shuffleOn: function () {
    this.shuffle = true;
    this._enum = this.enum;
    this.enum = new Enum (this.enum.array.shuffle ());
    this.index = this.enum.fromEnum (this.value);
    return this;
  },

  shuffleOff: function () {
    this.shuffle = false;
    this.enum = this._enum;
    this.index = this.enum.fromEnum (this.value);
    return this;
  },

  shuffleToggle: function () {
    if (this.shuffle) {
      return this.shuffleOff ();
    } else {
      return this.shuffleOn ();
    }
  },

  repeatOn: function () {
    this.repeat = true;
    this.repeatone = false;
  },

  repeatOff: function () {
    this.repeat = false;
    this.repeatone = false;
  },

  repeatToggle: function () {
    if (this.repeat) {
      return this.repeatOff ();
    } else {
      return this.repeatOn ();
    }
  },

  repeatOne: function () {
    this.repeatone = true;
  },

  init: function (x) {
    if (x !== undefined) {
      this.at (this.enum.fromEnum (x));
    } else if (typeof this.initializer === 'function') {
      this.at (this.enum.fromEnum (this.initializer ()));
    } else {
      this.at (this.enum.fromEnum (this.initializer));
    }
  },

  concat: function (arr) {
    this.enum.concat (arr);
  },

  splice: function (start, count) {
    this.enum.splice (start, count);
  },

  remove: function (value) {
    var index = this.enum.fromEnum (value);
    this.splice (index, 1);
  },

};


