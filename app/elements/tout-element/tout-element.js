class toutElement {
  beforeRegister() {
    this.is = 'tout-element';
    this.properties = {
      placement: {
        type: String
      },
      storyId: {
        type: Object
      },
      slot: {
        type: String
      },
      route: {
        type: Object,
        observer: 'onRouteChanged'
      },
      player: String,
      hidden: {
        type: Boolean,
        observer: 'onHiddenChanged'
      },
      slotName: String,
      routeData: {
        type: Object
      }
    };
    this.observers = ['_routeChanged(routeData.page)'];
  }

  attached() {
    app.logger('\<tout-element\> attached');

    let metaTag = Polymer.dom(document).querySelector('meta[property="tout:article:id"]');
    metaTag.setAttribute('content', this.get('storyId'));
    console.log(metaTag);

    let slot = this.get('slot');
    let slotName = 'tout-slot-' + slot;
    let placement = this.get('placement');
    let player = this.get('player');

    this.set('slotName', slotName);

    TOUT.onReady(function(){
      TOUT.players.create(player, { selector: '#' + slotName });
    });
  }

  detached() {
    app.logger('\<tout-element\> detached');
    this.destroy();
  }

  refresh() {
    this.async(function() {
      console.log('Refreshing the Tout');
      let player = this.get('player');
      let slotName = this.get('slotName');

      TOUT.onReady(function(){
        TOUT.players.create(player, { selector: '#' + slotName });
      });
    });
  }

  destroy(autoRefresh) {
    this.async(function() {
      let el = this;
      let slotName = this.get('slotName');

      TOUT.onReady(function(){
        let $slot = TOUT.$('#' + slotName);

        let players = TOUT.players.getAll();
        let player = players.find(function(player) {
          return $slot.has(player._player.$el);
        });

        if(typeof player !== 'undefined' && typeof player.instanceID !== 'undeinfed' && player.instanceID !== ''){
          player.destroy();

          let toutWrapper = el.querySelector('#' + slotName);
          toutWrapper.innerHTML = '';

          if (autoRefresh) {
            el.refresh();
          }
        }
      });
    });
  }

  _routeChanged(page) {
    if (page === 'section' || page === '') {
      this.destroy(true);
    } else {
      this.destroy();
    }
  }
}
Polymer(toutElement);
