class cranberryPagination {
  beforeRegister() {
    this.is = 'cranberry-pagination';
    this.properties = {
      start: {
        type: Number,
        value: 1,
        notify: true
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

    this._updateParams();
  }

  _showNext() {
    let start = this.get('start');
    let count = this.get('count');
    let offset = start + count;

    this.set('start', offset);

    this._showPreviousButton();

    this._updateParams();
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
