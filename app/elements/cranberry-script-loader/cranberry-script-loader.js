class CranberryScriptLoader {
  // element registration
  beforeRegister() {
    this.is = 'cranberry-script-loader';
  }

  // public methods

  // attached to document
  attached() {
    app.logger('\<cranberry-script-loader\> attached');
  }

  loadScript(url) {
    app.logger('\<cranberry-script-loader\> loading ' + url);

    let embed = document.createElement('script');
    embed.src = url;
    embed.async = true;

    let script = document.getElementsByTagName('script')[0];
    let parent = script.parentNode;

    parent.insertBefore(embed, script);
  }
}
Polymer(CranberryScriptLoader);