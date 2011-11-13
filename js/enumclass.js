// Enum data class

function Enumclass (array) {
  this.array = array;
  this.init ();
}

Enumclass.prototype = {

  array: [],

  length: undefined,

  head: undefined,

  last: undefined,

  succ: function (x) {
    return this.toEnum (+ 1 + this.fromEnum (x));
  },

  pred: function (x) {
    return this.toEnum (- 1 + this.fromEnum (x));
  },

  toEnum: function (i) {
    if (0 <= i && i < this.length) {
      return this.array[i];
    } else {
      return undefined;
    }
  },

  fromEnum: function (x) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this.array[i] === x) return i;
    }
    return undefined;
  },

  enumFrom: function (x) {
    return this.enumFromTo (x, this.last);
  },

  enumFromThen: function (x, y) {
    var i = this.fromEnum (x);
    var j = this.fromEnum (y);
    var ans = [];
    for (var k = i; 0 <= k && k < this.length; k += (j - i)) {
      ans = ans.concat (this.array[k]);
    }
    return ans;
  },

  enumFromTo: function (x, y) {
    return this.enumFromThenTo (x, this.succ (x), y);
  },

  enumFromThenTo: function (x, y, z) {
    var i = this.fromEnum (x);
    var j = this.fromEnum (y);
    var k = this.fromEnum (z);
    var d = j - i;
    var ans = [];
    if (0 === d) {
      ans = ans.concat (this.array[i]);
    } else if (0 < d) {
      for (var l = i; l <= k && l < this.length; l += d) {
        ans = ans.concat (this.array[l]);
      }
    } else {
      for (var l = i; l >= k && l >= 0; l += d) {
        ans = ans.concat (this.array[l]);
      }
    }
    return ans;
  },

  init: function () {
    this.length = this.array.length;
    this.head = this.array[0];
    this.last = this.array[this.array.length - 1];
  },

  concat: function (arr) {
    this.array = this.array.concat (arr);
    this.init ();
  },

  splice: function (start, count) {
    this.array.splice (start, count);
    this.init ();
  },

};

/*
var o = new Enumclass ([1,2,3,4,5,4,3,2,1])
console.dir(o)
console.dir (o.toEnum (5))
console.dir (o.fromEnum (5))
o.concat ([5,4,3,2])
console.dir (o)
o.splice (5,1);
console.dir (o)
*/


