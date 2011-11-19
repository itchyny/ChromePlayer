// commands
// TODO: arguments
var command = {

  /* operate player */
  PlayPause:          function (opt) { return function (app) { app.ui.click ('play'); }; },
  OpenFile:           function (opt) { return function (app) { app.ui.click ('open'); }; },
  NextMusic:          function (opt) { return function (app) { app.next (); }; },
  PreviousMusic:      function (opt) { return function (app) { app.prev (); }; },
  SeekForward:        function (opt) { return function (app) { app.seekBy (opt[0]); }; },
  SeekBackward:       function (opt) { return function (app) { app.seekBy (-opt[0]); }; },
  SeekPercent:        function (opt) { return function (app) { app.seekAt (opt[0]); }; },

  /* change setting */
  ToggleRepeat:       function (opt) { return function (app) { app.ui.click ('repeat'); }; },
  ToggleShuffle:      function (opt) { return function (app) { app.ui.click ('shuffle'); }; },

  /* volume */
  VolumeUp:           function (opt) { return function (app) { app.volumeup (); }; },
  VolumeDown:         function (opt) { return function (app) { app.volumedown (); }; },
  VolumeMute:         function (opt) { return function (app) { app.mute (); }; },
  VolumeResume:       function (opt) { return function (app) { app.resume (); }; },
  VolumeToggleMute:   function (opt) { return function (app) { app.togglemute (); }; },


  /* select, extend */
  SelectDown:         function (opt) { return function (app) { app.ui.selectDown (); }; },
  ExtendDown:         function (opt) { return function (app) { app.ui.extendDown (); }; },
  SelectUp:           function (opt) { return function (app) { app.ui.selectUp (); }; },
  ExtendUp:           function (opt) { return function (app) { app.ui.extendUp (); }; },
  SelectHome:         function (opt) { return function (app) { app.ui.selectHome (); }; },
  ExtendToHome:       function (opt) { return function (app) { app.ui.extendToHome (); }; },
  SelectEnd:          function (opt) { return function (app) { app.ui.selectEnd (); }; },
  ExtendToEnd:        function (opt) { return function (app) { app.ui.extendToEnd (); }; },
  SelectAll:          function (opt) { return function (app) { app.ui.selectAll (); }; },
  UnselectAll:        function (opt) { return function (app) { app.ui.unselectAll (); }; },
  PageDown:           function (opt) { return function (app) { app.ui.pageDown (); }; },
  ExtendPageDown:     function (opt) { return function (app) { app.ui.extendPageDown (); }; },
  PageUp:             function (opt) { return function (app) { app.ui.pageUp (); }; },
  ExtendPageUp:       function (opt) { return function (app) { app.ui.extendPageUp (); }; },
  DeleteSelected:     function (opt) { return function (app) { app.ui.deleteSelected (); }; },

  /* toggle popup menu */
  ToggleHelp:         function (opt) { return function (app) { app.ui.toggleHelp (); }; },
  ToggleAbout:        function (opt) { return function (app) { app.ui.toggleAbout (); }; },
  DefaultEnter:       function (opt) { return function (app) { app.ui.defaultEnter (); }; },
  ViewInformation:    function (opt) { return function (app) { app.ui.viewInformation (); }; },
  Escape:             function (opt) { return function (app) { app.ui.escape (); }; },
  FocusToggle:        function (opt) { return function (app) { app.ui.focusToggle (); }; },
  FocusToggleReverse: function (opt) { return function (app) { app.ui.focusToggleReverse (); }; },

  /* Special commands */
  Define:             function (opt) { return function () {}; } // TODO

};

