// Enumerable state

function Enumstate (array, initializer, callback) {
  this.array = array;
  this._enums = this.enums = new Enums (array);
  this.length = array.length;
  this.initializer = initializer;
  this.callback = callback;
  this.at (0);
}

Enumstate.prototype = {

  index: undefined,

  value: undefined,

  history: [],

  shuffle: false,

  length: 0,

  at: function (i) {
    if (i === undefined) return this.value;
    this.index = i;
    this.value = this.enums.toEnum (i);
    this.history = this.history.concat (i);
    return this.value;
  },

  next: function (j) {
    if (j === undefined) j = 1
    this.index += j;
    this.value = this.enums.toEnum (this.index);
    if (this.value === undefined) {
      if (this.shuffle) {
        this.enums = new Enums (this.enums.array.shuffle ());
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
    this._enums = this.enums;
    this.enums = new Enums (this.enums.array.shuffle ());
    return this;
  },

  shuffleOff: function () {
    this.shuffle = false;
    this.enums = this._enums;
    return this;
  },

  shuffleToggle: function () {
    if (this.shuffle)
      return this.shuffleOff ();
    else
      return this.shuffleOn ();
  },

  init: function (x) {
    if (x !== undefined)
      this.at (this.enums.fromEnum (x));
    else if (typeof this.initializer === 'function')
      this.at (this.enums.fromEnum (this.initializer ()));
    else
      this.at (this.enums.fromEnum (this.initializer));
    this.callback (this.value);
  },

};


