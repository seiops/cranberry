class matherAnalytics {
  beforeRegister() {
    this.is = 'mather-analytics';
    this.properties = {
      content: Object,
      loadMatherScript: {
        type: Boolean,
        value: true
      },
      matherId: String,
      matherName: String,
      matherq: {
        type: Array,
        computed: '_setupMatherQArray(matherId, matherName, user, content)'
      },
      globalMatherq: {
        type: Array,
        value: function() {
          let _matherq;

          try {
            _matherq = window.top._matherq;
          }
          catch (e) { }
        
          if (!_matherq) {
            _matherq = (window._matherq = window._matherq || []);
          }

          return _matherq;
        }
      },
      user: Object
    };
    this.listeners = {
      'mather-hit': 'matherHit'
    };
  }

  attached() {
    console.info('\<mather-analytics\> attached');
  }

  _setupMatherQArray(matherId, matherName, user, content) {
    console.info('\<mather-analytics\> sending page view');

    let _matherq;

    try {
      _matherq = window.top._matherq;
    }
    catch (e) { }
  
    if (!_matherq) {
      _matherq = (window._matherq = window._matherq || []);
    }

    let loadMatherScript = this.get('loadMatherScript');

    // Setup Initial Matherq Array
    _matherq.push(['setCollectorUrl', 'www.i.matheranalytics.com']);
    _matherq.push(['setAppId', 'v1']);
    _matherq.push(['setCustomerId', 'ma87848']);
    _matherq.push(['setMarket', matherId]);
    _matherq.push(['setUserId', '']);
    _matherq.push(['enableActivityTracking', 30, 10]);
    _matherq.push(['setHierarchy', (typeof content.hierarchy !== 'undefined' ? content.hierarchy : '')]);
    _matherq.push(['setPageType', (typeof content.pageType !== 'undefined' ? content.pageType : '')]);
    _matherq.push(['setSection', (typeof content.section !== 'undefined' ? content.section : '')]);
    _matherq.push(['setAuthor', (typeof content.authors !== 'undefined' ? content.authors : matherName)]);
    _matherq.push(['setArticlePublishTime', (typeof content.publishDate !== 'undefined' ? content.publishDate : '')]);

    // Setup Page View
    _matherq.push(['trackPageView', null, { identities: [{ type: 'gigya', id: (typeof user.UID !== 'undefined' ? user.UID : '') }] } ]);

    // Load the Mather Script
    if (loadMatherScript) {
      this._loadMatherScript(_matherq);
    }

    return _matherq;
  }

  _loadMatherScript(_matherq) {
    console.info('\<mather-analytics\> loading mather script');
    var a = [].concat.apply([], _matherq);
    var src = a[a.indexOf('setCustomerId') + 1] + '/' + a[a.indexOf('setMarket') + 1] + '/sp.js?cb=' + Math.round(new Date() / 1.0368e9);
    var sp = document.createElement('script'); sp.type = 'text/javascript'; sp.async = true; sp.defer = true;
    sp._mather_tag = document.scripts[document.scripts.length - 1]; sp._mather_sp = sp.uniqueID;
    sp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://js.matheranalytics.com/s/' + src;
    var s = Polymer.dom(document).querySelectorAll('script')[0]; s.parentNode.insertBefore(sp, s);

    this.set('loadMatherScript', false);
  }

  matherHit(e) {
    this.set('content', e.detail.data);
  }
}
Polymer(matherAnalytics);
