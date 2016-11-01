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
      hidePreviousButton: {
        type: Boolean,
        value: true
      }
    }
  }

  _showPrevious() {
    let start = this.get('start');
    let count = this.get('count');
    let offset = start - count;

    this.set('start', offset);
    
    this._showPreviousButton();
  }

  _showNext() {
    let start = this.get('start');
    let count = this.get('count');
    let offset = start + count;

    this.set('start', offset);

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
}
Polymer(cranberryPagination);
