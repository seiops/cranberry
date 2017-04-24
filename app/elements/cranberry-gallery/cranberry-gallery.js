class CranberryGallery {
  get behaviors() {
    return [Polymer.NeonAnimationRunnerBehavior]
  }
  beforeRegister() {
    this.is = 'cranberry-gallery';
    this.properties = {
      animationConfig: {
        value: function() {
          return {
            'entry': {
              name: 'fade-in-animation',
              node: this,
              timing: {duration: 1500}
            }
          }
        }
      },
      baseUrl: String,
      gallery: {
        type: Object
      },
      galleryId: {
        type: Number,
        value: 0,
        observer: '_galleryIdChanged'
      },
      goToIndex: {
        type: Number,
        value: 0
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
      requestInProgress: {
        type: Boolean,
        value: true,
        observer: '_requestInProgressChanged'
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
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      sendInitialView: {
        type: Boolean,
        value: true
      }
    };
    this.observers = ['_checkParams(routeData.id)', '_hiddenChanged(hidden, routeData.id)'];
    this.listeners = { 'scroll-complete': 'scrollComplete' };
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
  _galleryIdChanged (galleryId, oldGalleryId) {
    if (galleryId !== 0 && galleryId !== oldGalleryId) {
      console.info('\<cranberry-gallery\> galleryId set to ' + galleryId);

      this._updateGalleryId(galleryId);
    }

  }

  _goToSlide (e) {
    this.set('goToIndex', Number(e.target.parentElement.dataset.index));
    this.fire('iron-signal', { name: 'app-scroll', data: { scrollPosition: 0, scrollSpeed: 1500, scrollAnimation: 'easeInOutQuint', afterScroll: true } });
  }
  
  scrollComplete() {
    let hidden = this.get('hidden');
    let goToIndex = this.get('goToIndex');
    this.async(() => {
      if (!hidden) {
        let mainSlider = this.querySelector('#mainSlider');
        let imageIndex = goToIndex;

        mainSlider.goTo(imageIndex);

        let topAd = Polymer.dom(this.root).querySelector('#topAd');
        let sideAd = Polymer.dom(this.root).querySelector('#sideAd');

        topAd.refresh();
        sideAd.refresh();
      }
    });
  }

  _handleResponse (response) {
    console.info('\<cranberry-gallery\> json response received');

    let result = JSON.parse(response.detail.Result);
    let data = {};

    let parentSection = result.sectionInformation.sectionParentName;
    let section = result.sectionInformation.sectionName;

    if (typeof parentSection !== 'undefined') {
      parentSection = parentSection.toLowerCase();
    }

    if (typeof section !== 'undefined') {
      section = section.toLowerCase();
    }

    let matherSections = (typeof parentSection !== 'undefined' && parentSection !== '' ? parentSection + '/' + section : section + '/');

    // Data settings for pageview
    data.dimension6 = 'Gallery';

    if (typeof result.byline !== 'undefined') {
      data.dimension1 = result.byline;
    }

    if (typeof result.published !== 'undefined') {
      data.dimension3 = result.published;
    }

    if (typeof result.tags !== 'undefined') {
      data.dimension8 = result.tags;
    }

    // Assign restResponse to data bound object gallery
    this.set('gallery', result);

    let sendInitialView = this.get('sendInitialView');

    if (sendInitialView) {
      // Send pageview event with iron-signals
      this.fire('iron-signal', {name: 'track-page', data: { path: '/photo-gallery/' + result.itemId, data } });

      //Send Chartbeat
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/photo-gallery/' + result.itemId, data: {'sections': result.sectionInformation.sectionName, 'authors': result.byline } } });

      // Fire Youneeq Page Hit Request
      this.fire('iron-signal', {name: 'page-hit', data: {content: result}});
      this.fire('iron-signal', {name: 'observe', data: {content: result}});

      // Fire Mather
      this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': section, 'hierarchy': matherSections, 'authors': result.byline, 'publishedDate': result.publishedISO, 'pageType': 'gallery', timeStamp: new Date() } } });

      this.set('sendInitialView', false);
    }

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
      slider.set('hidden', false);

      let modal = Polymer.dom(document).querySelector('cranberry-base').querySelector('#globalModal');

      let modalContent = Polymer.dom(modal).querySelector('paper-dialog-scrollable').querySelector('#scrollable').querySelector('.content-area');

      modalContent.appendChild(slider);

      modal.open();
      modal.refit();
    });
  }

  // Update story id in request parameters.
  _updateGalleryId (galleryid) {
    this.debounce('_updateGalleryId', ()  => {
      this.set('tags', []);
      this.set('jsonp.desiredItemID', galleryid);

      let request = this.get('jsonp');

      this.set('params', request);

      this._changeParams();
    });
  }

  _hiddenChanged(hidden, routeId) {
    this.async(()  => {
      let gallery = this.get('gallery');
      let galleryId = this.get('galleryId');
      let sendInitialView = this.get('sendInitialView');

      if (typeof hidden !== 'undefined' && hidden) {
        this._closeShare();
        this._destroyNativo();
      } else {
        if (typeof gallery !== 'undefined' && typeof gallery.itemId !== 'undefined' && !sendInitialView) {
          let parentSection = gallery.sectionInformation.sectionParentName;
          let section = gallery.sectionInformation.sectionName;

          if (typeof parentSection !== 'undefined') {
            parentSection = parentSection.toLowerCase();
          }

          if (typeof section !== 'undefined') {
            section = section.toLowerCase();
          }

          let data = {};
          // Data settings for pageview
          data.dimension6 = 'Gallery';

          if (typeof gallery.byline !== 'undefined') {
            data.dimension1 = gallery.byline;
          }

          if (typeof gallery.published !== 'undefined') {
            data.dimension3 = gallery.published;
          }

          if (typeof gallery.tags !== 'undefined') {
            data.dimension8 = gallery.tags;
          }

          let matherSections = (typeof parentSection !== 'undefined' && parentSection !== '' ? parentSection + '/' + section : section + '/');
          
          // Send pageview event with iron-signals
          this.fire('iron-signal', {name: 'track-page', data: { path: '/photo-gallery/' + gallery.itemId, data } });

          //Send Chartbeat
          this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/photo-gallery/' + gallery.itemId, data: {'sections': section,  'authors': gallery.byline } } });
          
          // Fire Youneeq Page Hit Request
          this.fire('iron-signal', {name: 'page-hit', data: {content: gallery}});
          this.fire('iron-signal', {name: 'observe', data: {content: gallery}});

          this.fire('iron-signal', {name: 'refresh-ad' });

          // Fire Mather
          this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': section, 'hierarchy': matherSections, 'authors': gallery.byline, 'publishedDate': gallery.publishedISO, 'pageType': 'gallery', timeStamp: new Date() } } });
        }
      }
    });
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

  _scrollToComments() {
    this.fire('iron-signal', {name: 'scroll-to-comments'});
  }

  _requestInProgressChanged(loading, oldLoading) {
    this.async(() => {
      if (!loading) {
        this.playAnimation('entry');
      }
    });
  }
}
Polymer(CranberryGallery);
