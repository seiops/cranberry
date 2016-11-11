class cranberryJailMugs {
  beforeRegister() {
    this.is = 'cranberry-jail-mugs';
    this.properties = {
      baseUrl: String,
      addSliderEvent: {
        type: Boolean,
        value: true
      },
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
      images: Array
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
    // Generate request for image slider JSON
    let route = this.get('route');
    let routePath = route.path.replace('/', '');
    if (routePath !== '') {
      date = routePath;
    }
    let request = this.$.secondRequest;
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
  }

  onSliderJsonChanged(newValue) {
    // Setup the images array
    let images = this._setupImages(newValue);
    let slider = this.$.mugSlider;
    let self = this;
    let addEvent = this.get('addSliderEvent');
    let currentMaxIndex = this.get('currentMaxIndex');

    // If this event isnt already on the element then add it
    if (!addEvent) {
      slider.addEventListener('sliderMoved', function(e) {
        console.log('SLIDER MOVED');
        console.log(e);
        
        let index = e.detail.index;
        let currentRecord = newValue[index];
        let charges = self._computeChargesArray(currentRecord.charge.split(','));
        // Change mug shot caption and indexes on page
        self.set('currentMugName', currentRecord.title);
        self.set('currentCharges', charges);
        self.set('currentIndex', index);
        // You can also refresh the ads from here by following what is in onRouteChanged
      });
    }
    // Updat slider event, headline, and max index
    this.set('addSliderEvent', false);
    this.set('currentHeadline', newValue[0].bookingDateFormatted);
    if (newValue.length !== currentMaxIndex) {
      this.set('currentMaxIndex', newValue.length);
    }
    slider.set('items', images);
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
  }

  _openModal () {
    let baseUrl = this.get('baseUrl');
    let slider = document.createElement('cranberry-slider');

    let images = this.get('images');


    slider.set('items', images);
    slider.set('baseUrl', baseUrl);
    slider.set('whiteText', true);

    let modal = Polymer.dom(document).querySelector('cranberry-base').querySelector('#globalModal');

    let modalContent = Polymer.dom(modal).querySelector('paper-dialog-scrollable').querySelector('#scrollable').querySelector('.content-area');

    modalContent.appendChild(slider);

    modal.open();
    modal.refit();
  }
}
Polymer(cranberryJailMugs);
