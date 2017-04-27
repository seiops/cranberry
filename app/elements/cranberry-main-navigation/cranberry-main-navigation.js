class cranberryMainNavigation {
  beforeRegister() {
    this.is = 'cranberry-main-navigation';
    this.properties = {
      navigationItems: {
        type: Array,
        value: []
      },
      route: Object,
      submenuSelected: {
        type: Object,
        observer: '_submenuSelectedChanged'
      }
    };
    this.listeners = { 
      'side-menu-content-received': '_contentReceived',
      'side-menu-request-info': '_requestReceived'
    };
  }

  _contentReceived(event) {
    if (typeof event.detail.result.items !== 'undefined') {
      this.set('navigationItems', event.detail.result.items);
    }
  }

  attached() {
    this.async(() => {
      this.fire('iron-signal', { name: 'request-content', data:{request: 'menu', desiredMenu: 'side-menu', callbackId: 'mainNavigation'}});
    });
  }

  _checkChildren(children) {
    if (typeof children !== 'undefined' && children.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  _checkDrawer() {
    this.async(() => {
      let base = Polymer.dom(document).querySelector('cranberry-base');
      let drawer = Polymer.dom(base.root).querySelector('#drawer');

      if (!drawer.persistent) {
        drawer.close();
      }
    });
  }

  _requestReceived(event) {
    if (typeof event.detail.request !== 'undefined') {
      this.set('currentRequest', event.detail.request);
    }
  }

  _submenuSelectedChanged(value, oldValue) {
    if (typeof value !== 'undefined' && typeof value === 'object') {
      if (typeof value.parentNode !== 'undefined' && value.parentNode) {

        var element = value.parentNode;

        while(element.parentNode) {
          element = element.parentNode;

          if (element.tagName === 'PAPER-SUBMENU') {
            element.open();
            return false;
          }
        }
      }
      
    }
  }

  _scrubIcon(icon) {
    if (typeof icon !== 'undefined' && icon.length > 0) {
      let colonIndex = icon.indexOf(':');

      if (colonIndex !== -1) {
        let simpleIcon = icon.slice(colonIndex + 1);
        return simpleIcon;
      } else {
        return icon;
      }
    }
  }

  _drawerItemSelected(e) {
    setTimeout(() => {
      this._checkDrawer();
    }, 150);
  }
}
Polymer(cranberryMainNavigation);
