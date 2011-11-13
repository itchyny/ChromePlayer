// key configuration for player

// TODO: clickを全てplayer.uiから取る.
// clickをui.clickに

function click (t) {
  var i = UI.div[t] || $('img#' + t);
  i.mousedown().click();
  setTimeout( function () {
    i.mouseup();
  }, 200 );
}

function clickfun (t) {
  return function (e) {
    click(t);
  };
}

window.keyconfig = {

  '<c-space>': clickfun ('play'),
  '<a-space>': clickfun ('play'),
  '<space>': clickfun ('play'),
  '<c-r>': clickfun ('repeat'),
  '<c-o>': clickfun ('open'),
  '<c-u>': clickfun ('shuffle'),
  '<c-a>': function () {
    UI.div.tbody
      .children()
      .SELECT(true)
      .last()
      .LASTSELECT();
  },
  '<cs-a>': function () {
    UI.div.tbody
      .children()
      .UNSELECT(true);
  },
  '<s-/>': function () {
    UI.div.help.fadeToggle(200);
    if($('div#help:hidden').size()) {
      div.tablebody.focus();
    }
  },
  '<f1>': function () {
      UI.div.about.fadeToggle(200);
  },
  '<esc>': function () {
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
  '<delete>': function (player) {
    $('tr.ui-selected').last().next().LASTSELECT();
    $('tr.ui-selected').first().prev().LASTSELECT(true);
    $('tr.ui-selected')
      .map(
        function (i, tr) {
          return player.remove ( parseInt($(tr).attr('number'), 10) );
      });
    $('tr.ui-selected').remove();
  },
  '<down>': function () {
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
  '<s-down>': function () {
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
  '<c-down>': function (player) {
    player.volumedown ();
  },
  '<c-up>': function (player) {
    player.volumeup ();
  },
  '<ca-down>': function (player) {
    if (player.volume === 0 && player.predvol !== undefined)
      click ('volumeon');
    else
      click ('mute');
  },
  '<up>': function () {
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
  '<s-up>': function () {
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
  '<home>': function () {
    $('tr.ui-selected')
      .UNSELECT(true);
    UI.div.tbody.children()
    .first()
      .SELECT()
      .LASTSELECT();
  },
  '<s-home>': function () {
    $('tr.ui-selected')
      .removeClass('ui-selected ddms_selected');
    $('tr.last-select')
      .SELECT(true)
    .prevAll()
      .SELECT(true)
    .last()
      .SELECT();
  },
  '<end>': function () {
    $('tr.ui-selected')
      .UNSELECT(true);
    UI.div.tbody.children()
    .last()
      .SELECT()
      .LASTSELECT();
  },
  '<s-end>': function () {
    $('tr.ui-selected')
      .removeClass('ui-selected ddms_selected');
    $('tr.last-select')
      .SELECT(true)
    .nextAll()
      .SELECT(true)
    .last()
      .SELECT();
  },
  '<enter>': function () {
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
  '<a-enter>': function (player) {
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
  '<pgdn>': function () {
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
  '<s-pgdn>': function () {
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
  '<pdup>': function () {
    UI.div.tablebody.scrollTop( UI.div.tablebody.scrollTop() - UI.div.tablebody.height() * 0.8 );
    $('tr.ui-selected')
      .UNSELECT(true);
    $('tr', UI.div.tbody)
      .filter( function () { return $(this).position().top > 0; } )
      .first()
      .SELECT()
      .LASTSELECT();
  },
  '<s-pgup>': function () {
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

};



// map <c-space> PlayPause
// map <a-space> PlayPause
// map <space> PlayPause
// map <c-r> ToggleRepeat
// map <c-o> OpenFile
// map <c-u> ToggleShuffle
// map <c-a> SelectAll
// map <cs-a> SelectNone
// map <s-/> ToggleHelp
// map <enter> PlaySelected
// map <up> SelectUp
// map <down> SelectDown
// map <s-up> SelectShiftUp
// map <s-down> SelectShiftDown
// map <home> SelectHome
// map <end> SelectEnd
