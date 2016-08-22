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
      if (!calendarContainer.firstChild) {
        let calendar = document.createElement('spingo-calendar');
        calendar.id = 'spingoCalendar';
        calendarContainer.appendChild(calendar);
      } else {
        this.$$('#spingoCalendar').remove();
      }
    }
  }
}
Polymer(cranberryCalendar);
