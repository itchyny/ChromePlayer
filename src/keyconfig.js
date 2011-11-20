// key configuration for player

var keyconfig = {

  /* operate player */
  '<space>':    command.PlayPause (),
  '<c-space>':  command.PlayPause (),
  '<c-right>':  command.NextMusic (),
  '<c-left>':   command.PreviousMusic (),
  '<c-o>':      command.OpenFile (),
  '<right>':    command.SeekForward ([10]),
  '<s-right>':  command.SeekForward ([30]),
  'l':          command.SeekForward ([10]), // vim
  'w':          command.SeekForward ([30]), // vim
  '<left>':     command.SeekBackward ([10]),
  '<s-left>':   command.SeekBackward ([30]),
  'h':          command.SeekBackward ([10]), // vim
  'b':          command.SeekBackward ([30]), // vim
  '0':          command.SeekPercent ([0]), // vim
  '<s-4>':      command.SeekPercent ([100]), // vim

  /* change setting */
  '<c-r>':      command.ToggleRepeat (),
  '<c-u>':      command.ToggleShuffle (),

  /* volume */
  '<c-up>':     command.VolumeUp (),
  '<c-down>':   command.VolumeDown (),
  '<c-a-down>': command.VolumeToggleMute (),
  '9':          command.VolumeDown (), // mplayer
  // '0':       command.VolumeUp (), // mplayer

  /* select, expand */
  '<down>':     command.SelectDown (),
  'j':          command.SelectDown (), // vim
  '<s-down>':   command.ExtendDown (),
  '<s-j>':      command.ExtendDown (), // vim
  '<up>':       command.SelectUp (),
  'k':          command.SelectUp (), // vim
  '<s-up>':     command.ExtendUp (),
  '<s-k>':      command.ExtendUp (), // vim
  '<home>':     command.SelectHome (),
  'gg':         command.SelectHome (), // vim
  '<s-home>':   command.ExtendToHome (),
  'vgg':        command.ExtendToHome (), // vim
  '<end>':      command.SelectEnd (),
  '<s-g>':      command.SelectEnd (), // vim
  '<s-end>':    command.ExtendToEnd (),
  'v<s-g>':     command.ExtendToEnd (), // vim
  '<c-a>':      command.SelectAll (),
  '<c-s-a>':    command.UnselectAll (),
  '<pgdn>':     command.PageDown (),
  '<c-f>':      command.PageDown (), // vim
  '<s-pgdn>':   command.ExtendPageDown (),
  '<pdup>':     command.PageUp (),
  '<c-b>':      command.PageUp (), // vim
  '<s-pdup>':   command.ExtendPageUp (),

  /* toggle popup menu, ui */
  '<s-/>':      command.ToggleHelp (),
  '<f1>':       command.ToggleAbout (), // TODO
  '<[>':        command.ToggleAbout (), // TODO
  '<c-,>':      command.ToggleConfig (),
  '<delete>':   command.DeleteSelected (),
  'd':          command.DeleteSelected (), // vim
  '<esc>':      command.Escape (),
  '<enter>':    command.DefaultEnter (),
  '<a-enter>':  command.ViewInformation (),
  '<tab>':      command.FocusToggle (),
  '<s-tab>':    command.FocusToggleReverse (),
  'f':          command.FullScreenToggle (),
  '<c-s-f>':    command.FullScreenToggle ()

};


