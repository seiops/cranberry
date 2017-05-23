var wrapper = function( name, fn, opts) {
  // add events to cache/queue
  if (typeof this !== 'undefined') {
    addEventToQueue(this, name, fn, opts);
    this.__oldAddEvent( name, fn, opts);
  }
};

function addEventToQueue( obj, name, fn, opts ) {
  obj.__eventListeners = obj.__eventListeners || {};
  obj.__eventListeners[name] = obj.__eventListeners[name] || [];

  obj.__eventListeners[name].push({fn: fn, opts: opts});
}

function initListener() {
  document.__oldAddEvent = document.addEventListener;
  document.addEventListener = wrapper;

  window.__oldAddEvent = window.addEventListener;
  window.addEventListener = wrapper;
};

function cleanupListeners() {
  cleanupListener(document);
  cleanupListener(window);
}

function cleanupListener (obj) {
  for (var k in (obj.__eventListeners || {}) ) {
    var fns = obj.__eventListeners[k];
    for ( var i = 0; i < fns.length; i++ ) {

      obj.removeEventListener(k, fns[i].fn, fns[i].opts);
    }
  }
}

initListener();
window.onunload = cleanupListeners;

function clearObj(obj) {
  for (var k in obj) {
    obj[k] = null;
  }
}

function removeAllPolymerObjects() {
  if( !CustomElements.registry ) {
    return;
  }

  for ( var k in Object.keys(CustomElements.registry) ) {
    let els = document.querySelectorAll(CustomElements.registry[k]);
    for (var e in els) {
      if( e.parentNode ) {
        e.__dom =  null;
        e.parentNode.removeChild(e);
      } else if( typeof(e) !== 'string' ) {
        document.body.remove(e);
      }
    }
  }
}

function unloadPolymer() {
  googletag.destroySlots();
  removeAllPolymerObjects();
  clearObj(CustomElements.registry);
}
window.onbeforeunload = unloadPolymer;
