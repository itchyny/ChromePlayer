;
// Order

function Order (arr) {
  this.arr = arr;
}

Order.prototype = {

  index: 0,

  historyindex: 0,

  shuffleflg: false,

  history: [],

  reset: function () {
    this.index = 0;
    this.arr = this.arr.filter (function (x) { return x !== undefined; });
    if (this.shuffleflg)
      this.shuffle ();
  },

  set: function (arr) {
  },

  shuffleOn: function () {
    this.shuffleflg = true;
  },

  shuffleOff: function () {
    this.shuffleflg = false;
  },

  setshuffle: function (shuffle) {
    this.shuffleflg = shuffle !== "false" && shuffle;
  },

  sort: function () {
    this.arr = this.arr.sort (function (x, y) { return x - y; });
  },

  reverse: function () {
    this.arr = this.arr.reverse ();
  },

  shuffle: function () {
    this.arr.shuffle ();
  },

  next: function () {
    var ans = undefined;
    if (this.history.length === this.historyindex) {
      for (var i = this.index; i < this.arr.length; ++i) {
        ans = this.arr[i];
        if (ans !== undefined) break;
      }
      if (undefined !== ans) {
        this.history.concat (ans);
        this.historyindex = this.historyindex + 1;
      } else {
        this.reset ();
        if (!this.arr[this.index]) ans = this.index;
        this.history.concat (ans);
        this.historyindex = this.historyindex + 1;
      }
    } else {
      ans = this.history[this.historyindex];
      this.historyindex = this.historyindex + 1;
    }
    return ans;
  },

  append: function (i) {
    this.arr = this.arr.concat (i);
  },

  delete: function (x) {
    for (var i = 0; i < this.arr.length; ++i) {
      if (this.arr[i] === x) {
        this.arr[i] = undefined;
      }
    }
  },


};


