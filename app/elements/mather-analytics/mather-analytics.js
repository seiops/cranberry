class matherAnalytics {
  beforeRegister() {
    this.is = 'mather-analytics';
    this.properties = {
      matherId: String,
      matherName: String,
      snaq: {
        type: Array,
        computed: '_setupSnaqArray(matherId, matherName, user)',
        observer: '_snaqChanged'
      },
      user: Object
    };
  }

  attached() {
  }

  _setupSnaqArray(matherId, matherName, user) {
    let _snaq = [];

    _snaq.push('setCollectorUrl', 'www.i.matheranalytics.com');
    _snaq.push('setAppId', 'v1');
    _snaq.push('setCustomerId', 'ma87848');
    _snaq.push(['setMarket', matherId]);
    _snaq.push('setUserId', '');
    _snaq.push('enableActivityTracking', 30, 10);
    _snaq.push('setHierarchy', 'parent/child');
    // TODO: Setup Logic around content to setup proper author based on content type
    _snaq.push(['setAuthor', matherName]);
    

    _snaq.push(['trackPageView', null, { identities: [{ type: 'gigya', id: (typeof user.UID !== 'undefined' ? user.UID : '') }] } ]);
    
    return _snaq;
  }

  _setupMatherScript() {
    console.log(_snaq);
    var a = [].concat.apply([], _snaq);
    var src = a[a.indexOf('setCustomerId') + 1] + '/' + a[a.indexOf('setMarket') + 1] + '/sp.js?cachebust=' + Math.round(new Date() / 1.0368e9);
    var sp = document.createElement('script');
    sp.type = 'text/javascript';
    sp.async = true;
    sp.defer = true;
    sp._mather_tag = document.scripts[document.scripts.length - 1];
    sp._mather_sp = sp.uniqueID;
    sp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://js.matheranalytics.com/s/' + src;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(sp, s);
  }

  _snaqChanged(snaq, oldSnaq) {
    console.log('SNAQ CHANGED!');
    console.dir(snaq);
    console.dir(user);
    console.dir(matherId);
  }

//   <script type="text/javascript">
// var _snaq = (window._snaq = window._snaq || []);

// _snaq.push(['setSection', '[%
// {@currentpath="/"}
// Home%|%
// {@SectionName}
// <%@SectionName$j%>%|%
// {@Title}
// <%@Title$j%>%|%<%@currentpath$r("(^.+)\/$|.html","$1")$j%>%]']);

// _snaq.push(['setAuthor', '[%
// {@authorGlobal}
// <%@authorGlobal%>%|%<%MatherMarketName%>%]']);
// _snaq.push(['setPageType', '<%@RequestType%>']);

// _snaq.push(['setArticlePublishTime', [%
// {@firstPublishedDate}
// '<%@firstPublishedDate$i%>'%|%new Date()%]]);

// _snaq.push(['trackPageView', null, { identities: [{ type: 'gigya', id: '[%
// {User:UserStatus:ExternalID}
// <%User:UserStatus:ExternalID%>%|% %]' }] } ]);

// (function()
// { var a = [].concat.apply([], _snaq); var src = a[a.indexOf('setCustomerId') + 1] + '/' + a[a.indexOf('setMarket') + 1] + '/sp.js?cachebust=' + Math.round(new Date() / 1.0368e9); var sp = document.createElement('script'); sp.type = 'text/javascript'; sp.async = true; sp.defer = true; sp._mather_tag = document.scripts[document.scripts.length - 1]; sp._mather_sp = sp.uniqueID; sp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://js.matheranalytics.com/s/' + src; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(sp, s); }
// )();
// </script>

}
Polymer(matherAnalytics);
