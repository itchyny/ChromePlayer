// Easy wrapper for localStorage

var local = {

  get: function (key) {
    return localStorage[key];
  },

  set: function (key, val) {
    localStorage.setItem (key, val);
    return localStorage[key];
  },

  remove: function (key) {
    localStorage.removeItem (key);
  },

  clear: function () {
    localStorage.clear ();
  }

};


