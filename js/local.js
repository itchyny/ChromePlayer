;
// wrapper for localStorage
(function () {

  var ls = localStorage;

  window.local = {

    get: function (key) {
      return ls[key];
    },

    set: function (key, val) {
      ls.setItem (key, val);
    },

    remove: function (key) {
      ls.removeItem (key);
    },

    clear: function () {
      ls.clear ();
    }
  };


})();


