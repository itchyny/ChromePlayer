// UI
// dragenter等々を調べる

var UI = {

  init: function (player) {
    var self = this;
    self.player = player;
    self.div = (function (a, x) {
      a.forEach(function (b) { x[b] = $('#' + b); });
      return x;
    }) (['about'     , 'conf'         , 'config'  , 'current'    , 'filename' , 'fileselect',
         'firstrow'  , 'globalcontrol', 'help'    , 'musicSlider', 'mute'     , 'next'      ,
         'open'      , 'pause'        , 'play'    , 'playlist'   , 'prev'     , 'property'  ,
         'remain'    , 'repeat'       , 'scheme'  , 'shuffle'    , 'tablebody', 'tablediv'  ,
         'tagread'   , 'volumeSlider' , 'volumeon', 'wrapper'    , 'filter'   , 'filterword',
         'matchnum'  , 'notification' , 'notificationmsec'  , 'notificationresult' ,
         'info'      , 'infowrapper'  , 'albumart', 'seek'        ],
      { tbody: $('#tbody'),
        thead: $('thead'),
        table: $('table'),
        video: document.getElementsByTagName('video')[0]
    });
    self.initdrop ();
    self.initbuttons ();
    self.colorset ();
    self.initsize ();
    self.initslider ();
    // self.initschemes ();
    self.selectableSet ();
    self.initFilter ();
    self.initsplitter ();
    self.resizableSet ();
    self.initClickEscape ();
    self.fullScreenOff ();
    $(window).resize(function () { self.initsize (); });
    $('div#appname a').text('Local Player ver ' + player.version).click(function (e) {
      self.toggleAbout ();
    });
  },

  initdrop: function () {
    var self = this;
    document.body.ondragover = function (e) {
      // e.stopPropagation();
      e.preventDefault();
    };// TODO
    // document.body.dragenter = function (e) {
    //   e.stopPropagation();
    //   e.preventDefault();
    // };
    document.body.ondrop = function (e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files) {
        self.player.readFiles (e.dataTransfer.files);
      }
    };
  },

  initbuttons: function () {
    var self = this;
    var player = self.player;
    self.div.open.click(        function ()  { self.div.fileselect.click(); });
    self.div.fileselect.change( function (e) { player.readFiles(e.target.files); });
    self.div.play.click(        function ()  { player.toggle (); });
    self.div.pause.click(       function ()  { player.toggle (); });
    self.div.prev.click(        function ()  { player.prev (); });
    self.div.next.click(        function ()  { player.next (); });
    self.div.mute.click(        function ()  { player.mute (); });
    self.div.volumeon.click(    function ()  { player.resume (); });
    self.div.repeat.click(      function ()  { player.repeat.next (); });
    self.div.shuffle.click(     function ()  { player.shuffle.next (); });
    // self.div.conf.click(        function ()  { self.div.config.fadeToggle(200); });
    self.div.conf.click(        function ()  { window.open('./fancy-settings/source/index.html'); });
    $('img.lbutton, img.rbutton')
      .mouseup(function (e) { $(this).css({ 'top': '50%' }); })
      .mousedown(function (e) { $(this).css({ 'top': parseInt($(this).css('top'), 10) * 1.03 + '%' }); });
    self.div.filename.click(function () { self.selectNowplaying (); });
    self.div.tablebody.click (function () {
      self.focusIndex = 0;
      self.focusUpdate (true);
    });
    self.div.globalcontrol
      .attr({'checked':local.getSetting('globalcontrol')==='true'})
      .change(function (e) {
        local.set ('globalcontrol', e.target.checked.toString());
      });
    self.div.notification
      .attr({'checked': (local.getSetting ('notification') || 'true') === 'true'})
      .change(function (e) {
        local.set ('notification', e.target.checked.toString());
        if (undefined === local.getSetting ('notificationmsec')) {
          local.set ('notificationmsec', self.div.notificationmsec.valueAsNumber);
        }
      });
    local.set ('notification', self.div.notification.attr ('checked') === 'checked');
    function formatmsec (msec) {
      var sec = parseInt (parseInt (msec, 10) / 1000, 10);
      var secstr = sec < 10 ? "&nbsp;" + sec : sec;
      return secstr + 'sec';
    }
    self.div.notificationmsec
      .attr({'value': parseInt (local.getSetting ('notificationmsec'), 10) || 5000 })
      .change(function (e) {
        local.set ('notificationmsec', e.target.valueAsNumber);
        self.div.notificationresult.html (formatmsec (e.target.valueAsNumber));
      });
    self.div.notificationresult.html (formatmsec (self.div.notificationmsec.attr ('value')));
  },

  initsize: function () {
    var tbodyWdt = this.div.tbody.width();
    var fontSize = 12 * (window.innerWidth - 1280) / 2360 + 12;
    this.div.wrapper.css({ 'font-size': fontSize });
    this.div.playlist
      .height(window.innerHeight - this.div.playlist.offset().top - fontSize);
    this.div.tablediv
      .height(window.innerHeight - this.div.tablediv.offset().top - fontSize);
    this.div.tablebody
      .height(window.innerHeight - this.div.tablebody.offset().top - fontSize);
    // this.div.table
    //   .height(window.innerHeight - this.div.tablebody.offset().top - fontSize);
    // this.div.tbody
    //   .height(window.innerHeight - this.div.tablebody.offset().top - fontSize);
    $('tr').css({ 'width': tbodyWdt });
  },

  initsplitter: function () {
    var w;
    if (local.get ('splitter') === undefined) {
      w = {
        'now': 0.05,
        'filename': 0.10,
        'artist': 0.20,
        'title': 0.30,
        'track': 0.05,
        'album': 0.25
      };
    } else {
      w = JSON.parse (local.get ('splitter'));
      // w.now = 0.05;
    }
    for(var thname in w) {
      $('th.' + thname).width (w[thname] * (this.div.thead.width()));
    }
  },

  initschemes: function () {
    var theme = local.getSettingParse ('scheme') || 'classic-default';
    var self = this;
    for(var s in scheme) {
      $('<a />')
        .attr('scheme', s)
        //.text(s.replace(/classic-/, ''))
        .css({
          'color': scheme[s]['color']['div#wrapper'] || 'black',
          'background-color': scheme[s]['background-color']['div#wrapper']
        })
        .addClass( theme === s ? 'currentScheme' : '')
        .click(function () { self.setscheme($(this).attr('scheme')); })
        .appendTo(this.div.scheme);
      }
  },

  initslider: function () {
    var self = this;
    this.div.volumeSlider
      .slider({
        'min': 0,
        'max': 256,
        'step': 8,
        'value': self.player.volume.value,
        'slide': function () { self.player.updatevolume (); },
        'stop': function () { self.player.updatevolume (); }
      });
    this.div.musicSlider
      .slider({
        'min': 0,
        'max': 1,
        'step': 0.01,
        'start': function (e, ui) { self.startSlide (e, ui); },
        'stop': function (e, ui) { self.stopSlide (e, ui); }
      })
      .slider('disable');
  },

  initClickEscape: function () {
    var self = this;
    self.div.help.click(function () {
      self.div.help.fadeOut(200);
      self.focusIndex = 0;
      self.focusUpdate (true);
    });
    self.div.config.click(function (e) {
      if (['a', 'input', 'textarea'].indexOf(e.target.localName) < 0) {
        self.div.config.fadeOut(200);
        self.focusIndex = 0;
        self.focusUpdate (true);
      }
    });
    self.div.about.click(function (e) {
      if (e.target.localName !== 'a') {
        self.div.about.fadeOut(200);
        self.focusIndex = 0;
        self.focusUpdate (true);
      }
    });
    self.div.property.click(function (e) {
      if (e.target.localName !== 'a') {
        self.div.property.fadeOut(200);
        self.focusIndex = 0;
        self.focusUpdate (true);
      }
    });
    setTimeout (function () {
      self.div.thead
      .find('th')
      .each(function (i, th) {
        $(this).click( (function (i) {
          var order = 1;
          return function (e) {
            self.sortorder (i, order);
            order *= -1;
          };
        })(i))
      });
    }, 100);
  },

  setorder_identity: function (x) {
    return x;
  },
  setorder_replace_num: function (x) {
   return parseInt (x.replace(/１/,'1')
                     .replace(/２/,'2')
                     .replace(/３/,'3')
                     .replace(/４/,'4')
                     .replace(/５/,'5')
                     .replace(/６/,'6')
                     .replace(/７/,'7')
                     .replace(/８/,'8')
                     .replace(/９/,'9')
                     .replace(/０/,'0')
                     .replace(/[\0-\46]/g, '')
                     .replace(/\/.*/, ''), 10);
  },
  sortorder: (function () {
    var stack = [];
    return function (i, order) {
      var self = this;
      if (i === undefined) {
        i = 1;
      }
      var f = $('th').eq(i).text() === 'track' ? this.setorder_replace_num : this.setorder_identity;
      stack[1] = stack[0] ? (i === stack[0].i ? stack[1] : stack[0]) : {i:1, order:1, f: this.setorder_identity};
      stack[0] = {i: i, order: order, f: f};
      self.div.tbody.html(
          $('tr', self.div.tbody).sort((function () {
            var o = order, r = stack[1].order, j = i, k = stack[1].i, jTs = [], kTs = [];
            return function (a, b) {
              var anum = a.getAttribute ('number'), bnum = b.getAttribute('number');
              var ajT = jTs[anum] || (jTs[anum] = a.childNodes[j].innerText);
              var bjT = jTs[bnum] || (jTs[bnum] = b.childNodes[j].innerText);
              var akT = kTs[anum] || (kTs[anum] = a.childNodes[k].innerText);
              var bkT = kTs[bnum] || (kTs[bnum] = b.childNodes[k].innerText);
              return f(ajT) > f(bjT) ?  o :
                     f(ajT) < f(bjT) ? -o :
                     stack[1].f(akT) >= stack[1].f(bkT) ? r : -r;
            };
          })())
        );
      self.selectableSet();
      self.setorder ();
    };
  })(),

  setorder: function () {
    var arr = [];
    var self = this;
    $('tr', self.div.tbody)
      .each( function () { arr.push( parseInt( $(this).attr('number'), 10 ) ); });
    self.player.order.changeArray (arr);
    if (self.player.shuffle.value === 'true') {
      self.player.order.shuffleOn ();
    }
  },

  startSlide: function (e, ui) {
    if (this.seeking) {
      clearInterval (this.seeking);
    }
  },

  stopSlide: function (e, ui) {
    var self = this;
    if (self.player.seekAt (ui.value)) {
      self.seeking = setInterval (function () { self.seek (); }, 1000);
    }
  },

  addfile: function (file, index) {
    var html = [];
    var trs = '<td></td>'
            + '<td><div class="artist"></div></td>'
            + '<td></td>'
            + '<td><div class="title"></div></td>'
            + '<td></td>'
            + '<td><div class="track"></div></td>'
            + '<td></td>'
            + '<td><div class="album"></div></td>'
            + '</tr>';
    var h = -1;
    var tbodyWdt = this.div.tbody.width();
    html[++h] = '<tr class="music" number="';
    html[++h] = index;
    html[++h] = '" style="width:';
    html[++h] = tbodyWdt;
    html[++h] = 'px;">';
    html[++h] = '<td class="now">';
    html[++h] = '<td></td>';
    html[++h] = '<td><div class="filename" title="';
    html[++h] = file.name;
    html[++h] = '" >';
    html[++h] = file.name;
    html[++h] = '</div></td>';
    html[++h] = trs;
    this.div.tbody[0].innerHTML += html.join('');
  },

  ontagread: function (tags, index) {
    $('tr[number=' + index + ']')
    .find('.artist')
    .texttitle(tags.artist || '')
    .end()
    .find('.track')
    .texttitle(tags.track || '')
    .end()
    .find('.title')
    .texttitle(tags.title || '')
    .end()
    .find('.album')
    .texttitle(tags.album || '');
  },

  setdblclick: function () {
    var self = this;
    $('tr.music').dblclick (
      function (e) {
        self.div.musicSlider.slider ({ 'value': 0 });
        var index = parseInt( $(e.target).closest('tr').attr('number') || e.closest('tr').attr('number') || e.attr('number'), 10 );
        self.player.pause ();
        self.player.play (index);
    });
  },

  getvolume: function () {
    return parseInt(this.div.volumeSlider.slider('value'), 10);
  },

  setvolume: function (volume) {
    if (this.div && this.div.volumeSlider) {
      this.div.volumeSlider.slider({ 'value': volume });
    }
  },

  popupvideo: function () {
    this.div.video.parentNode.style.visibility = 'visible';
  },

  hidevideo: function () {
    this.div.video.parentNode.style.visibility = 'hidden';
  },

  showAlbumArt: function (file) {
    var art = $('img#art')[0];
    if (file.tags && file.tags.picture) {
      try {
        var image = file.tags.picture;
        art.src = "data:" + image.format + ";base64," + Base64.encodeBytes(image.data);
        this.div.albumart.addClass ('realart');
      } catch (e) {
        log (e);
        try {
          // TODO
        } catch (e) {
          art.src = './icon_128.png';
          this.div.albumart.removeClass ('realart');
        }
      }
    } else {
      art.src = './icon_128.png';
      this.div.albumart.removeClass ('realart');
    }
  },

  play: function (index) {
    var self = this;
    self.div.musicSlider.slider ('enable');
    var file = self.player.playing;
    if (this.fullScreen) this.fullScreenOn ();
    self.showFileName (file.name, index);
    $('tr.nP')
      .removeClass('nP')
      .find('img')
      .remove();
    $('tr[number=' + index.toString() + ']')
      .addClass('nP')
      .find('.now')
      .append( '<img src="./img/now.png">' );
    var $selected = $('tr.ui-selected');
    if ($selected.size() < 2) {
      $selected.UNSELECT(true);
      $('tr.nP').SELECT().LASTSELECT();
    }
    if (self.seeking) {
      clearInterval (self.seeking);
    }
    self.seeking = setInterval (function () { self.seek (); }, 1000);
    setTimeout (function () { self.reflesh (); }, 50);
    setTimeout (function () { self.reflesh (); }, 500);
    try {
    self.showAlbumArt (file);
    setTimeout (function () {
      self.showAlbumArt (file);
    }, 200);
    } catch (e) {};
  },

  pause: function () {
    var self = this;
    if (this.seeking) {
      clearInterval (this.seeking);
    }
    this.reflesh (false);
    setTimeout (function () { self.reflesh (); }, 50);
  },

  reflesh: function (b) {
    this.div.play.attr(
      b === false || (this.player.playing !== undefined
                                && this.player.playing.paused ()) ? {
        'src': './img/play.png',
        'title': 'Play'
      } : {
        'src': './img/pause.png',
        'title': 'Pause'
    });
  },

  seek: (function () {
    var convertTime = function (sec) {
      sec = parseInt(sec, 10);
      if (isNaN(sec)) return '00:00';
      var min = parseInt((sec / 60) % 60, 10);
      var hour = parseInt(sec / 3600, 10);
      sec %= 60;
      if (hour > 0) {
        return hour.toString() + ':' + (min < 10 ? '0' : '') + min.toString() + ':' + (sec < 10 ? '0' : '') + sec.toString();
      } else {
        return (min < 10 ? '0' : '') + min.toString() + ':' + (sec < 10 ? '0' : '') + sec.toString();
      }
    };
    return function () {
      if (this.player.playing != undefined && this.player.playing.audio) {
        var audioCurrentTime = this.player.playing.audio.currentTime;
        var audioDuration = this.player.playing.audio.duration;
        this.div.musicSlider.slider ({ 'value': audioCurrentTime / audioDuration });
        this.div.current.text (convertTime (audioCurrentTime));
        this.div.remain.text ('-' + convertTime (audioDuration - audioCurrentTime));
      }
    };
  })(),

  colorset: function () {
    var theme = local.getSettingParse ('scheme') || 'classic-default';
    var colorscheme = scheme[theme];
    $('a.currentScheme').removeClass('currentScheme');
    $('a[scheme=' + theme + ']').addClass('currentScheme');
    var styles = [];
    for(var attr in colorscheme) {
      for(var selector in colorscheme[attr]) {
        styles.push( selector + ' { ' + attr + ':' + colorscheme[attr][selector] + ';}' );
      }
    }
    $('style#sch').text(styles.join('\n')).size()
      || $('<style />', {'id': 'sch'}).text(styles.join('\n')).appendTo($('head'));
  },

  setscheme: function (scheme) {
    local.set ('scheme', scheme);
    this.colorset ();
  },

  resizableSet: function () {
    var self = this;
    $('th:not(.splitter)+th:not(.splitter)', this.div.thead)
      .each(function (i) {
        var flg = false;
        var splitter = $('<th />', {'class': 'splitter'}).mousedown(function (e) { flg = true; }).insertBefore($(this));
        // if (i === 0) return; // First column is unresizable.
        $(window)
          .mouseup(function (e) {
            if (flg) {
              flg = false;
              self.afterResize();
            }
          })
          .mousemove(function (e) {
            if (flg) {
              var prevWidth, totalWidth = splitter.prev().width() + splitter.next().width();
              splitter.prev().width( prevWidth = -splitter.prev().offset().left + e.clientX);
              splitter.next().width( totalWidth - prevWidth );
            }
          });
      });
  },

  afterResize: function () {
    var s = [], data = {}, theadWidth = this.div.thead.width();
    $('th:not(.splitter)').each(function (i, th) {
      var w = $(this).width() / (theadWidth - 0);
      s.push('td:nth-child(' + (i + 1) + ') {width:' + w * 100 + '%!important;}');
      data[$(this).attr('class')] = w;
    });
    local.set('splitter', JSON.stringify(data));
    this.selectableSet();
  },

  selectableSet: function () {
    // Clone trs every time on setting selectable.
    // This function is called when
    //   Input files.
    //   Sort the file list.
    //   Multi drag & drop action.
    var self = this;
    var tbodyWdt = self.div.tbody.width();
    $('tr', self.div.tbody)
    .each(function () {
      var $self = $(this);
      var n = $('<tr />')
      .attr({
        'number': $self.attr('number')
      })
      .append($self.children())
      .click(function (e) {
        var $last = $('tr.last-select');
        self.focusIndex = 0;
        self.focusUpdate (true);
        if (e.shiftKey && !e.altKey && $last.size()) {
          if (e.ctrlKey) {
            var selected = $('tr.ui-selected');
            setTimeout(
              function () {
              selected.SELECT(true);
            }, 20);
          }
          if (e.clientY < $last.position().top) {
            setTimeout(
              function () {
              $last
              .SELECT(true)
              .LASTSELECT()
              .prevAll()
              .filter(function () { return $(this).position().top > e.clientY; })
              .SELECT(true);
            }, 20);
          } else {
            setTimeout(
              function () {
              $last
              .SELECT(true)
              .LASTSELECT()
              .nextAll()
              .filter(function () { return $(this).position().top < e.clientY; })
              .SELECT(true);
            }, 20);
          }
        }
      })
      .dblclick (
        function (e) {
          var index = parseInt( $(e.target).closest('tr').attr('number') || e.closest('tr').attr('number') || e.attr('number'), 10 );
          self.player.pause ();
          self.player.play (index);
      })
      .width(tbodyWdt)
      .addClass( $self.hasClass('nP') ? 'nP': '' )
      .addClass( $self.hasClass('moved') ? 'ui-selected moved': '' )
      .addClass( $self.hasClass('ui-selected') ? 'ui-selected': '' )
      .appendTo(self.div.tbody);
      if ($self.ISSELECTED()) {
        setTimeout(function () {n.SELECT(true);}, 30);
      }
    })
    .remove();
    // Initialization of drag & drop multi select.
    $.fn.drag_drop_multi_select.unique=0;
    $.fn.drag_drop_multi_select.stack=[];
    $.fn.drag_drop_multi_select.settings=[];
    this.div.tbody.drag_drop_multi_select({
      'element_to_drag_drop_select': 'tr, this.div.tbody',
      'elements_to_drop': this.div.tbody,
      'moveOpacity': 0.7
    });
  },

  setrepeat: function (r) {
    if (this.div && this.div.repeat) {
      this.div.repeat
        .css({ 'opacity': (r === 'false' ? 0.4 : '') })
        .attr({ 'src': (r === 'one' ? './img/one.png' : './img/repeat.png') });
    }
  },

  setshuffle: function (s) {
    if (this.div && this.div.shuffle) {
      this.div.shuffle
        .css({
          'opacity': (s.toString() === 'true' ? '' : 0.4)
        });
    }
  },

  prevNotification: null,

  showNotification: function (picture, title, mes) {
    message.send (
      { type: 'notification'
        , from: 'player'
        , icon: picture
        , title: title
        , message: mes
    });
  },

  formatTags: function (tags) {
    return (tags && tags['TPE1'] && tags['TIT2']) ? tags['TPE1'] + ' - ' + tags['TIT2'] : '';
  },

  showFileName: function (filename, index, force) {
    var self = this;
    var music = this.player.musics[index];
    var tags = music.tags;
    filename = self.formatTags (tags) || filename;
    document.title = filename;
    this.div.filename.texttitle(filename);
    if (tags && tags.picture || force) {
        var image = tags && tags.picture ? tags.picture : undefined;
        try {
          var picture = image ? 'data:' + image.format + ';base64,' + Base64.encodeBytes (image.data)
                              : '../icon_128.png';
        } catch (e) {
          var picture = '../icon_128.png';
        }
        if (self.formatTags (tags) === '' || !tags.picture) {
          if (force) {
            if (tags.artist && tags.title && tags.album) {
              self.showNotification (picture, tags.artist, tags.title + '  /  ' + tags.album);
            } else {
              self.showNotification (picture, filename, "");
            }
          } else {
            setTimeout (function () {
              self.showFileName (filename, index, true);
            }, 200);
          }
        } else {
          self.showNotification (picture, tags.artist, tags.title + '  /  ' + tags.album);
        }
    } else {
      setTimeout (function () {
        self.showFileName (filename, index, true);
      }, 200);
    }
  },

  selectDown: function () {
    var self = this;
    var $selected = $('tr.ui-selected');
    if ($selected.size()) {
      $selected
        .UNSELECT(true)
        .next()
        .andSelf()
        .last()
        .SELECT()
        .LASTSELECT();
    } else {
      var $last = $('tr.last-select');
      if ($last.size()) {
        $last
          .last()
          .SELECT()
          .LASTSELECT();
      } else {
        $('tr.nP')
          .next()
          .andSelf()
          .last()
          .SELECT()
          .LASTSELECT()
          .size()
          || $('tr', self.div.tbody)
              .first()
              .SELECT()
              .LASTSELECT();
      }
    }
  },

  extendDown: function () {
    var $last = $('tr.last-select');
    if ($last.size()) {
      if ($last.prev().ISSELECTED()) {
        $last
          .prevAll()
          .filter( ( function () {var flg = true; return function () {return flg && (flg = $(this).ISSELECTED());} })() )
          .last()
          .UNSELECT();
      } else {
        $last
          .nextAll()
          .filter( ( function () {var flg = true; return function () {return flg && (flg = $(this).prev().ISSELECTED());} })() )
          .last()
          .SELECT();
      }
    }
  },

  selectUp: function () {
    var self = this;
    var $selected = $('tr.ui-selected');
    if ($selected.size()) {
      $selected
        .UNSELECT(true)
        .prev()
        .andSelf()
        .first()
        .SELECT()
        .LASTSELECT();
    } else {
      var $last = $('tr.last-select');
      if ($last.size()) {
        $last
          .first()
          .SELECT()
          .LASTSELECT();
      } else {
        $('tr.nP')
          .prev()
          .andSelf()
          .first()
          .SELECT()
          .LASTSELECT()
          .size()
          || $('tr', self.div.tbody)
              .last()
              .SELECT()
              .LASTSELECT();
      }
    }
  },

  extendUp: function () {
    var $last = $('tr.last-select');
    if ($last.size()) {
      if ($last.next().ISSELECTED()) {
        $last
          .nextAll()
          .filter( ( function () {var flg = true; return function () {return flg && (flg = $(this).ISSELECTED());} })() )
          .last()
          .UNSELECT();
      } else {
        $last
          .prevAll()
          .filter( ( function () {var flg = true; return function () {return flg && (flg = $(this).next().ISSELECTED());} })() )
          .last()
          .SELECT();
      }
    }
  },

  selectHome: function () {
    var self = this;
    $('tr.ui-selected')
      .UNSELECT(true);
    self.div.tbody.children()
    .first()
      .SELECT()
      .LASTSELECT();
  },

  extendToHome: function () {
    $('tr.ui-selected')
      .removeClass('ui-selected ddms_selected');
    $('tr.last-select')
      .SELECT(true)
    .prevAll()
      .SELECT(true)
    .last()
      .SELECT();
  },

  selectEnd: function () {
    var self = this;
    $('tr.ui-selected')
      .UNSELECT(true);
    self.div.tbody.children()
    .last()
      .SELECT()
      .LASTSELECT();
  },

  extendToEnd: function () {
    $('tr.ui-selected')
      .removeClass('ui-selected ddms_selected');
    $('tr.last-select')
      .SELECT(true)
    .nextAll()
      .SELECT(true)
    .last()
      .SELECT();
  },

  selectAll: function () {
    var self = this;
    self.div.tbody
      .children()
      .SELECT(true)
      .last()
      .LASTSELECT();
  },

  unselectAll: function () {
    var self = this;
    self.div.tbody
      .children()
      .UNSELECT(true);
  },

  selectInvert: function () {
    var self = this;
    var $selected = $('tr.ui-selected');
    self.div.tbody
      .children()
      .SELECT(true)
      .last()
      .LASTSELECT();
    $selected.UNSELECT (true);
  },

  toggleHelp: function () {
    var self = this;
    self.div.help.fadeToggle(200);
    if ($('div#help:hidden').size()) {
      div.tablebody.focus();
    }
  },

  toggleAbout: function () {
    this.div.about.fadeToggle(200);
  },

  // toggleConfig: function () {
  //   this.div.config.fadeToggle(200);
  // },

  deleteSelected: function () {
    var player = this.player;
    $('tr.ui-selected').last().next().LASTSELECT();
    $('tr.ui-selected').first().prev().LASTSELECT(true);
    $('tr.ui-selected')
      .map(
        function (i, tr) {
          return player.remove ( parseInt($(tr).attr('number'), 10) );
      });
    $('tr.ui-selected').remove();
  },

  selectNowplaying: function () {
    var self = this;
    $('tr.ui-selected').UNSELECT();
    $('tr.nP').SELECT().LASTSELECT();
    self.focusIndex = 0;
    self.focusUpdate ();
  },

  pageDown: function () {
    var self = this;
    self.div.tablebody.scrollTop( self.div.tablebody.scrollTop() + self.div.tablebody.height() * 0.8 );
    $('tr.ui-selected')
      .UNSELECT(true);
    var h = window.innerHeight;
    $('tr', self.div.tbody)
      .filter( function () { return $(this).position().top < h; } )
      .last()
      .SELECT()
      .LASTSELECT();
  },

  extendPageDown: function () {
    var self = this;
    self.div.tablebody.scrollTop( self.div.tablebody.scrollTop() + self.div.tablebody.height() * 0.8 );
    if ($('tr.last-select').prev().ISSELECTED()) {
      $('tr.ui-selected')
        .filter( function () { return $(this).position().top < self.div.thead.position().top + 40; } )
        .UNSELECT(true);
    } else {
      var h = window.innerHeight;
      $('tr.last-select')
        .nextAll()
        .filter( function () { return $(this).position().top < h; } )
        .SELECT(true)
        .last()
        .SELECT();
    }
  },

  pageUp: function () {
    var self = this;
    self.div.tablebody.scrollTop( self.div.tablebody.scrollTop() - self.div.tablebody.height() * 0.8 );
    $('tr.ui-selected')
      .UNSELECT(true);
    $('tr', self.div.tbody)
      .filter( function () { return $(this).position().top > 0; } )
      .first()
      .SELECT()
      .LASTSELECT();
  },

  extendPageUp:  function () {
    var self = this;
    self.div.tablebody.scrollTop( self.div.tablebody.scrollTop() - self.div.tablebody.height() * 0.8 );
    var h = window.innerHeight;
    var $last = $('tr.last-select', self.div.tbody);
    if ($last.next().ISSELECTED()) {
      $('tr.ui-selected')
        .filter( function () { return $(this).position().top > h - 50; })
        .UNSELECT(true);
    } else {
      $last
        .prevAll()
        .filter( function () { return $(this).position().top > 0; } )
        .SELECT(true)
        .last()
        .SELECT();
    }
  },

  defaultEnter: function () {
    var self = this;
    if ($('textarea#shortcuts:focus').size()) {
      return;
    }
    switch($('div#help:visible,div#config:visible,div#about:visible,div#property:visible').size()) {
      case 0:
        var $last = $('tr.last-select');
        if ($last.size ()) {
          $('tr.ui-selected')
            .UNSELECT(true)
          $last.SELECT().children().first().dblclick();
        } else {
          $('tr.ui-selected')
            .UNSELECT(true)
          .first()
          .children()
          .first()
          .dblclick();
        }
        return;
      default:
        self.div.config.add(self.div.help).add(self.div.property).add(self.div.about)
          .filter( function () { return $(':visible', this).size(); })
          .last()
          .fadeOut(200);
        return;
      }
  },

  viewInformation: function () {
    var self = this;
    var player = self.player;
    self.div.property.fadeIn(200);
    if (/* player.data.tagread === 'true' &&*/ player.tags) {
      var m = {
        'TALB': 'album',
        'TIT2': 'title',
        'TPE1':'artist',
        'TRCK': 'track',
        'TDRC': 'year'
      };
      var tags = $('tr.ui-selected').map( function (i, tr) {return player.tags[parseInt($(tr).attr('number'), 10)];});
      for(var flameid in m) {
        $('dd#id' + m[flameid])
          .text('　' + tags.map( function (i, x) {return x[flameid]}).unique().join());
      }
    }
  },

  escape: function () {
    var self = this;
    self.player.key.unlockAll ();
    self.filterEnd ();
    self.fullScreenOff ();
    switch($('#help:visible,#config:visible,#about:visible,#property:visible,#filter:visible').size()) {
      case 0:
        if ($('div#musicSlider a:focus, div#volumeSlider a:focus').size()) {
          $('div#musicSlider a, div#volumeSlider a').focusout();
          // self.focusIndex = 0;
          // self.focusUpdate (true);
        } else {
          $('tr.ui-selected').UNSELECT(true);
        }
        return;
      default:
        self.div.config.add(self.div.help).add(self.div.property).add(self.div.about)
          .filter( function () { return $(':visible', this).size(); })
          .last()
          .fadeOut(200);
        return;
      };
  },

  click: function (t) {
    var self = this;
    var i = self.div[t] || $('img#' + t);
    i.mousedown ().click();
    setTimeout ( function () {
      i.mouseup ();
    }, 200 );
  },


  focusIndex: 0,

  focusElements: function () {
    return [ $('#tbody')
           , $('div#musicSlider a')
           , $('div#volumeSlider a')
           ];
  },

  focusUpdate: function (focusonly) {
    this.focusElements ()[this.focusIndex].focus();
    if (focusonly) return;
    if (this.focusIndex === 0) {
      $('tr.ui-selected')
        .first()
        .SELECT()
        .size()
        || $('tr.nP')
            .SELECT()
            .LASTSELECT();
    }
  },

  focusToggle: function () {
    this.focusIndex = (this.focusIndex + 1) % 3;
    this.focusUpdate ();
  },

  focusToggleReverse: function () {
    this.focusIndex = (this.focusIndex - 1 + this.focusElements().length) % 3;
    this.focusUpdate ();
  },

  fullScreen: false,

  setVideoSize: function (width, height) {
    this.div.video.style.width = width + 'px';
    this.div.video.style.marginLeft = (- width / 2) + 'px';
    this.div.video.style.height = height + 'px';
    this.div.video.style.marginTop = (- height / 2) + 'px';
  },

  fullScreenOnVideo: function () {
    var video = this.div.video;
    video.controls = false;
    video.style.cursor = 'none';
    document.onmousemove = function () { // TODO
      video.controls = true;
      video.style.cursor = 'true';
      setTimeout (function () {
        video.controls = false;
        video.style.cursor = 'none';
      }, 1000);
    };
    if (video.webkitRequestFullScreen) {
      video.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else {
      this.setVideoSize (window.outerWidth, window.outerHeight);
    }
  },

  fullScreenOnAudio: function () {
    this.div.info[0].webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    var srcheight = window.screen.availHeight;
    var styles = [
      'div#wrapper div#info{',
      '  height: ' + srcheight + 'px!important;',
      '}',
      'div#wrapper div#filename{',
      '  margin-top:' + (0.5 - 0.1) * srcheight + 'px!important;',
      '}',
      'div#wrapper div#seek{',
      '  top:' + (0.5) * srcheight + 'px!important;',
      '}',
      'div#wrapper div#albumart{',
      '  width: ' + 0.4 * srcheight + 'px!important;',
      '  height: ' + 0.4 * srcheight + 'px!important;',
      '  margin-top:' + (-0.5 * 0.4) * srcheight + 'px!important;',
      '}',
      'div#wrapper div#albumart img{',
      '  width: ' + 0.4 * srcheight + 'px!important;',
      '  height: ' + 0.4 * srcheight + 'px!important;',
      '}'
    ];
    $('style#full').text(styles.join('\n'));
    this.div.info.addClass ('full');
  },

  fullScreenType: null,

  fullScreenOn: function () {
    if (!this.player.playing) return;
    if (this.player.playing.filetype === 'video') {
      if (this.fullScreen && this.fullScreenType === 'video') return;
      this.fullScreenOffAudio ();
      this.fullScreenOnVideo ();
      var self = this;
      setTimeout (function () {
        self.fullScreenOnVideo ();
      }, 500);
      this.fullScreenType = 'video';
    } else if (this.player.playing.filetype === 'audio') {
      if (this.fullScreen && this.fullScreenType === 'audio') return;
      this.fullScreenOffVideo ();
      this.fullScreenOnAudio ();
      this.fullScreenType = 'audio';
    }
    this.fullScreen = true;
  },

  fullScreenOffVideo: function () {
    var width;
    if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else {
      this.setVideoSize (width = window.outerWidth * 0.6, width / 16 * 9);
    }
  },

  fullScreenOffAudio: function () {
    this.div.info.removeClass ('full');
    $('style#full').text('');
  },

  fullScreenOff: function () {
    this.fullScreenType = '';
    this.fullScreen = false;
    this.fullScreenOffVideo ();
    this.fullScreenOffAudio ();
  },

  fullScreenToggle: function () {
    if (this.fullScreen) {
      this.fullScreenOff ();
    } else {
      this.fullScreenOn ();
    }
  },

  initFilter: function () {
    var self = this;
    this.div.filterword.keydown(function (e) { self.filterKeydown (e); });
  },

  filterStart: function () {
    var tags = [], trs = [], index = 0, selected = $('ui-selected');
    this.div.filter.fadeIn(200);
    var input = this.div.filterword.focus()[0];//.val('');
    input.selectionStart = 0;
    input.selectionEnd = input.value.length;
    $('tr', this.div.tbody).each(function (i, x) {
      tags[i] = ((function (x) {
        var a = [];
        for (i in x) {
          a.push(x[i])
        }
        return a;
      })(self.player.musics[$(x).attr('number')].tags)).join('•').toLowerCase();
    });
    this.div.matchnum.text('');
    this.filterTags = tags;
  },

  filterKeydown: function (e) {
    var self = this;
    setTimeout( function () {
      if (e.keyCode === 13) { self.filterBlink (); return; };
      if (e.keyCode === 27) { self.filterEnd (); return; };
      var s = (e.target.value).toLowerCase();
      var matched = [];
      var $trs = $('tr', self.div.tbody);
      $('tr.ui-selected', self.div.tbody).UNSELECT(true);
      if (!s) {
        self.div.matchnum.text(0 + '/' + $trs.length);
        return;
      }
      try {
      self.filterTags.forEach(function (t, i) {
        if (t.match(s) !== null) {
          matched.push(i);
        }
      });
      matched.forEach(function (n) {
        $trs.eq(n).SELECT(true);
      });
      self.div.matchnum.text(matched.length + '/' + $trs.length);
      var selected = $('tr.ui-selected');
      } catch (e){};
      //if (matched.length < 3) $trs.eq(matched[0]).SELECT().LASTSELECT();
    }, 20);
  },

  filterEnd: function () {
    this.div.filter.fadeOut(200);
    this.div.filterword.focusout ();
    // this.div.table.focusin ();
    this.focusUpdate ();
  },

  filterIndex: 0,
  filterBlink: function () {
    if (isNaN(this.filterIndex)) {
      this.filterIndex = 0;
    };
    var selected = $('tr.ui-selected');
    var x = selected.eq(this.filterIndex).UNSELECT(true);
    setTimeout( function () { x.SELECT(false, true).LASTSELECT(); }, 200);
    this.filterIndex = (++this.filterIndex) % selected.size();
  }

};

$.fn.SELECT = function (flg, anime) {
  if (this.size()) {
    this
      .addClass('ui-selected ddms_selected');
    if (flg) {
      // If flg is true, not scroll. Default is false(Scroll follows).
      return this;
    }
    var offsetTop = this.offset().top;
    var firstRow = UI.div.tablebody.offset().top;
    var rm = offsetTop - 30 - firstRow;
    var ex = offsetTop + 60 - UI.div.tablediv.height() - firstRow;
     if (rm < 0) {
       if (anime) {
         UI.div.tablebody.animate({scrollTop: '+=' + rm}, {duration: 'fast', easing: 'linear'});
       } else {
         UI.div.tablebody.scrollTop(UI.div.tablebody.scrollTop() + rm);
       }
     } else if (ex > 0) {
       if (anime) {
         UI.div.tablebody.animate({scrollTop: '+=' + ex}, {duration: 'fast', easing: 'linear'});
       } else {
         UI.div.tablebody.scrollTop(UI.div.tablebody.scrollTop() + ex);
         //tablebody.scrollTop += ex;
       }
     }
  }
  return this;
};

$.fn.UNSELECT = function (flg) {
  if (!flg) this.SELECT();
  return this.removeClass('ui-selected ddms_selected last-select');
};

$.fn.LASTSELECT = function (flg) {
  if (!flg) {
    $('tr.last-select', UI.div.tbody)
      .removeClass('last-select');
  }
  return this.addClass('last-select');
};

$.fn.ISSELECTED = function () {
  return this.hasClass('ui-selected');
};

$.fn.drag_drop_multi_select.defaults.while_dragging_action = function (e, ui) {
  var eY = e.originalEvent.clientY;
  var trs = $('tr', UI.div.tbody);
  var trHgtHlf = trs.first().height() / 2;
  var $target = trs
                .filter(function () { var d = eY - $(this).offset().top; return -trHgtHlf <= d && d < trHgtHlf; } )
                .first();
  trs.removeClass('dragover');
  var $dragover = $target.addClass('dragover');
  setTimeout (function () {
    $dragover.removeClass ('dragover');
  }, 5000);
};

$.fn.drag_drop_multi_select.defaults.after_drop_action = function ($item, $old, $new, e, ui) {
logfn ('drag_drop_multi_select.defaults.after_drop_action');
  var trs = $('tr', UI.div.tbody);
  var itemNum = $item.first().attr('number');
  var trHgtHlf = trs.first().height() / 2;
  var eY = e.originalEvent.clientY;
  var $target = trs
                .filter(function () { var d = eY - $(this).offset().top; return -trHgtHlf <= d && d < trHgtHlf; } )
                .first();
  if (itemNum === $target.attr('number')) {
    var $next = $item.last().next();
    $item
      .insertBefore($next)
      .addClass('ui-selected moved');
      console.log($next)
  } else {
    $item
      .insertBefore($target)
      .addClass('ui-selected moved');
      console.log($target)
  }
  setTimeout(function () { UI.selectableSet(); }, 30);
  setTimeout(
    function () {
      $('tr.ui-selected', UI.div.tbody)
        .removeClass('ui-selected moved last-select');
      UI.setorder ();
    }, 1000
  );
};

