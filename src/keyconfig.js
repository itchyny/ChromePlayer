// key configuration for player

Player.prototype.key = new Key ({

  /* operate player */
  '<space>':       command.PlayPause ([]),
  '<c-space>':     '<space>',
  '<g-c-space>':   '<space>',
  '<c-right>':     command.NextMusic ([]),
  '<g-c-right>':   '<c-right>',
  '<c-left>':      command.PreviousMusic ([]),
  '<g-c-left>':    '<c-left>',
  '<c-o>':         command.OpenFile ([]),
  ':  o':          '<c-o>', // vim
  ':  e':          '<c-o>', // vim
  '<right>':       command.SeekForward (['10']),
  '<s-right>':     command.SeekForward (['30']),
  'l':             '<right>', // vim
  'w':             '<s-right>', // vim
  '<left>':        command.SeekBackward (['10']),
  '<s-left>':      command.SeekBackward (['30']),
  'h':             '<left>', // vim
  'b':             '<s-left>', // vim
  '<s-4>':         command.SeekPercent (['100']), // vim

  /* change setting */
  '<c-r>':         command.ToggleRepeat ([]),
  '<c-u>':         command.ToggleShuffle ([]),

  /* volume */
  '<c-up>':        command.VolumeUp ([]),
  '<g-c-up>':      '<c-up>',
  '<c-down>':      command.VolumeDown ([]),
  '<g-c-down>':    '<c-down>',
  '<c-a-down>':    command.VolumeToggleMute ([]),
  '<g-c-a-down>':  '<c-a-down>',
  '9':             command.VolumeDown ([]), // mplayer
  // '0':          command.VolumeUp ([]), // mplayer

  /* select, expand */
  '<down>':        command.SelectDown ([]),
  'j':             '<down>', // vim
  '<s-down>':      command.ExtendDown ([]),
  '<s-j>':         '<s-down>', // vim
  '<up>':          command.SelectUp ([]),
  'k':             '<up>', // vim
  '<s-up>':        command.ExtendUp ([]),
  '<s-k>':         '<s-up>', // vim
  '<home>':        command.SelectHome ([]),
  'gg':            '<home>', // vim
  '0':             '<home>', // vim
  '<s-home>':      command.ExtendToHome ([]),
  '<end>':         command.SelectEnd ([]),
  '<s-g>':         '<end>', // vim
  '<s-end>':       command.ExtendToEnd ([]),
  '<c-a>':         command.SelectAll ([]),
  '<c-s-a>':       command.UnselectAll ([]),
  '<c-i>':         command.SelectInvert ([]),
  '<pgdn>':        command.PageDown ([]),
  // '<c-f>':         '<pgdn>', // vim
  '<s-pgdn>':      command.ExtendPageDown ([]),
  '<pgup>':        command.PageUp ([]),
  '<c-b>':         '<pgup>', // vim
  '<s-pgup>':      command.ExtendPageUp ([]),
  // 'v':             command.ShiftLock ([]), // vim // TODO

  /* toggle popup menu, ui */
  '<s-/>':         command.ToggleHelp ([]),
  '<f1>':          command.ToggleAbout ([]),
  '[':             '<f1>',
  '<c-,>':         command.ToggleConfig ([]),
  '<delete>':      command.DeleteSelected ([]),
  '<backspace>':   '<delete>',
  'd':             '<delete>', // vim
  '<esc>':         command.Escape ([]),
  '<s-esc>':       '<esc>',
  '<c-[>':         '<esc>', // vim
  '<c-s-[>':       '<esc>', // vim
  '<enter>':       command.DefaultEnter ([]),
  '<a-enter>':     command.ViewInformation ([]),
  '<tab>':         command.FocusToggle ([]),
  '<s-tab>':       command.FocusToggleReverse ([]),
  'f':             command.FullScreenToggle ([]),
  '<c-s-f>':       command.FullScreenToggle ([]),

  /* filter interface */
  '<c-f>':         command.FilterStart ([]),
  '/':             '<c-f>', // vim

  /* special command */
  '<nop>':         command.Nop ([])

});










