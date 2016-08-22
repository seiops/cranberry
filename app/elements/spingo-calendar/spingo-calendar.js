class spingoCalendar {
  beforeRegister() {
    this.is = 'spingo-calendar';
  }

  attached() {
    window.SpinGo = {
      config: {
          radius: 25,
          pushState: true
      }
    };
  }

  detached() {
    console.info('Spingo Calendar detached');
    let script = document.querySelector('script[src="//d16twqtnxc0kgx.cloudfront.net/apps/calendar-ui/v3.7.4/calendar-ui.js"]');
    console.info(script);
    script.remove();
    window.FastClick = {};
    window.sgMobileRedirect = {};
    window.SpinGo = {};
  }
}
Polymer(spingoCalendar);
