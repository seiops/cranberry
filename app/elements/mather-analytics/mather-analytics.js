class matherAnalytics {
  beforeRegister() {
    this.is = 'route-info';
  }

  ready() {
    console.dir(route);
    console.dir(data);
  }

  _stringifyQueryParams() {
    var params = [];
    if (this.route && this.route.queryParams) {
      for (var key in this.route.queryParams) {
        params.push(key + ' = ' + this.route.queryParams[key]);
      }
    }
    return params.join(', ');
  }
}
Polymer(matherAnalytics);
