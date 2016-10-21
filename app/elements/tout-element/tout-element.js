class toutElement {
  beforeRegister() {
    this.is = 'tout-element';
    this.properties = {
      placement: {
        type: String
      },
      storyTail: {
        type: Object
      },
      slot: {
        type: String
      },
      route: {
        type: Object,
        observer: 'onRouteChanged'
      },
      hidden: {
        type: Boolean,
        observer: 'onHiddenChanged'
      }
    };
  }

  ready() {

  }
  onHiddenChanged(newValue) {
    let tout = Polymer.dom(this.querySelector('#tout-slot-b50c2b'));
    if (newValue) {
      if (tout.firstChild){
        console.info('DESTROY!!!');
        console.info(TOUT);
        TOUT.onReady(function(){
          var $slot = TOUT.$("#tout-slot-b50c2b");

          var players = TOUT.players.getAll();
          var player = players.find(function(player) {
            return $slot.has(player._player.$el);
          });

          if(player){
            player.destroy();
            tout.remove();
          }
        });
      }

    }
  }
  onRouteChanged(newValue) {
    console.info('In Route changed');
    console.info(newValue);
    if (newValue.path !== null && typeof newValue.path !== 'undefined') {
      let route = newValue;
      let routePath = route.path.replace('/', '');

      this.set('storyTail', routePath);

      let self = this;

      // this._setupTout();
      console.log(TOUT);
      TOUT.onReady(function(){
        TOUT.players.create("mid_article_player", { selector: "#tout-slot-b50c2b" });
      });
    }
  }

  _setupTout() {

  }

  attached() {
  }
}
Polymer(toutElement);
