class CranberryStory {
  beforeRegister() {
    this.is = 'cranberry-story';
    this.properties = {
      baseUrl: String,
      byline: {
        type: Object,
        value: {}
      },
      error: {
        type: Object,
        value: {}
      },
      hasLeadShortcode: {
        type: Boolean,
        value: false
      },
      hidden: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      loading: {
        type: Boolean,
        value: true
      },
      paragraphsLoading: {
        type: Boolean,
        value: true
      },
      response: Object,
      requestLoading: {
        type: Boolean,
        value: true
      },
      routeData: Object,
      staticPage: {
        type: Boolean,
        value: false
      },
      storyId: {
        type: String,
        value: ''
      },
      toutUid: String,
      user: Object
    };
    this.observers = [
      '_storyDoneLoading(paragraphsLoading, requestLoading)',
      '_errorHandler(error)'
    ]
  }

  // Life-Cycle Methods
  attached() {
    console.info('\<cranberry-story\> attached');
    let routeId = this.get('routeData.id');
    let storyId = this.get('storyId');
  }

  detached() {
    console.info('\<cranberry-story\> detached');
  }

  // Public Methods
  refreshDFP() {
    let hidden = this.get('hidden');

    this.async(() => {
      if (!hidden) {
        let ads = Polymer.dom(this.root).querySelectorAll('google-dfp');

        ads.forEach((value, index) => {
          value.refresh();
        });
      }
    });
  }

  // Private Methods
  _destroyNativo() {
    let nativoAds = Polymer.dom(this).querySelectorAll('.ntv-ad-div');

    if (nativoAds.length > 0) {
      nativoAds.forEach((value, index) => {
        value.innerHTML = '';
      });
    }
  }

  _errorHandler(error) {
    if (typeof error !== 'undefined' && Object.keys(error).length > 0) {
      this.set('paragraphsLoading', false);
    }
  }

  _sendPageview() {
    this.async(() => {
      let story = this.get('response');

      var { byline: { inputByline: byline }, sectionInformation: { sectionParentName, sectionName, section  }, published: published, publishedISO: publishedISO, tags: tags, itemId: storyId } = story;
      
      let matherSections = (typeof sectionParentName !== 'undefined' && sectionParentName !== '' ? sectionParentName.toLowerCase() + '/' + section.toLowerCase() : section.toLowerCase() + '/');

      if (typeof story.byline !== 'undefined') {
        if (typeof story.byline.title !== 'undefined') {
          byline = story.byline.title;
        }
      }

      if (section === '') {
        section = story.sectionInformation.sectionParentName;
      }

      let data = {
        dimension1: (typeof byline !== 'undefined') ? byline : '',
        dimension3: (typeof published !== 'undefined') ? published : '',
        dimension6: 'Story',
        dimension8: (typeof tags !== 'undefined') ? tags : ''
      };
    
      // Send pageview event with iron-signals
      this.fire('iron-signal', {name: 'track-page', data: { path: '/story/' + storyId, data } });

      // Send Chartbeat
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: '/story/' + storyId, data: {'sections': section, 'authors': byline } } });

      // Fire Youneeq Page Hit Request
      this.fire('iron-signal', {name: 'page-hit', data: {content: story}});
      this.fire('iron-signal', {name: 'observe', data: {content: story}});
      
      // Fire Mather
      this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': section, 'hierarchy': matherSections, 'authors': byline, 'publishDate': publishedISO, 'pageType': 'story', timeStamp: new Date() } } });
    });
  }

  _storyDoneLoading(paragraphsLoading, requestLoading) {
    this.async(() => {
      if (typeof paragraphsLoading !== 'undefined' && typeof requestLoading !== 'undefined') {

        if (requestLoading && !paragraphsLoading) {
          this.set('paragraphsLoading', true);
        }

        if (!paragraphsLoading && !requestLoading) {
          this.set('loading', false);
          this._sendPageview();

          // Fire nativo
          if (typeof window.PostRelease !== 'undefined' && typeof window.PostRelease.Start === 'function') {
            PostRelease.Start();
          }
        }
      }
    });
  }
}
Polymer(CranberryStory);
