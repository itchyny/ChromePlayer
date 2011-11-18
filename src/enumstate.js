// Enumerable (ordered) state

function Enumstate (array, initializer, callback) {
  this.array = array;
  this._enum = this.enum = new Enum (array);
  this.length = array.length;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
}

Enumstate.prototype = {

  index: 0,

  value: undefined,

  history: [],

  shuffle: false,

  repeat: false,

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
        this.at (0);
      } else {
        return undefined;
      }
    } else {
      this.at (this.index);
    }
    return this.value;
  },

  pred: function (j) {
    return this.next (-1);
  },

  shuffleOn: function () {
    this.shuffle = true;
    this._enum = this.enum;
    this.enum = new Enum (this.enum.array.shuffle ());
    return this;
  },

  shuffleOff: function () {
    this.shuffle = false;
    this.enum = this._enum;
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
  },

  repeatOff: function () {
    this.repeat = false;
  },

  repeatToggle: function () {
    if (this.repeat) {
      return this.repeatOff ();
    } else {
      return this.repeatOn ();
    }
  },

  init: function (x) {
    if (x !== undefined) {
      this.at (this.enum.fromEnum (x));
    } else if (typeof this.initializer === 'function') {
      console.log(this.initializer());
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


