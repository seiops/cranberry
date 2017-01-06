class CranberryBase {
  // element registration
  beforeRegister() {
    this.is = 'cranberry-base';
    this.properties = {
      data: Object,
      upgraded: Boolean,
      storage: {
        type: Object
      },
      route: Object,
      section: String,
      user: Object,
      locationImage: {
        type: String,
        value: ''
      },
      sideNav: {
        type: Object,
        value: []
      }
    };
    this.observers = ['_setCanonical(route)'];
  }
  // public methods

  // attached to document
  attached() {
    // let storage = JSON.parse(localStorage.getItem(this.$.localStorage.name));

    // if (storage) {
    //   if (storage.darkThemeEnabled) {
    //     this.changeTheme(storage.darkThemeEnabled);
    //   }

    //   if (storage.accentColor) {
    //     this.changeAccentColor(storage.accentColor);
    //   }
    // }

    this._setupSurvey();
  }

  // element ready
  ready() {
    // Let the world know we're ready to receive data
    // https://github.com/Polymer/polymer/issues/2653
    this.fire('upgraded');
    this.set('upgraded', true);

  }

  _setCanonical(route) {
    if (typeof route !== 'undefined') {
      let path = route.path;
      let prefix = route.prefix;

      let canonicalTag = Polymer.dom(document).querySelector('link[rel="canonical"]');
      canonicalTag.setAttribute('href', window.location.origin + prefix + path);
    }
  }
  
  _setupSurvey() {
    let loader = document.querySelector('cranberry-script-loader');

    loader.loadScript('https://apps.ignitefeedback.com/assets/javascripts/igniter.js');

    window._igniter = window._igniter || [];
    window._igniter.push(['or-V23', 'https://apps.ignitefeedback.com']);
  }

  // private methods
  _sectionTail(section) {
    this.set('section', section);
  }

  initializeDefaultStorage() {
    this.storage = {
      accentColor: null,
      darkThemeEnabled: null
    };
  }

  scrollPageToTop() {
    this.$.headerPanelMain.scrollToTop(true);
  }

  closeDrawer(e) {
    e.preventDefault();
    this.$.paperDrawerPanel.closeDrawer();
  }

  onAccentColorSwatchPickerSelected() {
    this.changeAccentColor(this.$.accentColorSwatchPicker.color);
  }

  onConfirmToastTap() {
    this.$.confirmToast.hide();
  }

  onDarkThemeToggleChange() {
    this.changeTheme(this.$.darkThemeToggle.checked);
  }

  onSubmitFeedbackTap() {
    this.$.submitFeedback.href += window.location.pathname;
  }

  changeAccentColor(color) {}

  _clearModal(e) {
    e.preventDefault();

    let modalContent = Polymer.dom(this.root).querySelector('paper-dialog-scrollable').querySelector('#scrollable').querySelector('.content-area');

    // Remove all children of the content area
    while(modalContent.firstChild) {
      modalContent.removeChild(modalContent.firstChild);
    }
  }

  _checkDrawer() {
    this.async(() => {
      if (!this.$.drawer.persistent) {
        this.$.drawer.close();
      }
    });
  }

  _drawerItemSelected(e) {
    console.dir(e);
    setTimeout(() => {
      this._checkDrawer();
    }, 150);
  }

  _equal(a, b) {
    if (a === b) {
      return true;
    } else {
      return false;
    }
  }

  _isLatest(selected) {
    if (selected === 0) {
      return true;
    } else {
      return false;
    }
  }

  openUserModal() {
    let el = Polymer.dom(this.root).querySelector('gigya-socialize');

    el.openModal();
  }

  _isLocal(selected) {
    if (selected === 1) {
      return true;
    } else {
      return false;
    }
  }

  _isPopular(selected) {
    if (selected === 2) {
      return true;
    } else {
      return false;
    }
  }

  _isFeatured(selected) {
    if (selected === 2) {
      return true;
    } else {
      return false;
    }
  }

  _siteTitle(route) {
    let path = route.path;
    let section = '';
    let sectionPath = path.search('section');
    let storyPath = path.search('story');
    let galleryPath = path.search('gallery');
    let calendarPath = path.search('calendar');
    let searchPath = path.search('search');
    let tagsPath = path.search('tags');

    if (sectionPath > 0) {
      section = path.replace('\/section\/', '');
    } else if (calendarPath > 0) {
      section = 'calendar';
    } else if (storyPath > 0 || galleryPath > 0) {
      section = '';
    } else if (path === '/') {
      section = 'home';
    } else if (path === '/forecast') {
      section = 'forecast';
    } else if (tagsPath > 0){
      let newPath = path.replace(/\/tags\//g, '');
      newPath = newPath.replace(/\-/g, ' ');
      section = newPath;
    } else if (searchPath > 0){
      let newPath = path.replace(/\/search\//g, '');
      newPath = newPath.replace(/\+/g, ' ');
      section = newPath;
    } else {
      section = path.replace(/\//g, '');
    }

    return section;
  }

  changeTheme(darkThemeEnabled) {
    let themeMode = 'light';

    if (darkThemeEnabled) {
      themeMode = 'dark';
    }

    this.customStyle['--primary-background-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-primary-background-color`
    );
    this.customStyle['--secondary-background-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-secondary-background-color`
    );
    this.customStyle['--tertiary-background-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-tertiary-background-color`
    );
    this.customStyle['--primary-text-color'] = this.getComputedStyleValue(`--${themeMode}-theme-primary-text-color`);
    this.customStyle['--secondary-text-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-secondary-text-color`
    );
    this.customStyle['--disabled-text-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-disabled-text-color`
    );
    this.customStyle['--divider-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-divider-color`
    );
    this.customStyle['--toggle-unchecked-bar-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-toggle-unchecked-bar-color`
    );
    this.customStyle['--toggle-unchecked-button-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-toggle-unchecked-button-color`
    );
    this.customStyle['--toggle-unchecked-ink-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-toggle-unchecked-ink-color`
    );
    this.customStyle['--toggle-checked-bar-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-toggle-checked-bar-color`
    );
    this.customStyle['--toggle-checked-button-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-toggle-checked-button-color`
    );
    this.customStyle['--toggle-checked-ink-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-toggle-checked-ink-color`
    );
    this.updateStyles();
  }

  changeAccentColor(
    color
  ) {
    let accentColors = {
      '#ff5252': 'red',
      '#ff4081': 'pink',
      '#e040fb': 'purple',
      '#7c4dff': 'deep-purple',
      '#536dfe': 'indigo',
      '#448aff': 'blue',
      '#40c4ff': 'light-blue',
      '#18ffff': 'cyan',
      '#64ffda': 'teal',
      '#69f0ae': 'green',
      '#b2ff59': 'light-green',
      '#eeff41': 'lime',
      '#ffff00': 'yellow',
      '#ffd740': 'amber',
      '#ffab40': 'orange',
      '#ff6e40': 'deep-orange'
    };
    let accentColorName = accentColors[color];
    let themeMode = 'light';

    if (this.$.darkThemeToggle.checked) {
      themeMode = 'dark';
    }

    this.customStyle['--accent-color'] = this.getComputedStyleValue(
      `--paper-${accentColorName}-a200`
    );
    this.customStyle['--light-accent-color'] = this.getComputedStyleValue(
      `--paper-${accentColorName}-a100`
    );
    this.customStyle['--dark-accent-color'] = this.getComputedStyleValue(
      `--paper-${accentColorName}-a400`
    );
    this.customStyle['--darker-accent-color'] = this.getComputedStyleValue(
      `--paper-${accentColorName}-a700`
    );
    this.updateStyles();
    this.customStyle['--toggle-checked-bar-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-toggle-checked-bar-color`
    );
    this.customStyle['--toggle-checked-button-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-toggle-checked-button-color`
    );
    this.customStyle['--toggle-checked-ink-color'] = this.getComputedStyleValue(
      `--${themeMode}-theme-toggle-checked-ink-color`
    );
    this.updateStyles();
  }

  _focusSearch() {
    let drawer = this.$.drawer;
    let drawerBar = this.$.drawerSearch;

    if (!drawer.opened) {
      // If the drawer is closed open it
      this.$.drawer.open();
      // Timeout function to ensure the input is not hidden anymore
      setTimeout(function() {
        drawerBar.$.input.focus()
      }, 250);
    } else {
      drawerBar.$.input.focus();
    }
  }

  // Function to prevent the document from scrolling when modal is open
  _disableDocumentScrolling() {
    document.body.style.overflow = 'hidden';
  }

  // Function to re-enable the document scrolling when modal is closed
  _restoreDocumentScrolling() {
    document.body.style.overflow = '';
  }

  // Compute if the thumbnail for the user is present
  _computeThumbnail(thumbnail) {
    if (typeof thumbnail !== 'undefined' && thumbnail !== '') {
      return thumbnail;
    } else {
      // Return canned image currently
      return '../images/story/unavail.png';
    }
  }

  // Function to hide or show the default login button or the user button
  _computeDefaultHide(thumbnail) {
    if (typeof thumbnail === 'undefined') {
      return false;
    } else {
      return true;
    }
  }
}
// Change accent color
Polymer(
  CranberryBase
);
