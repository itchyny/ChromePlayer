// Easy wrapper for localStorage

var local = {

  get: function (key) {
    return localStorage.getItem (key);
  },

  set: function (key, val) {
    localStorage.setItem (key, val);
  },

  remove: function (key) {
    localStorage.removeItem (key);
  },

  clear: function () {
    localStorage.clear ();
  }

};




if (typeof exports !== 'undefined') {
  exports.local = local;
}





