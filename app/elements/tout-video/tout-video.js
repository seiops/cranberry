/* Tout Video JS library integration */

class ToutVideo {
  beforeRegister() {
    this.is = 'tout-video';
  }
  ready() {
    app.logger("Finished loading Tout Video.");
  }

}

Polymer(ToutVideo);
