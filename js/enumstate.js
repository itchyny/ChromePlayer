// Enumerable (ordered) state

function Enumstate (array, initializer, callback) {
  this.array = array;
  this._enumclass = this.enumclass = new Enumclass (array);
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
        this.enumclass = new enumclass (this.enumclass.array.shuffle ());
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
    this.enumclass = new enumclass (this.enumclass.array.shuffle ());
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


