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

class CranberryFeaturedContent {
  beforeRegister() {
    this.is = 'cranberry-featured-content';
    this.properties = {
      count: {
        type: Number
      },
      items: {
        type: Object,
        value: []
      },
      params: {
        type: Object,
        value: [],
        observer: '_changeParams'
      },
      rest: {
        type: String,
        value: 'http://sedev.libercus.net/rest.json'
      },
      sections: {
        type: String,
        observer: '_changeSections'
      },
      start: {
        type: Number
      },
      type: {
        type: String
      }
    };
  }

  // Public methods.
  attached () {
    app.logger ('<\cranberry-featured-content\> attached');
  }

  ready () {
    app.logger('\<cranberry-featured-content\> ready');
  }

  // Private methods.
  _changeParams () {
    let params = this.get('params');

    if (params.length !== 0 && params.desiredCount) {
      this.$.request.url = this.rest;

      this.$.request.params = params;

      this.$.request.generateRequest();
    }
  }

  _changeSections (section) {
    app.logger ('<\cranberry-featured-content\> section changed -\> ' + section);

    this._updateParams();
  }

  _changeType () {
    app.logger ('<\cranberry-featured-content\> type changed');
  }

  _firstItem (item, index) {
    if (index === 0) {
      return true;
    } else {
      return false;
    }
  }

  _handleResponse (data) {
    let restResponse = JSON.parse(data.detail.Result);

    this.set('items', restResponse);
  }

  _updateParams () {
    this.$.request.abortRequest();

    this.set('items',[]);

    let jsonp = {};

    jsonp.request = 'content-list';
    jsonp.desiredSection = this.get('sections');
    jsonp.desiredContent = this.get('type');
    jsonp.desiredCount = this.get('count');

    this.set('params', jsonp);
  }
}

Polymer(CranberryFeaturedContent);
