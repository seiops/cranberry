/*
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* Gigya Socialize JS library integration */

class GigyaSocialize {
  beforeRegister() {
    this.is = 'gigya-socialize';
    this.properties = {
      items: {
        type: Object,
        notify: true
      }
    };
  }
  ready() {
    var checkGigya = function () {
      setTimeout(function () {
        if (typeof gigya !== 'undefined') {
          // Gigya callback goes here.
          // Bind to login and logout evenets.
          app.logger("Finished loading Gigya Socialize.");
          console.dir(gigya.accounts);
          return;

        } else {
          checkGigya();
        }
      }, 1000);
    };
    checkGigya();
  }
}

Polymer(GigyaSocialize);
