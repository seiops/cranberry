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

  var fetchSupported = (typeof window.fetch === 'function' ? true : false);

  if (!fetchSupported) {
    var fetchPolyfill = document.createElement('script');
    fetchPolyfill.src = 'bower_components/fetch/fetch.js';

    document.body.appendChild(fetchPolyfill);
  }

  // Check browser version if web components are not supported
  if (!webComponentsSupported) {
    if (typeof navigator !== 'undefined' && navigator.userAgent !== 'undefined') {
      let userAgent = navigator.userAgent;
      if (userAgent.indexOf("Trident/7.0") > 0) {
        console.log('I am IE 11');
        showBlockingSplash();
      } else if (userAgent.indexOf("Trident/6.0") > 0) {
        console.log('I am IE 10');
      } else if (userAgent.indexOf("Trident/5.0") > 0) {
        console.log('I am IE 9');
      } else {
        console.log('I am not a triggered version of IE');
      }
    }
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

    console.log('Show the core please!');

    app.removeAttribute('hidden');
    loadingSplash.removeAttribute('hidden');
    blockingSplash.setAttribute('hidden', true);
  }
  function finishLazyLoading() {
    // // When base-bundle.html with elements is loaded
    var onImportLoaded = function() {
      logger('Imports loaded and elements registered.');

      if (webComponentsSupported) {
        document.dispatchEvent(
          new CustomEvent('WebComponentsReady', {bubbles: true})
        );
      }
    };

    var elementsBaseBundle = document.getElementById('elementsBaseBundle');
    
    if (elementsBaseBundle.import && elementsBaseBundle.import.readyState === 'complete') {
      onImportLoaded();
    } else {
      elementsBaseBundle.addEventListener('load', onImportLoaded);
    }
  }

  // finishLazyLoading();
  if (!webComponentsSupported) {
    logger('Web Components aren\'t supported!');
    var preScript = document.createElement('script');
    
    preScript.src = 'bower_components/webcomponents-platform/webcomponents-platform.js';
    preScript.onload = appendWebComp;
    document.body.appendChild(preScript);
  } else {
    logger('\[Cranberry Core\]\: Web Component support detected');
    finishLazyLoading();
  }

  function appendWebComp() {
    var script = document.createElement('script');
    script.src = 'bower_components/webcomponentsjs/webcomponents-lite.js';
    script.onload = finishLazyLoading;
    document.body.appendChild(script);
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
