// SAMPLE
// https://github.com/frankkohlhepp/fancy-settings/wiki/Create-settings
this.manifest = {
  "name": "Local Player",
  "icon": "../../icon_128.png",
  "settings": [
    {
    "tab": i18n.get ("general"),
    "group": i18n.get ("notification"),
    "type": "checkbox",
    "name": "notification",
    "label": i18n.get ("notificationlabel")
  },
  {
    "tab": i18n.get ("general"),
    "group": i18n.get ("notification"),
    "type": "slider",
    "name": "notificationmsec",
    "label": i18n.get ("notificationmsec"),
    "max": 30000,
    "min": 1,
    "step": 1,
    "display": true,
    "displayModifier": function (value) {
      return parseInt (value / 1000, 10).floor() + "sec";
    }
  },
  // {
  //   "tab": i18n.get ("general"),
  //   "group": i18n.get ("playing"),
  //   "type": "checkbox",
  //   "name": "appclosing",
  //   "label": i18n.get ("appclosing")
  // },
  {
    "tab": i18n.get ("general"),
    "group": i18n.get ("keyboard"),
    "name": "globalcontrol",
    "type": "checkbox",
    "label": i18n.get ("globalcontrol")
  },
  {
    "tab": i18n.get ("general"),
    "group": i18n.get ("appearance"),
    "name": "scheme",
    "type": "popupButton",
    "label": i18n.get ("colorscheme"),
    "options": {
      "values": [
        { "value": "classic-default"
        , "text": "default"
      },
      { "value": "classic-pink"
      , "text": "pink"
      },
      { "value": "classic-yellow"
      , "text": "yellow"
      },
      { "value": "classic-orange"
      , "text": "orange"
      },
      { "value": "classic-lime"
      , "text": "lime"
      },
      { "value": "classic-blue"
      , "text": "blue"
      },
      { "value": "classic-purple"
      , "text": "purple"
      },
      { "value": "classic-dark"
      , "text": "dark"
      }
      ]
    }
  },
  {
    "tab": i18n.get ("advanced"),
    "group": i18n.get ("keyboard"),
    "name": "playerrc",
    "type": "textarea",
    "label": i18n.get ("keyboardlabel"),
    "text": ""
  },
  {
    "tab": i18n.get ("advanced"),
    "group": i18n.get ("initialize"),
    "name": "initialize",
    "type": "button",
    "text": i18n.get ("initializeall")
  },
  {
    "tab": i18n.get ("about"),
    "group": i18n.get ("author"),
    "name": "author",
    "type": "description",
    "text": i18n.get ("myDescription")
  },
  {
    "tab": i18n.get ("about"),
    "group": i18n.get ("application"),
    "name": "application",
    "type": "description",
    "text": i18n.get ("appDescription")
  }
  ]
};
