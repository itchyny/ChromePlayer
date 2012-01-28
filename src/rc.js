var Rc = {
  regex: {
    white: /^((\s*)\s)/,
    onekey: /^((<((([cmasCMAS]\-)*)(f(10|11|12|1|2|3|4|5|6|7|8|9)|backspace|tab|enter|shift|ctrl|alt|esc|space|pgup|pgdn|end|home|left|up|right|down|insert|delete|ctrl|numlock|[*+/:;,\-.\/@\[\\\]\^]|[a-z])))>|f(10|11|12|1|2|3|4|5|6|7|8|9)|backspace|tab|enter|shift|ctrl|alt|esc|space|pgup|pgdn|end|home|left|up|right|down|insert|delete|ctrl|numlock|[*+/:;,\-.\/@\[\\\]\^]|[a-z])/,
    command: /^((map|unmap|gmap|gunmap|avoid)\s)/,
    rhscommand: /^([A-Z]([a-zA-Z]*))/,
    rhs: /^(((([A-Z]([a-zA-Z]*))((\s*)\s))*)([A-Z]([a-zA-Z]*)))/,
    comment: /^(#(.*))/,
  },
  match: function (match, obj) {
    var str = obj.str;
    var regex = this.regex[match];
    var result = regex.exec (str);
    if (result) {
      var r = result[0];
      var newstr = str.slice (r.length);
      var newcol = obj.col + r.length;
      return { result: r, length: r.length, col: newcol, line: obj.line, str: newstr };
    } else {
      return { str: str, col: obj.col, line: obj.line };
    }
  },
  // matchcommand: function (s) {
  //   var a = this.regex.command.exec (s);
  //   return a ? a[0], null;
  // },
  // trimmatch: function (result, str) {
  //   return str.slice (result.length);
  // },
  delwhite: function (obj) {
    return this.match ('white', obj);
  },
  delcomment: function (obj) {
    return this.match ('comment', obj);
  },
  delwhiteandcomment: function (obj) {
    return this.delcomment (this.delwhite (obj));
  },
  getallkey: function (obj) {
    var ans = [];
    var obj = this.match ('onekey', obj);
    while (obj.result) {
      ans.push (obj.result);
      if (obj.str !== '') {
        obj = this.delwhiteandcomment (obj);
        obj = this.match ('onekey', obj);
      } else {
        delete obj.result;
      }
    }
    obj.result = ans;
    return obj;
  },

  parseerror: function (obj) {
    console.dir (obj)
    throw obj.str + '\n' +
      "Parse Error at line: " + obj.line + " column: " + obj.col;
  },
  parseavoid: function (obj) {
    // TODO: make regex of regex
  },
  errorifnullstr: function (obj) {
    if (obj.str === '')
      this.parseerror (obj);
  },
  getcommand: function (obj) {
    obj = this.match ('command', obj);
    if (!obj.result) {
      this.parseerror (obj);
    } else {
      obj.result = obj.result.slice (0, -1);
      return obj;
    }
  },
  parseline: function (obj) {
    obj = this.delwhiteandcomment (obj);
    if (obj.str === '') {
      return null;
    } else {
      obj = this.getcommand (obj);
      if (!obj.result) {
        this.parseerror (obj);
      } else {
        var command = obj.result;
        if (command === 'avoid') {
          this.parseavoid (obj);
        } else if (command === 'unmap' || command === 'gunmap') {
          obj = this.delwhiteandcomment (obj);
          this.errorifnullstr (obj);
          obj = this.getallkey (obj);
          if (obj.result === []) {
            this.parseerror (obj);
          } else {
            var keys = obj.result;
            obj = this.delwhiteandcomment (obj);
            if (obj.str !== '') {
              this.parseerror (obj);
            }
            return { obj: obj, result: { command: command, result: keys } };
          }
        } else {
          obj = this.delwhiteandcomment (obj);
          this.errorifnullstr (obj);
          obj = this.getallkey (obj);
          var keys = obj.result;
          obj = this.delwhiteandcomment (obj);
          if (obj.str === '') {
            return { obj: obj, result: { command: command, result: keys } };
          }
          if (obj.result === []) {
            this.parseerror (obj);
          } else {
            obj = this.delwhiteandcomment (obj);
            this.errorifnullstr (obj);
            var obj = this.match ('rhscommand', obj);
            if (!obj.result) {
              this.parseerror (obj);
            } else {
              var rhscommand = obj.result;
              obj = this.delwhiteandcomment (obj);
              if (obj.str !== '')
                this.parseerror (obj);
              return { obj: obj, result: { command: command, result: keys, rhscommand: rhscommand } };
            }
          }
        }
      }
      return obj;
    }
  },
  parselines: function (ss) {
    var obj;
    var ans = [];
    for (var i = 0; i < ss.length; i++) {
      obj = this.parseline ({ str: ss[i], col: 0, line: i + 1});
      if (obj) {
        ans.push (obj.result);
      }
    }
    return ans;
  },
};

/*
s = '   map jj<s-f>  PageDown;VolumeToggleMute'
s = '   map jj<s-f>  PageDown'
s = '   map jj+/<c-s-/><s-f>rd  PageDown'
ss = '   unmap jj<s-f> '
com = ' map p j F  #oijoiaj oai jo ijoi jo i'
obj = { str: s, col: 0, line: 0 }
r = Rc.parseline (obj);
console.log (r)
r = Rc.parselines (s + "\n" + ss + "\n"+  com + "\n" + s);
console.log (r)
*/
