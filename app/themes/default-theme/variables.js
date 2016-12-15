/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var config = require('../../metadata/general'),
    primaryColorName = config.siteName,
    accentColorName = config.siteName + '-accent',
    fileName = config.fileName,
    themeMode = 'light',
    colors = require('./colors'),
    primaryColor = colors['paper-' + primaryColorName + '-500'],
    darkPrimaryColor = colors['paper-' + primaryColorName + '-700'];

// or dark
module.exports = {
    global: {
        logo: '../../images/logos/' + fileName + '/logo.png',
        location: '../../images/logos/' + fileName + '/location.png',
        fileName: fileName,
        primaryColorName: primaryColorName,
        accentColorName: accentColorName,
        themeMode: themeMode
    },
    // Location settings
    // Web Application Manifest - manifest.json
    manifest: {
        'theme_color': darkPrimaryColor,
        'background_color': primaryColor
    },
    // HTML Metadata in head of index.html
    metadata: {
        // Chrome for Android theme color
        chromeThemeColor: darkPrimaryColor,
        // Tile color for Win8
        msapplicationTileColor: primaryColor
    }
};
