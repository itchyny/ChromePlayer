// Enum cycle


// requirements
if (typeof window === 'undefined') {
  var Enumlinear = require('./enumlinear').Enumlinear;
}

function Enumcycle (array, initializer, callback) {
  var self = this;
  self.callback = callback || function (x) { };
  this.enumlinear = new Enumlinear (array, initializer
  , function (value) {
      self.value = value;
      self.index = self.enumlinear.index;
  });
  for (var x in this.enumlinear) {
    if (this.enumlinear.hasOwnProperty (x)) {
      this[x] = this.enumlinear[x]; 
    }
  }
}
Enumcycle.prototype = new Enumlinear ();
Enumcycle.prototype.at = function (index) {
  if (index === undefined || isNaN (index)) {
    index = this.index;
  }
  var length = this.array.length;
  index = ((index % length) + length) % length;
  return this.enumlinear.at (index);
};
Enumcycle.prototype.changeArray = function (array) {
  this.enumlinear.changeArray (array);
  this.array = this.enumlinear.array;
};


var x = new Enumcycle ([1,3,5,7,9,11,13],0);
console.log(x)
x.concat ([15,17,19,21]);
for (var i=0; i < 20; i++) {
  console.log(x.next ());
};
console.log(x)





// export Enumcycle
this.Enumcycle = Enumcycle;

