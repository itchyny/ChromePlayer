/*!____
~*~~~~~~~~Chrome~Player~vVERSION____
~*~~~~~~~~~~~~~~created~by~itchyny____
~*____
~*~~~~~Work~on~Google~Chrome~9.0____
~*~~~~~Copyright~(c)~2011~itchyny____
~*____
~*~~~~~Last Modified:~DATE____
~*____
~*/

( function () {

  // This would be strict code. Yet browser does not support.
  // "use strict";

  // (Almost) everything is in this 'player'.
  var player = {
    data: {
      version: "VERSION"
    }
  },

  // AUDIO is the <audio> element, accessible from every functions.
  // But AUDIO can be changed in player.core.play, as: AUDIO = new Audio(e.target.result);
      AUDIO = null,//  document.getElementsByTagName('audio')[0]  // <- used to be.

  // Shorthand for localStorage.
      L = localStorage,

  //
      $ = jQuery,

  // DIV is the set of jQuery objects for fast selecting.
      DIV = (function (a, x) {
        a.forEach(function (b) { x[b] = $('#' + b); });
        return x;
      })(['about', 'conf', 'config', 'current', 'filename', 'fileselect', 'firstrow', 'globalcontrol', 'help', 'musicSlider', 'mute', 'next', 'open', 'pause', 'play', 'playlist', 'prev', 'property', 'remain', 'repeat', 'scheme', 'shuffle', 'tablebody', 'tablediv', 'tagread', 'volumeSlider', 'volumeon', 'wrapper', 'filter', 'filterword', 'matchnum'], {tbody: $('#tbody'), thead: $('thead'), table: $('table')});

  $( function () {
    var lplayer = player;
    lplayer.ui.set();
    lplayer.volume.set();
    lplayer.key.set();
    lplayer.repeat.set();
    lplayer.shuffle.set();
    lplayer.style.set();
    lplayer.style.colorset();
    //player.core.readFiles(player.local.getFiles());
  });

  ( function () {
    // Global setup, prototype extension of Array or String, jQuery.
    if(L.globalcontrol === undefined) {
      L.globalcontrol = player.data.globalcontrol = 'true';
    } else {
      player.data.globalcontrol = L.globalcontrol;
    }
    if(L.tagread === undefined) {
      L.tagread = player.data.tagread = 'true';
    } else {
      player.data.tagread = L.tagread;
    }

    // Message listener from other tabs.
    chrome.extension &&
    chrome.extension.onRequest.addListener(
      function (e, sender, sendResponse) {
        if(player.data.globalcontrol === 'false') {
          return;
        }
        var key = player.key;
        switch(e.keyCode) {
          case 32: key.space(e); return;
          case 37: key.left(e); return;
          case 38: key.up(e); return;
          case 39: key.right(e); return;
          case 40: key.down(e); return;
          case 173: // volume mute
          case 119: key.f8(e); return;
          case 174: // volume down
          case 120: key.f9(e); return;
          case 175: // volume up
          case 121: key.f10(e); return;
          case 176: key.media_next_track(e); return;
          case 177: key.media_prev_track(e); return;
          case 178: key.media_stop(e); return;
          case 179: key.media_play_pause(e); return;
        }
      }
    );

    String.prototype.toBin = (function () {
      var push = Array.prototype.push,
          join = Array.prototype.join;
      return function () {
        var ans = [], i = 9, b = this;
        while(--i) {
          push.call(ans, b & 128);
          b <<= 1;
        }
        return join.call(ans, '');
      };
    })();

    String.prototype.unsynchsafe = (function () {
      var charCodeAt = String.prototype.charCodeAt;
      return function () {
        return ( ((charCodeAt.call(this, 0) & 0x7f) << 21)
               | ((charCodeAt.call(this, 1) & 0x7f) << 14)
               | ((charCodeAt.call(this, 2) & 0x7f) << 7)
               | ((charCodeAt.call(this, 3) & 0x7f)));
      };
    })();

    // http://la.ma.la/blog/diary_200608300350.htm
    Array.prototype.shuffle = ( function () {
      var mathRandom = Math.random,
            mathFloor = Math.floor;
      return function () {
        var i = this.length, j, t;
        while(i) {
          j = mathFloor( mathRandom() * i );
          t = this[--i];
          this[i] = this[j];
          this[j] = t;
        }
        return this;
      };
    })();

    Array.prototype.unique = function () {
      var ans = [], i, j, l, m, f;
      for(i = -1, l = this.length; ++i < l;) {
        for(j = -1, m = ans.length, f = true; ++j < m;) {
          if(ans[j] === this[i]) {
            j = m + 1;
            f = false;
          }
        }
        if(f){
          ans.push(this[i]);
        }
      }
      return ans;
    };

    $.fn.unique = Array.prototype.unique;

    $.fn.join = Array.prototype.join;

    $.fn.texttitle = function (t) {
      return this
        .text(t)
        .attr('title', t);
    };

    $.fn.SELECT = (function () {
      var tablebody = DIV.tablebody[0];
      return function (flg, anime) {
        if(this.size()) {
          this
            .addClass('ui-selected ddms_selected');
          if(flg) {
            // If flg is true, not scroll. Default is false(Scroll follows).
            return this;
          }
          var offsetTop = this.offset().top,
              firstRow = DIV.tablebody.offset().top,
              rm = offsetTop - 30 - firstRow,
              ex = offsetTop + 60 - DIV.tablediv.height() - firstRow;
           if(rm < 0) {
             if (anime) {
               DIV.tablebody.animate({scrollTop: '+=' + rm}, {duration: 'fast', easing: 'linear'});
             } else {
               DIV.tablebody.scrollTop(DIV.tablebody.scrollTop() + rm);
             }
           } else if(ex > 0) {
             if(anime) {
               DIV.tablebody.animate({scrollTop: '+=' + ex}, {duration: 'fast', easing: 'linear'});
             } else {
               DIV.tablebody.scrollTop(DIV.tablebody.scrollTop() + ex);
               //tablebody.scrollTop += ex;
             }
           }
        }
        return this;
      };
    })();

    $.fn.UNSELECT = function (flg) {
      if(!flg) {
        // If flg is true, not SELECT(that is, scroll doesn't follow that selection). Default is false(Scroll follows).
        this.SELECT();
      }
      return this.removeClass('ui-selected ddms_selected last-select');
    };

    $.fn.LASTSELECT = function (flg) {
      if(!flg) {
        $('tr.last-select', DIV.tbody)
          .removeClass('last-select');
      }
      return this
        .addClass('last-select');
    };

    $.fn.ISSELECTED = function () {
      return this
        .hasClass('ui-selected');
    };

    $.fn.drag_drop_multi_select.defaults.after_drop_action = function ($item, $old, $new, e, ui) {
      var itemNum = $item.first().attr('number'),
          trHgtHlf = $('tr', DIV.tbody).first().height() / 2,
          eY = e.clientY,
          $target = $('tr', DIV.tbody)
                    .filter( function () { var d = eY - $(this).offset().top; return -trHgtHlf <= d && d < trHgtHlf; } )
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
      setTimeout(player.ui.selectableSet, 30);
      setTimeout(
        function () {
          $('tr.ui-selected', DIV.tbody)
            .removeClass('ui-selected moved last-select');
          player.order.set();
        }, 1000
      );
    };

  })();

  player.ui = {

    set: function () {
      $('div#appname a')
        .text('Chrome Player v' + player.data.version);
      $(window)
        .resize(player.style.set);
      document.body.ondragover = function (e) {
        e.preventDefault();
      };
      document.body.ondrop = function (e) {
        e.preventDefault();
        player.core.readFiles(e.dataTransfer.files);
      };
      DIV.help.click( function () {
        DIV.help.fadeOut(200);
        player.key.tab(0);
      });
      DIV.config.click( function (e) {
        if(['a', 'input'].indexOf(e.target.localName) < 0) {
          DIV.config.fadeOut(200);
          player.key.tab(0);
        }
      });
      DIV.about.click( function (e) {
        if(e.target.localName !== 'a') {
          DIV.about.fadeOut(200);
          player.key.tab(0);
        }
      });
      DIV.property.click( function (e) {
        if(e.target.localName !== 'a') {
          DIV.property.fadeOut(200);
          player.key.tab(0);
        }
      });
      $('img.lbutton, img.rbutton')
        .mouseup( function (e) {
          $(this).css({
            'top': ''
          });
        })
        .mousedown( function (e) {
          $(this).css({
            'top': parseInt($(this).css('top'), 10) * 1.03 + '%'
          });
        });
      DIV.fileselect
        .change( function (e) {
          player.core.readFiles(e.target.files);
        });
      DIV.open
        .click( function () {
          DIV.fileselect.click();
        });
      DIV.play
        .click(player.audio.toggle);  // <- audio.play
      DIV.pause
        .click(player.audio.toggle);  // <- audio.pause
      DIV.prev
        .click(player.audio.prev);
      DIV.next
        .click(player.audio.next);
      DIV.mute
        .click(player.volume.mute);
      DIV.volumeon
        .click(player.volume.on);
      DIV.repeat
        .click(player.repeat.toggle);
      DIV.shuffle
        .click(player.shuffle.toggle);
      DIV.conf
        .click( function () { DIV.config.fadeToggle(200); } );
      //DIV.firstrow.click(player.order.sort);
      DIV.thead
        .find('th')
        .each( function (i, th) {
          $(this).click( ( function () {
            var order = 1;
            return function () {
              player.order.sort(i, order);
              order *= -1;
            };
          })())
        });
      DIV.filename
        .click( function () {
          $('tr.ui-selected').UNSELECT();
          $('tr.nP').SELECT().LASTSELECT();
          player.key.tab(0);
        });
      DIV.globalcontrol
        .attr({'checked':player.data.globalcontrol==='true'})
        .change( function (e) {
          L.globalcontrol = player.data.globalcontrol = e.target.checked.toString();
        });
      DIV.tagread
        .attr({'checked':player.data.tagread==='true'})
        .change( function (e) {
          L.tagread = player.data.tagread = e.target.checked.toString();
        });
      //$('tr', DIV.thead)
      //  .sortable();
        //.children()
        //.resizable({ handles: 'e, w' });
        //.resizable();
      DIV.volumeSlider
        .slider({
         'min': 0,
         'max': 256,
         'step': 8,
         'slide': player.volume.update,
         'stop': player.volume.update
        });
      DIV.musicSlider
        .slider({
          'min': 0,
          'max': 1,
          'step': 0.01,
          'start': player.info.startSlide,
          'stop': player.info.stopSlide
        })
        .slider(
          // On setup only.
          'disable'
        );
      DIV.filterword.keydown(player.filter.start);
      player.ui.selectableSet();
      player.ui.resizableSet();
    },

    resizableSet: ( function () {
      var afterResize = function () {
        var s = [],
            data = {},
            theadWidth = DIV.thead.width();
        $('th:not(.splitter)')
          .each( function (i, th) {
            var w = $(this).width() / (theadWidth - 0);
            s.push('td:nth-child(' + (i + 1) + ') {width:' + w * 100 + '%!important;}');
            data[$(this).attr('class')] = w;
          });
        //$('style#splitter')[0].innerText = s.join('');
        L.splitter = JSON.stringify(data);
      };
      setTimeout(afterResize, 10);
      return function () {
        $('th:not(.splitter)+th:not(.splitter)', DIV.thead)
          .each( function (i) {
            var flg = false,
                $splitter = $('<th />', {'class': 'splitter'})
                .mousedown( function (e) {
                  flg = true;
                })
                .insertBefore($(this));
            //if (i === 0) { return; } // First column is unresizable.
            $(window)
              .mouseup( function (e) {
                if(flg) {
                  flg = false;
                  afterResize();
                }
              })
              .mousemove( function (e) {
                if(flg) {
                  var prevWidth,
                      totalWidth = $splitter.prev().width() + $splitter.next().width();
                  $splitter.prev().width( prevWidth = -$splitter.prev().offset().left + e.clientX);
                  $splitter.next().width( totalWidth - prevWidth );
                }
              });
          });
      };
    })(),

    selectableSet: function () {
      // Clone trs every time on setting selectable.
      // This function is called when
      //   Input files.
      //   Sort the file list.
      //   Multi drag & drop action.
      var tbodyWdt = DIV.tbody.width();
      $('tr', DIV.tbody)
        .each( function () {
          var $self = $(this),
              n = $('<tr />')
            .attr({
              'number': $self.attr('number')
            })
            .append($self.children())
            .dblclick(player.audio.playThis)
            .click( function (e) {
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
                        .filter( function () { return $(this).position().top > e.clientY; })
                        .SELECT(true);
                    }, 20);
                } else {
                  setTimeout(
                    function () {
                      $last
                        .SELECT(true)
                        .LASTSELECT()
                        .nextAll()
                        .filter( function () { return $(this).position().top < e.clientY; })
                        .SELECT(true);
                    }, 20);
                }
              }
            })
            .width(tbodyWdt)
            .addClass( $self.hasClass('nP') ? 'nP': '' )
            .addClass( $self.hasClass('moved') ? 'ui-selected moved': '' )
            .addClass( $self.hasClass('ui-selected') ? 'ui-selected': '' )
            .appendTo(DIV.tbody);
          if($self.ISSELECTED()) {
            setTimeout( function () {n.SELECT(true);}, 30);
          }
        })
        .remove();
      // Initialization of drag & drop multi select.
      $.fn.drag_drop_multi_select.unique=0;
      $.fn.drag_drop_multi_select.stack=[];
      $.fn.drag_drop_multi_select.settings=[];
      DIV.tbody.drag_drop_multi_select({
        'element_to_drag_drop_select': 'tr, DIV.tbody',
        'elements_to_drop': DIV.tbody,
        'moveOpacity': 0.7
      });
    }

  };


  player.key = ( function () {

    // A function for easy coding around meta keys. Code as:
    //   switch(meta(eventHandler)) {
    //     case 'c': /* when ctrl key only */ return;
    //     case 'ca': /* when ctrl and alt key down */ return;
    //   }
    // It's better to use 'return' rather than 'break',
    // because it makes you easy to understand the callback.
    var meta = function (e) {
      return (e.global ? 'g' : '')
           + (e.ctrlKey || e.metaKey ? 'c' : '')
           + (e.shiftKey ? 's' : '')
           + (e.altKey ? 'a' : '');
    },

    // Click a button.
    // Buttons has mousedown event which moves them a little down(set in player.ui.set).
    click = function (t) {
      var i = DIV[t] || $('img#' + t);
      i.mousedown().click();
      setTimeout( function () {
        i.mouseup();
      }, 200 );
    },

    prevent = function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
    };

    return {
      set: function () {
        var key = player.key;
        $(window)
          .keydown(
            function (e) {
              if ($('#filter:visible').size()) {
                switch(e.keyCode) {
                  case 27: key.esc(e); return;
                  case 13: prevent(e); player.filter.blink(); return;
                  case 70: 
                    switch(meta(e)) {
                      case 'c':
                        prevent(e); player.filter.set(); return;
                    }
                    return;
                }
                return;
              };
              //console.log(e.keyCode);
              switch(e.keyCode) {
                case 9: key.tab(e); return;
                case 13: key.enter(e); return;
                case 27: key.esc(e); return;
                case 32: key.space(e); return;
                case 33: key.pgup(e); return;
                case 34: key.pgdn(e); return;
                case 35: key.end(e); return;
                case 36: key.home(e); return;
                case 37: key.left(e); return;
                case 38: key.up(e); return;
                case 39: key.right(e); return;
                case 40: key.down(e); return;
                case 8:
                case 46: key.del(e); return;
                case 65: key.a(e); return;
                case 70: key.f(e); return;
                case 79: key.o(e); return;
                case 82: key.r(e); return;
                case 85: key.u(e); return;
                case 112: key.f1(e); return;
                case 173: // volume mute
                case 119: key.f8(e); return;
                case 174: // volume down
                case 120: key.f9(e); return;
                case 175: // volume up
                case 121: key.f10(e); return;
                case 191: key.question(e); return;
                case 176: key.media_next_track(e); return;
                case 177: key.media_prev_track(e); return;
                case 178: key.media_stop(e); return;
                case 179: key.media_play_pause(e); return;
              }
            }
          );
      },

      f: function (e) {
        prevent(e);
        switch (meta(e)) {
          case 'c':
            player.filter.set();
            return;
        }
      },

      media_next_track: function (e) {
        prevent(e);
        click('next');
        return;
      },

      media_prev_track: function (e) {
        prevent(e);
        click('prev');
        return;
      },

      media_stop: function (e) {
        prevent(e);
        player.audio.pause();
        return;
      },

      media_play_pause: function (e) {
        prevent(e);
        click('play');
        return;
      },

      f1: function (e) {
        switch(meta(e)) {
          case '':
            prevent(e);
            DIV.about.fadeToggle(200);
            return;
        }
      },

      f8: function (e) {
        switch(meta(e)) {
          case 'g':
          case '':
            if(AUDIO === null){
              player.volume.toggleMute();
              return;
            }
            click(AUDIO.volume ? 'mute' : 'volumeon');
            return;
        }
      },

      f9: function (e) {
        switch(meta(e)) {
          case 'g':
          case '':
            prevent(e);
            player.volume.down();
            return;
        }
      },

      f10: function (e) {
        switch(meta(e)) {
          case 'g':
          case '':
            prevent(e);
            player.volume.up();
            return;
        }
      },

      pgup: function (e) {
        switch(meta(e)) {
          case '':
            prevent(e);
            DIV.tablebody.scrollTop( DIV.tablebody.scrollTop() - DIV.tablebody.height() * 0.8 );
            $('tr.ui-selected')
              .UNSELECT(true);
            $('tr', DIV.tbody)
              .filter( function () { return $(this).position().top > 0; } )
              .first()
              .SELECT()
              .LASTSELECT();
            return;
          case 's':
            prevent(e);
            DIV.tablebody.scrollTop( DIV.tablebody.scrollTop() - DIV.tablebody.height() * 0.8 );
            var h = window.innerHeight,
                $last = $('tr.last-select', DIV.tbody);
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
            return;
        }
      },

      pgdn: function (e) {
        switch(meta(e)) {
          case '':
            prevent(e);
            DIV.tablebody.scrollTop( DIV.tablebody.scrollTop() + DIV.tablebody.height() * 0.8 );
            $('tr.ui-selected')
              .UNSELECT(true);
            var h = window.innerHeight;
            $('tr', DIV.tbody)
              .filter( function () { return $(this).position().top < h; } )
              .last()
              .SELECT()
              .LASTSELECT();
            return;
          case 's':
            prevent(e);
            DIV.tablebody.scrollTop( DIV.tablebody.scrollTop() + DIV.tablebody.height() * 0.8 );
            if($('tr.last-select').prev().ISSELECTED()) {
              $('tr.ui-selected')
                .filter( function () { return $(this).position().top < DIV.thead.position().top + 40; } )
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
            return;
        }
      },

      question: function (e) {
        // Toggle keyboard shortcuts helper.
        switch(meta(e)) {
          case 's': 
            DIV.help.fadeToggle(200);
            if($('div#help:hidden').size()) {
              DIV.tablebody.focus();
            }
            return;
        }
      },

      tab: ( function () {
        var index = 0;
        return function (e) {
          if(typeof e === 'number') {
            // player.key.tab(0) -> focus on tablebody
            index = 2 + e;
          } else {
            prevent(e);
          }
          switch(meta(e)) {
            case 's': ++index; //fallthrough
            case '': ++index;
              index %= 3;
              [DIV.tbody, $('div#musicSlider a'), $('div#volumeSlider a')][index].focus();
              if(index === 0) {
                $('tr.ui-selected')
                  .first()
                  .SELECT()
                  .size()
                  || $('tr.nP')
                      .SELECT()
                      .LASTSELECT();
              }
              return;
          }
        };
      })(),

      // plus: function (e) {
      //   switch(meta(e)) {
      //     case 'gs':
      //     case 's':
      //       prevent(e);
      //       player.volume.up();
      //   }
      // },

      // minus: function (e) {
      //   switch(meta(e)) {
      //     case 'g':
      //     case '':
      //       prevent(e);
      //       player.volume.down();
      //   }
      // },

      space: function (e) {
        switch(meta(e)) {
          case 'gc':
          case 'ga':
          case 'c':
          case 'a':
          case '':
            prevent(e);
            click('play');
            return;
        }
      },

      o: function (e) {
        switch(meta(e)) {
          case 'c':
            prevent(e);
            click('open');
            return;
        }
      },

      a: function (e) {
        switch(meta(e)) {
          case 'c':
            prevent(e);
            DIV.tbody
              .children()
              .SELECT(true)
              .last()
              .LASTSELECT();
            return;
          case 'cs':
            prevent(e);
            DIV.tbody
              .children()
              .UNSELECT(true);
            return;
        }
      },

      r: function (e) {
        switch(meta(e)) {
          case 'c':
            prevent(e);
            click('repeat');
            return;
        }
      },

      u: function (e) {
        switch(meta(e)) {
          case 'c':
            prevent(e);
            click('shuffle');
            return;
        }
      },

      end: function (e) {
        prevent(e);
        switch(meta(e)) {
          case 's':
            $('tr.ui-selected')
              .removeClass('ui-selected ddms_selected');
            $('tr.last-select')
              .SELECT(true)
            .nextAll()
              .SELECT(true)
            .last()
              .SELECT();
            return;
          case '':
            $('tr.ui-selected')
              .UNSELECT(true);
            DIV.tbody.children()
            .last()
              .SELECT()
              .LASTSELECT();
            return;
        }
      },

      home: function (e) {
        prevent(e);
        switch(meta(e)) {
          case 's':
            $('tr.ui-selected')
              .removeClass('ui-selected ddms_selected');
            $('tr.last-select')
              .SELECT(true)
            .prevAll()
              .SELECT(true)
            .last()
              .SELECT();
            return;
          case '':
            $('tr.ui-selected')
              .UNSELECT(true);
            DIV.tbody.children()
            .first()
              .SELECT()
              .LASTSELECT();
            return;
        }
      },

      esc: function (e) {
        prevent(e);
        switch(meta(e)) {
          case '':
            switch($('#help:visible,#config:visible,#about:visible,#property:visible,#filter:visible').size()) {
              case 0:
                if($('div#musicSlider a:focus, div#volumeSlider a:focus').size()) {
                  player.key.tab(0);
                  $('div#musicSlider a, div#volumeSlider a').focusout();
                  //$('div#musicSlider a, div#volumeSlider a').focusout();
                } else {
                  $('tr.ui-selected')
                    .UNSELECT(true);
                }
                return;
              default:
                DIV.config.add(DIV.help).add(DIV.property).add(DIV.about)
                  .filter( function () { return $(':visible', this).size(); })
                  .last()
                  .fadeOut(200);
                player.filter.end();
                return;
          }
        }
      },

      enter: function (e) {
        prevent(e);
        switch(meta(e)) {
          case '':
            switch($('div#help:visible,div#config:visible,div#about:visible,div#property:visible').size()) {
              case 0:
                player.audio.playThis(
                  $('tr.ui-selected')
                    .UNSELECT(true)
                  .first()
                  .children()
                  .first()
                );
                  //.dblclick();
                return;
              default:
                DIV.config.add(DIV.help).add(DIV.property).add(DIV.about)
                  .filter( function () { return $(':visible', this).size(); })
                  .last()
                  .fadeOut(200);
                return;
            }
          case 'a':
            DIV.property.fadeIn(200);
            if(player.data.tagread === 'true' && player.data.tags) {
              var m = {
                'TALB': 'album',
                'TIT2': 'title',
                'TPE1':'artist',
                'TRCK': 'track',
                'TDRC': 'year'
              },
              tags = $('tr.ui-selected').map( function (i, tr) {return player.data.tags[parseInt($(tr).attr('number'), 10)];});
              for(var flameid in m) {
                $('dd#id' + m[flameid])
                  .text('　' + tags.map( function (i, x) {return x[flameid]}).unique().join());
              }
            }
            return;
        }
      },

      up: function (e) {
        prevent(e);
        switch(meta(e)) {
          case 'gc':
          case 'c': player.volume.up(); return;
          case 's':
          case 'cs':
            prevent(e);
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
            return;
          case '':
            var $selected = $('tr.ui-selected'),
                $last = $('tr.last-select');
            prevent(e);
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
                || $('tr', DIV.tbody)
                    .last()
                    .SELECT()
                    .LASTSELECT();
            }
            return;
        }
      },

      down: function (e) {
        prevent(e);
        switch (meta(e)) {
          case 'gc':
          case 'c': player.volume.down(); return;
          case 'gca':
          case 'ca':
            if(AUDIO === null){
              player.volume.toggleMute();
              return;
            }
            click(AUDIO.volume ? 'mute' : 'volumeon');
            return;
          case 's':
          case 'cs':
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
            return;
          case '':
            prevent(e);
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
                || $('tr', DIV.tbody)
                    .first()
                    .SELECT()
                    .LASTSELECT();
            }
            return;
        }
      },

      left: function (e) {
        if($('a:focus', DIV.volumeSlider).size()) {
          return;
        }
        prevent(e);
        switch(meta(e)) {
          case '':
            player.audio.seekBy(-10);
            return;
          case 's':
            player.audio.seekBy(-30);
            return;
          case 'a':
          case 'gc':
          case 'c':
            click('prev');
            return;
        }
      },

      right: function (e) {
        if($('a:focus', DIV.volumeSlider).size()) {
          return;
        }
        prevent(e);
        switch(meta(e)) {
          case '':
            player.audio.seekBy(10);
            return;
          case 's':
            player.audio.seekBy(30);
            return;
          case 'a':
          case 'gc':
          case 'c':
            click('next');
            return;
        }
      },

      del: function (e) {
        prevent(e);
        $('tr.ui-selected')
          .last()
          .next()
          .LASTSELECT();
        $('tr.ui-selected')
          .first()
          .prev()
          .LASTSELECT(true);
        $('tr.ui-selected')
          .remove();
        player.order.set();
      }
    };
  })();

  player.style = ( function () {
    var w;
    if(L.splitter === undefined) {
      w = {
        'now': 0.05,
        'filename': 0.10,
        'artist': 0.20,
        'title': 0.30,
        'track': 0.05,
        'album': 0.25
      };
    } else {
      w = JSON.parse(L.splitter);
      w.now = 0.05;
    }
    for(var thname in w) {
      $('th.' + thname)
        .width(w[thname] * (DIV.thead.width()));
    };
    var scheme = {
      "classic-default": {
        "background-color": {
          "div#wrapper": "#aaa",
          "div#info": "#eee",
          "div#playlist": "#fff",
          "thead tr": "#ddd",
          "div#musicSlider": "#aaa",
          "div#musicSlider a": "#666",
          "div#musicSlider a:focus": "#333",
          "div#volumeSlider": "#eee",
          "tbody tr:nth-child(odd) ": "#fff",
          "tbody tr:nth-child(even) ": "#ddf",
          "tbody tr.nP": "#aaf",
          "tbody tr.ui-selected": "#08f"
        },
        "color": {
          "tbody tr.ui-selected": "#fff"
        }
      },
      "classic-pink": {
        "background-color": {
          "div#wrapper": "#f66",
          "div#info": "#fbb",
          "thead tr": "#f99",
          "div#musicSlider": "#f66",
          "div#musicSlider a": "#844",
          "div#musicSlider a:focus": "#622",
          "div#volumeSlider": "#f88",
          "tbody tr:nth-child(odd) ": "#fdd",
          "tbody tr:nth-child(even) ": "#fbb",
          "tbody tr.nP": "#f77",
          "div#playlist": "#fdd",
          "tbody tr.ui-selected": "#f22"
        },
        "color": {
          "tbody tr.ui-selected": "#fff"
        }
      },
      "classic-yellow": {
        "background-color": {
          "div#wrapper": "#ff0",
          "div#info": "#ff8",
          "thead tr": "#ff8",
          "div#musicSlider": "#ff0",
          "div#musicSlider a": "#880",
          "div#musicSlider a:focus": "#640",
          "div#volumeSlider": "#ff8",
          "tbody tr:nth-child(odd) ": "#ff7",
          "tbody tr:nth-child(even) ": "#ff6",
          "tbody tr.nP": "#ff4",
          "div#playlist": "#ffb",
          "tbody tr.ui-selected": "#ff0"
        },
        "color": {
          "tbody tr.ui-selected": "#000!important"
        }
      },
      "classic-orange": {
        "background-color": {
          "div#wrapper": "#f80",
          "div#info": "#fb8",
          "thead tr": "#fb8",
          "div#musicSlider": "#f80",
          "div#musicSlider a": "#840",
          "div#musicSlider a:focus": "#620",
          "div#volumeSlider": "#fb8",
          "tbody tr:nth-child(odd) ": "#ff8",
          "tbody tr:nth-child(even) ": "#fd6",
          "tbody tr.nP": "#fa0",
          "div#playlist": "#fdb",
          "tbody tr.ui-selected": "#f60"
        },
        "color": {
          "tbody tr.ui-selected": "#000"
        }
      },
      "classic-lime": {
        "background-color": {
          "div#wrapper": "#6f6",
          "div#info": "#bfb",
          "div#playlist": "#fff",
          "thead tr": "#9f9",
          "div#musicSlider": "#6f6",
          "div#musicSlider a": "#484",
          "div#musicSlider a:focus": "#262",
          "div#volumeSlider": "#8f8",
          "tbody tr:nth-child(odd) ": "#dfd",
          "tbody tr:nth-child(even) ": "#bfb",
          "tbody tr.nP": "#7f7",
          "div#playlist": "#dfd",
          "tbody tr.ui-selected": "#2f2"
        },
        "color": {
          "tbody tr.ui-selected": "#fff"
        }
      },
      "classic-lblue": {
        "background-color": {
          "div#wrapper": "#66f",
          "div#info": "#bbf",
          "thead tr": "#99f",
          "div#musicSlider": "#66f",
          "div#musicSlider a": "#448",
          "div#musicSlider a:focus": "#226",
          "div#volumeSlider": "#88f",
          "tbody tr:nth-child(odd) ": "#ddf",
          "tbody tr:nth-child(even) ": "#bbf",
          "tbody tr.nP": "#77f",
          "div#playlist": "#ddf",
          "tbody tr.ui-selected": "#22f"
        },
        "color": {
          "tbody tr.ui-selected": "#fff"
        }
      },
      "classic-purple": {
        "background-color": {
          "div#wrapper": "#f0f",
          "div#info": "#f8f",
          "thead tr": "#f8f",
          "div#musicSlider": "#f0f",
          "div#musicSlider a": "#808",
          "div#musicSlider a:focus": "#604",
          "div#volumeSlider": "#f8f",
          "tbody tr:nth-child(odd) ": "#f7f",
          "tbody tr:nth-child(even) ": "#f6f",
          "tbody tr.nP": "#f4f",
          "div#playlist": "#fbf",
          "tbody tr.ui-selected": "#f0f"
        },
        "color": {
          "tbody tr.ui-selected": "#000"
        }
      },
      "classic-dark": {
        "background-color": {
          "div#wrapper": "#000",
          "div#info": "#333",
          "thead tr": "#333",
          "div#musicSlider": "#000",
          "div#musicSlider a": "#666",
          "div#musicSlider a:focus": "#999",
          "div#volumeSlider": "#333",
          "div#volumeSlider a": "#666",
          "div#volumeSlider a:focus": "#666",
          "tbody tr:nth-child(odd) ": "#222",
          "tbody tr:nth-child(even) ": "#292929",
          "tbody tr.nP": "#444",
          "div#playlist": "#111",
          "tbody tr.ui-selected": "#080808"
        },
        "color": {
          "div#wrapper": "#fff"
        }
      }
    },
        theme = 'classic-default',
        colorscheme = null;
    for(var s in scheme) {
      $('<a />')
        .attr('scheme', s)
        //.text(s.replace(/classic-/, ''))
        .css({
          'color': scheme[s]['color']['div#wrapper'] || 'black',
          'background-color': scheme[s]['background-color']['div#wrapper']
        })
        .addClass( theme === s ? 'currentScheme' : '')
        .click( function () { player.style.themeset($(this).attr('scheme')); })
        .appendTo(DIV.scheme);
    }
    return {
      set: function () {
        player.key.tab(0);
        var tbodyWdt = DIV.tbody.width(),
            fontSize = 12 * (window.innerWidth - 1280) / 2360 + 12;
        DIV.wrapper
          .css({
            'font-size': fontSize
          });
        DIV.playlist
          .height(window.innerHeight - DIV.playlist.offset().top - fontSize);
        DIV.tablediv
          .height(window.innerHeight - DIV.tablediv.offset().top - fontSize);
        DIV.tablebody
          .height(window.innerHeight - DIV.tablebody.offset().top - fontSize);
        // DIV.table
        //   .height(window.innerHeight - DIV.tablebody.offset().top - fontSize);
        // DIV.tbody
        //   .height(window.innerHeight - DIV.tablebody.offset().top - fontSize);
        DIV.play.attr(
          AUDIO !== null && AUDIO.paused ? {
            'src': './img/play.png',
            'title': 'Play'
          } : {
            'src': './img/pause.png',
            'title': 'Pause'
        });
        // For style in dragging files.
        // If dragged elements weren't set its size absolutely, the helpers collapse.
        $('tr')
          .css({
            'width': tbodyWdt
          });
      },

      themeset: function (t) {
        if(t in scheme) {
          theme = t;
          //player.local.setScheme(t);
          L.scheme = t;
          //L.colorscheme = JSON.stringify(t);
          player.style.colorset();
        }
      },

      colorset: function () {
        theme = L.scheme/*player.local.getScheme()*/ || 'classic-default';
        colorscheme = scheme[theme];
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
        //player.local.setScheme(colorscheme);
        //L.scheme = colorscheme;
      }
    };
  })();

  player.volume = ( function () {
    var volume = 128,
        getFromSlider = function () {
      return parseInt(DIV.volumeSlider.slider('value'), 10);
    },
    setToSlider = function (volume) {
      DIV.volumeSlider
        .slider({
          'value': volume
        });
    },
    setToAudioTag = function (volume) {
      if(AUDIO) AUDIO.volume = volume / 256;
    },
    setVolume = function (volume) {
      if(L && !isNaN(volume) && typeof volume === 'number' && 0 <= volume && volume <= 256) {
        L.volume = volume;
      }
    };
    return {
      set: function () {
        volume = //player.local.getVolume();
        (function(){
          var volume = parseInt(L.volume, 10);
          if(L && volume !== undefined && !isNaN(L.volume) && 0 <= volume && volume <= 256) {
            return volume;
          } else {
            return 128;
          }
        })();
        setToAudioTag(volume);
        setToSlider(volume);
      },

      update: function () {
        volume = getFromSlider();
        setToAudioTag(volume);
        setVolume(volume);
      },

      mute: function () {
        volume = getFromSlider();
        setToAudioTag(0);
        setToSlider(0);
        setVolume(0);
      },

      on: function () {
        setToAudioTag(volume);
        setToSlider(volume);
        setVolume(volume);
      },

      toggleMute: function () {
        if(getFromSlider() === 0) {
          player.volume.on();
        } else {
          player.volume.mute();
        }
      },

      up: function () {
        volume = Math.min(volume + 16, 256);
        setToAudioTag(volume);
        setToSlider(volume);
        setVolume(volume);
      },

      down: function () {
        volume = Math.max(volume - 16, 0);
        setToAudioTag(volume);
        setToSlider(volume);
        setVolume(volume);
      }

    };
  })();

  player.audio = {

    play: function () {
      if(AUDIO === null) { return; };
      if(player.data.nP >= 0) {
        AUDIO.play();
        player.style.set();
        clearInterval(player.data.seek);
        player.data.seek = setInterval(player.info.seek, 500);
        DIV.musicSlider.slider('enable');
      }
    },

    playThis: function (e) {
      if(AUDIO === null) { return; };
      if(AUDIO.duration) {
        AUDIO.currentTime = 0;
        player.info.seek();
        //player.audio.play();
      }
      player.audio.pause();
      player.core.play( parseInt( $(e.target).closest('tr').attr('number') || e.closest('tr').attr('number') || e.attr('number'), 10 ) );
    },

    pause: function () {
      if(AUDIO === null) { return; };
      AUDIO.pause();
      player.style.set();
      clearInterval(player.data.seek);
    },

    next: function () {
      player.audio.pause();
      if(AUDIO !== null && player.repeat.get() === 'one' && AUDIO.duration) {
        AUDIO.currentTime = 0;
        player.audio.play();
        var $selected = $('tr.ui-selected');
        if($selected.size() < 2) {
          $selected.UNSELECT(true);
          $('tr.nP').SELECT().LASTSELECT();
        }
      } else {
        if(AUDIO !== null && AUDIO.duration) {
          AUDIO.currentTime = 0;
          player.info.seek();
        }
        var nextIndex = player.data.order[player.data.nP + 1];
        if(nextIndex !== undefined && nextIndex >= 0) {
          player.core.play(nextIndex);
        } else if(player.repeat.get() === 'true') {
          player.order.set();
          nextIndex = player.data.order[0];
          if(nextIndex !== undefined) {
            player.core.play(nextIndex);
          }
        } else {
          player.order.set();
          player.data.nP = -1;
        }
      }
    },

    prev: function () {
      player.audio.pause();
      if(AUDIO !== null && player.repeat.get() === 'one' && AUDIO.duration) {
        AUDIO.currentTime = 0;
        player.audio.play();
        var $selected = $('tr.ui-selected');
        if($selected.size() < 2) {
          $selected
            .UNSELECT(true);
          $('tr.nP')
            .SELECT()
            .LASTSELECT();
        }
      } else {
        if(AUDIO !== null && AUDIO.duration) {
          AUDIO.currentTime = 0;
          player.info.seek();
        }
        var prevIndex = player.data.order[player.data.nP - 1];
        if(prevIndex >= 0) {
          player.core.play(prevIndex);
        } else if(player.repeat.get() === 'true') {
          prevIndex = player.data.order[player.data.order.length -1];
          if(prevIndex !== undefined) {
            player.core.play(prevIndex);
          }
        } else {
          player.order.set();
          player.data.nP = -1;
        }
      }
    },

    toggle: function () {
      if(AUDIO === null) { return; };
      if(AUDIO.paused) {
        player.audio.play();
      } else {
        player.audio.pause();
      }
    },

    seekBy: function (sec) {
      if(AUDIO === null) { return; };
      if(player.data.nP >= 0 && AUDIO.duration) {
        var cT = AUDIO.currentTime,
            dr = AUDIO.duration;
        if(sec < 0 && cT < -sec) {
          AUDIO.currentTime = 0;
          player.info.seek();
          if(cT < -sec / 4) {
            player.audio.prev();
          }
        } else if(cT + sec > dr) {
          AUDIO.currentTime = dr;
          player.info.seek();
          player.audio.next();
        } else {
          AUDIO.currentTime += sec;
        }
        player.info.seek();
      }
    }

  };

  player.order = {

    set: function () {
      var shuffle = player.shuffle.get();
      player.data.order = [];
      $('tr', DIV.tbody)
        .each( function () { player.data.order.push( parseInt( $(this).attr('number'), 10 ) ); });
      if(shuffle) {
        player.order.shuffle();
      }
      player.data.nP = player.data.order.indexOf( parseInt( $('tr.nP').attr('number'), 10 ) );
    },

    shuffle: function () {
      player.data.order.shuffle();
    },

    sort: ( function () {
      var stack = [];
      return function (i, order) {
        if(i === undefined) {
          i = 1;
        }
        //var f = function (x) {return x;};
        //var c = function (s) {
        //  return s.replace(/１/,'1').replace(/２/,'2').replace(/３/,'3').replace(/４/,'4').replace(/５/,'5').replace(/６/,'6').replace(/７/,'7').replace(/８/,'8').replace(/９/,'9').replace(/０/,'0');
        //}
        var f = ($('th:not(.splitter)').eq(i).text() === 'track') ? function (x) {return parseInt(c(x), 10);} : function (x) {return x;};
        stack[1] = stack[0] ? (i === stack[0].i ? stack[1] : stack[0]) : {i:1, order:1, f:function (x) {return x;}};
        stack[0] = {i: i, order: order, f: f};
        DIV.tbody
          .html(
            $('tr', DIV.tbody).sort(
              (function () {
                var o = order, r = stack[1].order, j = i, k = stack[1].i, texts = [], nexts = [];
                return function (a, b) {
                  var ajT = a.childNodes[2 * j].innerText, bjT = b.childNodes[2 * j].innerText,
                      akT = a.childNodes[2 * k].innerText, bkT = b.childNodes[2 * k].innerText;
                  return /*f*/(ajT) > /*f*/(bjT) ?  o :
                         /*f*/(ajT) < /*f*/(bjT) ? -o :
                         /*stack[1].f*/(akT) >= /*stack[1].f*/(bkT) ? r : -r;
                  //return f(ajT) > f(bjT) ?  o :
                  //       f(ajT) < f(bjT) ? -o :
                  //       stack[1].f(akT) >= stack[1].f(bkT) ? r : -r;
                };
              })()
            )
          );
        player.ui.selectableSet();
        player.order.set();
        // if($('tr.ui-selected').size() === 1) {
        //   $('tr.ui-selected')
        //     .SELECT();
        // }
      }
    })()

  };

  player.repeat = ( function () {
    var repeat = 'false',
        setToImg = function (repeat) {
      DIV.repeat
        .css({
          'opacity': (repeat === 'false' ? 0.4 : '')
        })
        .attr({
          'src': (repeat === 'one' ? './img/one.png' : './img/repeat.png')
        });
    };
    return {
      set: function () {
        repeat = //player.local.getRepeat();
        (function(){
          if(L && L.repeat) {
            return L.repeat.toString();
          } else {
            return 'false';
          }
        })();
        setToImg(repeat);
      },

      toggle: function () {
        switch (repeat) {
          case 'true':
            repeat = 'one';
            break;
          case 'one':
            repeat = 'false';
            break;
          default:
            repeat = 'true';
        }
        setToImg(repeat);
        //player.local.setRepeat(repeat);
        L.repeat = repeat.toString();
      },

      get: function () {
        return repeat;
      }
    };
  })();

  player.shuffle = ( function () {
    var shuffle = 'false',
        setToImg = function (shuffle) {
      DIV.shuffle
        .css({
          'opacity': (shuffle.toString() === 'true' ? '' : 0.4)
        });
    };
    return {
      set: function () {
        shuffle = (function(){
          if(L && L.shuffle) {
            return L.shuffle.toString();
          } else {
            return 'false';
          }
        })();
        setToImg(shuffle);
        player.order.set();
      },

      toggle: function () {
        shuffle = (shuffle !== 'true').toString();
        setToImg(shuffle);
        //player.local.setShuffle(shuffle);
        L.shuffle = shuffle.toString();
        player.order.set();
      },

      get: function () {
        return shuffle === 'true';
      }
    };
  })();

  player.info = {

    seek: ( function () {
      // The most frequently called function.
      var convertTime = ( function () {
        var lparseInt = parseInt,
            lisNaN = isNaN;
        return function (sec) {
          sec = lparseInt(sec, 10);
          if(lisNaN(sec)) {
            return '00:00';
          }
          var min = lparseInt((sec / 60) % 60, 10),
              hour = lparseInt(sec / 3600, 10);
          sec %= 60;
          if(hour > 0) {
            return hour.toString() + ':' + (min < 10 ? '0' : '') + min.toString() + ':' + (sec < 10 ? '0' : '') + sec.toString();
          } else {
            return (min < 10 ? '0' : '') + min.toString() + ':' + (sec < 10 ? '0' : '') + sec.toString();
          }
        };
      })(),
      //    lAUDIO = AUDIO, // Usesless when Audio element was created on each music in player.core.play.
          c = document.getElementById('current'),
          r = document.getElementById('remain');
      return function () {
        var audioCurrentTime = AUDIO.currentTime,
            audioDuration = AUDIO.duration;
        DIV.musicSlider.slider({ 'value': audioCurrentTime / audioDuration });
        c.innerText = convertTime(audioCurrentTime);
        r.innerText = '-' + convertTime(audioDuration - audioCurrentTime);
      };
    })(),

    startSlide: function (e, ui) {
      clearInterval(player.data.seek);
    },

    stopSlide: function (e, ui) {
      AUDIO.currentTime = AUDIO.duration * ui.value;
      player.data.seek = setInterval(player.info.seek, 500);
    },

    showFileName: function (filename, index) {
      if(player.data.tags) {
        var tags = player.data.tags[index];
        if(tags && tags['TIT2']) {
          document.title =  (tags['TIT2'] || '') + ' - ' + (tags['TPE1'] || '') + ',' + (tags['TALB'] || '');
          filename = tags['TPE1'] + ' - ' + tags['TIT2'];
        }
      }
      document.title = filename;
      DIV.filename
        .texttitle(filename);
    }
  };

  player.filter = ( function () {
    var tags = [], trs = [], index = 0, selected = [];
    return {
      set: function () {
        tags = [], trs = [], index = 0, selected = $('ui-selected');
        DIV.filter.fadeIn(200);
        var input = DIV.filterword.focus()[0];//.val('');
        input.selectionStart = 0;
        input.selectionEnd = input.value.length;
        $('tr', DIV.tbody).each(function (i, x) {
          tags[i] = ((function (x) {
            var a = [];
            for (i in x) {
              a.push(x[i])
            }
            return a;
          })(player.data.tags[$(x).attr('number')])).join('__').toLowerCase();
        });
        DIV.matchnum.text('');
      },
      start: function (e) {
        setTimeout( function () {
          if (e.keyCode === 13) { return; };
          var s = (e.target.value).toLowerCase();
          var matched = [];
          var $trs = $('tr', DIV.tbody);
          $('tr.ui-selected', DIV.tbody).UNSELECT(true);
          if (!s) {
            DIV.matchnum.text(0 + '/' + $trs.length);
            return;
          }
          try {
          tags.forEach(function (t, i) {
            if (t.match(s) !== null) {
              matched.push(i);
            }
          });
          matched.forEach(function (n) {
            $trs.eq(n).SELECT(true);
          });
          DIV.matchnum.text(matched.length + '/' + $trs.length);
          selected = $('tr.ui-selected');
          } catch (e){};
          //if (matched.length < 3) $trs.eq(matched[0]).SELECT().LASTSELECT();
        }, 20);
      },
      end: function () {
        DIV.filter.fadeOut(200);
        DIV.filterword.focusout();
        player.key.tab(0);
      },
      blink: function () {
        if (isNaN(index)) { index = 0; };
        var x = selected.eq(index).UNSELECT(true);
        setTimeout( function () { x.SELECT(false, true); }, 200);
        index = (++index) % selected.size();
      }
    };
  })();

  player.core = ( function () {
    var fs = []; // File Objects is accessible only from function in player.core.
    var decode = function (chars) {
      switch(chars.charCodeAt(0)) {
        case 0: // ISO-8859-1
          //console.log('ISO-8859-1');
          return chars.toString();
        case 2: // UTF-16BE without BOM
          //console.log('UTF-16BE without BOM');
        case 1: // UTF-16 with BOM
          //console.log('UTF-16 with BOM');
          var a = "", StringfromCharCode = String.fromCharCode, kind;
          for(var i = 1, charslen = chars.length; i < charslen; ) {
            if(kind === 1 || ((chars.charCodeAt(i) & 0xff) === 0xff)) { // 2bytes
              if(!kind) {
                i += 2;
                kind = 1;
              }
              a += StringfromCharCode( chars.charCodeAt(i++)
                                     |(chars.charCodeAt(i++)<<8));
            } else if(kind === 2 || ((chars.charCodeAt(i) & 0xfe) === 0xfe)) { // 2bytes
              if(!kind) {
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
        case 3: // UTF-8
          //console.log('UTF-8');
          var a = "", StringfromCharCode = String.fromCharCode;
          for(var i = 1, charslen = chars.length; i < charslen; ) {
            var charsi = chars.charCodeAt(i);
            if(charsi & 128) {
              if(charsi & 32) {
                if(charsi & 16) {
                  if(charsi & 8) {
                    if(charsi & 4) { // U+04000000 .. U+7FFFFFFF
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
    };
    var metaRead = ( function () {
      var onload = function (e, fileindex) {
        var result = e.target.result;

        //var ans = [];
        //for(var i = 0; i < result.length; ++i) {
        //  var b = result.charCodeAt(i).toString(16);
        //  if(i % 20 === 19) {
        //    b += '\n';
        //  }
        //  ans.push(b);
        //}
        //console.log(ans.join(' '));
        //console.log($.map(ans, function (x) {return x + ' ' + String.fromCharCode(parseInt(x, 16)) + ' '}));

        // 10bytes header
        //  console.log('------    header   ------');
        var i = 0;
        var header = result.slice(i, i += 10);
        //  var headerid = header.slice(0, 3);
        //  console.log('headerid: ' + headerid);
        //  var headertagver = [header.charCodeAt(3), header.charCodeAt(4)];
        //  console.log('tagver : ' + headertagver);
        var headerflg = header.slice(5, 6).toBin();
        //  console.log('flg : ' + headerflg);
        var tagsize = header.slice(6, 10).unsynchsafe();
        //console.log('tagsize : ' + tagsize);

        // ??bytes extended header
        //console.log('------    extended header   ------');
        if(headerflg[1] === '1') {
          var extendedsize = result.slice(i, i += 4).unsynchsafe();
          //console.log('extendedsize: ' + extendedsize);
          var extendedheader = result.slice(i, i += extendedsize);
          //console.log('extendedheader: ' + extendedheader);
        }

        // ??bytes frames
        //console.log('------    frames   ------');
        var tags = {},
            ldecode = decode,
            lparseInt = parseInt;
        while(i < tagsize) {
          var flameid = result.slice(i, i += 4);
          var flamesize = ( function (x) {return lparseInt(x.charCodeAt(3), 10);})(result.slice(i, i += 4));
          //var flameflg = result.slice(i, i += 2).toBin();
          i += 2;
          var flametext = ldecode(result.slice(i, i += flamesize));
          if(flamesize) {
            //console.log('flame id: ' + flameid);
            //console.log('flame size: ' + flamesize);
            //console.log('flame flg: ' + flameflg);
            //console.log('flame text: ' + flametext);
            if(flametext) {
              tags[flameid] = flametext;
            }
          }
        }
        //var printobj = function (x) { ( function (x, indent) { for(i in x) { console.log(indent + i.toString() + ': ' + x[i].toString()); if(typeof x[i] === 'object') { arguments.callee(x[i], '  ' + indent); } } })(x, ''); };
        //console.log('------    ID3 tags   ------');
        //console.dir(tags);
        if(!player.data.tags){
          player.data.tags = [];
        }
        player.data.tags[fileindex] = tags;
        $('tr[number=' + fileindex + ']')
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
        //if(tags['TIT2']) {
        //  document.title =  (tags['TIT2'] || '') + ' - ' + (tags['TPE1'] || '') + ',' + (tags['TALB'] || '');
        //}
      };
      return function (file, index) {
        var binaryReader = new FileReader();
        binaryReader.onload = function (e) {onload(e, index);};
        try {
          binaryReader.readAsBinaryString(file.slice(0, 1000));
        } catch (e) {
          binaryReader.readAsBinaryString(file.webkitSlice(0, 1000));
        }
      };
    })();
    return {
      readFiles: function (files) {
        var tbodyWdt = DIV.tbody.width();
        $('tr', DIV.tbody)
          .each(
            function () {
              $('<tr />')
                .attr({
                  'number': $(this).attr('number')
                })
                .append($(this).children())
                .dblclick(player.audio.playThis)
                .width(tbodyWdt)
                .appendTo(DIV.tbody)
                .addClass( $(this).hasClass('nP') ? 'nP': '' );
            }
          )
          .remove();
        var tagread = player.core.tagread,
            tdnow = '<td class="now"></td>',
            d = document,
            rgx = new RegExp('audio\/.*(mp3|ogg|m4a|mp4)'),
            html = [],
            h = -1,
            trs = '<td></td>'
                + '<td><div class="artist"></div></td>'
                + '<td></td>'
                + '<td><div class="title"></div></td>'
                + '<td></td>'
                + '<td><div class="track"></div></td>'
                + '<td></td>'
                + '<td><div class="album"></div></td>'
                + '</tr>';
        for(var i = -1, flen = files.length, fslen = fs.length; ++i < flen; ++fslen){
          var f = files[i],
              ftype = f.type,
              fname = f.name;
        //$.each(
          //files,
          //function (i, f) {
            if(ftype.match(rgx)) {
              html[++h] = '<tr number="';
              html[++h] = fslen;
              html[++h] = '" style="width:';
              html[++h] = tbodyWdt;
              html[++h] = 'px;">';
              html[++h] = '<td class="now">';
              html[++h] = '<td></td>';
              html[++h] = '<td><div class="filename" title="';
              html[++h] = fname;
              html[++h] = '" >';
              html[++h] = fname;
              html[++h] = '</div></td>';
              html[++h] = trs;

              // $('<tr />')
              //   .attr({ 'number': fs.length })
              //   .append(tdnow)
              //   .append( $('<td />').append($('<div class="filename" />').texttitle(f.name)) )
              //   .append('<td><div class="artist"></div></td>')
              //   .append('<td><div class="title"></div></td>')
              //   .append('<td><div class="track"></div></td>')
              //   .append('<td><div class="album"></div></td>')
              //   .width(tbodyWdt)
              //   .appendTo(DIV.tbody);

              fs[fslen] = f;
              tagread(fslen);
            }
          //}
        //);
        }
        DIV.tbody[0].innerHTML += html.join('');
        player.order.set();
        if(AUDIO === null || player.data.nP < 0 && AUDIO.paused) {
          player.audio.next();
        }
        player.ui.selectableSet();
        //player.local.setFiles(fs);
      },

      tagread: function (index) {
        if(player.data.tagread === 'false') {
          return;
        }
        var file = fs[index];
        if(file) {
          metaRead(file, index);
        }
      },

      play: function (index) {
        var file = fs[index];
        var blob = false;
        if(file) {
          if(!player.data.tags || !player.data.tags[index]) {
            player.core.tagread(index);
            setTimeout(
              function () {
                player.info.showFileName(file.fileName, index);
              }, 1000
            );
          }

          //player.file.save(file);
          //player.file.read();

          var reader = new FileReader();
          reader.onload = function (e) {
            //AUDIO.removeAttribute('src');
            //AUDIO.setAttribute('src', e.target.result);
            if(AUDIO !== null){
              AUDIO.removeEventListener('ended', player.audio.next);
              AUDIO = null;
            }
            AUDIO = new Audio(e.target.result);//blob ? 'data:' + file.type + ';' + e.target.result.slice(5) : e.target.result);
            // If Audio element was created for each music and <audio> in html file was not used.
            player.volume.set();
            player.audio.play();
            AUDIO.addEventListener('ended', player.audio.next);
            e = null;
          };
          reader.onerror = function (e) {
            // When the file was deleted externally after added to the filelist.
            player.audio.next();
          };
          reader.readAsDataURL(file);

          //var worker = new Worker('worker.js');
          //worker.onmessage = function (e) {
          //  if(e.data === 'error'){
          //    player.audio.next();
          //  }
          //  if(AUDIO !== null){
          //    AUDIO.removeEventListener('ended', player.audio.next);
          //    AUDIO = null;
          //  }
          //  AUDIO = new Audio(e.data);
          //  // If Audio element was created for each music and <audio> in html file was not used.
          //  player.volume.set();
          //  player.audio.play();
          //  AUDIO.addEventListener('ended', player.audio.next);
          //  e = null;
          //};
          //worker.onerror = function (e) {
          //  player.audio.next();
          //};
          //worker.postMessage(file);

          player.data.nP = player.data.order.indexOf(index);
          //player.data.fileName = file.fileName;
          setTimeout(
            function () {
              player.info.showFileName(file.fileName, index);
            }, 100
          );
        }
        $('tr.nP')
          .removeClass('nP')
          .find('img')
          .remove();
        $('tr[number=' + (index).toString() + ']')
          .addClass('nP')
          .find('.now')
          .append( '<img src="./img/now.png">' );
        var $selected = $('tr.ui-selected');
        if($selected.size() < 2) {
          $selected.UNSELECT(true);
          $('tr.nP').SELECT().LASTSELECT();
        }
      }

    };
  })();

  // player.file = ( function () {
  //   var errorHandler = function (e) {
  //     console.log('error occured');
  //     console.dir(e);
  //   };
  //   var fileSave = function (fs, file) {
  //     console.log('fileSave');
  //     console.dir(fs);
  //     fs.root.getFile(
  //       'music.mp3',
  //       {create:false},
  //       function (fileEntry) {
  //         fileEntry.remove(
  //           function () {
  //             console.log('file removed');
  //           }, errorHandler
  //         );
  //       },errorHandler
  //     );
  //     setTimeout(function () {
  //       fs.root.getFile(
  //         'music.mp3',
  //         {create: true, exclusive: true},
  //         function (fileEntry) {
  //           console.dir(fileEntry);
  //           fileEntry.createWriter(
  //             function (fileWriter) {
  //               fileWriter.onwriteend = function (e) {
  //                 console.log('write completed');
  //                 console.dir(e);
  //               };
  //               fileWriter.onerror = function (e) {
  //                 console.log('write faild');
  //                 console.dir(e);
  //               };
  //               fileWriter.write(file);
  //             }, errorHandler
  //           );
  //         }, errorHandler
  //       );
  //     }, 500);
  //   };
  //   var fileRead = function (fs) {
  //     console.log('FileRead');
  //     fs.root.getFile(
  //       'music.mp3',
  //       {},
  //       function(fileEntry) {
  //         fileEntry.file(
  //           function(file) {
  //             var reader = new FileReader();
  //             reader.onloadend = function(e) {
  //               console.log('file readed');
  //               AUDIO = new Audio(e.target.result);
  //               player.volume.set();
  //               player.audio.play();
  //               AUDIO.addEventListener('ended', player.audio.next);
  //               console.dir(e);
  //             };
  //             reader.readAsDataURL(file);
  //           }, errorHandler
  //         );
  //       }, errorHandler
  //     );
  //   };
  //   return {
  //     save: function (file) {
  //       console.log('save file');
  //       console.dir(file);
  //       window.requestFileSystem(
  //         window.PERSISTENT,
  //         25 * 1024 * 1024 /* 15MB */,
  //         function (fs) {fileSave(fs, file);},
  //         errorHandler
  //       );
  //     },
  //     read: function () {
  //       console.log('read file');
  //       setTimeout(function () {
  //       window.requestFileSystem(
  //         window.PERSISTENT,
  //         25 * 1024 * 1024,
  //         fileRead,
  //         errorHandler
  //       );
  //       }, 1000);
  //     }
  //   };
  // })();

})();

