class routeInfo {
  beforeRegister() {
    this.is = 'route-info';
    this.properties = {
      route: {
        type: Object
      }
    };
  }

  _stringifyQueryParams() {
    var params = [];
    console.dir(this.route);
    console.dir(this.route.__queryParams);
    if (this.route && this.route.__queryParams) {
      for (var key in this.route.__queryParams) {
        params.push(key + ' = ' + this.route.__queryParams[key]);
      }
    }
    return params.join(', ');
  }
}
Polymer(routeInfo);
