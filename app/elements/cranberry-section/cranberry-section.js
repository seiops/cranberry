/*
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* Gigya Socialize JS library integration */

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
