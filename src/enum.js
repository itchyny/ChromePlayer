// Enum data class
//
// An instance of Enum is just a data type,
// which has the nature of Enum.
//

// Enum Constructor
function Enum (array) {
  this.array = array;
}

Enum.prototype = {

  array: [], //:: [A]

  succ: function (x) {
    return this.toEnum (+ 1 + this.fromEnum (x));
  },

  pred: function (x) {
    return this.toEnum (- 1 + this.fromEnum (x));
  },

  toEnum: function (i) {
    /*! return undefined if index is out of array */
    if (0 <= i && i < this.array.length) {
      return this.array[i];
    } else {
      return undefined;
    }
  },

  fromEnum: function (x) {
    /*! return undefined if value is not found in array */
    for (var i = 0, l = this.array.length; i < l; i++) {
      if (this.array[i] === x) return i;
    }
    return undefined;
  },

  enumFrom: function (x) {
    return this.enumFromTo (x, this.array[this.array.length - 1]);
  },

  enumFromThen: function (x, y) {
    var i = this.fromEnum (x);
    var j = this.fromEnum (y);
    var ans = [];
    for (var k = i; 0 <= k && k < this.array.length; k += (j - i)) {
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
      for (var l = i; l <= k && l < this.array.length; l += d) {
        ans = ans.concat (this.array[l]);
      }
    } else {
      for (var l = i; l >= k && l >= 0; l += d) {
        ans = ans.concat (this.array[l]);
      }
    }
    return ans;
  }

};

// export Enum 
this.Enum = Enum;





