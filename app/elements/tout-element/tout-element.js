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
          console.info(tout);
          console.info('REALLY DESTROY!!!');
          TOUT.$("#tout-slot-b50c2b").html('');
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

      this._setupTout();

      TOUT.onReady(function() {
        TOUT.slotManager.slotReady("b50c2b", '#tout-slot-b50c2b');
      });
    }
  }

  _setupTout() {
    !function(){var TOUT=window.TOUT=window.TOUT||{};if(console&&console.log&&console.log('Tout SDK: '+ +new Date),!TOUT._sdkScriptTagParsedAt){TOUT._sdkScriptTagParsedAt=new Date,TOUT.EMBED_CODE_VERSION='1.2.0';var sdkHost=TOUT.SDK_HOST||'platform.tout.com',sdkProtocol=TOUT.SDK_PROTOCOL||('https:'==window.location.protocol?'https:':'http:'),analyticsHost=TOUT.SDK_ANALYTICS_HOST||'analytics.tout.com',analyticsProtocol=TOUT.SDK_ANALYTICS_PROTOCOL||sdkProtocol;TOUT.onReady=TOUT.onReady||function(func){return TOUT._onReadyQueue=TOUT._onReadyQueue||[],TOUT._onReadyQueue.push(func),TOUT},TOUT.fireSimpleAnalyticsPixel=function(trigger_name,attrs){var img=new Image,url=analyticsProtocol+'//'+analyticsHost+'/events?trigger='+trigger_name;for(var attr in attrs)attrs.hasOwnProperty(attr)&&(url+='&'+attr+'='+encodeURIComponent(attrs[attr]));return img.src=url,img},TOUT.init=function(brandUid,options){options=options||{};var sdkScriptId='tout-js-sdk';if(document.getElementById(sdkScriptId)&&!options.forceInit)return TOUT;if(brandUid=TOUT.SDK_BRAND_UID||brandUid,'undefined'==typeof brandUid||'string'!=typeof brandUid||0===brandUid.length||brandUid.length>7)return TOUT.fireSimpleAnalyticsPixel('sdk_log',{log_level:'error',log_message:'BRAND_UID_NOT_DEFINED',content_page_url:window.location.href}),console&&console.error&&console.error('TOUT - Invalid Brand UID: '+brandUid),TOUT;TOUT._initOptions=options;var script=document.createElement('script');script.type='text/javascript',script.src=sdkProtocol+'//'+sdkHost+'/sdk/v1/'+brandUid+'.js',script.id=sdkScriptId,script.className='tout-sdk';var firstScript=document.getElementsByTagName('script')[0];return firstScript.parentNode.insertBefore(script,firstScript),TOUT.fireSimpleAnalyticsPixel('sdk_initialized',{content_brand_uid:brandUid,sdk_embed_code_version:TOUT.EMBED_CODE_VERSION,content_page_url:window.location.href}),TOUT}}}();
    (function(){
        TOUT.init('2f45b0');
    })();
  }

  attached() {
  }
}
Polymer(toutElement);
