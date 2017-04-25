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
      elementAttached: {
        type: Boolean,
        value: false
      },
      gallery: {
        type: Object
      },
      galleryId: {
        type: Number,
        computed: '_computeGalleryId(routeData.id, hidden, elementAttached)',
        observer: '_galleryIdChanged'
      },
      goToIndex: {
        type: Number,
        value: 0
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      loading: {
        type: Boolean,
        value: true
      },
      myCaptureUrl: {
        type: String
      },
      routeData: Object
    };
    this.observers = ['_hiddenChanged(hidden)'];
    this.listeners = { 
      'scroll-complete': '_scrollComplete',
      'gallery-content-received': '_contentReceived'
    };
  }

  _checkTags(tags) {
    if (typeof tags !== 'undefined' && tags.length > 0) {
      this._setDisplayTag(tags);
      return true;
    } else {
      return false
    }
  }

  _setDisplayTag(tags) {
    let tagsArr = tags.split(',');
    let tag = tagsArr[0];

    this.set('displayTag', tag);
  }

  _contentReceived(event) {
    if (typeof event.detail.result !== 'undefined') {
      this.set('gallery', event.detail.result);
      this.set('loading', false);
      this._sendPageView();
    }
  }

  _computeGalleryId(routeId, hidden, attached) {
    if (attached) {
      let routeIdNumber = parseInt(routeId);
      let currentGalleryId = this.get('galleryId');

      if (routeIdNumber !== currentGalleryId) {
        if (!hidden) {
          return routeIdNumber;
        } else {
          this.destroyGallery();
        }
      } else {
        return currentGalleryId;
      }
    } else {
      return 0;
    }
  }

  // Observer method for when the story id changes.
  _galleryIdChanged (galleryId, oldGalleryId) {
    this.async(() => {
      if (typeof galleryId !== 'undefined' && galleryId !== 0) {
        this.set('loading', true);
        this.fire('iron-signal', { name: 'request-content', data:{request: 'gallery', desiredItemID: galleryId, callbackId: 'cranberryGalleryRequest'}});
      }
    });
  }

  _hiddenChanged(hidden) {
    let gallery = this.get('gallery');
    if (hidden && typeof gallery !== 'undefined' && Object.keys(gallery).length > 0) {
      this.destroyGallery();
    }
  }

  _sendPageView() {
    this.async(() => {
      let gallery = this.get('gallery');
      let data = {};

      let parentSection = (typeof gallery.sectionInformation.sectionParentName !== 'undefined' ? gallery.sectionInformation.sectionParentName.toLowerCase() : '');
      let section = (typeof gallery.sectionInformation.sectionName !== 'undefined' ? gallery.sectionInformation.sectionName.toLowerCase() : '');
      let matherSections = (typeof parentSection !== 'undefined' && parentSection !== '' ? parentSection + '/' + section : section + '/');

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
      // Send pageview event with iron-signals
      this.fire('iron-signal', {name: 'track-page', data: { path: '/photo-gallery/' + gallery.itemId, data } });

      //Send Chartbeat
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/photo-gallery/' + gallery.itemId, data: {'sections': section, 'authors': gallery.byline } } });

      // Fire Youneeq Page Hit Request
      this.fire('iron-signal', {name: 'page-hit', data: {content: gallery}});
      this.fire('iron-signal', {name: 'observe', data: {content: gallery}});

      // Fire Mather
      this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': section, 'hierarchy': matherSections, 'authors': gallery.byline, 'publishedDate': gallery.publishedISO, 'pageType': 'gallery', timeStamp: new Date() } } });

      this.set('sendInitialView', false);
    });
  }

  // Public methods.
  attached() {
    console.info('\<cranberry-gallery\> attached');
    this.set('elementAttached', true);
  }

  detached() {
    this.destroyGallery();
  }

  destroyGallery() {
    this.set('loading', true);
    this.set('gallery', {});
    this.set('elementAttached', false);

    this._destroyNativo();
    this._closeShare();
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

  _goToSlide (e) {
    this.set('goToIndex', Number(e.target.parentElement.dataset.index));
    this.fire('iron-signal', { name: 'app-scroll', data: { scrollPosition: 0, scrollSpeed: 1500, scrollAnimation: 'easeInOutQuint', afterScroll: true } });
  }
  
  _scrollComplete() {
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
}
Polymer(CranberryGallery);
