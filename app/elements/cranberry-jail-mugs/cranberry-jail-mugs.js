class cranberryJailMugs {
  beforeRegister() {
    this.is = 'cranberry-jail-mugs';
    this.properties = {
      baseUrl: String,
      cardResponse: {
        type: Object,
        observer: '_cardResponseReceived'
      },
      cardsJson: {
        type: Object,
        observer: 'onCardsJsonChanged'
      },
      currentMugId: {
        type: String,
        observer: '_currentMugIdChanged'
      },
      dfpAdSection: String,
      dfpObject: {
        type: Object,
        computed: '_computeDfpObject(dfpAdSection)'
      },
      firstRun: {
        type: Boolean,
        value: true
      },
      hideNext: {
        type: Boolean,
        value: false
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      rest: {
        type: String
      },
      route: {
        type: Object,
        observer: 'onRouteChanged'
      },
      showPrev: {
        type: Boolean,
        value: false
      },
      sliderJson: Object,
      sliderResponse: {
        type: Object,
        observer: '_sliderResponseReceived'
      },
      start: {
        type: Number,
        value: 1
      }
    };
    this.listeners = {
      'next.tap': '_loadNewCards',
      'prev.tap': '_loadNewCards'
    };
  }

  onRouteChanged(newValue, oldValue) {
    this.async(() => {
      let hidden = this.get('hidden');
      let firstRun = this.get('firstRun');

      if (!hidden && newValue.path !== null) {
        let path = (newValue.path === '' ? '' : newValue.path.replace('/', ''));

        if (firstRun) {
          this.set('firstRun', false);
          this._buildCardRequest();
        }

        if (path !== '') {
          this.set('currentMugId', path);
        }
      }
    });
  }

  _buildCardRequest(start) {
    let request = this.$.request;
    let currentRequest = this.get('cardRequest');

    if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
      console.info('<\cranberry-jail-mugs\> aborting previous request');
      request.abortRequest(currentRequest);
    }

    request.setAttribute('callback-value', 'cardCallback');
    let url = this.get('rest');
    let params = {
      'request': 'mugshots',
      'desiredCount': '8',
      'desiredSortOrder': '-publishdate_priority_-contentmodified'
    };

    // Add start to the desiredStart parameter
    if (typeof start !== 'undefined') {
      params.desiredStart = start;
    }

    request.setAttribute('url', url);
    request.params = params;
    request.generateRequest();
  }

  _cardResponseReceived(response) {
    let result = JSON.parse(response.Result);
    let currentMugId = this.get('currentMugId');

    if (typeof currentMugId === 'undefined' || currentMugId === '') {
      this.set('currentMugId', result.content[0].bookingDate);
      currentMugId = result.content[0].bookingDate;
    }

    this.set('cardsJson', result.content);
  }

  _computeDfpObject(dfpAdSection) {
    return {
            adSection: this.dfpAdSection,
            content: 'jail-mugs',
            placement: (window.location.host === 'www.sanduskyregister.com' ? 'production' : 'development')
          };
  }

  _sliderResponseReceived(response) {
    let result = JSON.parse(response.Result);
    let content = result.content[0];
    let bookingdate = content.bookingDate;
    let data = {};
    let dfpObject = this.get('dfpObject');

    data.dimension6 = 'Jail Mugs';
    data.dimension3 = bookingdate;

    content.dfp = this.get('dfpObject');
    
    this.set('sliderJson', content);

    // // Send pageview event with iron-signals
    this.fire('iron-signal', {name: 'track-page', data: { path: '/jail-mugs/' + bookingdate, data } });

    // // Send Chartbeat
    this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/jail-mugs/' + bookingdate, data: {'sections': 'jail-mugs' } } });

    // // Fire Youneeq Page Hit Request
    this.fire('iron-signal', {name: 'page-hit', data: { content: content } });
  }

  _handleResponse(response) {
    console.info('<\cranberry-jail-mugs\> Card Response Received');
  }

  _handleSlides(response) {
    console.info('<\cranberry-jail-mugs\> Slider Response Received');
  }

  onCardsJsonChanged(newValue) {
    let currentMugId = this.get('currentMugId');

    if (typeof currentMugId === 'undefined' || currentMugId === '') {
      this.set('currentMudId', newValue[0].bookingdate);
      currentMugId = newValue[0].bookingdate;
    }
    
    // Add previous button if needed
    this._checkPrevButton(newValue[0].start);
  }

  _checkPrevButton(start) {
    // Function to show or hide the previous button based on the current start value
    if (start === 1) {
      this.set('showPrev', false);
    } else {
      this.set('showPrev', true);
    }
  }

  _currentMugIdChanged(mugId, oldId) {
    let request = this.$.secondRequest;
    let url = this.get('rest');

    let params = {
      'request': 'mugshots',
      'desiredCount': '999',
      'desiredBookingDate': mugId
    };

    request.setAttribute('callback-value', 'slideCallback');
    request.setAttribute('url', url);
    request.params = params;
    request.generateRequest();
  }

  _loadNewCards(e) {
    // Establish a "start" value based on the button clicked forward 8 back 8 depending.
    let direction = e.target.id;
    let move = 0;
    if (direction === "next") {
      move = 8;
    } else {
      move = -8;
    }

    let start = this.get('start');
    let totalMove = start + move;

    this.set('start', totalMove);

    // Genereate new card request based on new start value
    this._buildCardRequest(totalMove);

    let bookingdate = this.get('route.path').replace('/', '');
    let path = `/jail-mugs/${bookingdate}`;
    let data = {
      dimension3: bookingdate,
      dimension6: 'Jail Mugs'
    };


    // Send pageview event with iron-signals
    this.fire('iron-signal', {name: 'track-page', data: { path: path, data } });

    // Send Chartbeat
    this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: path, data: {'sections': 'jail-mugs' } } });
  }

  _openModal () {
    let baseUrl = this.get('baseUrl');
    let slider = document.createElement('cranberry-slider');
    let sliderJson = this.get('sliderJson');

    slider.set('items', sliderJson.mediaAssets.images);
    slider.set('gallery', sliderJson);
    slider.set('baseUrl', baseUrl);
    slider.set('whiteText', true);
    slider.set('galleryType', 'cranberry-jail-mugs');
    slider.set('hidden', false);

    let modal = Polymer.dom(document).querySelector('cranberry-base').querySelector('#globalModal');

    let modalContent = Polymer.dom(modal).querySelector('paper-dialog-scrollable').querySelector('#scrollable').querySelector('.content-area');

    modalContent.appendChild(slider);

    modal.open();
    modal.refit();
  }
}
Polymer(cranberryJailMugs);
