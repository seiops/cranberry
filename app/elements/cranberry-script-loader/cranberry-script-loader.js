class CranberryScriptLoader {
  // element registration
  beforeRegister() {
    this.is = 'cranberry-script-loader';
  }

  // public methods

  // attached to document
  attached() {
    console.info('\<cranberry-script-loader\> attached');
  }

  loadScript(url, id, attribute, appendToBody) {
    console.info('\<cranberry-script-loader\> loading ' + url);

    let embed = document.createElement('script');

    if (typeof id !== 'undefined' && id.length > 0) {
      embed.setAttribute('id', id);
    }
    
    embed.src = url;
    
    if (typeof attribute !== 'undefined') {
      if (attribute === 'defer') {
        embed.defer = true;
      } else if (attribute === 'async') {
        embed.async = true;
      }
    } else {
      embed.async = true;
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
Polymer(CranberryScriptLoader);
