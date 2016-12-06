class cranberryPagination {
  beforeRegister() {
    this.is = 'cranberry-pagination';
    this.properties = {
      start: {
        type: Number,
        value: 1,
        notify: true,
        observer: '_startChanged'
      },
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
      section: {
        type: String,
        observer: '_sectionChanged'
      },
      parent: {
        type: String,
        observer: '_parentSectionChanged'
      },
    };
  }

  _showPrevious() {
    let start = this.get('start');
    let count = this.get('count');
    let currentPage = this.get('currentPage');
    let offset = start - count;

    this.set('start', offset);
    this.set('currentPage', currentPage - 1);
    
    this._showPreviousButton();
  }

  _showNext() {
    let start = this.get('start');
    let count = this.get('count');
    let currentPage = this.get('currentPage');
    let offset = start + count;

    this.set('start', offset);
    this.set('currentPage', currentPage + 1);

    this._showPreviousButton();
  }

  _showPreviousButton() {
    let start = this.get('start');
    let count = this.get('count');

    if (start > count) {
      this.set('hidePreviousButton', false);
    } else {
      this.set('hidePreviousButton', true);
    }
  }

  _startChanged(start) {
    if (typeof start !=='undefined' && start === 1) {
      this._showPreviousButton();
    }
  }

  _sectionChanged(newValue, oldValue) {
    this.set('start', 1);
    this.set('currentPage', 1);
  }

  _parentSectionChanged(newValue, oldValue) {
    this.set('start', 1);
    this.set('currentPage', 1);
  }

}
Polymer(cranberryPagination);
