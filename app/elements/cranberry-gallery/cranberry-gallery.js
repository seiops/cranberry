class CranberryGallery {
  beforeRegister() {
    this.is = 'cranberry-gallery';
    this.properties = {
      baseUrl: String,
      gallery: {
        type: Object
      },
      galleryId: {
        type: Number,
        value: 0,
        observer: '_galleryIdChanged'
      },
      jsonp: {
        type: Object,
        value: {
          request: 'gallery'
        }
      },
      myCaptureUrl: {
        type: String
      },
      params: {
        type: Object,
        value: {}
      },
      rest: {
        type: String
      },
      routeData: Object,
      tags: {
        type: Array
      },
      noTags: {
        type: Boolean,
        value: true
      },
      hidden: {
          type: Boolean
      }
    };
    this.observers = ['_checkParams(routeData.id)', '_hiddenChanged(hidden)'];
    this.listeners = { 'scrollComplete': '_afterScroll' };
  }

  // Public methods.
  attached() {
    console.info('\<cranberry-gallery\> attached');
  }

  // Private methods.
  _buyImage() {
    let slider = this.$.mainSlider;
    let currentImage = slider.querySelector('iron-image').src;
    let myCapture = this.get('myCaptureUrl');

    let capture = {
        sDomain: myCapture,
        setImgParams: function () {
            var sImg = currentImage;
            capture.sImage = "?image=" + encodeURIComponent(sImg); // formatted sImg for preview
            capture.sNotes = "&notes=" + encodeURIComponent(sImg.replace(sImg.split('/')[7] + "/", "")); // full res image for auto image retrieval
            capture.sBackURL = "&backurl=" + encodeURIComponent(window.location.origin + window.location.pathname + window.location.hash);
            var sMyCapURL = capture.sDomain + capture.sImage + capture.sNotes + capture.sBackText + capture.sBackURL;
            window.open(sMyCapURL, '_blank');
        }
    };
    capture.setImgParams();
  }

  // Called by observer when params object is changed.
  _changeParams () {
    let params = this.get('params');
    let galleryId = this.get('galleryId');

    this.set('gallery', {});

    if (params.length !== 0 && galleryId !== 0) {
      this.$.request.url = this.rest;
      this.$.request.params = params;

      this.$.request.generateRequest();
    }
  }

  // Updates id value from route.
  _checkParams() {
    let galleryId = this.get('routeData.id');
    let currentId = this.get('galleryId');

    if (typeof galleryId !== 'undefined' && currentId !== galleryId) {
      console.info('\<cranberry-gallery\> setting new gallery id -\> ' + galleryId);

      this.set('galleryId', galleryId);
    }
  }

  // Observer method for when the story id changes.
  _galleryIdChanged () {
    let galleryId = this.get('galleryId');

    if (galleryId !== 0) {
      console.info('\<cranberry-gallery\> galleryId set to ' + galleryId);

      this._updateGalleryId(galleryId);
    }

  }

  _goToSlide (e) {
    let mainSlider = this.querySelector('#mainSlider');
    let imageIndex = Number(e.target.parentElement.dataset.index);

    mainSlider.goTo(imageIndex);

    this._scrollToY(0, 1500, 'easeInOutQuint');
  }
  
  _afterScroll() {
    let topAd = this.$.topAd;
    let sideAd = this.$.sideAd;

    topAd.refresh();
    sideAd.refresh();
  }

  _handleResponse (data) {
    console.info('\<cranberry-gallery\> json response received');

    let result = JSON.parse(data.detail.Result);
    let gaData = {};

    // Data settings for pageview
    gaData.dimension6 = 'Gallery';

    if (typeof result.byline !== 'undefined') {
      gaData.dimension1 = result.byline;
    }

    if (typeof result.published !== 'undefined') {
      gaData.dimension3 = result.published;
    }

    if (typeof result.tags !== 'undefined') {
      gaData.dimension8 = result.tags;
    }

    // Send pageview event with iron-signals
    this.fire('iron-signal', {name: 'track-page', data: { path: '/photo-gallery/' + result.itemId, gaData } });

    //Send Chartbeat
    this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/photo-gallery/' + result.itemId, data: {'sections': result.sectionInformation.sectionName, 'authors': result.byline } } });

    // Assign restResponse to data bound object gallery
    this.set('gallery', result);

    // Fire nativo
    if (typeof window.PostRelease !== 'undefined' && typeof window.PostRelease.Start === 'function') {
      PostRelease.Start();
    }

    if (typeof result.tags !== 'undefined' && result.tags.length > 0) {
      // Set tags variable to the tags response
      this.set('tags', result.tags.split(','));
      this.set('noTags', false);
    } else {
      this.set('noTags', true);
    }
  }

  _onRouteChanged (newValue, oldValue) {
    if (typeof oldValue !== 'undefined') {
      if (newValue.path.replace('/', '') === 'gallery-content') {
        let mainSlider = this.querySelector('#mainSlider');

        mainSlider.endLoading(slider, 0, 'next');
      }
    }
  }

  _openModal () {
    let baseUrl = this.get('baseUrl');
    let slider = document.createElement('cranberry-slider');
    let gallery = this.get('gallery');

    this.async(() => {
      slider.set('items', gallery.mediaAssets.images);
      slider.set('baseUrl', baseUrl);
      slider.set('whiteText', true);
      slider.set('gallery', gallery);

      let modal = Polymer.dom(document).querySelector('cranberry-base').querySelector('#globalModal');

      let modalContent = Polymer.dom(modal).querySelector('paper-dialog-scrollable').querySelector('#scrollable').querySelector('.content-area');

      modalContent.appendChild(slider);

      modal.open();
      modal.refit();
    });
  }

  // Update story id in request parameters.
  _updateGalleryId (galleryid) {
    this.set('tags', []);
    this.set('jsonp.desiredItemID', galleryid);

    let request = this.get('jsonp');

    this.set('params', request);

    this._changeParams();
  }

  _hiddenChanged(hidden) {
    let gallery = this.get('gallery');

    if (hidden) {
      this._closeShare();
      this._destroyNativo();
    } else {
      // Send pageview event with iron-signals
      this.fire('iron-signal', {name: 'track-page', data: { path: '/photo-gallery/' + gallery.itemId, gaData } });

      //Send Chartbeat
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/photo-gallery/' + gallery.itemId, data: {'sections': gallery.sectionInformation.sectionName, 'authors': gallery.byline } } });

    }
  }

  _destroyNativo() {
    let nativoAds = Polymer.dom(this).querySelectorAll('.ntv-ad-div');

    if (nativoAds.length > 0) {
      nativoAds.forEach((value, index) => {
        value.innerHTML = '';
      });
    }
  }
  
  _closeShare() {
    let slider = Polymer.dom(this.$.mainSlider);
    let shareBar = slider.querySelector('gigya-sharebar');

    shareBar.close();
  }

    _requestAnimFrame() {
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
      })();
  }

  _scrollToY(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use
    this._requestAnimFrame();
    let scrollY = window.scrollY || document.documentElement.scrollTop;
    console.log(scrollY);
    let currentTime = 0;

    scrollTargetY = scrollTargetY || 0;
    speed = speed || 2000;
    easing = easing || 'easeOutSine';

    // min time .1, max time .8 seconds
    let time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    let easingEquations = {
      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },
      easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
      },
      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
      }
    };

    let tick = () => {
      currentTime += 1 / 60;

      var p = currentTime / time;
      var t = easingEquations[easing](p);

      if (p < 1) {
        window.requestAnimFrame(tick);
        window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
      } else {
        this.fire('scrollComplete');
        window.scrollTo(0, scrollTargetY);
      }
    }

    // call it once to get started
    tick();
  }
}
Polymer(CranberryGallery);
