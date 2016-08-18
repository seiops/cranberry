class CranberryGallery {
  beforeRegister() {
    this.is = 'cranberry-gallery';
    this.properties = {
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
      }
    };
    this.listeners = {
      'buyButton.tap': '_buyImage',
      'images.tap': '_goToSlide',
      'modalOpen.tap': '_openModal',
      'modalClose.tap': '_closeModal'
    };
    this.observers = ['_checkParams(routeData.id)'];
  }

  // Public methods.
  attached() {
    app.logger('\<cranberry-gallery\> attached');
  }

  // ready() {
  //   app.logger('\<cranberry-gallery\> ready');
  // }

  // Private methods.
  _buyImage() {
    let slider = this.$.querySelector('cranberry-slider');
    let images = slider.items;
    let currentIndex = slider.index;
    let currentImage = images[currentIndex].src;
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

  _closeModal () {
    this._sliderMove('close');
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

    mainSlider.goTo(mainSlider, imageIndex);
  }

  _handleResponse (data) {
    app.logger('\<cranberry-gallery\> json response received');

    let result = JSON.parse(data.detail.Result);

    // Assign restResponse to data bound object gallery
    this.set('gallery', result);

    // Set tags variable to the tags response
    this.set('tags', result.tags.split(','));
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
    this._sliderMove('open');
  }

  _sliderMove (type) {
    let modal = this.$.modal;
    let modalSlider = modal.querySelector('#modalSlider');
    let mainSlider = this.querySelector('#mainSlider');
    let mainIndex = mainSlider.index;
    let modalIndex = modalSlider.index;

    // Move slider for main or modal depending on event
    if (mainIndex !== modalIndex) {
      if (type === 'close') {
        mainSlider.goTo(mainSlider, modalIndex);
      } else {
        modalSlider.goTo(modalSlider, mainIndex);
      }
    }

    // Toggle the open/close event
    modal.toggle();
  }

  // Update story id in request parameters.
  _updateGalleryId (galleryid) {
    this.set('jsonp.desiredItemID', galleryid);

    let request = this.get('jsonp');

    this.set('params', request);

    this._changeParams();
  }
}
Polymer(CranberryGallery);
