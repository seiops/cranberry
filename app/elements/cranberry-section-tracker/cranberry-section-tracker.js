class cranberrySectionTracker {
  beforeRegister() {
    this.is = 'cranberry-section-tracker';
    this.properties = {
        findSection: {
            type: Boolean,
            value: false
        },
        rest: String,
        page: {
            type: String,
            observer: '_onRouteChanged'
        },
        foundSection: {
          type: Object,
          notify: true
        }
    };
    this.observers = ['_buildRequest(findSection)'];
  }

  _buildRequest(findSection) {
    if (findSection) {
      console.log('FIND SECTION CHANGED TO :::::::: ' + findSection);
      console.log('SETTING UP REQUEST');
      this.set('foundSection', {'section': 'local', 'sectionParent': 'news'});
      this.set('findSection', false);
    }
    
  }

  _onRouteChanged(page) {
    console.log('The Page Has Changed!');
    console.log(page);

    if (typeof page !== 'undefined' && (page === '' || page === 'section' || page === 'galleries')) {
      // GENERATE THE REQUEST
      this.set('findSection', true);
    }
  }

}
Polymer(cranberrySectionTracker);
