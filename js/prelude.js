function log (x) {
  console.dir (x);
}

Array.prototype.shuffle = ( function () {
  var mathRandom = Math.random,
  mathFloor = Math.floor;
  return function () {
    var i = this.length, j, t;
    while(i) {
      j = mathFloor( mathRandom() * i );
      t = this[--i];
      this[i] = this[j];
      this[j] = t;
    }
    return this;
  };
})();

Array.prototype.unique = function () {
  var ans = [], i, j, l, m, f;
  for(i = -1, l = this.length; ++i < l;) {
    for(j = -1, m = ans.length, f = true; ++j < m;) {
      if(ans[j] === this[i]) {
        j = m + 1;
        f = false;
      }
    }
    if(f){
      ans.push(this[i]);
    }
  }
  return ans;
};

$.fn.unique = Array.prototype.unique;

$.fn.join = Array.prototype.join;

$.fn.texttitle = function (t) {
  return this.text(t).attr('title', t);
};


