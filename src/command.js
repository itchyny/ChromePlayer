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
  DefaultEnter:         function (opt) { return { type: 0, id: 0, str: "Play selected file", fn: function (app) { app.ui.defaultEnter (); } }; },
  PlayPause:            function (opt) { return { type: 0, id: 1, str: "Play / Pause", fn: function (app) { app.ui.click ('play'); } }; },
  DeleteSelected:       function (opt) { return { type: 0, id: 2, str: "Delete selected files", fn: function (app) { app.ui.deleteSelected (); } }; },
  NextMusic:            function (opt) { return { type: 0, id: 3, str: "Next", fn: function (app) { app.next (); } }; },
  PreviousMusic:        function (opt) { return { type: 0, id: 4, str: "Previous", fn: function (app) { app.prev (); } }; },
  SeekForward:          function (opt) { var sec = parseInt (opt[0], 10); return { type: 0, id: 5, str: "Seek forward by " + sec + " seconds", fn: function (app) { app.seekBy (sec); } }; },
  SeekBackward:         function (opt) { var sec = parseInt (opt[0], 10); return { type: 0, id: 6, str: "Seek backward by " + sec + " seconds", fn: function (app) { app.seekBy (-sec); } }; },
  SeekPercent:          function (opt) { return { type: 0, id: 7, str: "", fn: function (app) { app.seekAt (parseInt (opt[0], 10)); } }; },
  OpenFile:             function (opt) { return { type: 1, id: 8, str: "Open Files", fn: function (app) { app.ui.click ('open'); } }; },

  /* change setting */
  ToggleRepeat:         function (opt) { return { type: 1, id: 9, str: "Toggle repeat", fn: function (app) { app.ui.click ('repeat'); } }; },
  ToggleShuffle:        function (opt) { return { type: 1, id: 10, str: "Toggle shuffle", fn: function (app) { app.ui.click ('shuffle'); } }; },

  /* filter interface */
  FilterStart:          function (opt) { return { type: 1, id: 11, str: "Start filter", fn: function (app) { app.ui.filterStart (); } }; },

  /* select, extend */
  SelectDown:           function (opt) { return { type: 1, id: 9, str: "", fn: function (app) { app.ui.selectDown (); } }; },
  ExtendDown:           function (opt) { return { type: 1, id: 10, str: "", fn: function (app) { app.ui.extendDown (); } }; },
  SelectUp:             function (opt) { return { type: 1, id: 11, str: "", fn: function (app) { app.ui.selectUp (); } }; },
  ExtendUp:             function (opt) { return { type: 1, id: 12, str: "", fn: function (app) { app.ui.extendUp (); } }; },
  SelectHome:           function (opt) { return { type: 1, id: 13, str: "", fn: function (app) { app.ui.selectHome (); } }; },
  ExtendToHome:         function (opt) { return { type: 1, id: 14, str: "", fn: function (app) { app.ui.extendToHome (); } }; },
  SelectEnd:            function (opt) { return { type: 1, id: 15, str: "", fn: function (app) { app.ui.selectEnd (); } }; },
  ExtendToEnd:          function (opt) { return { type: 1, id: 16, str: "", fn: function (app) { app.ui.extendToEnd (); } }; },
  SelectAll:            function (opt) { return { type: 1, id: 17, str: "", fn: function (app) { app.ui.selectAll (); } }; },
  UnselectAll:          function (opt) { return { type: 1, id: 18, str: "", fn: function (app) { app.ui.unselectAll (); } }; },
  SelectInvert:         function (opt) { return { type: 1, id: 19, str: "Invert select", fn: function (app) { app.ui.selectInvert (); } }; },
  PageDown:             function (opt) { return { type: 1, id: 20, str: "", fn: function (app) { app.ui.pageDown (); } }; },
  ExtendPageDown:       function (opt) { return { type: 1, id: 21, str: "", fn: function (app) { app.ui.extendPageDown (); } }; },
  PageUp:               function (opt) { return { type: 1, id: 22, str: "", fn: function (app) { app.ui.pageUp (); } }; },
  ExtendPageUp:         function (opt) { return { type: 1, id: 23, str: "", fn: function (app) { app.ui.extendPageUp (); } }; },
  SelectNowplaying:     function (opt) { return { type: 1, id: 25, str: "", fn: function (app) { app.ui.selectNowplaying (); } }; },
  ShiftLock:            function (opt) { return { type: 1, id: 26, str: "", fn: function (app) { app.key.lock ('shiftKey'); } }; },
  CtrlLock:             function (opt) { return { type: 1, id: 27, str: "", fn: function (app) { app.key.lock ('ctrlKey'); } }; },
  AltLock:              function (opt) { return { type: 1, id: 28, str: "", fn: function (app) { app.key.lock ('altKey'); } }; },
  ShiftUnlock:          function (opt) { return { type: 1, id: 29, str: "", fn: function (app) { app.key.unlock ('shiftKey'); } }; },
  CtrlUnlock:           function (opt) { return { type: 1, id: 30, str: "", fn: function (app) { app.key.unlock ('ctrlKey'); } }; },
  AltUnlock:            function (opt) { return { type: 1, id: 31, str: "", fn: function (app) { app.key.unlock ('altKey'); } }; },
  ShiftToggleLock:      function (opt) { return { type: 1, id: 32, str: "", fn: function (app) { app.key.togglelock ('shiftKey'); } }; },
  CtrlToggleLock:       function (opt) { return { type: 1, id: 33, str: "", fn: function (app) { app.key.togglelock ('ctrlKey'); } }; },
  AltToggleLock:        function (opt) { return { type: 1, id: 34, str: "", fn: function (app) { app.key.togglelock ('altKey'); } }; },

  /* volume */
  VolumeUp:             function (opt) { return { type: 2, id: 35, str: "Volume up", fn: function (app) { app.volumeup (); } }; },
  VolumeDown:           function (opt) { return { type: 2, id: 36, str: "Volume down", fn: function (app) { app.volumedown (); } }; },
  VolumeMute:           function (opt) { return { type: 2, id: 37, str: "Volume mute", fn: function (app) { app.ui.click ('mute'); } }; },
  VolumeResume:         function (opt) { return { type: 2, id: 38, str: "Resume from mute", fn: function (app) { app.ui.click ('volumeon'); } }; },
  VolumeToggleMute:     function (opt) { return { type: 2, id: 39, str: "Toggle mute", fn: function (app) { app.ui.click (app.ismute () ? 'volumeon' : 'mute'); } }; },

  /* vim setting */
  // VisualModeOn:         function (opt) { return function (app) { app.vim.visual.at (1); }; }, // TODO
  // VisualModeoff:        function (opt) { return function (app) { app.vim.visual.at (0); }; }, // TODO

  /* toggle popup menu */
  ToggleHelp:           function (opt) { return { type: 3, id: 40, str: "Keyboard shortcut", fn: function (app) { app.ui.toggleHelp (); } }; },
  ToggleAbout:          function (opt) { return { type: 3, id: 41, str: "Application Information", fn: function (app) { app.ui.toggleAbout (); } }; },
  OpenConfig:           function (opt) { return { type: 3, id: 42, str: "Configuration", fn: function (app) { app.ui.click ('conf'); } }; },
  ViewInformation:      function (opt) { return { type: 3, id: 44, str: "Music information", fn: function (app) { app.ui.viewInformation (); } }; },
  Escape:               function (opt) { return { type: 3, id: 45, str: "", fn: function (app) { app.ui.escape (); } }; },
  FocusToggle:          function (opt) { return { type: 3, id: 46, str: "", fn: function (app) { app.ui.focusToggle (); } }; },
  FocusToggleReverse:   function (opt) { return { type: 3, id: 47, str: "", fn: function (app) { app.ui.focusToggleReverse (); } }; },
  FullScreenOn:         function (opt) { return { type: 3, id: 48, str: "", fn: function (app) { app.ui.fullScreenOn (); } }; },
  FullScreenOff:        function (opt) { return { type: 3, id: 49, str: "", fn: function (app) { app.ui.fullScreenOff (); } }; },
  FullScreenToggle:     function (opt) { return { type: 3, id: 50, str: "Toggle fullscreen", fn: function (app) { app.ui.fullScreenToggle (); } }; },

  /* Special commands */
  Nop:                  function (opt) { return { type: 4, id: 52, str: "", fn: function (app) {} }; },
  Define:               function (opt) { return { type: 4, id: 53, str: "", fn: function (app) {} }; } // TODO

};






