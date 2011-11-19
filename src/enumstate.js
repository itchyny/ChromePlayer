// Enumerable (ordered) state

function Enumstate (array, initializer, callback) {
  this.array = array;
  this._enum = this.enumclass = new Enum (array);
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
    this.value = this.enumclass.toEnum (i);
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
      this.value = this.enumclass.toEnum (this.index);
      if (this.value === undefined) {
        if (this.shuffle) {
          this.enumclass = new Enum (this.enumclass.array.shuffle ());
        }
        if (this.repeat) {
          this.index = 0;
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
    this._enum = this.enumclass;
    this.enumclass = new Enum (this.enumclass.array.shuffle ());
    this.index = this.enumclass.fromEnum (this.value);
    return this;
  },

  shuffleOff: function () {
    this.shuffle = false;
    this.enumclass = this._enum;
    this.index = this.enumclass.fromEnum (this.value);
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
      this.at (this.enumclass.fromEnum (x));
    } else if (typeof this.initializer === 'function') {
      this.at (this.enumclass.fromEnum (this.initializer ()));
    } else {
      this.at (this.enumclass.fromEnum (this.initializer));
    }
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
  }

};


