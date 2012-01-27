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
  PlayPause:            function (opt) { return { str: "Play / Pause", fn: function (app) { app.ui.click ('play'); } }; },
  OpenFile:             function (opt) { return { str: "Open Files", fn: function (app) { app.ui.click ('open'); } }; },
  NextMusic:            function (opt) { return { str: "Next", fn: function (app) { app.next (); } }; },
  PreviousMusic:        function (opt) { return { str: "Previous", fn: function (app) { app.prev (); } }; },
  SeekForward:          function (opt) { var sec = parseInt (opt[0], 10); return { str: "Seek forward by " + sec + " seconds", fn: function (app) { app.seekBy (sec); } }; },
  SeekBackward:         function (opt) { var sec = - parseInt (opt[0], 10); return { str: "Seek backward by " + sec + " seconds", fn: function (app) { app.seekBy (-sec); } }; },
  SeekPercent:          function (opt) { return { str: "", fn: function (app) { app.seekAt (parseInt (opt[0], 10)); } }; },

  /* change setting */
  ToggleRepeat:         function (opt) { return { str: "Toggle repeat", fn: function (app) { app.ui.click ('repeat'); } }; },
  ToggleShuffle:        function (opt) { return { str: "Toggle shuffle", fn: function (app) { app.ui.click ('shuffle'); } }; },

  /* volume */
  VolumeUp:             function (opt) { return { str: "Volume up", fn: function (app) { app.volumeup (); } }; },
  VolumeDown:           function (opt) { return { str: "Volume down", fn: function (app) { app.volumedown (); } }; },
  VolumeMute:           function (opt) { return { str: "Volume mute", fn: function (app) { app.ui.click ('mute'); } }; },
  VolumeResume:         function (opt) { return { str: "Resume from mute", fn: function (app) { app.ui.click ('volumeon'); } }; },
  VolumeToggleMute:     function (opt) { return { str: "Toggle mute", fn: function (app) { app.ui.click (app.ismute () ? 'volumeon' : 'mute'); } }; },

  /* select, extend */
  SelectDown:           function (opt) { return { str: "", fn: function (app) { app.ui.selectDown (); } }; },
  ExtendDown:           function (opt) { return { str: "", fn: function (app) { app.ui.extendDown (); } }; },
  SelectUp:             function (opt) { return { str: "", fn: function (app) { app.ui.selectUp (); } }; },
  ExtendUp:             function (opt) { return { str: "", fn: function (app) { app.ui.extendUp (); } }; },
  SelectHome:           function (opt) { return { str: "", fn: function (app) { app.ui.selectHome (); } }; },
  ExtendToHome:         function (opt) { return { str: "", fn: function (app) { app.ui.extendToHome (); } }; },
  SelectEnd:            function (opt) { return { str: "", fn: function (app) { app.ui.selectEnd (); } }; },
  ExtendToEnd:          function (opt) { return { str: "", fn: function (app) { app.ui.extendToEnd (); } }; },
  SelectAll:            function (opt) { return { str: "", fn: function (app) { app.ui.selectAll (); } }; },
  UnselectAll:          function (opt) { return { str: "", fn: function (app) { app.ui.unselectAll (); } }; },
  SelectInvert:         function (opt) { return { str: "", fn: function (app) { app.ui.selectInvert (); } }; },
  PageDown:             function (opt) { return { str: "", fn: function (app) { app.ui.pageDown (); } }; },
  ExtendPageDown:       function (opt) { return { str: "", fn: function (app) { app.ui.extendPageDown (); } }; },
  PageUp:               function (opt) { return { str: "", fn: function (app) { app.ui.pageUp (); } }; },
  ExtendPageUp:         function (opt) { return { str: "", fn: function (app) { app.ui.extendPageUp (); } }; },
  DeleteSelected:       function (opt) { return { str: "", fn: function (app) { app.ui.deleteSelected (); } }; },
  SelectNowplaying:     function (opt) { return { str: "", fn: function (app) { app.ui.selectNowplaying (); } }; },
  ShiftLock:            function (opt) { return { str: "", fn: function (app) { app.key.lock ('shiftKey'); } }; },
  CtrlLock:             function (opt) { return { str: "", fn: function (app) { app.key.lock ('ctrlKey'); } }; },
  AltLock:              function (opt) { return { str: "", fn: function (app) { app.key.lock ('altKey'); } }; },
  ShiftUnlock:          function (opt) { return { str: "", fn: function (app) { app.key.unlock ('shiftKey'); } }; },
  CtrlUnlock:           function (opt) { return { str: "", fn: function (app) { app.key.unlock ('ctrlKey'); } }; },
  AltUnlock:            function (opt) { return { str: "", fn: function (app) { app.key.unlock ('altKey'); } }; },
  ShiftToggleLock:      function (opt) { return { str: "", fn: function (app) { app.key.togglelock ('shiftKey'); } }; },
  CtrlToggleLock:       function (opt) { return { str: "", fn: function (app) { app.key.togglelock ('ctrlKey'); } }; },
  AltToggleLock:        function (opt) { return { str: "", fn: function (app) { app.key.togglelock ('altKey'); } }; },

  /* vim setting */
  // VisualModeOn:         function (opt) { return function (app) { app.vim.visual.at (1); }; }, // TODO
  // VisualModeoff:        function (opt) { return function (app) { app.vim.visual.at (0); }; }, // TODO

  /* toggle popup menu */
  ToggleHelp:           function (opt) { return { str: "Keyboard shortcut", fn: function (app) { app.ui.toggleHelp (); } }; },
  ToggleAbout:          function (opt) { return { str: "Application Information", fn: function (app) { app.ui.toggleAbout (); } }; },
  OpenConfig:           function (opt) { return { str: "Configuration", fn: function (app) { app.ui.click ('conf'); } }; },
  DefaultEnter:         function (opt) { return { str: "", fn: function (app) { app.ui.defaultEnter (); } }; },
  ViewInformation:      function (opt) { return { str: "Music information", fn: function (app) { app.ui.viewInformation (); } }; },
  Escape:               function (opt) { return { str: "", fn: function (app) { app.ui.escape (); } }; },
  FocusToggle:          function (opt) { return { str: "", fn: function (app) { app.ui.focusToggle (); } }; },
  FocusToggleReverse:   function (opt) { return { str: "", fn: function (app) { app.ui.focusToggleReverse (); } }; },
  FullScreenOn:         function (opt) { return { str: "", fn: function (app) { app.ui.fullScreenOn (); } }; },
  FullScreenOff:        function (opt) { return { str: "", fn: function (app) { app.ui.fullScreenOff (); } }; },
  FullScreenToggle:     function (opt) { return { str: "Toggle fullscreen", fn: function (app) { app.ui.fullScreenToggle (); } }; },

  /* filter interface */
  FilterStart:          function (opt) { return { str: "Start filter", fn: function (app) { app.ui.filterStart (); } }; },

  /* Special commands */
  Nop:                  function (opt) { return { str: "", fn: function (app) {} }; },
  Define:               function (opt) { return { str: "", fn: function (app) {} }; } // TODO

};







