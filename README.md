# !!! WARNING: THIS IS UNSTABLE VERSION !!!
# Stable version (version 1.58, without video feature) is available at https://github.com/itchyny/ChromePlayer/tree/3005dd77af29be16e808684dfc5d5df1691b49ce


# This is the source code of Chrome Player
## Chrome Player is an App for Google Chrome,
### available at https://chrome.google.com/webstore/detail/chkhjlbdflppmaddpjmjecgdagdljimc



## Usage
- A media player on your browser for LOCAL FILES.
- Drag mp3/ogg files from file browser into the window.
- Or, you can also add music files from a file dialog, which appears when you click the '+' button.
- You'll find the file name show up.
- And player above will automatically start to play the file.
- If you double-click the file name in the file list, it'll start to play that file.

## Motivation
Yet you can open and play (and pause, and so on) a mp3 file with Google Chrome, but only one file.
Chrome Player allows you to listen to multiple files without any annoying operation.

## Key bindings
Press ? to see the keyboard shortcuts.
(For shortcuts, I didn't write some to the list,
which appears when ? pressed.
For example, you can also use Alt+Space to pause.
This was added because in Mac, Ctrl+Space is Spotlight.
And as for Mac users, Command key can be also used
where it is written as: <Ctrl>.)

## Supported file types
music: mp3, ogg, aac, m4a
video: mp4

## Not implemented features, unfixed bugs
Save the file list
Support for other types like wav or flac

## Source code
I pushed this source to github.
https://github.com/itchyny/ChromePlayer (Local Player used to be named Chrome Player)
I allow you to fork another app from this code.

## Security
You may wonder why this App accesses "all data from your website". Actually, this App gets no data from your browsing site. This permission is needed for "Global keyboard control." It is realized by following: listening the keydown event, and if it was → or ←, the player catches that event and seek for next or previous music.

If you want see the script, open a site (www.google.com for example) and right click → inspect → Scripts, find chrome-extension://chkhjlbdflppmaddpjmjecgdagdljimc/js/shortcuts.js. "chkhjlbdflppmaddpjmjecgdagdljimc" is the id number for this App.

## Contact or comment
### Write a review!!!
### Any impression on this app is welcome.

## Enjoy!
