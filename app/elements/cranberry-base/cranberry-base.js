/* Cranberry app */
class CranberryBase {
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
            user: Object
        };
    }

    _userChange(user) {
      console.log('user change');
      console.dir(user);
    }
    attached() {
        let storage = JSON.parse(localStorage.getItem(this.$.localStorage.name));

        if (storage) {
            if (storage.darkThemeEnabled) {
                this.changeTheme(storage.darkThemeEnabled);
            }

            if (storage.accentColor) {
                this.changeAccentColor(storage.accentColor);
            }
        }
    }

    ready() {
        // Let the world know we're ready to receive data
        // https://github.com/Polymer/polymer/issues/2653
        this.fire('upgraded');
        this.set('upgraded', true);
    }

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

    closeDrawer() {
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

    openModal() {
      this.$.modal.open();
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

        if (sectionPath > 0) {
            section = path.replace('\/section\/', '');
        } else if (storyPath > 0 || galleryPath > 0) {
            section = '';
        } else if (path === '/') {
            section = 'Home';
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
        this.updateStyles(

        );
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
        this.updateStyles(

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
        this.updateStyles(

        );
    }
}
// Change accent color
Polymer(
    CranberryBase
);
