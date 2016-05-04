# SNG Cranberry Web Core


## Requirements

Cranberry has the following major dependencies:

* **Node.js**, used to run JavaScript tools from the command line.
* **npm**, the node package manager, installed with Node.js and used to install Node.js packages.
* **gulp**, a Node.js-based build tool.
* **bower**, a Node.js-based package manager used to install front-end packages (like Polymer).


## Setup

### Quick Install

If you already have `node 0.12.x` installed you only need the additional components.

#### Initialize your app

```sh
npm install -g gulp bower && npm install && bower install
```


### Full Installation

Check Node.js version. It should be at least 0.12.x.

```sh
node -v
```
> v0.12.5


Check npm version. It should be at least 2.12.x.

```sh
npm -v
```
> 2.12.2

If you don't have Node.js installed, or you have a lower version, go to [nodejs.org](https://nodejs.org) and click on the install button.



Install `gulp` and `bower` globally.

 ```sh
 npm install -g gulp bower
 ```

#### Quick-start (for experienced users)

With Node.js installed, run the following one liner from the root of your Polymer Starter Kit Plus download:

```sh
npm run install:complete # Alias for "sudo npm install -g npm && sudo npm install -g bower gulp && npm install && bower install"

gulp init # Initialize your app - download fonts from Google Fonts and analytics.js
```


#### Variables

- Gulp variables -  [config.js](https://github.com/seiops/cranberry/blob/master/config.js)
- Theme variables -  [variables.css](https://github.com/seiops/cranberry/blob/master/app/themes/default-theme/variables.css) and [variables.js](https://github.com/seiops/cranberry/blob/master/app/themes/default-theme/variables.js)
- HTML metadata -  [config.js](https://github.com/seiops/cranberry/blob/master/app/metadata/config.js) and [general.js](https://github.com/seiops/cranberry/blob/master/app/metadata/general.js)
