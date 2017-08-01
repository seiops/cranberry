class cxenseRecommendationWidget {
  beforeRegister() {
    this.is = 'cxense-recommendation-widget';
    this.properties = {
    };
  }

  attached() {
    let cX = cX || {};
    cX.callQueue = cX.callQueue || [];

    console.dir(cX);
    console.dir(cX.callQueue);
    cX.callQueue.push(['insertWidget',{
      // TODO: Replace this widget ID with one from Cxense.
      widgetId: '69c0ca55586b5c0856d4286c623e3c66017b5ad5',
      renderFunction: this._render
    }]);
  }

  _render(data, context) {
    console.log(`RESPONSE FROM CXENSE!`);
    console.dir(context);
    if (typeof data.response !== 'undefined' && data.response.items.length > 0) {
      console.dir(data.response.items);
    } 
  }
}
Polymer(cxenseRecommendationWidget);
