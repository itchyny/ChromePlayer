#! /usr/bin/env node

var fs = require('fs'),
    http = require('http'),
    querystring = require('querystring');
var closure = require('./closure');

// closure.compile(
//   '(function () {var variable =    10 *   20;  /*  comment   */  ;;   alert (  variable  );})();',
//   function (e, c) {
//     if(e) {
//       console.log(e.toString());
//       return;
//     }
//     console.log(c);
//   }
// );

var convert = function () {
  fs.readFile(
    './js/main.js',
    'UTF-8',
    function (e, d) {
      if(e){
        throw e;
      }
      d = d
           .replace(/SELECT/g, 'S')
           .replace(/UNS/g, 'U')
           .replace(/LASTS/g, 'L')
           .replace(/ISSED/g, 'I')
           .replace(/player\.(k|c|o|r|v|l|i|d|a|st|sh|f)[a-z]{2,20}/g, 'p\.$1')
           .replace(/data:/, 'd:')
           .replace(/player/g, 'p')
           .replace(/AUDIO/g, 'A')
           .replace(/DIV/g, 'D')
           .replace(/__SELECTED__/g, 'E')
          closure.compile(
            d,
            function(e, c){
            if(e) throw e;
            c =("/*!\n"
              + " *       Chrome Player vVERSION\n"
              + " *             created by itchyny\n"
              + " *\n"
              + " *     Work on Google Chrome 9.0\n"
              + " *     Copyright (c) 2011 itchyny\n"
              + " *\n"
              + " *     Last Modified: DATE\n"
              + " *\n"
              + " */\n"
              + "").replace(/DATE/, new Date().toGMTString()) + c;
          c = c.replace(/VERSION/g, '1.58');
          fs.writeFile(
            './js/main.min.js',
            c,
            function (e) {
              if(e) console.log('error' + e);
              console.log('file write completed');
            }
          );
        }
      );
    }
  );
}


convert();

