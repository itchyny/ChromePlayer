# For anyone who read this source

## Name of the app
This app used to be "Chrome Player," but Chrome is the trademark of Google, so I renamed to "Local Player."

## Code reading
* See makefile at first.
      * This is the file list which index.html will include. However, index.html uses JavaScript files in src/ and main.js is comment outed. This is because when I'm developping this app, I don't have to make main.js each time I editted JavaScript file.
* See player.js. This is the main code of the player.
* For keybinding management, see keyconfig.js and command.js, key.js.

## When you edit this code
* Basically, do not edit folloing code (but enumdinamic may have a bug, so you can fix that if found.)
      * enum.js
      * enumlinear.js
      * enumcycle.js
      * enumdinamic.js
      * limited.js

## Coding style, promise
* When you edit html files, edit index\_base.html or bg\_index\_base.html, not index.html nor bg\_index.html.
* When you use notification, you should use notification.createNotification in notification.js. Do not use webkitNotifications.createNotification directly.
* When you use localStorage, you should use local.(get|set) in local.js. Do not use localStorage directly.
* For message passing, use message.send in message.js. However, I should write more things in this file...
* For logging some message, use log or logfn in prelude.js. These are disabled in main.js (See \_footer.js).
* Underscores of \_header.js and \_footer.js mean that they are incomplete codes. These wrap all the JavaScript code in a closure, and any object should not be exposed to window in main.js. (See makefile.)


