class toutElement {
  beforeRegister() {
    this.is = 'tout-element';
    this.properties = {
      hasPlayer: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true
      },
      hidden: {
        type: Boolean,
        value: false
      },
      player: Object,
      playerName: String,
      route: {
        type: Object,
        observer: 'onRouteChanged'
      },
      routeData: Object,
      slot: String,
      slotName: String,
      story: Object,
      storyId: String,
      toutUid: String
    };
    this.observers = [
      '_routeChanged(routeData.page)',
      '_hiddenChanged(hidden)'
    ];
  }

  // Lifecycle methods
  attached() {
    console.info('\<tout-element\> attached');
    this._setupToutScript();    
    this._setMetaData();
    this._createTout();
  }

  // Public Methods
  refresh() {
    this._createTout();
  }

  destroy() {
    this.async(() => {
      let player = this.get('player');
      console.dir(player);
      if (typeof player !== 'undefined' && Object.keys(player).length > 0 && typeof player.destroy === 'function') {
        console.info('\<tout-element\> destroying player: ' + this.get('playerName'));
        player.destroy();
      }
    });
  }

  // Private Methods
  _createTout() {
    let slot = this.get('slot');
    let slotName = 'tout-slot-' + slot;
    let slotSelector = '#tout-slot-' + slot;
    let playerName = this.get('playerName');

    this.set('slotName', slotName);

    console.info('\<tout-element\> building: ' + playerName + ' : in slot: ' + slotName);

    TOUT.onReady(() => {
      var toutPromise = TOUT.players.create(playerName, { selector: slotSelector });

      toutPromise.then((player) => {
        
        if (typeof player !== 'undefined' && Object.keys(player).length > 0) {
          console.info('\<tout-element\> player recieved');
          this.set('player', player);
          this.set('hasPlayer', true);  
        } else {
          console.info('\<tout-element\> no player recieved');
          this.set('hasPlayer', false);
        }
      });
    });
  }

  _hiddenChanged(hidden) {
    let hasPlayer = this.get('hasPlayer');
    this.async(() => {
      if (hasPlayer) {
        if (hidden) {
          this.destroy();
        } else {
          this.refresh();
        }
      }
    });
  }

  _routeChanged(page) {
    // if (page === 'section' || page === '') {
    //   this.destroy(true);
    // } else {
    //   this.destroy();
    // }
  }

  _setMetaData() {
    let story = this.get('story');
    let storyId = '';

    if (typeof story !== 'undefined' && typeof story.itemId !== 'undefined') {
      storyId = story.itemId;

      if (typeof story.title !== 'undefined') {
        let metaTag = Polymer.dom(document).querySelector('meta[property="og:title"]');
        let currentContent = metaTag.getAttribute('content');
        if (currentContent !== story.title) {
          metaTag.setAttribute('content', story.title);
        } 
      }
    }

    if (typeof storyId !== 'undefined' && storyId !== '') {
      let metaTag = Polymer.dom(document).querySelector('meta[property="tout:article:id"]');
      let currentContent = metaTag.getAttribute('content');
      if (currentContent !== storyId) {
        metaTag.setAttribute('content', storyId);
      } 
    }
  }

  _setupToutScript() {
    if (typeof TOUT === 'undefined') {
      let toutUid = this.get('toutUid');

      !function(){var TOUT=window.TOUT=window.TOUT||{};if(console&&console.log&&console.log("Tout SDK: "+ +new Date),!TOUT._sdkScriptTagParsedAt){TOUT._sdkScriptTagParsedAt=new Date,TOUT.EMBED_CODE_VERSION="1.2.0";var sdkHost=TOUT.SDK_HOST||"platform.tout.com",sdkProtocol=TOUT.SDK_PROTOCOL||("https:"==window.location.protocol?"https:":"http:"),analyticsHost=TOUT.SDK_ANALYTICS_HOST||"analytics.tout.com",analyticsProtocol=TOUT.SDK_ANALYTICS_PROTOCOL||sdkProtocol;TOUT.onReady=TOUT.onReady||function(func){return TOUT._onReadyQueue=TOUT._onReadyQueue||[],TOUT._onReadyQueue.push(func),TOUT},TOUT.fireSimpleAnalyticsPixel=function(trigger_name,attrs){var img=new Image,url=analyticsProtocol+"//"+analyticsHost+"/events?trigger="+trigger_name;for(var attr in attrs)attrs.hasOwnProperty(attr)&&(url+="&"+attr+"="+encodeURIComponent(attrs[attr]));return img.src=url,img},TOUT.init=function(brandUid,options){options=options||{};var sdkScriptId="tout-js-sdk";if(document.getElementById(sdkScriptId)&&!options.forceInit)return TOUT;if(brandUid=TOUT.SDK_BRAND_UID||brandUid,"undefined"==typeof brandUid||"string"!=typeof brandUid||0===brandUid.length||brandUid.length>7)return TOUT.fireSimpleAnalyticsPixel("sdk_log",{log_level:"error",log_message:"BRAND_UID_NOT_DEFINED",content_page_url:window.location.href}),console&&console.error&&console.error("TOUT - Invalid Brand UID: "+brandUid),TOUT;TOUT._initOptions=options;var script=document.createElement("script");script.type="text/javascript",script.src=sdkProtocol+"//"+sdkHost+"/sdk/v1/"+brandUid+".js",script.id=sdkScriptId,script.className="tout-sdk";var firstScript=document.getElementsByTagName("script")[0];return firstScript.parentNode.insertBefore(script,firstScript),TOUT.fireSimpleAnalyticsPixel("sdk_initialized",{content_brand_uid:brandUid,sdk_embed_code_version:TOUT.EMBED_CODE_VERSION,content_page_url:window.location.href}),TOUT}}}();
      (function(toutUid){
        TOUT.init(toutUid);
      })(toutUid);
    }
  }
}
Polymer(toutElement);
