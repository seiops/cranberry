# SNG Cranberry Web Core


## Requirements

The Cranberry Development Kit requires the following major dependencies:

* **Node.js**, used to run JavaScript tools from the command line.
* **npm**, the node package manager, installed with Node.js and used to install Node.js packages.
* **gulp**, a Node.js-based build tool.
* **bower**, a Node.js-based package manager used to install front-end packages (like Polymer).


## Setup

### Quick Install

If you already have `node 0.12.x` installed you only need the additional components.

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


## Directory Structure

```
/
|---app/
|   |---elements/
|   |---images/
|   |---scripts/
|   |---styles/
|   |---test/
|---docs/
|---dist/
```

* **app/..** - Source code development area.
* **elements/** - Custom elements.
* **images/** - Static images.
* **scripts/** - JS script modules.
* **styles/** - Shared styles and CSS rules.
* **test/** - Tests for web components.
* **dist/** - Production build (vulcanized and minified).
