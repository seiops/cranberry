class cranberryProfilePage {
  beforeRegister() {
    this.is = 'cranberry-profile-page';
    this.properties = {
      route: {
        type: Object,
        observer: '_routeChanged'
      },
      userId: {
        type: Number
      },
      fname: {
        type: String
      },
      lname: {
        type: String
      },
      profile: {
        type: Object
      },
      content: {
        type: Object
      },
      featuredContent: {
        type: Object
      },
      rest: String,
      baseUrl: String,
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      hideContent: {
        type: Boolean,
        value: true
      },
      hideFeatured: {
        type: Boolean,
        value: true
      },
      start: {
        type: Number,
        observer: '_startChanged'
      },
      contentLoading: {
        type: Boolean,
        value: true
      },
      profileLoading: {
        type: Boolean,
        value: true
      }
    }
    this.observers = [
      '_fetchProfile(userId)',
      '_fetchProfileWithName(fname, lname)',
      '_fetchContentWithName(fname, lname)'
    ]
  }

  _routeChanged(newRoute, oldRoute) {
    if (typeof newRoute !== 'undefined' && typeof newRoute.path !== 'undefined' && newRoute.path !== null) {
      this.set('content', []);
      this.set('featuredContent', []);
      this.set('profile', {});

      let pathArray = newRoute.path.split('/');
      
      if (pathArray.length > 2) {
        this.set('fname', pathArray[1]);
        this.set('lname', pathArray[2]);
      } else {
        this.set('userId', pathArray[1]);
      }
    }
  }

  _fetchProfile(userId) {
    // Fetch profile with just userId
    if (typeof userId !== 'undefined') {
      this._setupProfileRequest(true);
    }
  }

  _fetchProfileWithName(fname, lname) {
    let userId = this.get('userId');
    // Fetch profile with the first and last names setting userid to 999
    if (typeof fname !== 'undefined' && typeof lname !== 'undefined' && (typeof userId === 'undefined' || userId === '')) {
      this._setupProfileRequest(false);
    }
  }

  debouncedChanged(fname, lname, start) {
    // Debounce function to ensure that all values are properly set.
    this.debounce('debouncedChanged', ()  => {
      // Fetch content with the first and last names
      if (typeof fname !== 'undefined' && typeof lname !== 'undefined') {
        this.set('content', []);
        this.set('featuredContent', []);

        let requester = this.$.profileListRequest;
        let currentRequest = this.get('profileListRequest');

        if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
          console.info('<\cranberry-profile-page\> aborting previous request');
          requester.abortRequest(currentRequest);
        }

        requester.url = this.rest;
        requester.setAttribute('callback-value', 'profileListCallback');

        let params = {};

        params.request = 'content-list';
        params.desiredContent = 'story_gallery';
        if (typeof start !== 'undefined') {
          params.desiredStart = start;
        } else {
          params.desiredStart = '1';
        }
        
        params.desiredFeaturedCount = '1';
        params.disableFeatured = 'false';
        params.desiredStoryByline = fname + ' ' + lname;
        params.sectionType = 'profile';

        requester.set('params', params);
        requester.generateRequest();
      }
    });
  }

  _fetchContentWithName(fname, lname, start) {
    this.async(() => {
      this.debouncedChanged(fname, lname, start);
    });
  }

  _setupProfileRequest(useUserId) {
    this.set('profile', {});
    let requester = this.$.profileRequest;
    let currentRequest = this.get('profileRequest');

    if (typeof currentRequest !== 'undefined' && currentRequest.loading === true) {
      console.info('<\cranberry-profile-page\> aborting previous request');
      requester.abortRequest(currentRequest);
    }

    requester.url = this.rest;
    requester.setAttribute('callback-value', 'profileCallback');

    let params = {};

    params.request = 'congero';
    params.desiredContent = 'staffMember';

    if (useUserId) {
      let userId = this.get('userId');

      params.userId = userId;
    } else {
      let fname = this.get('fname');
      let lname = this.get('lname');

      params.fname = fname;
      params.lname = lname;
      params.userId = 999;
    }

    requester.set('params', params);
    requester.generateRequest();
  }

  _handleResponse(json) {
    console.info('\<cranberry-profile-page\> json response received');

    let result = JSON.parse(json.detail.Result);

    this.set('profile', result);
    if (typeof result.first !== 'undefined' && typeof result.last !== 'undefined' && result.first !== '' && result.last !== '') {
      this.set('fname', result.first);
      this.set('lname', result.last);
    }
  }

  _handleListResponse(json) {
    console.info('\<cranberry-profile-page\> json content response received');

    let result = JSON.parse(json.detail.Result);

    if (typeof result.featured !== 'undefined' && result.featured.length > 0) {
      this.set('featuredContent', result.featured[0]);
      this.set('hideFeatured', false);
    } else {
      this.set('hideFeatured', true);
    }
    
    if (typeof result.content !== 'undefined' && result.content.length > 0) {
      this.set('content', result.content);
      this.set('hideContent', false);
    } else {
      this.set('hideContent', true);
    }

    this.set('dfpObject', result.section.dfp);

    this._firePageview();
    this.fire('iron-signal', {name: 'cranberry-section-route-changed', data: { section: { sectionType: 'section', sectionName: 'news' } } });
  }

  _firePageview() {
    let section = this.get('userId');
    let author = this.get('author');

    this.async(() => {
      this.fire('iron-signal', {name: 'track-page', data: { path: '/profile/' + section, data: { 'dimension7': '/profile/' + section } } });
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/profile/' + section, data: {'sections': '/profile/' + section, 'authors': author } } });
    });
  }

  _startChanged(start, oldStart) {
      this.async(function () {
        if (typeof oldStart !== 'undefined' && typeof start !== 'undefined') {
          console.info('\<cranberry-profile-page\> start changed -\> ' + start);
          let fname = this.get('fname');
          let lname = this.get('lname');
          this._fetchContentWithName(fname, lname, start);
        }
      });
    }
}
Polymer(cranberryProfilePage);
