;
// Enum data

function Enum (array) {
  this.array = array;
}

Enum.prototype = {

  succ: function (x) {
    for (var i = 0; i < this.array.length - 1; i++) {
      if (this.array[i] === x) return this.array[i + 1];;
    };
    return undefined;
  },

  pred: function (x) {
    for (var i = 1; i < this.array.length; i++) {
      if (this.array[i] === x) return this.array[i - 1];;
    };
    return undefined;
  },

  toEnum: function (i) {
    if (0 <= i && i < this.array.length)
      return this.array[i];
    else
      return undefined;
  },

  fromEnum: function (x) {
    for (var i = 0; i < this.array.length; i++) {
      if (this.array[i] === x) return i;
    };
    return undefined;
  },

  enumFrom: function (x) {
    var i = this.fromEnum (x);
    return this.array.slice (i);
  },

  enumFromThen: function (x, y) {
    var i = this.fromEnum (x);
    var j = this.fromEnum (y);
    var ans = [];
    for (var k = i; 0 <= k && k < this.array.length; k += (j - i))
      ans = ans.concat (this.array[k]);
    return ans;
  },

  enumFromTo: function (x, y) {
    var i = this.fromEnum (x);
    var j = this.fromEnum (y);
    var ans = [];
    for (var k = i - 1; k++ !== j && k < this.array.length; )
      ans = ans.concat (this.array[k]);
    return ans;
  },

  enumFromThenTo: function (x, y, z) {
    var i = this.fromEnum (x);
    var j = this.fromEnum (y);
    var k = this.fromEnum (z);
    var ans = [];
    for (var l = i - (j - i); (l += (j - i)) !== k && k < this.array.length && 0 <= k; )
      ans = ans.concat (this.array[l]);
    ans = ans.concat (this.array[l]);
    return ans;
  },

};



