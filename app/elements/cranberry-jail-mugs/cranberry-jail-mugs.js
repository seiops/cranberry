class cranberryJailMugs {
  beforeRegister() {
    this.is = 'cranberry-jail-mugs';
    this.properties = {
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
      showPrev: {
        type: Boolean,
        value: false
      },
      route: {
        type: Object,
        observer: 'onRouteChanged'
      },
      cardsJson: {
        type: Object
      },
      sliderJson: {
        type: Object
      },
      currentBooking: {
        type: String,
        observer: 'onCurrentBookingChanged'
      }
    };
    this.listeners = {
      'next.tap': '_loadNewCards',
      'prev.tap': '_loadNewCards'
    };
  }

  onRouteChanged(newValue) {
    if (newValue.path !== null && typeof newValue.path !== 'undefined' && newValue.path !== '/' && newValue.path !== '') {
      this.set('currentBooking', newValue.path.replace('/', ''));
    }
  }

  _handleResponse(json) {
    app.logger('\<cranberry-jail-mugs\> json response received');

    let result = JSON.parse(json.detail.Result);

    let route = this.get('route');
    let appLocation = document.querySelector('app-location');

    // Check show/hide previous button
    this._checkPrevButton(result[0].start);

    if (typeof route.path !== 'undefined' && route.path !== null) {
      let routePath = route.path.replace('/', '');
      this.set('cardsJson', result);
      // See if the route is the "section front" version of the page
      if (routePath === '') {
        // We are on the section front change the path of the app to the bookingdate
        appLocation.set('path', '/jail-mugs/' + result[0].bookingDate);
      }
    }
  }

  _checkPrevButton(start) {
    if (start === 1) {
      this.set('showPrev', false);
    } else {
      this.set('showPrev', true);
    }
  }

  _handleSlides(json) {
    app.logger('\<cranberry-jail-mugs\> slide json response received');

    let result = JSON.parse(json.detail.Result);
    let images = this._setupImages(result);
    let slider = this.$.mugSlider;
    let self = this;

    slider.addEventListener('goTo', function(e) {
      let index = e.detail.index;
      let displayIndex = index + 1;
      let currentRecord = result[index];
      let charges = self._computeChargesArray(currentRecord.charge.split(','));
      self.set('currentMugName', currentRecord.title);
      self.set('currentCharges', charges);
      self.set('currentIndex', displayIndex);
    });
    this.set('currentHeadline', result[0].bookingDateFormatted);
    this.set('currentMaxIndex', result.length);
    slider.set('images', images);
  }

  onCurrentBookingChanged(newValue) {
    let params = {
      'request': 'congero',
      'desiredContent': 'jailmugsind',
      'desiredbookingdate': newValue
    };

    this.$.secondRequest.url = 'http://sedev.libercus.net/rest.json';
    this.$.secondRequest.params = params;
    this.$.secondRequest.generateRequest();
  }

  _setupImages(content) {
    // Add images from JSON response into imageAssets property
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
      move = 10;
    } else {
      move = -10;
    }

    let start = this.get('start');
    this.set('start', start + move);

    let requester = this.$.request;
    requester.set('params', {"request": "congero", "desiredContent": "jailmugs", "desiredStart": start + move, "desiredCount": "10", "desiredSortOrder": "-publishdate_priority_-contentmodified"});
  }
}
Polymer(cranberryJailMugs);
