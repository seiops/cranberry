(function(){
  //var etag_cache_buster = ;

  if (document.getElementById("tout-js-sdk")) {return;}

  window.TOUT = window.TOUT || {};

  var brandUid = TOUT.propertyUid || TOUT.property || TOUT.brandUid || TOUT.branduid,
    sdkHost = TOUT.sdkHost || 'platform.tout.com';

  if(brandUid) {
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = 'http://' + sdkHost + '/sdk/v1/' + brandUid + '.js';
    js.id = "tout-js-sdk";
    js.async = true;
    var fjs = document.getElementsByTagName('script')[0];
    fjs.parentNode.insertBefore(js, fjs);
  } else {
    if(window.console && window.console.error){
      console.error("TOUT ERROR: No propertyUid defined");
    }

    var image = new Image();
    image.src = "http://analytics.tout.com/events?trigger=sdk_log&log_level=error&log_message=BRAND_UID_NOT_DEFINED&content_page_url=" + encodeURIComponent(window.location.href);
  }
})();
