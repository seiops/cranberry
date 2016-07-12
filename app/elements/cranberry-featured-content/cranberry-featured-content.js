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
      rest: {
        type: String,
        value: "http://sedev.libercus.net/rest.json",
        notify: true
      },
      params: {
        type: Object,
        value: [],
        observer: '_changeParams',
        notify: true
      },
      items: {
        type: Object,
        value: [],
        notify: true
      },
      type: {
        type: String,
        value: "story_gallery",
        observer: '_changeType'
      },
      sections: {
        type: String,
        value: "news",
        observer: '_changeSections'
      },
      count: {
        type: Number,
        value: 10,
        observer: '_changeCount'
      },
      start: {
        type: Number,
        value: 1,
        observer: '_changeStart'
      }
    };
  }
  handleResponse (data) {
    var restResponse = JSON.parse(data.detail.Result);

    this.set('items', restResponse);
    // var responseMessage = '';

    // if (typeof restResponse !== undefined && restResponse.errorCode === 0) {

    //   var params = {
    //       provider:restResponse.loginProvider,
    //       callback: this._onlogin(data),
    //       UID: restResponse.UID,
    //       UIDSignature: restResponse.UIDSignature,
    //       signatureTimestamp: restResponse.signatureTimestamp
    //   };

    //   restResponse.callback = this._onlogin(data);


    //   gigya.socialize.getUserInfo(params);

    //   responseMessage = 'User: ' + restResponse.profile.nickname + '<br />UID: ' + restResponse.UID + '<br />Signature: ' + restResponse.UIDSignature + '<br />Provider: ' + restResponse.loginProvider;
    // } else {
    //   responseMessage = restResponse.errorDetails;
    // }


    // form.querySelector('.output').innerHTML = responseMessage;
  }
  _firstItem(item,index) {
    if (index === 0) {
      return true;
    } else {
      return false;
    }
  }
  _changeCount() {
    console.log('Changed count:', this.count);
  }
  _changeParams() {
    var params = this.get('params');

    if (params.length !== 0 && params.desiredCount) {
      this.$.request.url = this.rest;

      this.$.request.params = params;

      this.$.request.generateRequest();
    }
  }
  _changeStart() {
    app.logger ('<\cranberry-featured-content\> start changed');
  }
  _changeSections() {
    app.logger ('<\cranberry-featured-content\> section changed');

    this._updateParams();
  }
  _changeType() {
    app.logger ('<\cranberry-featured-content\> type changed');
  }
  ready() {
    app.logger ('<\cranberry-featured-content\> ready');

  }
  _updateParams() {
    this.$.request.abortRequest();

    this.set('items',[]);

    var jsonp = {};

    jsonp.request = 'content-list';
    jsonp.desiredSection = this.get('sections');
    jsonp.desiredContent = this.get('type');
    jsonp.desiredCount = this.get('count');

    this.set('params', jsonp);
  }
  attached() {
    app.logger ('<\cranberry-featured-content\> attached');
    this._updateParams();
  }
}

Polymer(CranberryFeaturedContent);
