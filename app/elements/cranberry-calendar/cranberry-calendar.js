class cranberryCalendar {
  beforeRegister() {
    this.is = 'cranberry-calendar';
    this.properties = {
      route: {
        type: Object,
        observer: '_onRouteChanged'
      }
    }
  }

  _onRouteChanged(newValue) {
    let calendarContainer = this.$.calendarContainer;
    if (typeof newValue.path !== 'undefined' && newValue.path === '/calendar') {
      let calendar = document.createElement('spingo-calendar');
      calendar.id = 'spingoCalendar';
      calendarContainer.appendChild(calendar);
    } else {
      let spingo = this.$$('#spingoCalendar');
      if (calendarContainer.firstChild) {
        calendarContainer.removeChild(spingo);
      }
    }
  }
}
Polymer(cranberryCalendar);
