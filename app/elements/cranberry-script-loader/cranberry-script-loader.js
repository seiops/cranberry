class CranberryScriptLoader {
  // element registration
  beforeRegister() {
    this.is = 'cranberry-script-loader';
  }

  // public methods

  // attached to document
  attached() {
    console.info('\<cranberry-script-loader\> attached');

    // Custom Event Listener
    window.addEventListener('load-script', this._loadScriptListener);
  }

  detached() {
    window.removeEventListener('load-script', this._loadScriptListener);
  }

  ready() {
    this._loadScriptListener = this._loadScriptListener.bind(this);
  }

  _loadScriptListener(e) {
    let details = e.detail;
    let {url: scriptUrl, id: scriptId, attributes: scriptAttributes, appendToBody } = details;

    if (typeof scriptUrl !== 'undefined' && scriptUrl.length > 0) {
      console.info('\<cranberry-script-loader\> loading ' + scriptUrl);
      let embed = document.createElement('script');

      // Set scriptUrl to src value of script
      embed.src = scriptUrl;

      // If ID is present set attribute on script
      if (typeof scriptId !== 'undefined' && scriptId.length > 0) {
        embed.setAttribute('id', scriptId);
      }

      // If there are any attributes to attach to the script do that
      if (typeof scriptAttributes !== 'undefined' && Object.keys(scriptAttributes).length > 0) {
        for (let attribute of scriptAttributes) {
          console.log(`You have an attribute of ${attribute.name} and a value of ${attribute.value}`);
          embed.setAttribute(attribute.name, attribute.value);
        }
      }

      if (typeof appendToBody !== 'undefined' && appendToBody) {
        let body = document.getElementsByTagName('body')[0];
        body.appendChild(embed);
      } else {
        let script = document.getElementsByTagName('script')[0];
        let parent = script.parentNode;
        parent.insertBefore(embed, script);
      }
    }
  }

  loadScript(url, id, attribute, appendToBody) {
    
  }
}
Polymer(CranberryScriptLoader);
