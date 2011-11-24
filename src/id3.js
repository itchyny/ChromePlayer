// id3 tag reader

String.prototype.toBin = function () {
  var ans = [], i = 9, b = this;
  while (--i) {
    ans.push (b & 128);
    b <<= 1;
  }
  return ans.join ("");
};

String.prototype.unsynchsafe = function () {
  return ( (this.charCodeAt (0) & 0x7f) << 21
          |(this.charCodeAt (1) & 0x7f) << 14
          |(this.charCodeAt (2) & 0x7f) << 7
          |(this.charCodeAt (3) & 0x7f));
};

function decode (chars) {
  switch (chars.charCodeAt(0)) {
    case 0:  // ISO-8859-1
      // log("ISO-8859-1"); // UTF-16?
    // console.log(chars);
    var a = "";
    for (var i = -1; i < chars.length; ) { // TODO
      // console.log(chars.charCodeAt(i++))
      // console.log(chars.charCodeAt(i++))
      // console.log(" --- ")
      a += String.fromCharCode((chars.charCodeAt(i++))
                               |chars.charCodeAt(i++))<<8;
    };
    // log ("a: " + a);
    // return a;
    return chars.toString ();
    case 2: { // UTF-16BE without BOM
      // log("UTF-16BE without BOM");
    }
    case 1: { // UTF-16 with BOM
      // log("UTF-16 with BOM");
      var a = "", StringfromCharCode = String.fromCharCode, kind;
      for (var i = 1, charslen = chars.length; i < charslen; ) {
        if (kind === 1 || ((chars.charCodeAt(i) & 0xff) === 0xff)) { // 2bytes
          if (!kind) {
            i += 2;
            kind = 1;
          }
          a += StringfromCharCode( chars.charCodeAt(i++)
                                  |(chars.charCodeAt(i++)<<8));
        } else if (kind === 2 || ((chars.charCodeAt(i) & 0xfe) === 0xfe)) { // 2bytes
          if (!kind) {
            i += 2;
            kind = 2;
          }
          a += StringfromCharCode( (chars.charCodeAt(i++)<<8)
                                  |chars.charCodeAt(i++));
        } else { // 1byte
          a += chars[i++];
        }
      }
      return a;
    }
    case 3: { // UTF-8
      // log("UTF-8");
      var a = "", StringfromCharCode = String.fromCharCode;
      for(var i = 1, charslen = chars.length; i < charslen; ) {
        var charsi = chars.charCodeAt(i);
        if (charsi & 128) {
          if (charsi & 32) {
            if (charsi & 16) {
              if (charsi & 8) {
                if (charsi & 4) { // U+04000000 .. U+7FFFFFFF
                  a += StringfromCharCode( (chars.charCodeAt(i++)&1)<<30
                                          |(chars.charCodeAt(i++)&63)<<24
                                          |(chars.charCodeAt(i++)&63)<<18
                                          |(chars.charCodeAt(i++)&63)<<12
                                          |(chars.charCodeAt(i++)&6)
                                          |(chars.charCodeAt(i++)) );
                } else { // U+00200000 .. U+03FFFFFF
                  a += StringfromCharCode( (chars.charCodeAt(i++)&3)<<24
                                          |(chars.charCodeAt(i++)&63)<<18
                                          |(chars.charCodeAt(i++)&63)<<12
                                          |(chars.charCodeAt(i++)&6)
                                          |(chars.charCodeAt(i++)) );
                }
              } else { // U+010000 .. U+1FFFFF
                a += StringfromCharCode( (chars.charCodeAt(i++)&7)<<18
                                        |(chars.charCodeAt(i++)&63)<<12
                                        |(chars.charCodeAt(i++)&6)
                                        |(chars.charCodeAt(i++)) );
              }
            } else { // U+0800 .. U+FFFF
              a += StringfromCharCode( (chars.charCodeAt(i++)&15)<<12
                                      |(chars.charCodeAt(i++)&63)<<6
                                      |(chars.charCodeAt(i++)&63) );
            }
          } else { // U+0080 .. U+07FF
            a += StringfromCharCode((chars.charCodeAt(i++)&31)<<6
                                    |chars.charCodeAt(i++)&63);
          }
        } else { // U+00 .. U+7F
          a += chars[i++];
        }
      }
      return a;
    }
  }
}

function _ID3 (result) {
  this.result = result;
  this.i = 0;
}

_ID3.prototype = {

  read: function () {
    // log ("id3 read")
    this.header();
    this.extendedheader();
    this.frames();
    return this.tags;
  },

  header: function () {
    // 10bytes header
    // log("------    header   ------");
    this.header = this.result.slice (this.i, this.i += 10);
    this.headerid = this.header.slice(0, 3);
    // log("headerid: " + this.headerid);
    this.version = [this.header.charCodeAt(3), this.header.charCodeAt(4)];
    // log("tagver : " + this.version);
    this.flags = this.header.slice(5, 6).toBin();
    // log("flags : " + this.flags);
    this.tagsize = this.header.slice(6, 10).unsynchsafe();
    // log("tagsize : " + this.tagsize);
  },

  extendedheader: function () {
    // ??bytes extended header
    // log("------    extended header   ------");
    if (this.flags[1] === "1") {
      var extendedsize = this.result.slice(this.i, this.i += 4).unsynchsafe();
      // log("extendedsize: " + extendedsize);
      var extendedheader = this.result.slice(this.i, this.i += extendedsize);
      // log("extendedheader: " + extendedheader);
    }
  },

  frames: function () {
    // ??bytes frames
    // log("------    frames   ------");
    var tags = {};
    var i = this.i;
    var ldecode = decode;
    var lparseInt = parseInt;
    while (i < this.tagsize) {
      var flameid = this.result.slice(i, i += 4);
      // console.log(flameid);
      var flamesize = ( function (x) {return lparseInt(x.charCodeAt(3), 10);})(this.result.slice(i, i += 4));
      var flameflg = this.result.slice(i, i += 2).toBin();
      var flametext = ldecode(this.result.slice(i, i += flamesize));
      if (flamesize) {
        // log("flame id: " + flameid);
        // log("flame size: " + flamesize);
        // log("flame flg: " + flameflg);
        // log("flame text: " + flametext);
        if (flametext) {
          tags[flameid] = flametext;
          if (this.shortcuts[flameid]) {
            tags[this.shortcuts[flameid]] = flametext;
          }
        }
      }
    }
    this.tags = tags;
  },

  shortcuts: {
    TIT2: "title",
    TPE1: "artist",
    TALB: "album",
    TYER: "year",
    COMM: "comment",
    TRCK: "track",
    TCON: "genre",
    APIC: "picture",
    USLT: "lyrics"
  }

};



if (typeof exports !== 'undefined') {
  exports._ID3 = _ID3;
}




