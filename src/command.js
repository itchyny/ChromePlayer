// Commands which user can access by setting keybinding
//
// The reason I use the form of
//   Command : function (opt) { return function () ... }
// is for options (rather, arguments?). See SeekForward command for example.
// If option for command is not allowed, we must provide lots of commands like
//   SeekForward10, SeekForward20, SeekForward30, ...
//
// The "app" here is actually player in global closure, and is player.key.app, too.
// See keyconfig.js and key.js.
var command = {

  /* operate player */
  PlayPause:            function (opt) { return function (app) { app.ui.click ('play'); }; },
  OpenFile:             function (opt) { return function (app) { app.ui.click ('open'); }; },
  NextMusic:            function (opt) { return function (app) { app.next (); }; },
  PreviousMusic:        function (opt) { return function (app) { app.prev (); }; },
  SeekForward:          function (opt) { return function (app) { app.seekBy (parseInt (opt[0], 10)); }; },
  SeekBackward:         function (opt) { return function (app) { app.seekBy (-parseInt (opt[0], 10)); }; },
  SeekPercent:          function (opt) { return function (app) { app.seekAt (parseInt (opt[0], 10)); }; },

  /* change setting */
  ToggleRepeat:         function (opt) { return function (app) { app.ui.click ('repeat'); }; },
  ToggleShuffle:        function (opt) { return function (app) { app.ui.click ('shuffle'); }; },

  /* volume */
  VolumeUp:             function (opt) { return function (app) { app.volumeup (); }; },
  VolumeDown:           function (opt) { return function (app) { app.volumedown (); }; },
  VolumeMute:           function (opt) { return function (app) { app.ui.click ('mute'); }; },
  VolumeResume:         function (opt) { return function (app) { app.ui.click ('volumeon'); }; },
  VolumeToggleMute:     function (opt) { return function (app) { app.ui.click (app.ismute () ? 'volumeon' : 'mute'); }; },

  /* select, extend */
  SelectDown:           function (opt) { return function (app) { app.ui.selectDown (); }; },
  ExtendDown:           function (opt) { return function (app) { app.ui.extendDown (); }; },
  SelectUp:             function (opt) { return function (app) { app.ui.selectUp (); }; },
  ExtendUp:             function (opt) { return function (app) { app.ui.extendUp (); }; },
  SelectHome:           function (opt) { return function (app) { app.ui.selectHome (); }; },
  ExtendToHome:         function (opt) { return function (app) { app.ui.extendToHome (); }; },
  SelectEnd:            function (opt) { return function (app) { app.ui.selectEnd (); }; },
  ExtendToEnd:          function (opt) { return function (app) { app.ui.extendToEnd (); }; },
  SelectAll:            function (opt) { return function (app) { app.ui.selectAll (); }; },
  UnselectAll:          function (opt) { return function (app) { app.ui.unselectAll (); }; },
  SelectInvert:         function (opt) { return function (app) { app.ui.selectInvert (); }; },
  PageDown:             function (opt) { return function (app) { app.ui.pageDown (); }; },
  ExtendPageDown:       function (opt) { return function (app) { app.ui.extendPageDown (); }; },
  PageUp:               function (opt) { return function (app) { app.ui.pageUp (); }; },
  ExtendPageUp:         function (opt) { return function (app) { app.ui.extendPageUp (); }; },
  DeleteSelected:       function (opt) { return function (app) { app.ui.deleteSelected (); }; },
  SelectNowplaying:     function (opt) { return function (app) { app.ui.selectNowplaying (); }; },
  ShiftLock:            function (opt) { return function (app) { app.key.lock ('shiftKey'); }; },
  CtrlLock:             function (opt) { return function (app) { app.key.lock ('ctrlKey'); }; },
  AltLock:              function (opt) { return function (app) { app.key.lock ('altKey'); }; },
  ShiftUnlock:          function (opt) { return function (app) { app.key.unlock ('shiftKey'); }; },
  CtrlUnlock:           function (opt) { return function (app) { app.key.unlock ('ctrlKey'); }; },
  AltUnlock:            function (opt) { return function (app) { app.key.unlock ('altKey'); }; },
  ShiftToggleLock:      function (opt) { return function (app) { app.key.togglelock ('shiftKey'); }; },
  CtrlToggleLock:       function (opt) { return function (app) { app.key.togglelock ('ctrlKey'); }; },
  AltToggleLock:        function (opt) { return function (app) { app.key.togglelock ('altKey'); }; },

  /* vim setting */
  // VisualModeOn:         function (opt) { return function (app) { app.vim.visual.at (1); }; }, // TODO
  // VisualModeoff:        function (opt) { return function (app) { app.vim.visual.at (0); }; }, // TODO

  /* toggle popup menu */
  ToggleHelp:           function (opt) { return function (app) { app.ui.toggleHelp (); }; },
  ToggleAbout:          function (opt) { return function (app) { app.ui.toggleAbout (); }; },
  OpenConfig:         function (opt) { return function (app) { app.ui.click ('conf'); }; },
  DefaultEnter:         function (opt) { return function (app) { app.ui.defaultEnter (); }; },
  ViewInformation:      function (opt) { return function (app) { app.ui.viewInformation (); }; },
  Escape:               function (opt) { return function (app) { app.ui.escape (); }; },
  FocusToggle:          function (opt) { return function (app) { app.ui.focusToggle (); }; },
  FocusToggleReverse:   function (opt) { return function (app) { app.ui.focusToggleReverse (); }; },
  FullScreenOn:         function (opt) { return function (app) { app.ui.fullScreenOn (); }; },
  FullScreenOff:        function (opt) { return function (app) { app.ui.fullScreenOff (); }; },
  FullScreenToggle:     function (opt) { return function (app) { app.ui.fullScreenToggle (); }; },

  /* filter interface */
  FilterStart:          function (opt) { return function (app) { app.ui.filterStart (); }; },

  /* Special commands */
  Nop:                  function (opt) { return function (app) {}; },
  Define:               function (opt) { return function (app) {}; } // TODO

};







