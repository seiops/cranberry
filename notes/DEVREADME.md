## Use observer arrays ##

- Asynchronous properties don't need to be checked for undefined values.
- Observers can watch multiple properties and will only fire if ALL properties have values. 
- Unique ability to use wildcards (returns change record object: path, value, base object preceeding property)

## App layout ##

- Always try to use a pattern from the app-layout element.

## Upgraded element signal ##

Discussed at https://github.com/Polymer/polymer/issues/2653

``
  this.properties = {
    upgraded: Boolean
  }

  ready() {
    this.fire('upgraded');
    this.upgraded = true;
  }

  window.addEventListener('upgraded', () => {
    app.baseUrl = baseUrl;
  });

  function setData() {
    app.route = 'home';
    app.pageTitle = 'Home';
    app.pageSubTitle = 'Default home page.';
    setFocus(app.route);
  }

  if (!app.upgraded) {
    once(app, 'upgraded', setData);
  } else {
    setData();
  }
``
