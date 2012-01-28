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
logfn ('Enumlinear.prototype.head');
    return this.at (0);
  },

  last: function () {
logfn ('Enumlinear.prototype.last');
    return this.at (this.enumclass.array.length - 1);
  },

  nonvalidIndex: function (index) {
    return index === undefined || isNaN (index) || typeof index !== 'number';
  },

  at: function (index) {
logfn ('Enumlinear.prototype.at');
    /*! return value; return undefined if index if out of array */
    if (this.nonvalidIndex (index)) {
      index = this.index;
    }
    var value = this.enumclass.toEnum (index);
    if (value === undefined || this.array.length === 0) {
      return undefined;
    }
    this.value = value;
    this.index = index;
    this.array = this.enumclass.array;
    this.history = this.history.concat (this.value);
    this.callback (this.value, this.app);
    return this.value;
  },

  atfromEnum: function (value) {
logfn ('Enumlinear.prototype.atfromEnum');
    /*! return value; return undefined if value is not found in array */
    var index = this.enumclass.fromEnum (value);
    if (index === undefined) {
      return undefined;
    }
    return this.at (index);
  },

  next: function (j) {
logfn ('Enumlinear.prototype.next');
    /*! return undefined if out of array after moving */
    if (this.nonvalidIndex (j)) {
      j = 1;
    }
    return this.at (this.index + j);
  },

  prev: function (j) {
logfn ('Enumlinear.prototype.prev');
    /*! return undefined if out of array after backward */
    if (this.nonvalidIndex (j)) {
      j = -1;
    }
    return this.next (j);
  },

  init: function (app) {
logfn ('Enumlinear.prototype.init');
    this.app = app;
    /*! return value; return undefined if value is not found in array */
    var value;
    if (typeof this.initializer === 'function') {
      try {
        value = this.initializer ();
      } catch (e) {
        value = this.array[0];
      }
    } else {
      value = this.initializer;
    }
    value = this.atfromEnum (value);
    // If initialization fails, begin at head of the array, with no error.
    if (value === undefined) {
      return this.at (0);
    }
  },

  concat: function (arr) {
logfn ('Enumlinear.prototype.concat');
    return this.changeArray (this.enumclass.array.concat (arr));
  },

  splice: function (start, count) {
logfn ('Enumlinear.prototype.splice');
    var array = this.enumclass.array;
    array.splice (start, count);
    return this.changeArray (array);
  },

  remove: function (value) {
logfn ('Enumlinear.prototype.remove');
    return this.splice (this.enumclass.fromEnum (value), 1);
  },

  changeArray: function (array) {
logfn ('Enumlinear.prototype.changeArray');
    array = array.drop(undefined);
    this.enumclass = new Enum (array);
    this.array = this.enumclass.array;
    var index = this.enumclass.fromEnum (this.value) || 0;
    this.at (index);
    return this;
  }

};




if (typeof exports !== 'undefined') {
  exports.Enumlinear = Enumlinear;
}





