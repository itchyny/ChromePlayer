function log (x) {
  console.dir (x);
}

function logfn (x) {
  console.log ('--------------- ' + x + ' ---------------');
}

Array.prototype.clone = function () {
    return Array.apply (null,this);
};

Array.prototype.drop = function (x) {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (this[i] !== x) {
      arr = arr.concat ([this[i]]);
    }
  }
  return arr;
};

Array.prototype.shuffle = function () {
  var xs = this.clone ();
  var i = xs.length, j, t;
  var mathRandom = Math.random;
  var mathFloor = Math.floor;
  while (i) {
    j = mathFloor( mathRandom() * i );
    t = xs[--i];
    xs[i] = xs[j];
    xs[j] = t;
  }
  return xs;
};

Array.prototype.unique = function () {
  var ans = [], i, j, l, m, f;
  for(i = -1, l = this.length; i < l; ++i) {
    for(j = -1, m = ans.length, f = true; j < m; ++j) {
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

if (typeof $ !== 'undefined') {

  $.fn.texttitle = function (t) {
    return this.text(t).attr('title', t);
  };

}

function aboutEqual (x, y) {
  return Math.abs (x - y) < 1e-9;
}

function viewname (x) {
  if (typeof test === "function") {
    var line = "================================";
    var space = "   ";
    test (line + space + x + space + line, function () {});
  }
}

// export logger functions
if (typeof exports !== 'undefined') {
  exports.log = log;
  exports.logfn = logfn;
}





