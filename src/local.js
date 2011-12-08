// Easy wrapper for localStorage

var local = {

  get: function (key) {
    console.log (key);
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
  },

  getSetting: function (key) {
    return local.get ('store.' + 'settings' + '.' + key);
  }

};








