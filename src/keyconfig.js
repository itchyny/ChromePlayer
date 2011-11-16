// key configuration for player

var keyconfig = {

  '<c-space>': function (player) { player.ui.click ('play'); },
  '<a-space>': function (player) { player.ui.click ('play'); },
  '<space>': function (player) { player.ui.click ('play'); },
  '<c-r>': function (player) { player.ui.click ('repeat'); },
  '<c-o>': function (player) { player.ui.click ('open'); },
  '<c-u>': function (player) { player.ui.click ('shuffle'); },
  '<c-a>': function (player) { player.ui.selectAll (); },
  '<cs-a>': function (player) { player.ui.unselectAll (); },
  '<s-/>': function (player) { player.ui.toggleHelp (); },
  '<f1>': function (player) { player.ui.toggleAbout (); },
  '<esc>': function (player) { player.ui.escape (); },
  '<delete>': function (player) { player.ui.deleteSelected (); },
  '<d>': function (player) { player.ui.deleteSelected (); },
  '<down>': function (player) { player.ui.selectDown (); },
  '<j>': function (player) { player.ui.selectDown (); },
  '<s-down>': function (player) { player.ui.expandDown (); },
  '<s-j>': function (player) { player.ui.expandDown (); },
  '<c-down>': function (player) { player.volumedown (); },
  '<c-j>': function (player) { player.volumedown (); },
  '<9>': function (player) { player.volumedown (); },
  '<c-up>': function (player) { player.volumeup (); },
  '<0>': function (player) { player.volumeup (); },
  '<c-k>': function (player) { player.volumeup (); },
  '<ca-down>': function (player) { player.ui.toggleMute (); },
  '<up>': function (player) { player.ui.selectUp (); },
  '<k>': function (player) { player.ui.selectUp (); },
  '<s-up>': function (player) { player.ui.expandUp (); },
  '<s-k>': function (player) { player.ui.expandUp (); },
  'gg': function (player) { player.ui.selectHome (); }, // TODO
  '<home>': function (player) { player.ui.selectHome (); },
  '<s-home>': function (player) { player.ui.expandToHome (); },
  '<end>': function (player) { player.ui.selectEnd (); },
  '<s-end>': function (player) { player.ui.expandToEnd (); },
  '<s-g>': function (player) { player.ui.selectEnd (); },
  '<right>': function (player) { player.seekBy (10); },
  '<s-right>': function (player) { player.seekBy (30); },
  '<left>': function (player) { player.seekBy (-10); },
  '<s-left>': function (player) { player.seekBy (-30); },
  '<l>': function (player) { player.seekBy (10); },
  '<w>': function (player) { player.seekBy (30); },
  '<h>': function (player) { player.seekBy (-10); },
  '<b>': function (player) { player.seekBy (-30); },
  '<enter>': function (player) { player.ui.defaultEnter (); },
  '<a-enter>': function (player) { player.ui.viewInformation (); },
  '<pgdn>': function (player) { player.ui.pageDown (); },
  '<s-pgdn>': function (player) { player.ui.expandPageDown (); },
  '<pdup>': function (player) { player.ui.pageUp (); },
  '<s-pgup>':  function (player) { player.ui.expandPageUp (); },
  '<^>':  function (player) { player.seekBy (-10000); }, // TODO
  '<s-4>':  function (player) { player.seekBy (10000); },

};



// map <c-space> PlayPause
// map <a-space> PlayPause
// map <space> PlayPause
// map <c-r> ToggleRepeat
// map <c-o> OpenFile
// map <c-u> ToggleShuffle
// map <c-a> SelectAll
// map <cs-a> SelectNone
// map <s-/> ToggleHelp
// map <enter> PlaySelected
// map <up> SelectUp
// map <down> SelectDown
// map <s-up> SelectShiftUp
// map <s-down> SelectShiftDown
// map <home> SelectHome
// map <end> SelectEnd
