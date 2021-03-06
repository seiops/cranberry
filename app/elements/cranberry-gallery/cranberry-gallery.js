class CranberryGallery {
  beforeRegister() {
    this.is = 'cranberry-gallery';
    this.properties = {
      baseUrl: String,
      elementAttached: Boolean,
      gallery: Object,
      goToIndex: {
        type: Number,
        value: 0
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      loading: {
        type: Boolean,
        value: true
      },
      myCaptureUrl: {
        type: String
      },
      myCaptureReady: {
        type: Boolean,
        computed: '_checkMyCaptureReady(myCapture)',
        value: false
      },
      myCapture: Object,
      routeData: Object
    };
    this.observers = [
      '_compoundObserver(hidden, routeData.id, elementAttached)'
    ];
    this.listeners = { 
      'scroll-complete': '_scrollComplete',
      'gallery-content-received': '_contentReceived',
      'gallery-request-info': '_requestReceived'
    };
  }

  _compoundObserver(hidden, id, attached) {
    this.debounce('_compoundObserver', () => {
      if (!hidden) {
        if (attached) {
          this.set('loading', true);
          this.fire('iron-signal', { name: 'request-content', data:{request: 'gallery', desiredItemID: id, callbackId: 'cranberryGalleryRequest'}});
        }
      } else {
        this.destroyGallery();
      }
    });
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

  _requestReceived(event) {
    if (typeof event.detail.request !== 'undefined') {
      this.set('currentRequest', event.detail.request);
      this.set('currentRequester', event.detail.requester);
    }
  }

  _contentReceived(event) {
    if (typeof event.detail.result !== 'undefined') {
      console.dir(event.detail.result);
      this.set('gallery', event.detail.result);
      this.set('loading', false);
      this._sendPageView();

      if (typeof window.PostRelease !== 'undefined' && typeof window.PostRelease.Start === 'function') {
        PostRelease.Start();
      }
    }
  }

  _sendPageView() {
    this.async(() => {
      let gallery = this.get('gallery');
      let data = {};

      let parentSection = (typeof gallery.sectionInformation.sectionParentName !== 'undefined' ? gallery.sectionInformation.sectionParentName.toLowerCase() : '');
      let section = (typeof gallery.sectionInformation.sectionName !== 'undefined' ? gallery.sectionInformation.sectionName.toLowerCase() : '');
      let matherSections = (typeof parentSection !== 'undefined' && parentSection !== '' ? parentSection + '/' + section : section + '/');
      let byline = '';

      if (typeof gallery.byline !== 'undefined') {
        if (typeof gallery.byline.title !== 'undefined' && gallery.byline.title !== '') {
          byline = gallery.byline.title;
        } else {
          byline = gallery.byline.inputByline;
        }
      }

      // Data settings for pageview
      data.dimension6 = 'Gallery';

      data.dimension1 = byline;

      if (typeof gallery.published !== 'undefined') {
        data.dimension3 = gallery.published;
      }

      if (typeof gallery.tags !== 'undefined') {
        data.dimension8 = gallery.tags;
      }

      data.dimension7 = matherSections;

      // Send pageview event with iron-signals
      this.fire('iron-signal', {name: 'track-page', data: { path: '/photo-gallery/' + gallery.itemId, data } });

      //Send Chartbeat
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/photo-gallery/' + gallery.itemId, data: {'sections': section, 'authors': gallery.byline } } });

      // Fire Youneeq Page Hit Request
      this.fire('iron-signal', {name: 'page-hit', data: {content: gallery}});
      this.fire('iron-signal', {name: 'observe', data: {content: gallery}});

      // Fire Mather
      this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': section, 'hierarchy': matherSections, 'authors': gallery.byline, 'publishedDate': gallery.publishedISO, 'pageType': 'gallery', timeStamp: new Date() } } });

      // Cxense
      this.dispatchEvent(
        new CustomEvent(
          'send-cxense-pageview',
          {
            bubbles: true,
            composed: true,
            detail: {
              location: window.location.href
            }
          }
        )
      );

      this.set('sendInitialView', false);
    });
  }

  // Public methods.
  attached() {
    console.info('\<cranberry-gallery\> attached');
    this.set('elementAttached', true);
  }

  detached() {
    console.info('\<cranberry-gallery\> detached');
    this.destroyGallery();
  }

  destroyGallery() {
    console.info('\<cranberry-gallery\> destroying gallery');
    let currentRequest = this.get('currentRequest');
    let currentRequester = this.get('currentRequester');

    this.fire('iron-signal', {name: 'cancel-request-content', data: {request: currentRequest, requester: currentRequester}});
    this.set('loading', true);
    this.set('gallery', {});

    this._destroyNativo();
    this._closeShare();
  }

  // Private methods.
  _buyImage() {
    let myCapture = this.get('myCapture');

    if (typeof myCapture !== 'undefined') {
      let myCaptureDomain = this.get('myCaptureUrl');

      let myCaputreUrl = `${myCaptureDomain}?image=${myCapture.preview}&notes=${myCapture.fullRes}&backurl=${myCapture.backURL}`

      window.open(myCaputreUrl, '_blank');
    }
  }

  _checkMyCaptureReady(myCapture) {
    if (typeof myCapture !== 'undefined') {
      return true;
    } else {
      return false;
    }
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

      modal.addEventListener('opened-changed', function() {
        if(modal.opened) {
          Polymer.dom(document.body).classList.add('no-scroll');
          Polymer.dom(document.documentElement).classList.add('no-scroll');
        } else {
          Polymer.dom(document.body).classList.remove('no-scroll');
          Polymer.dom(document.documentElement).classList.remove('no-scroll');
        }
      });

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
