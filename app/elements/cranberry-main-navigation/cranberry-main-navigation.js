class cranberryMainNavigation {
  beforeRegister() {
    this.is = 'cranberry-main-navigation';
    this.properties = {
      navigationItems: {
        type: Array,
        value: []
      },
      params: {
        type: Object,
        value: function() {
          return {
            request: 'menu',
            desiredMenu: 'sideMenu'
          }
        }
      },
      rest: String,
      route: Object,
      submenuSelected: {
        type: Object,
        observer: '_submenuSelectedChanged'
      }
    }
  }

  attached() {
    this.async(() => {
      let request = this.$.request;
      let restUrl = this.get('rest');
      let params = this.get('params');

      request.setAttribute('url', restUrl);
      request.setAttribute('callback-value', 'mainNavigation');
      request.params = params;

      request.generateRequest();

      let menu = this.$.menu;
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

  _handleResponse(response) {
    let result = JSON.parse(response.detail.Result);
    this.set('navigationItems', result.items);
  }
}
Polymer(cranberryMainNavigation);
