// Extend Player.prototype attribute globalcontrol
// globalcontrol.init is automatically called by Player.prototype.start
Player.prototype.globalcontrol = new Enumcycle ( ['false', 'true']
  , function () {
    if (chrome.extension) {
      chrome.extension.onRequest.addListener(
        function (e, sender, sendResponse) {
        var g = local.get ('globalcontrol');
        if (g === undefined || g === 'false') {
          return;
        }
        player.key.keydown (e);
      });
    }
  return local.get ('globalcontrol') || 'false';
  }
  , function (globalcontrol, app) {
    local.set ('globalcontrol', globalcontrol);
  }
);
