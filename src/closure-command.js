#! /usr/bin/env node
var closure = require ('./closure');

process.stdin.resume();
process.stdin.setEncoding ('utf8');

var program = "";
process.stdin.on ('data', function (chunk) {
  program += chunk;
});

process.stdin.on ('end', function () {
  closure.compile (program, function (e, c) {
    if (e) {
      console.log (e.toString());
      return;
    }
    console.log (c);
  });
});


