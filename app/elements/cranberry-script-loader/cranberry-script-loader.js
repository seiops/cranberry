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
      if (typeof attribute.attributeName !== 'undefined' && typeof attribute.attributeValue !== 'undefined') {
        embed.setAttribute(attribute.attributeName, attribute.attributeValue);
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
Polymer(CranberryScriptLoader);
