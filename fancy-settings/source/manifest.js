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
    {
    "tab": i18n.get ("keyboard"),
    // "group": "Food",
    "name": "globalcontrol",
    "type": "checkbox",
    "label": i18n.get ("globalcontrol")
  },
  {
    "tab": i18n.get ("keyboard"),
    // "group": "Food",
    "name": "playerrc",
    "type": "textarea",
    "label": i18n.get ("keyboardlabel"),
    "text": "hoge\nhoge"
  },
  ]
  // {
  //   "tab": i18n.get("information"),
  //   "group": i18n.get("login"),
  //   "name": "username",
  //   "type": "text",
  //   "label": i18n.get("username"),
  //   "text": i18n.get("x-characters")
  // },
  // {
  //   "tab": i18n.get("information"),
  //   "group": i18n.get("login"),
  //   "name": "password",
  //   "type": "text",
  //   "label": i18n.get("password"),
  //   "text": i18n.get("x-characters-pw"),
  //   "masked": true
  // },
  // {
  //   "tab": i18n.get("information"),
  //   "group": i18n.get("login"),
  //   "name": "myDescription",
  //   "type": "description",
  //   "text": i18n.get("description")
  // },
  // {
  //   "tab": i18n.get("information"),
  //   "group": i18n.get("logout"),
  //   "name": "myCheckbox",
  //   "type": "checkbox",
  //   "label": i18n.get("enable")
  // },
  // {
  //   "tab": i18n.get("information"),
  //   "group": i18n.get("logout"),
  //   "name": "myButton",
  //   "type": "button",
  //   "label": i18n.get("disconnect"),
  //   "text": i18n.get("logout")
  // },
  // {
  //   "tab": "Details",
  //   "group": "Sound",
  //   "name": "noti_volume",
  //   "type": "slider",
  //   "label": "Notification volume:",
  //   "max": 1,
  //   "min": 0,
  //   "step": 0.01,
  //   "display": true,
  //   "displayModifier": function (value) {
  //     return (value * 100).floor() + "%";
  //   }
  // },
  // {
  //   "tab": "Details",
  //   "group": "Sound",
  //   "name": "sound_volume",
  //   "type": "slider",
  //   "label": "Sound volume:",
  //   "max": 100,
  //   "min": 0,
  //   "step": 1,
  //   "display": true,
  //   "displayModifier": function (value) {
  //     return value + "%";
  //   }
  // },
  // {
  //   "tab": "Details",
  //   "group": "Food",
  //   "name": "myPopupButton",
  //   "type": "popupButton",
  //   "label": "Soup 1 should be:",
  //   "options": {
  //     "groups": [
  //       "Hot", "Cold",
  //     ],
  //     "values": [
  //       {
  //       "value": "hot",
  //       "text": "Very hot",
  //       "group": "Hot",
  //     },
  //     {
  //       "value": "Medium",
  //       "group": 1,
  //     },
  //     {
  //       "value": "Cold",
  //       "group": 2,
  //     },
  //     ["Non-existing"]
  //     ],
  //   },
  // },
  // {
  //   "tab": "Details",
  //   "group": "Food",
  //   "name": "myListBox",
  //   "type": "listBox",
  //   "label": "Soup 2 should be:",
  //   "options": [
  //     ["hot", "Hot and yummy"],
  //     ["cold"]
  //   ]
  // },
  // {
  //   "tab": "Details",
  //   "group": "Food",
  //   "name": "myRadioButtons",
  //   "type": "radioButtons",
  //   "label": "Soup 3 should be:",
  //   "options": [
  //     ["hot", "Hot and yummy"],
  //     ["cold"]
  //   ]
  // }
  // ],
  // "alignment": [
  //   [
  //     "username",
  //     "password"
  // ],
  // [
  //   "noti_volume",
  //   "sound_volume"
  // ]
  // ]
};
