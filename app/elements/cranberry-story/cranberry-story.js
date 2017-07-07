class CranberryStory {
  beforeRegister() {
    this.is = 'cranberry-story';
    this.properties = {
      animationConfig: {
        value: function() {
          return {
            'entry': {
              name: 'fade-in-animation',
              node: this,
              timing: {duration: 1500}
            }
          }
        }
      },
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
      storyDoneLoading: {
        type: Boolean,
        value: false,
        observer: '_loadingChanged'
      },
      storyId: {
        type: String,
        value: ''
      },
      toutOff: Boolean,
      toutUid: String,
      user: Object
    };
    this.observers = [
      '_storyDoneLoading(paragraphsLoading, requestLoading)',
      '_errorHandler(error)',
      '_hiddenChanged(hidden)'
    ]
  }

  // Life-Cycle Methods
  attached() {
    console.info('\<cranberry-story\> attached');
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

  _hiddenChanged(hidden) {
    if (hidden) {
      this.set('response', {});
    }
  }
  
  _computeMediaHidden(staticPage, hidden) {
    if (staticPage || hidden) {
      return true;
    } else {
      return false;
    }
  }

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
      let toutOff = this.get('toutOff');
      let staticPage = this.get('staticPage');

      var { byline: { inputByline: byline }, sectionInformation: { sectionParentName, sectionName, section  }, published: published, publishedISO: publishedISO, tags: tags, itemId: storyId } = story;
      
      let matherSections = (typeof sectionParentName !== 'undefined' && sectionParentName !== '' ? sectionParentName.toLowerCase() + '/' + section.toLowerCase() : section.toLowerCase() + '/');
      byline = '';

      if (typeof story.byline !== 'undefined') {
        if (typeof story.byline.title !== 'undefined' && story.byline.title !== '') {
          byline = story.byline.title;
        } else {
          byline = story.byline.inputByline;
        }
      }

      if (section === '') {
        section = story.sectionInformation.sectionParentName;
      }

      let path = (staticPage ? `/page/${encodeURI(section.toLowerCase())}` : `/story/${storyId}`);

      let data = {
        dimension1: (typeof byline !== 'undefined') ? byline : '',
        dimension3: (typeof published !== 'undefined') ? published : '',
        dimension4: toutOff,
        dimension5: storyId,
        dimension6: (staticPage ? 'Static' : 'Story'),
        dimension7: (staticPage ? section.replace(/ /g, '-') : section),
        dimension8: (typeof tags !== 'undefined' ? tags : '')
      };
      
      // Send pageview event with iron-signals
      this.fire('iron-signal', {name: 'track-page', data: { path: path, data } });

      // Send Chartbeat
      this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: path, data: {'sections': section, 'authors': byline } } });

      // Fire Youneeq Page Hit Request
      this.fire('iron-signal', {name: 'page-hit', data: {content: story}});
      this.fire('iron-signal', {name: 'observe', data: {content: story}});
      
      // Fire Mather
      this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': section, 'hierarchy': matherSections, 'authors': byline, 'publishDate': publishedISO, 'pageType': 'story', timeStamp: new Date() } } });

      // Cxense
      this.dispatchEvent(
        new CustomEvent(
          'send-cxense-pageview',
          {
            bubbles: true,
            composed: true,
            detail: {
              location: window.location.href
            }
          }
        )
      );
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
          this.set('storyDoneLoading', true);
          this._sendPageview();

          // Fire nativo
          if (typeof window.PostRelease !== 'undefined' && typeof window.PostRelease.Start === 'function') {
            PostRelease.Start();
          }
        } else {
          this.set('storyDoneLoading', false);
        }
      }
    });
  }

  _loadingChanged(loading, oldLoading) {
  }
}
Polymer(CranberryStory);
