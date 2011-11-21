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

  fromEnum: function (value) {
    /*! return value; return undefined if value is not found in array */
    var index = this.enumclass.fromEnum (value);
    if (index === undefined) {
      return undefined;
    }
    this.at (index);
  },

  at: function (index) {
    /*! return value; return undefined if index if out of array */
    if (index === undefined || isNaN (index)) {
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

  next: function (j) {
    /*! return undefined if out of array after moving */
    if (j === undefined || isNaN (j)) {
      j = 1;
    }
    return this.at (this.index + j);
  },

  prev: function (j) {
    /*! return undefined if out of array after backward */
    if (j === undefined || isNaN (j)) {
      j = -1;
    }
    return this.next (j);
  },

  init: function (value) {
    /*! return value; return undefined if value is not found in array */
    if (value === undefined) {
      if (typeof this.initializer === 'function') {
        value = this.initializer ();
      } else {
        value = this.initializer;
      }
    }
    return this.fromEnum (value);
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





