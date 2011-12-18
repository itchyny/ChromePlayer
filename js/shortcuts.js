//
// This is the content script for Chrome Player.
// On keydown event, check if its keyCode exists in the key set,
// and if true, pass its meta keys to the main script.
// key set is as follows:
//   32: space
//   37: left
//   38: up
//   39: right
//   40: down
//   119: f8
//   120: f9
//   121: f10
//   173: volume mute
//   174: volume down
//   175: volume up
//   176: media_next_track
//   177: media_prev_track
//   178: media_stop
//   179: media_play_pause

window.addEventListener(
  'keydown',
  (function(){
    var keys = [ 32, 37, 38, 39, 40, 119, 120, 121, 173, 174, 175, 176, 177, 178, 179 ];
    return function(e){
      if(keys.indexOf(e.keyCode) >= 0){
        try{
          // e.preventDefault ();
          chrome.extension.sendRequest(
            { keyCode: e.keyCode
            , shiftKey: e.shiftKey
            , ctrlKey: e.ctrlKey
            , altKey: e.altKey
            , global: true
            , type: 'globalkeydown'
            }
          );
        } catch(e){};
      }
    }
  })()
);
