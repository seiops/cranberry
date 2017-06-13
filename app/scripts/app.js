/*
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* global CustomEvent, Polymer */

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  let app = document.getElementById('app');
  let skeleton = document.getElementById('skeleton');
  let loadingSplash = document.getElementById('loadingSplash');
  let blockingSplash = document.getElementById('blockingSplash');

  // Debug mode
  app.debug = true;

  // Logger for debug mode
  let logger = text => {
    if (app.debug) {
      console.info(text);
    }
  };

  app.logger = logger;

  // Conditionally load the webcomponents polyfill if needed by the browser.
  // This feature detect will need to change over time as browsers implement
  // different features.
  var webComponentsSupported = ('registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template'));

  let fetchSupported = (typeof window.fetch === 'function' ? true : false);

  if (!fetchSupported) {
    let fetchPolyfill = document.createElement('script');
    fetchPolyfill.src = 'bower_components/fetch/fetch.js';

    document.head.appendChild(fetchPolyfill);
  }

  Array.prototype.find = Array.prototype.find || function(callback) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    } else if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }
    var list = Object(this);
    // Makes sures is always has an positive integer as length.
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    for (var i = 0; i < length; i++) {
      var element = list[i];
      if ( callback.call(thisArg, element, i, list) ) {
        return element;
      }
    }
  };

  // Establish Browser Versioning Object
  app.browser = get_browser();

  // Check browser version if web components are not supported
  if (!webComponentsSupported) {
    switch(app.browser.name) {
      case 'IE':
        showBlockingSplash();
        break;
    }
  }

  function get_browser() {
    let ua = navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|edge|trident|crios(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
      tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
      return {name:'IE',version:(tem[1]||'')};
    }

    if (M[1]==='Chrome') {
      tem=ua.match(/\bOPR\/(\d+)/)
      if(tem!=null)   {
        return {name:'Opera', version:tem[1]};
      }

      tem=ua.match(/Edge\/(\d+)/)
      if(tem!=null)   {
        return {name:'Edge', version:tem[1]};
      }
    }

    if (M[1]==='CriOS') {
      tem=ua.match(/\bCriOS\/(\d+)/)
      if(tem!=null)   {
        return {name:'Chrome', version:tem[1]};
      }
    }

    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];

    if((tem=ua.match(/version\/(\d+)/i))!=null) {
      M.splice(1,1,tem[1]);
    }
    
    return {
      name: M[0],
      version: M[1]
    };
 }

  function showBlockingSplash() {
    app.setAttribute('hidden', true);
    loadingSplash.setAttribute('hidden', true);
    blockingSplash.removeAttribute('hidden');

    let showCoreButton = document.getElementById('showCoreButton');

    showCoreButton.addEventListener('click', showCore, false);
  }

  function showCore(e) {
    e.preventDefault();

    app.removeAttribute('hidden');
    loadingSplash.removeAttribute('hidden');
    blockingSplash.setAttribute('hidden', true);
  }

  function finishLazyLoading() {
    // // When base-bundle.html with elements is loaded
    let onImportLoaded = function() {
      logger('Imports loaded and elements registered.');

      appendOtherScripts();

      if (webComponentsSupported) {
        document.dispatchEvent(
          new CustomEvent('WebComponentsReady', {bubbles: true})
        );
      }
    };

    let elementsBaseBundle = document.getElementById('elementsBaseBundle');
    
    if (elementsBaseBundle.import && elementsBaseBundle.import.readyState === 'complete') {
      onImportLoaded();
    } else {
      elementsBaseBundle.addEventListener('load', onImportLoaded);
    }
  }

  // finishLazyLoading();
  if (!webComponentsSupported) {
    logger('Web Components aren\'t supported!');
    let preScript = document.createElement('script');

    if(document.head.createShadowRoot || document.head.attachShadow) {
        // I can shadow DOM
        preScript.src = 'bower_components/webcomponentsjs/webcomponents-lite.js';
    } else {
        // I can't
        preScript.src = 'bower_components/webcomponentsjs/webcomponents.js';
    }
    
    preScript.onload = appendWebCompPlatform;
    document.body.appendChild(preScript);
  } else {
    logger('\[Cranberry Core\]\: Web Component support detected');
    finishLazyLoading();
  }

  function appendWebCompPlatform() {
    let script = document.createElement('script');
    script.src = 'bower_components/webcomponents-platform/webcomponents-platform.js';
    script.onload = finishLazyLoading;
    document.body.appendChild(script);
  }

  function appendOtherScripts() {
    let gpt = document.createElement('script');
    let shareThrough = document.createElement('script');
    let nativo = document.createElement('script');
    let sonobi = document.createElement('script');

    gpt.src = 'scripts/gpt.js';
    shareThrough.src = 'http://native.sharethrough.com/assets/sfp.js';
    nativo.src = 'http://s.ntv.io/serve/load.js';
    sonobi.src='http://mtrx.go.sonobi.com/morpheus.sanduskynewsgroup.1582.js';

    document.head.appendChild(gpt);
    document.head.appendChild(shareThrough);
    document.head.appendChild(nativo);
    document.head.appendChild(sonobi);
  }

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', () => {
    // logger('\[Cranberry Core\]\: dom-change');
  });

  // Temp scroll to top function on route change
  app.addEventListener('route-changed', function() {
    window.scrollTo(0,0);
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', () => {
    /* imports are loaded and elements have been registered */
  });

  window.addEventListener('service-worker-error', e => {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      logger(e.detail);
    }
  });

  window.addEventListener('service-worker-installed', () => {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      app.$.infoToast.text = 'Caching complete! This app will work offline.';
      app.$.infoToast.show();
    }
  });

  window.addEventListener('service-worker-updated', e => {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      logger(e.detail);
    }
  });
})(document);
