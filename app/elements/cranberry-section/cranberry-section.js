class CranberrySection {
  beforeRegister() {
    this.is = 'cranberry-section';
    this.properties = {
      route: Object,
      fullRoute: Object,
      routeData: Object,
      section: {
        type: String,
        value: 'news'
      },
      selected: {
        type: Number,
        value: 0
      }
    };
    this.observers = ['_routeChange(fullRoute.path, routeData.section)'];
  }

  // Public methods.
  attached() {
    app.logger('\<cranberry-section\> attached');

    this._checkTabs();
  }

  ready() {
    app.logger('\<cranberry-section\> ready');
  }


  // Private methods
  _checkItem(item,index) {
    let modulus = index % 2;

    if (index > 0 && modulus === 0) {
      return true;
    } else {
      return false;
    }
  }

  _checkTabs() {
    let tabs = this.$.tabs;

    tabs.addEventListener('iron-select', function() {
        this.set('selected', tabs.selected);
    });
  }

  _equal(a, b) {
    if (a === b) {
      return true;
    } else {
      return false;
    }
  }

  _isLatest(selected) {
    if (selected === 0) {
      return true;
    } else {
      return false;
    }
  }

  _isLocal(selected) {
    if (selected === 1) {
      return true;
    } else {
      return false;
    }
  }

  _isPopular(selected) {
    if (selected === 2) {
      return true;
    } else {
      return false;
    }
  }

  _isFeatured(selected) {
    if (selected === 2) {
      return true;
    } else {
      return false;
    }
  }

  _routeChange(route, section) {
    let currentSection = this.get('section');

    if (route === '/') {
      if (currentSection !== 'news') {
        this.set('section', 'news');
      }
    } else {
      let currentSection = this.get('section');

      if (currentSection !== section) {
        app.logger('\<cranberry-section\> section changed to ' + section);

        this.set('section', section);
      }
    }
  }

}

Polymer(CranberrySection);
