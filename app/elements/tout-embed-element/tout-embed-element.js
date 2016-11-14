class toutEmbedElement {
  beforeRegister() {
    this.is = 'tout-embed-element';
    this.properties = {
      slot: {
        type: String,
        observer: '_slotChanged'
      },
      previousSlot: {
        type: String
      }
    }
  }

  attached() {
    let slot = this.get('slot');

    let loader = document.querySelector('cranberry-script-loader');

    loader.loadScript('http://player.tout.com/embeds/feeds/6f7f6f.js?&autoplay=false&element_id=tout-embed-' + slot + '&height=auto&width=auto', 'toutEmbedScript-' + slot);
  }

  detached() {
    let slot = this.get('slot');

    let toutDefined = this._checkTout();

    this.async(function() {
      if (toutDefined) {
        window.TOUT.onReady(function(){
          let $slot = TOUT.$('#tout-embed-' + section);

          let players = TOUT.players.getAll();
          let player = players.find(function(player) {
            return $slot.has(player._player.$el);
          });

          if(typeof player !== 'undefined' && typeof player.instanceID !== 'undeinfed' && player.instanceID !== ''){
            player.destroy();
          }
        });
      }
    });

    let previous = this.get('previousSlot');

    this.async(function() {
      let destroySlot = slot;

      if (typeof previous !== 'undefined' && typeof slot !== 'undefined' && slot !== previous) {
        slot = previous;
      }
      
      let script = Polymer.dom(document).querySelector('#toutEmbedScript-' + slot);
      let parent = script.parentNode;

      parent.removeChild(script);
    });
    
  }

  _slotChanged(slot, oldSlot) {
    if (typeof slot !== 'undefined' && typeof oldSlot !== 'undefined') {
      this.set('previousSlot', oldSlot);
    }
  }

  // check if Tout API is loaded
  _checkTout() {
    let el = this;

    setTimeout(function() {
      if (typeof TOUT !== 'undefined') {
        return true;
      } else {
        el._checkTout();
      }
    }, 50);
  }
}
Polymer(toutEmbedElement);
