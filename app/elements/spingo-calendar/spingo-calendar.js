class spingoCalendar {
  beforeRegister() {
    this.is = 'spingo-calendar';
  }

  attached() {
    window.SpinGo = { config: {
          radius: 25,
          pushState: true,
          onNavigation: function(data) {
            // user has entered a new route
            console.info(data);
            data.leaving.then(function() {
              // user has left the route
              console.info('user left the route');
            });
          }
      } };
  }

  detached() {
    // console.info('Spingo Calendar detached');
    // let script = document.querySelector('script[src="//d16twqtnxc0kgx.cloudfront.net/apps/calendar-ui/v3.7.4/calendar-ui.js"]');
    // console.info(script);
    // script.remove();
    // window.FastClick = {};
    // window.sgMobileRedirect = {};
    // window.SpinGo = {};
  }
}
Polymer(spingoCalendar);
