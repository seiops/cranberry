class cranberryJailMugs {
  beforeRegister() {
    this.is = 'cranberry-jail-mugs';
    this.properties = {
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
            this.set('loadSection', undefined);
            this.set('loadSection', 'police_fire/jailmugs');
            this.$.topAd.fire('section-changed');
          }
      });
      let routePath = newValue.path.replace('/', '');
      let firstRun = this.get('firstRun');

      if (!firstRun) {
        if (routePath === '') {
          this._buildCardRequest();
        } else {
          this._buildSliderRequest(routePath);
        }
      } else {
        this.set('firstRun', false)
        this._buildCardRequest();
        this._buildSliderRequest(routePath);
      }

    }
  }

  _buildCardRequest(start) {
    let request = this.$.request;
    let url = 'http://sedev.libercus.net/rest.json';
    let params = {
      'request': 'congero',
      'desiredContent': 'jailmugs',
      'desiredCount': '8',
      'desiredSortOrder': '-publishdate_priority_-contentmodified'
    };

    if (typeof start !== 'undefined') {
      params.desiredStart = start;
    }

    request.setAttribute('url', url);
    request.params = params;
    request.generateRequest();
  }

  _handleResponse(json) {
    console.info('From new Handle');
    let result = JSON.parse(json.detail.Result);

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
    let route = this.get('route');
    let routePath = route.path.replace('/', '');
    if (routePath !== '') {
      date = routePath;
    }
    let request = this.$.secondRequest;
    let url = 'http://sedev.libercus.net/rest.json';
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
    let images = this._setupImages(newValue);
    let slider = this.$.mugSlider;
    let self = this;
    let addEvent = this.get('addSliderEvent');

    if (!addEvent) {
      slider.addEventListener('goTo', function(e) {
        let index = e.detail.index;
        let displayIndex = index + 1;
        let currentRecord = newValue[index];
        let charges = self._computeChargesArray(currentRecord.charge.split(','));
        self.set('currentMugName', currentRecord.title);
        self.set('currentCharges', charges);
        self.set('currentIndex', displayIndex);
        // You can also refresh the ads from here by following what is in onRouteChanged
      });
    }

    this.set('addSliderEvent', false);
    this.set('currentHeadline', newValue[0].bookingDateFormatted);
    this.set('currentMaxIndex', newValue.length);
    slider.set('images', images);
  }

  _checkPrevButton(start) {
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
      images.push(value.mugShot);
    });
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
    let direction = e.srcElement.id;
    let move = 0;
    if (direction === "next") {
      move = 8;
    } else {
      move = -8;
    }

    let start = this.get('start');
    let totalMove = start + move;

    this.set('start', totalMove);

    this._buildCardRequest(totalMove);
  }
}
Polymer(cranberryJailMugs);
