class cranberryPagination {
  beforeRegister() {
    this.is = 'cranberry-pagination';
    this.properties = {
      count: {
        type: Number,
        value: 18
      },
      currentPage: {
        type: Number,
        value: 1,
        notify: true
      },
      hidePreviousButton: {
        type: Boolean,
        value: true
      },
      parent: String,
      section: String,
      start: {
        type: Number,
        value: 1,
        notify: true,
        observer: '_startChanged'
      },
      urlPage: {
        type: Number
      }
    };
    this.observers = [
      '_sectionChanged(parent, section)',
      '_startChanged(start, urlPage, currentPage)'
    ]
  }

  _showPrevious() {
    let start = this.get('start');
    let count = this.get('count');

    if (typeof start !== 'number') {
      start = parseInt(start);
    }

    if (typeof count !== 'number') {
      count = parseInt(start);
    }

    let currentPage = this.get('currentPage');
    let offset = start - count;

    if (offset <= 0) {
      offset = 1;
    }

    this.set('start', offset);
    this.set('currentPage', currentPage - 1);
    
    if (currentPage - 1 === 1) {
      window.history.pushState({}, null, ``);
    } else {
      window.history.pushState({}, null, `?page=${currentPage - 1}`);
    }
    
    window.dispatchEvent(new CustomEvent('location-changed'));

    this._showPreviousButton();
  }

  _showNext() {
    let start = this.get('start');
    let count = this.get('count');

    if (typeof start !== 'number') {
      start = parseInt(start);
    }

    if (typeof count !== 'number') {
      count = parseInt(start);
    }

    let currentPage = this.get('currentPage');
    let offset = start + count;

    this.set('start', offset);
    this.set('currentPage', currentPage + 1);

    window.history.pushState({}, null, `?page=${currentPage + 1}`);
    window.dispatchEvent(new CustomEvent('location-changed'));

    this._showPreviousButton();
  }

  _showPreviousButton() {
    let currentPage =  this.get('currentPage');

    if (currentPage > 1) {
      this.set('hidePreviousButton', false);
    } else {
      this.set('hidePreviousButton', true);
    }
  }

  _startChanged(start, urlPage, currentPage) {
    console.log(`Something in start changed chagned start: ${start} and urlPage ${urlPage}`);
    if (typeof urlPage !== 'undefined' && urlPage > 1 && urlPage !== currentPage) {
      this._setNewStart();
    }

    if (typeof start !=='undefined' && start !== 1) {
      this._showPreviousButton();
    } else {
      this.set('hidePreviousButton', true);
    }
  }

  _sectionChanged(parent, section) {
    if (!this.hidden) {
      if (typeof parent !== 'undefined' || typeof section !== 'undefined') {
        this.set('start', 1);
        this.set('currentPage', 1);
      }
    }
  }

  _setNewStart() {
    console.log('We should figure out the new start value!');
  }
}
Polymer(cranberryPagination);
