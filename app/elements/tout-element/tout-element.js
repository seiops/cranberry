class toutElement {
  beforeRegister() {
    this.is = 'tout-element';
    this.properties = {
      story: {
        type: Object
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
      },
      toutUid: {
        type: String
      }
    };
    this.observers = ['_routeChanged(routeData.page)'];
  }

  attached() {
    console.info('\<tout-element\> attached');
    this._setupToutScript();

    let story = this.get('story');
    let storyId = '';
    if (typeof story !== 'undefined' && typeof story.itemId !== 'undefined') {
      storyId = story.itemId;

      if (typeof story.title !== 'undefined') {
        let metaTag = Polymer.dom(document).querySelector('meta[property="og:title"]');
        metaTag.setAttribute('content', story.title);
      }
    }

    if (typeof storyId !== 'undefined' && storyId !== '') {
      let metaTag = Polymer.dom(document).querySelector('meta[property="tout:article:id"]');
      metaTag.setAttribute('content', storyId);
    }
    

    let slot = this.get('slot');
    let slotName = 'tout-slot-' + slot;
    let player = this.get('player');

    this.set('slotName', slotName);

    TOUT.onReady(function(){
      TOUT.players.create(player, { selector: '#' + slotName });
    });
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

  detached() {
    console.info('\<tout-element\> detached');
    this.destroy();
  }

  refresh() {
    this.async(function() {
      let player = this.get('player');
      let slotName = this.get('slotName');

      TOUT.onReady(function(){
        TOUT.slotManager.slotReady(player, '#' + slotName);
      });
    });
  }

  destroy(autoRefresh) {
    let el = this;
    let slotName = this.get('slotName');

    let toutDefined = new Promise(
      function(resolve, reject) {
        function timeoutFunction() {
          setTimeout(function() {
            if (typeof TOUT !== 'undefined' && typeof TOUT.onReady === 'function') {
              resolve(true);
              return;
            } else {
              timeoutFunction();
            }
          }, 50);
        }
        timeoutFunction();
      }
    );

    toutDefined.then(function(val) {
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
Polymer(toutElement);
