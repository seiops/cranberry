class cranberryJailMugs {
  beforeRegister() {
    this.is = 'cranberry-jail-mugs';
    this.properties = {
      baseUrl: String,
      firstRun: {
        type: Boolean,
        value: true
      },
      currentIndex: {
        type: Number,
        value: 1
      },
      currentMaxIndex: {
        type: Number
      },
      start: {
        type: Number,
        value: 1
      },
      loadSection: {
        type: String
      },
      showPrev: {
        type: Boolean,
        value: false
      },
      hideNext: {
        type: Boolean,
        value: false
      },
      route: {
        type: Object,
        observer: 'onRouteChanged'
      },
      cardsJson: {
        type: Object,
        observer: 'onCardsJsonChanged'
      },
      sliderJson: {
        type: Object,
        observer: 'onSliderJsonChanged'
      },
      rest: {
        type: String
      },
      images: Array,
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      }
    };
    this.listeners = {
      'next.tap': '_loadNewCards',
      'prev.tap': '_loadNewCards'
    };
  }

  onRouteChanged(newValue) {
    if (newValue.path !== null && typeof newValue.path !== 'undeinfed') {
      this.async(function() {
          let hidden = this.hidden;

          if (!hidden) {
            // Set location to undefined to trigger the same value being placed in as a new value ** Ad refresh**
            this.set('loadSection', undefined);
            this.set('loadSection', 'police_fire/jailmugs');
          }
      });
      let routePath = newValue.path.replace('/', '');
      let firstRun = this.get('firstRun');

      // Check if the element has gone through once yet.
      if (!firstRun) {
        if (routePath === '') {
          this._buildCardRequest();
        } else {
          this._buildSliderRequest(routePath);
        }
      } else {
        // If it hasnt ran through once run both requests
        this.set('firstRun', false)
        this._buildCardRequest();
        this._buildSliderRequest(routePath);
      }

    }
  }

  _buildCardRequest(start) {
    // Generate Request to build the cards at the bottom of the page
    let request = this.$.request;
    let currentRequest = this.get('cardRequest');

    if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
      console.info('<\cranberry-jail-mugs\> aborting previous request');
      request.abortRequest(currentRequest);
    }

    request.setAttribute('callback-value', 'cardCallback');
    let url = this.get('rest');
    let params = {
      'request': 'congero',
      'desiredContent': 'jailmugs',
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

  _handleResponse(json) {
    let result = JSON.parse(json.detail.Result);

    if (result.length < 8) {
      this.set('hideNext', true);
    }
    this.set('cardsJson', result);
  }

  onCardsJsonChanged(newValue) {
    let route = this.get('route');
    let routePath = route.path.replace('/', '');

    // Add previous button if needed
    this._checkPrevButton(newValue[0].start);

    // Only if the path is empty switch sliders
    if (routePath === '') {
      this._buildSliderRequest(newValue[0].bookingDate);
    }
  }

  _buildSliderRequest(date) {
    let request = this.$.secondRequest;
    let currentRequest = this.get('slideRequest');

    if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
      console.info('<\cranberry-jail-mugs\> aborting previous request');
      request.abortRequest(currentRequest);
    }
    // Generate request for image slider JSON
    let route = this.get('route');
    let routePath = route.path.replace('/', '');
    if (routePath !== '') {
      date = routePath;
    }
    
    request.setAttribute('callback-value', 'slideCallback');
    let url = this.get('rest');
    let params = {
      'request': 'congero',
      'desiredContent': 'jailmugsind',
      'desiredbookingdate': date
    };

    request.setAttribute('url', url);
    request.params = params;
    request.generateRequest();
  }

  _handleSlides(json) {
    let result = JSON.parse(json.detail.Result);

    this.set('sliderJson', result);

    let bookingdate = this.get('route.path').replace('/', '');
    let data = {};

    data.dimension6 = 'jail-mugs';
    data.dimension3 = result[0].publishDate;

    // Send pageview event with iron-signals
    this.fire('iron-signal', {name: 'track-page', data: { path: '/jail-mugs/' + bookingdate, data } });

    // Send Chartbeat
    this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/jail-mugs/' + bookingdate, data: {'sections': 'jail-mugs' } } });
  }

  onSliderJsonChanged(newValue) {
    console.log(newValue);
    // Setup the images array
    let images = this._setupImages(newValue);
    let slider = this.$.mugSlider;
    let currentMaxIndex = this.get('currentMaxIndex');

    slider.removeEventListener('sliderMoved', this._event);
    slider.addEventListener('sliderMoved', this._event.bind(this));

    // Update slider event, headline, and max index
    this.set('currentHeadline', newValue[0].bookingDateFormatted);
    if (newValue.length !== currentMaxIndex) {
      this.set('currentMaxIndex', newValue.length);
    }
    slider.set('items', images);
  }

  _event(e) {
    let records = this.get('sliderJson');
    let index = e.detail.index;
    let currentRecord = records[index - 1];

    let charges = this._computeChargesArray(currentRecord.charge.split(','));
    // Change mug shot caption and indexes on page
    this.set('currentMugName', currentRecord.title);
    this.set('currentCharges', charges);
    this.set('currentIndex', index);
  }

  _checkPrevButton(start) {
    // Function to show or hide the previous button based on the current start value
    if (start === 1) {
      this.set('showPrev', false);
    } else {
      this.set('showPrev', true);
    }
  }

  _setupImages(content) {
    // Return images from JSON response
    let images = [];
    content.forEach(function(value, index) {
      if (typeof value.mugShot !== 'undefined') {
        images.push(value.mugShot);
      }
    });

    this.set('images', images);
    return images;
  }

  _computeChargesArray(charges) {
    // Remove any empty entries in the array of charges
    charges.forEach(function(value, index) {
      if (value === '') {
        charges.splice(index, 1);
      }
    });

    return charges;
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
    let data = {};

    data.dimension6 = 'jail-mugs';
    data.dimension3 = result[0].publishDate;

    // Send pageview event with iron-signals
    this.fire('iron-signal', {name: 'track-page', data: { path: '/jail-mugs/' + bookingdate, data } });

    // Send Chartbeat
    this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/jail-mugs/' + bookingdate, data: {'sections': 'jail-mugs' } } });
  }

  _openModal () {
    let baseUrl = this.get('baseUrl');
    let slider = document.createElement('cranberry-slider');

    let images = this.get('images');


    slider.set('items', images);
    slider.set('baseUrl', baseUrl);
    slider.set('whiteText', true);
    slider.set('hidden', false);

    let modal = Polymer.dom(document).querySelector('cranberry-base').querySelector('#globalModal');

    let modalContent = Polymer.dom(modal).querySelector('paper-dialog-scrollable').querySelector('#scrollable').querySelector('.content-area');

    modalContent.appendChild(slider);

    modal.open();
    modal.refit();
  }
}
Polymer(cranberryJailMugs);
