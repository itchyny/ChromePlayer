// UI

var UI = {

  start: function (player) {
    var self = this;
    self.player = player;
    self.div = (function (a, x) {
      a.forEach(function (b) { x[b] = $('#' + b); });
      return x;
    })(['about', 'conf', 'config', 'current', 'filename', 'fileselect',
    'firstrow', 'globalcontrol', 'help', 'musicSlider', 'mute', 'next',
    'open', 'pause', 'play', 'playlist', 'prev', 'property', 'remain',
    'repeat', 'scheme', 'shuffle', 'tablebody', 'tablediv', 'tagread',
    'volumeSlider', 'volumeon', 'wrapper', 'filter', 'filterword', 'matchnum'],
    {tbody: $('#tbody'), thead: $('thead'), table: $('table')});
    self.initdrop ();
    self.initbuttons ();
    self.colorset ();
    self.initsize ();
    self.initslider ();
    self.initschemes ();
    self.initsplitter ();
    self.resizableSet ();
    self.selectableSet ();
    $(window).resize(function () { self.initsize (); });
    $('div#appname a').text('Local Player v' + player.version);
  },

  initdrop: function () {
    var self = this;
    document.body.ondragover = function (e) {
      e.preventDefault();
    };
    document.body.ondrop = function (e) {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files) {
        self.player.readFiles (e.dataTransfer.files);
      }
    };
  },

  initbuttons: function () {
    var self = this;
    var player = self.player;
    self.div.open.click(function () { self.div.fileselect.click(); });
    self.div.fileselect.change(function (e) { player.readFiles(e.target.files); });
    self.div.play.click(function () { player.toggle (); });
    self.div.pause.click(function () { player.toggle (); });
    self.div.prev.click(function () { player.prev (); });
    self.div.next.click(function () { player.next (); });
    self.div.mute.click(function () { player.mute (); });
    self.div.volumeon.click(function () { player.resume (); });
    self.div.repeat.click(function () { player.repeat.next (); });
    self.div.shuffle.click(function () { player.shuffle.next (); });
    self.div.conf.click(function () { self.div.config.fadeToggle(200); });
    $('img.lbutton, img.rbutton')
      .mouseup(function (e) { $(this).css({ 'top': '50%' }); })
      .mousedown(function (e) { $(this).css({ 'top': parseInt($(this).css('top'), 10) * 1.03 + '%' }); });
  },

  initsize: function () {
    var tbodyWdt = this.div.tbody.width(),
        fontSize = 12 * (window.innerWidth - 1280) / 2360 + 12;
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
    if(local.get ('splitter') === undefined) {
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
      w.now = 0.05;
    }
    for(var thname in w) {
      $('th.' + thname).width (w[thname] * (this.div.thead.width()));
    }
  },

  initschemes: function () {
    var theme = local.get ('scheme') || 'classic-default';
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

  startSlide: function (e, ui) {
    if (this.seeking) {
      clearInterval (this.seeking);
    }
  },

  stopSlide: function (e, ui) {
    console.dir (e);
    console.dir (ui);
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
    .texttitle(tags['TPE1'] || '')
    .end()
    .find('.track')
    .texttitle(tags['TRCK'] || '')
    .end()
    .find('.title')
    .texttitle(tags['TIT2'] || '')
    .end()
    .find('.album')
    .texttitle(tags['TALB'] || '');
  },

  setdblclick: function () {
    var self = this;
    $('tr.music').dblclick (
      function (e) {
        self.div.musicSlider.slider ({ 'value': 0 });
        var index = parseInt( $(e.target).closest('tr').attr('number') || e.closest('tr').attr('number') || e.attr('number'), 10 );
        self.player.pause ();
        self.player.play (index);
        // TODO: この時, player.orderをどう動かすか
    });
  },

  get volume () {
    return parseInt(this.div.volumeSlider.slider('value'), 10);
  },

  setvolume: function (volume) {
    if (this.div && this.div.volumeSlider) {
      this.div.volumeSlider.slider({ 'value': volume });
    }
  },

  play: function (index) {
    var self = this;
    self.div.musicSlider.slider ('enable');
    self.showFileName (self.player.playing.name, index);
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
      var min = parseInt((sec / 60) % 60, 10),
          hour = parseInt(sec / 3600, 10);
      sec %= 60;
      if (hour > 0) {
        return hour.toString() + ':' + (min < 10 ? '0' : '') + min.toString() + ':' + (sec < 10 ? '0' : '') + sec.toString();
      } else {
        return (min < 10 ? '0' : '') + min.toString() + ':' + (sec < 10 ? '0' : '') + sec.toString();
      }
    };
    return function () {
      if (this.player.playing != undefined && this.player.playing.audio) {
        var audioCurrentTime = this.player.playing.audio.currentTime,
            audioDuration = this.player.playing.audio.duration;
        this.div.musicSlider.slider ({ 'value': audioCurrentTime / audioDuration });
        this.div.current.text (convertTime (audioCurrentTime));
        this.div.remain.text ('-' + convertTime (audioDuration - audioCurrentTime));
      }
    };
  })(),

  colorset: function () {
    var theme = local.get ('scheme') || 'classic-default';
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
        if (i === 0) return; // First column is unresizable.
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
    var tbodyWdt = UI.div.tbody.width();
    var self = this;
    $('tr', self.div.tbody)
    .each(function () {
      var $self = $(this),
      n = $('<tr />')
      .attr({
        'number': $self.attr('number')
      })
      .append($self.children())
      .click(function (e) {
        var $last = $('tr.last-select');
        if(e.shiftKey && !e.altKey && $last.size()) {
          if(e.ctrlKey) {
            var selected = $('tr.ui-selected');
            setTimeout(
              function () {
              selected.SELECT(true);
            }, 20);
          }
          if(e.clientY < $last.position().top) {
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
      .appendTo(UI.div.tbody);
      if($self.ISSELECTED()) {
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

  showFileName: function (filename, index) {
    var tags = this.player.musics[index].tags;
    if(tags && tags['TIT2']) {
      document.title =  (tags['TIT2'] || '') + ' - ' + (tags['TPE1'] || '') + ',' + (tags['TALB'] || '');
      filename = tags['TPE1'] + ' - ' + tags['TIT2'];
    }
    document.title = filename;
    this.div.filename.texttitle(filename);
  },

  selectDown: function () {
    var $selected = $('tr.ui-selected'),
        $last = $('tr.last-select');
    if($selected.size()) {
      $selected
        .UNSELECT(true)
        .next()
        .andSelf()
        .last()
        .SELECT()
        .LASTSELECT();
    } else if($last.size()) {
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
        || $('tr', UI.div.tbody)
            .first()
            .SELECT()
            .LASTSELECT();
    }
  },

  extendDown: function () {
    var $last = $('tr.last-select');
    if($last.size()) {
      if($last.prev().ISSELECTED()) {
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
    var $selected = $('tr.ui-selected'),
        $last = $('tr.last-select');
    if($selected.size()) {
      $selected
        .UNSELECT(true)
        .prev()
        .andSelf()
        .first()
        .SELECT()
        .LASTSELECT();
    } else if($last.size()) {
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
        || $('tr', UI.div.tbody)
            .last()
            .SELECT()
            .LASTSELECT();
    }
  },

  extendUp: function () {
    var $last = $('tr.last-select');
    if($last.size()) {
      if($last.next().ISSELECTED()) {
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
    $('tr.ui-selected')
      .UNSELECT(true);
    UI.div.tbody.children()
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
    $('tr.ui-selected')
      .UNSELECT(true);
    UI.div.tbody.children()
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
    UI.div.tbody
      .children()
      .SELECT(true)
      .last()
      .LASTSELECT();
  },

  unselectAll: function () {
    UI.div.tbody
      .children()
      .UNSELECT(true);
  },

  toggleHelp: function () {
    UI.div.help.fadeToggle(200);
    if($('div#help:hidden').size()) {
      div.tablebody.focus();
    }
  },

  toggleAbout: function () {
      UI.div.about.fadeToggle(200);
  },

  toggleConfig: function () {
      UI.div.config.fadeToggle(200);
  },

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

  pageDown: function () {
    UI.div.tablebody.scrollTop( UI.div.tablebody.scrollTop() + UI.div.tablebody.height() * 0.8 );
    $('tr.ui-selected')
      .UNSELECT(true);
    var h = window.innerHeight;
    $('tr', DIV.tbody)
      .filter( function () { return $(this).position().top < h; } )
      .last()
      .SELECT()
      .LASTSELECT();
  },

  extendPageDown: function () {
    UI.div.tablebody.scrollTop( UI.div.tablebody.scrollTop() + UI.div.tablebody.height() * 0.8 );
    if($('tr.last-select').prev().ISSELECTED()) {
      $('tr.ui-selected')
        .filter( function () { return $(this).position().top < UI.div.thead.position().top + 40; } )
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
    UI.div.tablebody.scrollTop( UI.div.tablebody.scrollTop() - UI.div.tablebody.height() * 0.8 );
    $('tr.ui-selected')
      .UNSELECT(true);
    $('tr', UI.div.tbody)
      .filter( function () { return $(this).position().top > 0; } )
      .first()
      .SELECT()
      .LASTSELECT();
  },

  extendPageUp:  function () {
    UI.div.tablebody.scrollTop( UI.div.tablebody.scrollTop() - UI.div.tablebody.height() * 0.8 );
    var h = window.innerHeight,
        $last = $('tr.last-select', UI.div.tbody);
    if($last.next().ISSELECTED()) {
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
    if ($('textarea#shortcuts:focus').size()) {
      return;
    }
    switch($('div#help:visible,div#config:visible,div#about:visible,div#property:visible').size()) {
      case 0:
        $('tr.ui-selected')
          .UNSELECT(true)
        .first()
        .children()
        .first()
        .dblclick();
        return;
      default:
        UI.div.config.add(UI.div.help).add(UI.div.property).add(UI.div.about)
          .filter( function () { return $(':visible', this).size(); })
          .last()
          .fadeOut(200);
        return;
      }
  },

  viewInformation: function (player) {
    UI.div.property.fadeIn(200);
    if (/* player.data.tagread === 'true' &&*/ player.tags) {
      var m = {
        'TALB': 'album',
        'TIT2': 'title',
        'TPE1':'artist',
        'TRCK': 'track',
        'TDRC': 'year'
      },
      tags = $('tr.ui-selected').map( function (i, tr) {return player.tags[parseInt($(tr).attr('number'), 10)];});
      for(var flameid in m) {
        $('dd#id' + m[flameid])
          .text('　' + tags.map( function (i, x) {return x[flameid]}).unique().join());
      }
    }
  },

  escape: function () {
    switch($('#help:visible,#config:visible,#about:visible,#property:visible,#filter:visible').size()) {
      case 0:
        if($('div#musicSlider a:focus, div#volumeSlider a:focus').size()) {
          // player.key.tab(0);
          $('div#musicSlider a, div#volumeSlider a').focusout();
        } else {
          $('tr.ui-selected').UNSELECT(true);
        }
        return;
      default:
        UI.div.config.add(UI.div.help).add(UI.div.property).add(UI.div.about)
          .filter( function () { return $(':visible', this).size(); })
          .last()
          .fadeOut(200);
        // player.filter.end();
        return;
      };
  },

  // toggleMute: function () { // player.toggleMute
  //   if (player.volume.value === 0 && player.predvol !== undefined) {
  //     this.click ('volumeon');
  //   } else {
  //     this.click ('mute');
  //   }
  // },

  click: function (t) {
    var i = UI.div[t] || $('img#' + t);
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

  focusUpdate: function () {
    this.focusElements ()[this.focusIndex].focus();
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

};

$.fn.SELECT = function (flg, anime) {
  if(this.size()) {
    this
      .addClass('ui-selected ddms_selected');
    if(flg) {
      // If flg is true, not scroll. Default is false(Scroll follows).
      return this;
    }
    var offsetTop = this.offset().top,
        firstRow = UI.div.tablebody.offset().top,
        rm = offsetTop - 30 - firstRow,
        ex = offsetTop + 60 - UI.div.tablediv.height() - firstRow;
     if(rm < 0) {
       if (anime) {
         UI.div.tablebody.animate({scrollTop: '+=' + rm}, {duration: 'fast', easing: 'linear'});
       } else {
         UI.div.tablebody.scrollTop(UI.div.tablebody.scrollTop() + rm);
       }
     } else if(ex > 0) {
       if(anime) {
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
  if(!flg) this.SELECT();
  return this.removeClass('ui-selected ddms_selected last-select');
};

$.fn.LASTSELECT = function (flg) {
  if(!flg) {
    $('tr.last-select', UI.div.tbody)
      .removeClass('last-select');
  }
  return this.addClass('last-select');
};

$.fn.ISSELECTED = function () {
  return this.hasClass('ui-selected');
};

$.fn.drag_drop_multi_select.defaults.after_drop_action = function ($item, $old, $new, e, ui) {
  var itemNum = $item.first().attr('number'),
      trHgtHlf = $('tr', UI.div.tbody).first().height() / 2,
      eY = e.clientY,
      $target = $('tr', UI.div.tbody)
                .filter(function () { var d = eY - $(this).offset().top; return -trHgtHlf <= d && d < trHgtHlf; } )
                .first();
  if(itemNum === $target.attr('number')) {
    var $next = $item.last().next();
    $item
      .insertBefore($next)
      .addClass('ui-selected moved');
  } else {
    $item
      .insertBefore($target)
      .addClass('ui-selected moved');
  }
  setTimeout(function () { UI.selectableSet(); }, 30);
  setTimeout(
    function () {
      $('tr.ui-selected', UI.div.tbody)
        .removeClass('ui-selected moved last-select');
      // player.order.set();
    }, 1000
  );
};

////             this.div.help.click(function () {
////               this.div.help.fadeOut(200);
////               key.tab(0);
////             });
////             this.div.config.click(function (e) {
////               if(['a', 'input'].indexOf(e.target.localName) < 0) {
////                 this.div.config.fadeOut(200);
////                 key.tab(0);
////               }
////             });
////             this.div.about.click(function (e) {
////               if(e.target.localName !== 'a') {
////                 this.div.about.fadeOut(200);
////                 key.tab(0);
////               }
////             });
////             this.div.property.click(function (e) {
////               if(e.target.localName !== 'a') {
////                 this.div.property.fadeOut(200);
////                 key.tab(0);
////               }
////             });
////             //this.div.firstrow.click(order.sort);
////             this.div.thead
////             .find('th')
////             .each(function (i, th) {
////               $(this).click( (function () {
////                 var order = 1;
////                 return function () {
////                   order.sort(i, order);
////                   order *= -1;
////                 };
////               })())
////             });
////             this.div.filename
////             .click(function () {
////               $('tr.ui-selected').UNSELECT();
////               $('tr.nP').SELECT().LASTSELECT();
////               key.tab(0);
////             });
////             this.div.globalcontrol
////             .attr({'checked':data.globalcontrol==='true'})
////             .change(function (e) {
////               L.globalcontrol = data.globalcontrol = e.target.checked.toString();
////             });
////             this.div.tagread
////             .attr({'checked':data.tagread==='true'})
////             .change(function (e) {
////               L.tagread = data.tagread = e.target.checked.toString();
////             });
////             //$('tr', this.div.thead)
////             //  .sortable();
////             //.children()
////             //.resizable({ handles: 'e, w' });
////             //.resizable();
////             this.div.filterword.keydown(filter.start);
