function reset(settings) {
    var store = new Store("settings");
    chrome.extension.getBackgroundPage().resetSettings();
    for (var name in settings.manifest) {
        var setting = settings.manifest[name];
        if (typeof setting.set === "function") {
            setting.set(store.get(setting.params.name));
        }
    }
}
window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
      // To bind a event to a button of named "hoge",
      // setting.manifest.hoge is the DOM element.
      // Here, "named" means that I set the "name" property in manifest.js
        settings.manifest.initialize.addEvent('action', function() {
          if (confirm("This will reset this extension's settings.  Are you sure?"))
            reset(settings);
        });
        settings.manifest.scheme.addEvent ('action', function (e) {
          chrome.extension.sendRequest ({ type: 'changescheme' });
        });
        console.dir(m=settings.manifest)
        settings.manifest.playerrc.addEvent ('action', function (e) {
          chrome.extension.sendRequest ({ type: 'changeplayerrc' });
        });
    });
    
    // Option 2: Do everything manually:
    /*
    var settings = new FancySettings("My Extension", "icon.png");
    
    var username = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "username",
        "type": "text",
        "label": i18n.get("username"),
        "text": i18n.get("x-characters")
    });
    
    var password = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "password",
        "type": "text",
        "label": i18n.get("password"),
        "text": i18n.get("x-characters-pw"),
        "masked": true
    });
    
    var myDescription = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "myDescription",
        "type": "description",
        "text": i18n.get("description")
    });
    
    var myButton = settings.create({
        "tab": "Information",
        "group": "Logout",
        "name": "myButton",
        "type": "button",
        "label": "Disconnect:",
        "text": "Logout"
    });
    
    // ...
    
    myButton.addEvent("action", function () {
        alert("You clicked me!");
    });
    
    settings.align([
        username,
        password
    ]);
    */
});
