# SNG Cranberry Web Core

## Requirements

Cranberry has the following major dependencies:

* **Node.js**, used to run JavaScript tools from the command line.
* **npm**, the node package manager, installed with Node.js and used to install Node.js packages.
* **gulp**, a Node.js-based build tool.
* **bower**, a Node.js-based package manager used to install front-end packages (like Polymer).

## Setup

### 1. Get the code
* Clone the [Github Repository](https://github.com/seiops/cranberry)

### 2. Install dependencies
* Navigate to the cloned repository local folder
* Run `npm install` in the terminal
* Run `bower install` in the terminal

### 3. Development workflow

#### Build to localhost `gulp serve --site **SITENAME** --env **ENVIRONMENT NAME**`
* Example development build for Sandusky Register `gulp serve --site sandusky --env dev`
* Example stage build for Sandusky Register `gulp serve --site sandusky --env stage`

#### Build to localhost off distribution folder `gulp serve:dist --site **SITENAME** --env **ENVIRONMENT NAME**`
* Example development dist build for Sandusky Register `gulp serve:dist --site sandusky --env dev`
* Example stage dist build for Sandusky Register `gulp serve:dist --site sandusky --env stage`

### 4. Build application for Libercus envrionments

* Build to Sandusky Register's [development site](http://srdevcore.libercus.net) `gulp pre-deploy --site sandusky --env dev`
* Build to Sandusky Register's [stage site](http://srstgcore.libercus.net) `gulp pre-deploy --site sandusky --env stage`
* Build to Sandusky Register's [production site](http://www.sanduskyregister.com) `gulp pre-deploy --site sandusky --env prod`

