class cranberryStaticSection {
  beforeRegister() {
    this.is = 'cranberry-static-section';
    this.properties = {
      hidden: {
          type: Boolean,
          reflectToAttribute: true,
          value: true
      },
      staticSection: {
        type: String
      },
      hideWeather: {
        type: Boolean,
        value: true
      },
      hideAdvantage: {
        type: Boolean,
        value: true
      },
      hideGames: {
        type: Boolean,
        value: true
      },
      hideDiscoverNorwalk: {
        type: Boolean,
        value: true
      },
      weatherScriptLoaded: {
        type: Boolean,
        value: false
      },
      tags: {
        type: String
      },
      advantageItems: {
        type: Array
      },
      ludiPortal: {
        type: String
      }
    }
    this.observers = ['_setupWeather(hidden, staticSection)',
                      '_setupGames(hidden, hideGames)']
  }

  _setupWeather(hidden, staticSection) {
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'weather') {
      let scriptLoaded = this.get('weatherScriptLoaded');

      if (!scriptLoaded) {
        let loader = document.querySelector('cranberry-script-loader');

        loader.loadScript('http://oap.accuweather.com/launch.js');
        this.set('weatherScriptLoaded', true);
        this.set('tags', 'weather, forecast');
      }

      this.set('hideWeather', false);
    }
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'advantage-member') {
      this.set('hideAdvantage', false);
      this.set('tags', 'advantage');
    }
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'games-page') {
      this.set('hideGames', false);
      this.set('tags', 'games');
    }
    if (typeof hidden !== 'undefined' && !hidden && typeof staticSection !== 'undefined' && staticSection === 'discovernorwalk') {
      this.set('hideDiscoverNorwalk', false);
      this.set('tags', 'discovernorwalk');
    }
  }

  _setupGames(hidden, hideGames) {
    
  }
}
Polymer(cranberryStaticSection);

// let gamesDiv = this.$.games;
    // let ludiPortal = this.get('ludiPortal');
    // if (typeof hidden !== 'undefined' && !hidden && typeof hideGames !== 'undefined' && !hideGames) {
    //   // Add HTML to games div
    //   let htmlString = '<div class="gcntargets" style="overflow:hidden;display:block;width:625px;height:1375px;" gcn-portal="' + ludiPortal + '" gcn-format="full" gcn-resize="1" gcn-mobileheight="4400" gcn-mobilewidth="360"></div><script>(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "https://s3.amazonaws.com/gcn-static-assets/jsmodules/embedder-townnews.js"; fjs.parentNode.insertBefore(js, fjs);}(document, "script", "gameplayer-gcn"));</script></div>';
    //   let ARTICLE_URL = window.location.href;
    //   let CONTENT_ID = 'everything';

    //   // Change this to write to the DIV
    //   gamesDiv.innerHTML = '<scr'+'ipt '+ ' url='+encodeURIComponent(ARTICLE_URL)+ (CONTENT_ID ? '&amp;cid='+encodeURIComponent(CONTENT_ID) : '')+ '&amp;random='+(new Date).getTime()+ ' type="text/javascript">'+'</scr'+'ipt>' + htmlString;

    // } else {
    //   // Destroy any HTML in games div.
    //   gamesDiv.innerHTML = '';
    // }
