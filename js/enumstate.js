;
// Enumerable state

function Enumstate (array, initializer, callback) {
  this.array = array;
  this._enum = this.enum = new Enum (array);
  this.at (0);
  this.length = array.length;
  this.initializer = initializer;
  this.callback = callback;
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
    this.value = this.enum.toEnum (i);
    this.history = this.history.concat (i);
    return this.value;
  },

  next: function (j) {
    if (j === undefined) j = 1
    this.index += j;
    this.value = this.enum.toEnum (this.index);
    if (this.value === undefined) {
      if (this.shuffle) {
        this.enum = new Enum (this.enum.array.shuffle ());
      }
      this.at (0);
    } else {
      this.at (this.index);
    }
    // console.log(this.history);
    this.callback (this.value);
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
    if (this.shuffle)
      return this.shuffleOff ();
    else
      return this.shuffleOn ();
  },

  init: function (x) {
    if (x !== undefined)
      this.at (this.enum.fromEnum (x));
    else if (typeof this.initializer === 'function')
      this.at (this.enum.fromEnum (this.initializer ()));
    else
      this.at (this.enum.fromEnum (this.initializer));
    this.callback (this.value);
  },

};


