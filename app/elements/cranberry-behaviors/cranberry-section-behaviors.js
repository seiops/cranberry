var CranberryBehaviors = CranberryBehaviors || {};

  CranberryBehaviors.SectionRequestBehavior = {
    properties: {
      animationConfig: {
        value: function() {
          return {
            'load-in': [{
              name: 'fade-in-animation',
              node: this.$.loadElement,
              timing: {
                duration: 325,
                delay: 750
              }
            },{
              name: 'fade-out-animation',
              node: this.$.contentElement,
              timing: {
                duration: 750
              }
            }],
            'load-out': [{
              name: 'fade-out-animation',
              node: this.$.loadElement,
              timing: {
                duration: 325
              }
            }, {
              name: 'fade-in-animation',
              node: this.$.contentElement,
              timing: {
                duration: 750,
                delay: 325
              }
            }]
          }
        }
      },
      restDomain: {
        type: String,
        value: '{$ config.baseEndpointUrl $}'
      }
    },
    listeners: {
      requestSection: '_requestSection'
    },
    _cleanSection(section) {
      return section.replace(/\-/g, '');
    },
    _handleError(error) {
      console.log('ERROR WAS HANDLED!');
      console.dir(error);
    },
    _handleLoad(load) {
      // abstract
    },
    _handleResponse(response) {
      if (typeof response.detail !== 'undefined' && typeof response.detail.Result !== 'undefined') {
        let result = JSON.parse(response.detail.Result);
        this.dispatchEvent(
          new CustomEvent('response-received', {detail: result})
        );
      }
    },
    _loadingChanged(loading, oldLoading) {
      if (loading) {
        this.playAnimation('load-in');
        this.$.loadElement.style.display = 'block';
        this.$.contentElement.style.display = 'none';
      } else {
        this.playAnimation('load-out');
        this.$.loadElement.style.display = 'none';
        this.$.contentElement.style.display = 'block';
      }
    },
    _requestSection(event) {
      this.fire('iron-signal', { name: 'app-scroll', data: { scrollPosition: 0, scrollSpeed: 1500, scrollAnimation: 'easeInOutQuint', afterScroll: true } });
      if (typeof event.detail !== 'undefined') {
        let detail = event.detail;

        let request = Polymer.dom(this.root).querySelector('#request');

        request.params = detail;
        request.setAttribute('callback-value', `${this._cleanSection(detail.desiredSection)}Callback`);
        request.generateRequest();
      }
    },
    _removeInProgressRequest() {
      let request = Polymer.dom(this.root).querySelector('#request');

      request.abortRequest();
    },
    _routeChanged(route) {}
  }

  CranberryBehaviors.PageviewBehavior = {
    _sendPageview(section) {
      let page = section.page;
      let matherSections = page.matherHierarchy;
      let author = page.author;
      let pageType = page.type;
      let path = page.pageviewPath;
      let data = {
        dimension6: 'section',
        dimension7: page.section
      };

      if (page.type === 'tags') {
        data.dimension8 = page.tag;
      } 

      this.async(() => {
        // Fire Google Analytics Pageview
        this.fire('iron-signal', {name: 'track-page', data: { path: path, data } });
        // Fire Chartbeat pageview
        this.fire('iron-signal', {name: 'chartbeat-track-page', data: { path: path, data: {'sections': section, 'authors': author } } });
        // Fire Youneeq Page Hit Request
        this.fire('iron-signal', {name: 'page-hit'});
        // Fire Mather
        this.fire('iron-signal', {name: 'mather-hit', data: { data: {'section': section, 'hierarchy': matherSections, 'authors': author, 'pageType': pageType, timeStamp: new Date() } }});
      });
    }
  }