var clipboard = {

  textarea: function (text) {
    var textarea = document.createElement('textarea');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.value = text;
    document.body.appendChild(textarea);
    return textarea;
  },

  set: function (text) {
    var area = clipboard.textarea(text);
    area.select();
    document.execCommand('Copy');
    document.body.removeChild(area);
  },

  /* doesn't work */
  get: function () {
    var area = clipboard.textarea('');
    area.focus();
    area.select();
    document.execCommand('Paste');
    setTimeout(function () {
      document.body.removeChild(area);
    }, 0);
    return area.value;
  }

};
