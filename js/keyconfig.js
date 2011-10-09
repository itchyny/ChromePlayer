;
// key configuration for player


function click (t) {
    // console.log(t);
  var i = UI.div[t] || $('img#' + t);
  i.mousedown().click();
  setTimeout( function () {
    i.mouseup();
  }, 200 );
}

function clickfun (t) {
  return function (e) {
    // console.log(e);
    click(t);
  };
}

window.keyconfig = {

  "<c-space>": clickfun ("play"),
  "<a-space>": clickfun ("play"),
  "<space>": clickfun ("play"),
  "<c-r>": clickfun ("repeat"),
  "<c-o>": clickfun ("open"),
  "<c-u>": clickfun ("shuffle"),
  "<c-a>": function () {
    UI.div.tbody
      .children()
      .SELECT(true)
      .last()
      .LASTSELECT();
  },
  "<cs-a>": function () {
    UI.div.tbody
      .children()
      .UNSELECT(true);
  },
  "<s-/>": function () {
    UI.div.help.fadeToggle(200);
    if($('div#help:hidden').size()) {
      div.tablebody.focus();
    }
  },
  "<f1>": function () {
      UI.div.about.fadeToggle(200);
  },
  "<esc>": function () {
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
  "<delete>": function () {
    $('tr.ui-selected').last().next().LASTSELECT();
    $('tr.ui-selected').first().prev().LASTSELECT(true);
    $('tr.ui-selected').remove();
    // player.order.set();
  },
  "<down>": function () {
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
  "<s-down>": function () {
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
  "<c-down>": function (player) {
    player.volumedown ();
  },
  "<c-up>": function (player) {
    player.volumeup ();
  },
  "<up>": function () {
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
  "<s-up>": function () {
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
  "<home>": function () {
    $('tr.ui-selected')
      .UNSELECT(true);
    UI.div.tbody.children()
    .first()
      .SELECT()
      .LASTSELECT();
  },
  "<s-home>": function () {
    $('tr.ui-selected')
      .removeClass('ui-selected ddms_selected');
    $('tr.last-select')
      .SELECT(true)
    .prevAll()
      .SELECT(true)
    .last()
      .SELECT();
  },
  "<end>": function () {
    $('tr.ui-selected')
      .UNSELECT(true);
    UI.div.tbody.children()
    .last()
      .SELECT()
      .LASTSELECT();
  },
  "<s-end>": function () {
    $('tr.ui-selected')
      .removeClass('ui-selected ddms_selected');
    $('tr.last-select')
      .SELECT(true)
    .nextAll()
      .SELECT(true)
    .last()
      .SELECT();
  },
  "<enter>": function () {
    switch($('div#help:visible,div#config:visible,div#about:visible,div#property:visible').size()) {
      case 0:
        // player.audio.playThis(
          $('tr.ui-selected')
            .UNSELECT(true)
          .first()
          .children()
          .first()
        // );
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
  "<s-enter>": function (player) {
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

};


