// Enum dinamic
//


// requirements
if (typeof window === 'undefined') {
  require ('./prelude');
  var Enum = require('./enum').Enum;
  var Enumlinear = require('./enumlinear').Enumlinear;
  var Enumcycle = require('./enumcycle').Enumcycle;
}



function Enumdinamic (array, initializer, callback) {
  var self = this;
  callback = callback || function (x) { };
  this.enumlinear = new Enumlinear
                  ( array
                  , initializer
                  , (function (f) {
                      return function (value) {
                        self.index = self.enumlinear.index;
                        self.value = value;
                        self.history = self.history.concat (self.value);
                        self.array = self.enumlinear.array;
                        f (self.value);
                      };
                  } (callback)));
  for (var x in this.enumlinear) {
    if (this.enumlinear.hasOwnProperty (x)) {
      this[x] = this.enumlinear[x]; 
    }
  }
  this.repeat = new Enumcycle ( ['false', 'true', 'one'], 'false'
              , function (repeat) {
              });
  this.shuffle = new Enumcycle ( ['false', 'true']
               , 'false'
               , function (shuffle) {
                switch (shuffle) {
                  case 'true':
                    if (!self.orderedarray) {
                      self.orderedarray = self.enumclass.array;
                    }
                    self.changeArray (self.orderedarray.shuffle ());
                    self.at (self.enumclass.fromEnum (self.value));
                    break;
                  default:
                    self.changeArray (self.orderedarray);
                    delete self.orderedarray;
                    self.at (self.enumclass.fromEnum (self.value));
                }
               })
}

Enumdinamic.prototype = new Enumlinear ();
Enumdinamic.prototype.at = function (index) {
  if (this.nonvalidIndex (index)) {
    index = this.index;
  }
  return this.enumlinear.at (index);
};
Enumdinamic.prototype.next = function (j) {
  /*! when goes out of the array:
   *                |                               repeat                            |
   *                |   false                        |   true     |    one            |
   * ---------------+--------------------------------+------------+-------------------+
   *         false  | undefined                      |     %      | always same index |
   * shuffle -------+--------------------------------+------------+-------------------+
   *          true  | shuffle array again, undefined | shuffle, % | always same index |
   * ---------------+--------------------------------+------------+-------------------+
   */
  if (j === undefined || isNaN (j)) {
    j = 1;
  }
  var index = this.index + j;
  switch (this.repeat.value) {
    case 'one': index = this.index; break;
    case 'true':
      var value = this.enumclass.toEnum (index);
      if (value === undefined) {
        switch (this.shuffle.value) {
          case 'true':
            this.enumclass = new Enum (this.enumclass.array.shuffle ());
          default:
            var length = this.array.length;
            index = ((index % length) + length) % length;
        }
      }
      break;
    default:
      var value = this.enumclass.toEnum (index);
      if (value === undefined) {
        switch (this.shuffle.value) {
          case 'true':
            this.enumclass = new Enum (this.enumclass.array.shuffle ());
            var length = this.array.length;
            index = ((index % length) + length) % length;
          default:
            return undefined;
        }
      }
  }
  this.at (index);
  return this.value;
};
Enumdinamic.prototype.changeArray = function (array) {
  this.enumlinear.changeArray (array);
  this.array = this.enumlinear.array;
  this.enumclass = this.enumlinear.enumclass;
};

Enumdinamic.prototype.setRepeat = function (repeat) { this.repeat.atfromEnum (repeat); };
Enumdinamic.prototype.repeatOff = function (repeat) { this.repeat.atfromEnum ('false'); };
Enumdinamic.prototype.repeatOn = function (repeat) { this.repeat.atfromEnum ('true'); };
Enumdinamic.prototype.repeatOne = function (repeat) { this.repeat.atfromEnum ('one'); };
Enumdinamic.prototype.repeatToggle = function (repeat) { this.repeat.next (); };
Enumdinamic.prototype.repeatToggleOnOff = function (repeat) { this.repeat.atfromEnum (this.repeat.value === 'false' ? 'true' : 'false'); };

Enumdinamic.prototype.setShuffle = function (shuffle) { this.shuffle.atfromEnum (shuffle); };
Enumdinamic.prototype.shuffleOff = function (shuffle) { this.shuffle.atfromEnum ('false'); };
Enumdinamic.prototype.shuffleOn = function (shuffle) { this.shuffle.atfromEnum ('true'); };
Enumdinamic.prototype.shuffleToggle = function (shuffle) { this.shuffle.next (); };
Enumdinamic.prototype.shuffleToggleOnOff = function (shuffle) { this.shuffle.atfromEnum (this.shuffle.value === 'false' ? 'true' : 'false'); };






// export Enumdinamic
this.Enumdinamic = Enumdinamic;













