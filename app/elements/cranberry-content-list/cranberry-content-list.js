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

class CranberryContentList {

  beforeRegister() {
    this.is = 'cranberry-content-list';
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
    app.logger('\<cranberry-content-list\> attached');
  }

  ready () {
    app.logger('\<cranberry-content-list\> ready');
  }

  // Private methods
  _changeParams () {
    let params = this.get('params');

    if (params.length !== 0 && params.desiredCount) {
      this.$.request.url = this.rest;

      this.$.request.params = params;

      this.$.request.generateRequest();
    }
  }

  _changeSections (section) {
    app.logger ('<\cranberry-content-list\> section changed -\> ' + section);

    this._updateParams();
  }


  _checkItem (item, index) {
    let modulus = index % 2;

    if (index > 0 && modulus === 0) {
      return true;
    } else {
      return false;
    }
  }

  _handleResponse (data) {
    let restResponse = JSON.parse(data.detail.Result);

    this.set('items', restResponse);
  }

  _hasImage (image) {
    if(typeof image !== 'undefined' && image.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  _hasPreview (preview) {
    if(typeof preview !== 'undefined' && preview.length > 0) {
      return true;
    } else {
      return;
    }
  }

  _isStory (item) {
    if(item === 'Story') {
      return true;
    } else {
      return false;
    }
  }

  _trimText (text) {
    let trunc = text;

    if (trunc.length > 125) {
      trunc = trunc.substring(0, 125);
      trunc = trunc.replace(/\w+$/, '');
      trunc += '...';
    }

    return trunc;
  }

  _updateParams () {
    this.$.request.abortRequest();

    this.set('items',[]);

    let jsonp = {};

    jsonp.request = "content-list";
    jsonp.desiredSection = this.get('sections');
    jsonp.desiredContent = this.get('type');
    jsonp.desiredCount = this.get('count');

    this.set('params', jsonp);
  }

}

Polymer(CranberryContentList);
