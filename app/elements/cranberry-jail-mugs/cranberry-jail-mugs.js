class cranberryJailMugs {
  beforeRegister() {
    this.is = 'cranberry-jail-mugs';
    this.properties = {
      content: {
        type: Object,
        observer: 'contentChanged'
      },
      imageAssets: {
        type: Array
      },
      records: {
        type: Array
      },
      currentRecord: {
        type: Array,
        observer: 'currentRecordChanged'
      },
      currentIndex: {
        type: Number,
        value: 1
      },
      currentMaxIndex: {
        type: Number
      },
      isLoading: {
        type: Boolean,
        value: true
      },
      start: {
        type: Number,
        value: 1
      },
      showPrev: {
        type: Boolean,
        value: false
      }
    };
    this.listeners = {
      'next.tap': '_loadNewCards',
      'prev.tap': '_loadNewCards'
    };
  }

  attached() {
    let slider = this.$.mugSlider;
    let self = this;

    slider.addEventListener('goTo', function(e) {
      let index = e.detail.index;
      let displayIndex = index + 1;
      let currentRecord = self.get('currentRecord').records[index];
      let charges = self._computeChargesArray(currentRecord.charge.split(','));

      self.set('currentMugName', currentRecord.title);
      self.set('currentCharges', charges);
      self.set('currentIndex', displayIndex);
    });
  }

  // Private Functions
  _computeIndex(index) {
    return index + 1;
  }
  _handleResponse(json) {
    app.logger('\<cranberry-jail-mugs\> json response received');

    let result = JSON.parse(json.detail.Result);

    console.dir(result);
    console.info(json);
    // Set content to the result
    this.set('content', result);

    // Check if we are on "page" 1
    if (result[0].start === 1) {
      let slider = this.$.mugSlider;
      let sliderImages = slider.get('images');

      // Check if the slider currently has no content and fill it
      if (typeof sliderImages === 'undefined') {
        // Set currentRecord to the first record in the result
        this.set('currentRecord', result[0]);

        // Add images from JSON response into imageAssets property
        let images = this._setupImages(result);

        this.set('imageAssets', images);
        this.$.mugSlider.set('images', images[0]);
        this.set('isLoading', false);
      } else {
        // Otherwise don't touch the slider and hide the previous button
        this.set('showPrev', false);
      }
    } else {
      this.set('showPrev', true);
    }

  }

  _setupImages(content) {
    // Add images from JSON response into imageAssets property
    let images = [];
    content.forEach(function(value, index) {
      let record = [];
      value.records.forEach(function(value, index) {
        record.push(value.mugShot);
      });
      images.push(record);
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

  _loadNewMugs(e) {
    // Scroll window to top of viewport
    window.scrollTo(0,0);

    // TODO: SEND PAGEVIEW

    let images = this.get('imageAssets');
    let index = 0;
    // Find the index in use case that user clicks child of element
    e.path.forEach(function(value) {
      if (value.nodeName === 'PAPER-CARD') {
        index = value.dataset.index;
        return false;
      }
    });
    let slider = this.$.mugSlider;
    let content = this.get('content');

    slider.set('images', images[index]);
    this.set('currentRecord', content[index]);
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

  // Changed Events
  contentChanged(newValue) {
    let images = this._setupImages(newValue);
    this.set('imageAssets', images);
  }

  currentRecordChanged(newValue) {
    this.set('currentHeadline', 'Mug Shots From ' + newValue.bookingDateFormatted);
    this.set('currentMaxIndex', newValue.records.length);
  }
}
Polymer(cranberryJailMugs);
