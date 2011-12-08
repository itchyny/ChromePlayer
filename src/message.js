var message = {

  strarr: 'abcdefghijklmnopqrstuvwxyz',

  randomstr: function () {
    var len = this.strarr.length;
    var s = '';
    for (var i = 0; i < 10; i++) {
      s += this.strarr[Math.floor(Math.random() * len)];
    }
    return s;
  },

  createId: function () {
    return (new Date ()).getTime ().toString () + this.randomstr ();
  },

  send: function (obj) {
    obj.id = this.createId ();
    chrome.extension.sendRequest (obj);
  }

};




