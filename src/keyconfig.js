// key configuration for player

var keyconfig = {

  /* operate player */
  '<space>':     command.PlayPause (),
  '<c-space>':   '<space>',
  '<c-right>':   command.NextMusic (),
  '<c-left>':    command.PreviousMusic (),
  '<c-o>':       command.OpenFile (),
  ':o':          '<c-o>', // vim
  ':e':          '<c-o>', // vim
  '<right>':     command.SeekForward ([10]),
  '<s-right>':   command.SeekForward ([30]),
  'l':           '<right>', // vim
  'w':           '<s-right>', // vim
  '<left>':      command.SeekBackward ([10]),
  '<s-left>':    command.SeekBackward ([30]),
  'h':           '<left>', // vim
  'b':           '<s-left>', // vim
  '0':           command.SeekPercent ([0]), // vim
  '<s-4>':       command.SeekPercent ([100]), // vim

  /* change sett ing */
  '<c-r>':       command.ToggleRepeat (),
  '<c-u>':       command.ToggleShuffle (),

  /* volume */
  '<c-up>':      command.VolumeUp (),
  '<c-down>':    command.VolumeDown (),
  '<c-a-down>':  command.VolumeToggleMute (),
  '9':           command.VolumeDown (), // mplayer
  // '0':        command.VolumeUp (), // mplayer

  /* select, exp and */
  '<down>':      command.SelectDown (),
  'j':           '<down>', // vim
  '<s-down>':    command.ExtendDown (),
  '<s-j>':       '<s-down>', // vim
  '<up>':        command.SelectUp (),
  'k':           '<up>', // vim
  '<s-up>':      command.ExtendUp (),
  '<s-k>':       '<s-up>', // vim
  '<home>':      command.SelectHome (),
  'gg':          '<home>', // vim
  '<s-home>':    command.ExtendToHome (),
  '<end>':       command.SelectEnd (),
  '<s-g>':       '<end>', // vim
  '<s-end>':     command.ExtendToEnd (),
  '<c-a>':       command.SelectAll (),
  '<c-s-a>':     command.UnselectAll (),
  '<pgdn>':      command.PageDown (),
  // '<c-f>':       '<pgdn>', // vim
  '<s-pgdn>':    command.ExtendPageDown (),
  '<pdup>':      command.PageUp (),
  '<c-b>':       '<pgup>', // vim
  '<s-pdup>':    command.ExtendPageUp (),
  'v':           command.ShiftLock (), // vim // TODO

  /* toggle popu p menu, ui */
  '<s-/>':       command.ToggleHelp (),
  '<f1>':        command.ToggleAbout (),
  '[':           '<f1>',
  '<c-,>':       command.ToggleConfig (),
  '<delete>':    command.DeleteSelected (),
  '<backspace>': '<delete>',
  'd':           '<delete>', // vim
  '<esc>':       command.Escape (),
  '<s-esc>':     '<esc>',
  '<c-[>':       '<esc>', // vim
  '<c-s-[>':     '<esc>', // vim
  '<enter>':     command.DefaultEnter (),
  '<a-enter>':   command.ViewInformation (),
  '<tab>':       command.FocusToggle (),
  '<s-tab>':     command.FocusToggleReverse (),
  'f':           command.FullScreenToggle (),
  '<c-s-f>':     command.FullScreenToggle (),

  /* filter interface */
  '<c-f>':       command.FilterStart (),

  /* special command */
  '<nop>':       command.Nop ()

};


