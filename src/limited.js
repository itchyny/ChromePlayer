// Limited data class
//
// Limited can be used for changing number,
// which has minBound and maxBound.
//

function Limited (min, max, step, initializer, callback) {
  if (min > max) {
    min = [max, max = min][0]; // swap
  }
  this.min = min;
  this.max = max;
  this.step = step;
  this.initializer = initializer;
  this.callback = callback || function (x) { };
}

Limited.prototype = {

  value: undefined,

  at: function (x) {
    if (x === undefined || isNaN (x)) {
      if (this.value === undefined) {
        this.value = (this.min + this.max) / 2;
      } else {
        this.value = this.assert (this.value);
      }
    } else {
      this.value = this.assert (x);
    }
    this.callback (this.value);
    return this.value;
  },

  assert: function (x) {
    return Math.min (Math.max (x, this.min), this.max);
  },

  increase: function (x) {
    if (x === undefined || isNaN (x)) {
      x = this.step;
    }
    return this.at (this.value + x);
  },

  decrease: function (x) {
    if (x === undefined || isNaN (x)) {
      x = this.step;
    }
    return this.increase (-x);
  },

  init: function (x) {
    if (x !== undefined) {
      this.at (x);
    } else if (typeof this.initializer === 'function') {
      this.at (this.initializer ());
    } else {
      this.at (this.initializer);
    }
  },

  setToMin: function () {
    return this.at (this.min);
  },

  setToMax: function () {
    return this.at (this.max);
  }

};




if (typeof exports !== 'undefined') {
  exports.Limited = Limited;
}






