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
      myCaptureUrl: {
        type: String
      },
      hidden: {
          type: Boolean,
          reflectToAttribute: true,
          value: true
      }
    };
    this.observers = ['_checkParams(routeData.id)', '_hiddenChanged(hidden)'];
  }

  // Public methods.
  attached() {
    app.logger('\<cranberry-gallery\> attached');
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
      app.logger('\<cranberry-gallery\> setting new gallery id -\> ' + galleryId);

      this.set('galleryId', galleryId);
    }
  }

  // Observer method for when the story id changes.
  _galleryIdChanged () {
    let galleryId = this.get('galleryId');

    if (galleryId !== 0) {
      app.logger('\<cranberry-gallery\> galleryId set to ' + galleryId);

      this._updateGalleryId(galleryId);
    }

  }

  _goToSlide (e) {
    let mainSlider = this.querySelector('#mainSlider');
    let imageIndex = Number(e.target.parentElement.dataset.index);

    mainSlider.goTo(imageIndex);
  }

  _handleResponse (data) {
    app.logger('\<cranberry-gallery\> json response received');

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

    // Assign restResponse to data bound object gallery
    this.set('gallery', result);


    if (typeof result.tags !== 'undefined' && result.tags.length > 0) {
      // Set tags variable to the tags response
      this.set('tags', result.tags.split(','));
      this.set('noTags', false);
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

    let images = this.get('gallery.mediaAssets.images');


    slider.set('items', images);
    slider.set('baseUrl', baseUrl);
    slider.set('whiteText', true);

    let modal = Polymer.dom(document).querySelector('cranberry-base').querySelector('#globalModal');

    let modalContent = Polymer.dom(modal).querySelector('paper-dialog-scrollable').querySelector('#scrollable').querySelector('.content-area');

    modalContent.appendChild(slider);

    modal.open();
    modal.refit();
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
    this.async(function() {
      if (hidden) {
        this._closeShare();
      }
    });
  }

  _closeShare() {
    let shareBar = this.querySelector('gigya-sharebar');
    shareBar.close();
  }
}
Polymer(CranberryGallery);
