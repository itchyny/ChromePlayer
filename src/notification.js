// notification wrapper
var notification = {

  prevNotification: null,

  createNotification: function (icon, title, message) {
    if (webkitNotifications && webkitNotifications.checkPermission () === 0) {
      if (this.prevNotification) {
        this.prevNotification.cancel ();
        delete this.prevNotification;
      }
      var notify = local.getSetting ('notification');
      var msec = JSON.parse (local.getSetting ('notificationmsec'));
      if (notify === 'true') {
        var n = webkitNotifications.createNotification (icon, title, message);
        n.show ();
        setTimeout (function () {
          n.cancel ();
          delete this.prevNotification;
        }, msec);
        this.prevNotification = n;
      }
    }
  }
};



