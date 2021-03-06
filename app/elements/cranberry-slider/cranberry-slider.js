class cranberrySlider {
  beforeRegister() {
    this.is = 'cranberry-slider';
    this.properties = {
      items: {
        type: Array,
        value: []
      },
      baseUrl: {
        type: String,
        value: ''
      },
      count: {
        type: Number,
        value: 0
      },
      currentIndex: {
        type: Number,
        value: 0
      },
      clicks: {
        type: Number,
        value: 0,
        observer: '_clicksChanged'
      },
      requestIndex: {
        type: Number,
        value: 0
      },
      displayIndex: {
        type: Number,
        value: 1
      },
      currentImage: {
        type: Object
      },
      startX : {
        type: Number,
        value: 0
      },
      isDraggable: {
        type: Boolean,
        value: true
      },
      imageLoading: {
        type: Boolean,
        value: true
      },
      height: {
        observer: '_heightChanged',
        type: Number,
        value: null
      },
      whiteText: {
        type: Boolean,
        value: false
      },
      noCaption: {
        type: Boolean,
        value: false
      },
      hideImage: {
        type: Boolean,
        value: false
      },
      galleryType: {
        type: String,
        value: 'cranberry-gallery'
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      showBuyButton: {
        type: Boolean,
        value: false,
        notify: true
      },
      toutOff: Boolean,
      myCapture: {
        type: Object,
        computed: '_computeMyCapture(currentImage)',
        notify: true
      }
    };
    this.observers = ['_itemsLoaded(items)'];
  }

  attached() {
    let image = this.$.mover;
    let self = this;

    image.addEventListener('touchstart', function (event) {
      let eventObj = event.changedTouches[0];

      self.set('isDraggable', true);
      self.set('startX', eventObj.pageX);
    });

    image.addEventListener('touchmove', function (event) {
      let startX = self.get('startX');
      let isDraggable = self.get('isDraggable');
      let eventObj = event.changedTouches[0];
      let thisX = eventObj.pageX;
      let change = Math.abs(startX - thisX);

      if (change >= 150 && isDraggable) {
        event.preventDefault();
        if (thisX < startX) {
          // Move Forward
          self.set('startX', 0);
          self.set('isDraggable', false);
          self._showNext();
        } else {
          // Move Backward
          self.set('startX', 0);
          self.set('isDraggable', false);
          self._showPrevious();
        }
      }
    });
  }

  _checkItemsLength(items) {
    if (typeof items !== 'undefined') {
      if (items.length > 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  _itemsLoaded(items) {
    if (typeof items !== 'undefined' && items.length > 0) {
      this.set('count', items.length);
    }

    this.set('requestIndex', 0);
    this.set('clicks', 0);
    this.set('hideImage', false);
  }

  _computeShow(item) {
    let items = this.get('items');
    let index = items.indexOf(item);
    let requestIndex = this.get('requestIndex');

    if (index === requestIndex) {
      this.set('currentImage', item);
      this.set('displayIndex', index + 1);
      this.fire('sliderMoved', {index: index + 1});

      this.set('showBuyButton', item.sell);
      return true;
    } else {
      return false;
    }
  }

  _showNext() {
    let imagesHidden = this.get('hideImage');

    if (imagesHidden) {
      this.set('hideImage', false);
    } else {
      let move = 1;
      let requestIndex = this.get('requestIndex');
      let count = this.get('count');

      let newNumber = requestIndex + move;

      if (newNumber > count - 1) {
        newNumber = 0;
      }

      this.set('requestIndex', newNumber);
      // this.playAnimation('exit');

      let template = this.$.sliderRepeat;
      template.render();
      this._registerClick();
    }
  }

  _showPrevious() {
    let imagesHidden = this.get('hideImage');

    if (imagesHidden) {
      this.set('hideImage', false);
    } else {
      let move = -1;
      let requestIndex = this.get('requestIndex');
      let count = this.get('count');

      let newNumber = requestIndex + move;

      if (newNumber < 0) {
        newNumber = count - 1;
      }

      this.set('requestIndex', newNumber);
      // this.playAnimation('exit');

      let template = this.$.sliderRepeat;
      template.render();
      this._registerClick();
    }
  }

  _heightChanged() {
    this.style.height = isNaN(this.height) ? this.height : this.height + 'px';
  }

  _registerClick() {
    let clicks = this.get('clicks');
    this.set('clicks', clicks + 1);
  }

  _clicksChanged(clicks) {
    let modal = this.get('whiteText');
    let galleryType = this.get('galleryType');

    if (typeof clicks !== 'undefined' && clicks !== 0) {
      if (clicks % 2 === 0 && !modal) {
      // Refresh Ad Units
      let app = Polymer.dom(document).querySelector('cranberry-base');
      let content = Polymer.dom(app.root).querySelector(galleryType);
      let gallery = Polymer.dom(content.root);
      
      let topAd = Polymer.dom(gallery).querySelector('#topAd');
      let sideAd = Polymer.dom(gallery).querySelector('#sideAd');

      topAd.refresh();
      sideAd.refresh();
      }

      if (clicks % 5 === 0) {
        // Show in gallery ad
        this.set('hideImage', true);
      }

      this._sendPageview();
    }
  }

  _closeAd() {
    this.set('hideImage', false);
  }

  _sendPageview() {
    let gallery = this.get('gallery');
    let galleryType = this.get('galleryType');
    let timeStamp = new Date();
    let data = {};

    let path = '/photo-gallery/';

    let parentSection = (typeof gallery.sectionInformation.sectionParentName !== 'undefined' ? gallery.sectionInformation.sectionParentName.toLowerCase() : '');
    let section = (typeof gallery.sectionInformation.sectionName !== 'undefined' ? gallery.sectionInformation.sectionName.toLowerCase() : '');
    let matherSections = (typeof parentSection !== 'undefined' && parentSection !== '' ? parentSection + '/' + section : section + '/');
    let contentType = 'Gallery';
    
    if (typeof galleryType !== 'undefined') {
      switch(galleryType) {
        case 'cranberry-jail-mugs':
          path = '/jail-mugs/' + gallery.bookingDate;
          gallery.timeStamp = new Date();
          contentType = 'Jail Mugs';
          break;
        case 'cranberry-story': 
          path = '/story/' + gallery.itemId;
          contentType = 'Story';
          let toutOff = this.get('toutOff');
          data.dimension4 = toutOff;
          break;
        default:
          path += gallery.itemId;
      }
    }
  
    // Data settings for pageview
    data.dimension6 = contentType;

    let byline = '';

    if (typeof galleryType !== 'undefined' && galleryType !== 'cranberry-jail-mugs') {
      if (typeof gallery.byline !== 'undefined') {
        if (typeof gallery.byline.title !== 'undefined' && gallery.byline.title !== '') {
          byline = gallery.byline.title;
        } else {
          byline = gallery.byline.inputByline;
        }
      }

      data.dimension1 = byline;
    }
    

    if (typeof gallery.published !== 'undefined') {
      data.dimension3 = gallery.published;
    }

    if (typeof gallery.tags !== 'undefined') {
      data.dimension8 = gallery.tags;
    }

    data.dimension7 = matherSections;

    // Send pageview event with iron-signals
    // GA
    this.fire('iron-signal', {name: 'track-page', data: { path: path, data } });

    //Send Chartbeat
    this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: path, data: {'sections': gallery.sectionInformation.sectionName, 'authors': (typeof gallery.byline !== 'undefined' ? gallery.byline : '') } } });

    // Fire Mather
    this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': section, 'hierarchy': matherSections, 'authors': gallery.byline, 'publishedDate': gallery.publishedISO, 'pageType': 'gallery', timeStamp: new Date() } } });

    // Fire Youneeq Page Hit Request
    this.fire('iron-signal', {name: 'page-hit', data: { content: gallery } });

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
  }

  _checkJailMugs(galleryType) {
    if (typeof galleryType !== 'undefined') {
      if (galleryType === 'cranberry-jail-mugs') {
        return true;
      } else {
        return false;
      }
    }
  }

  _computeMyCapture(currentImage) {
    if (currentImage.url !== 'undefined' && currentImage.small !== 'undefined') {
      let baseUrl = this.get('baseUrl');

      let myCaptureImage = {
        preview: encodeURIComponent(baseUrl +currentImage.exlarge),
        fullRes: encodeURIComponent(baseUrl +currentImage.url),
        backURL: encodeURIComponent(window.location.origin + window.location.pathname + window.location.hash)
      }

      return myCaptureImage;
    }
  }

  goTo(imageIndex) {
    let count = this.get('count');
    if (typeof imageIndex !== 'undefined' && imageIndex < count) {
      this.set('requestIndex', imageIndex);
      let template = this.$.sliderRepeat;
      template.render();
      this._registerClick()
    }
  }

}
Polymer(cranberrySlider);
