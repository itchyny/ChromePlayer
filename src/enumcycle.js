// Enum cycle, whose bound is connected


// requirements
if (typeof window === 'undefined') {
  var Enum = require('./enum').Enum;
  var Enumlinear = require('./enumlinear').Enumlinear;
}

// Enumcycle provides exactly same functions as Enumlinear does.
// What is different from Enumlinear is, that
// prototype.(at|next|prev) never returns undefined.
// Only function which can fail is prototype.init (when
// initializer was not found in the array.)
function Enumcycle (array, initializer, callback) {
  this.enumclass = new Enum (array);
  this.array = this.enumclass.array;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
  callback = callback || function (x) { };
  var self = this;
  this.enumlinear = new Enumlinear
                  ( array
                  , initializer
                  , (function (f) {
                      return function (value) {
                        self.index = self.enumlinear.index;
                        self.value = value;
                        self.history = self.history.concat (self.value);
                        self.array = self.enumlinear.array;
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






