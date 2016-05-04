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
   
## Getting Started

To take advantage of Polymer Starter Kit Plus you need to:

1. [Get a copy of the code.](https://github.com/StartPolymer/polymer-starter-kit-plus#1-get-the-code)
2. [Install the dependencies if you don't already have them.](https://github.com/StartPolymer/polymer-starter-kit-plus#2-install-dependencies)
3. [Modify the application to your liking.](https://github.com/StartPolymer/polymer-starter-kit-plus#3-development-workflow)
4. [Deploy your production code.](https://github.com/StartPolymer/polymer-starter-kit-plus#4-deploy-app-tada)

### 1. Get the code

Polymer Starter Kit Plus comes in two flavours - Lite (branch `lite`) and Full (branch `master`). [Lite version](https://github.com/StartPolymer/polymer-starter-kit-plus/tree/lite) doesn't contain demo content!

[Download](https://github.com/StartPolymer/polymer-starter-kit-plus/releases/latest) and extract Polymer Starter Kit Plus to where you want to work.

OR Install [Start Polymer Generator](https://github.com/StartPolymer/generator-startpolymer#installation) and run `yo startpolymer` in `my-project` directory.

:warning: **Important**: Polymer Starter Kit Plus contain dotfiles (files starting with a `.`). If you're copying the contents of the Starter Kit to a new location make sure you bring along these dotfiles as well! On Mac, [enable showing hidden files](http://ianlunn.co.uk/articles/quickly-showhide-hidden-files-mac-os-x-mavericks/), then try extracting/copying Polymer Starter Kit Plus again. This time the dotfiles needed should be visible so you can copy them over without issues.

Rob Dodson has a fantastic [PolyCast video](https://www.youtube.com/watch?v=xz-yixRxZN8) available that walks through using Polymer Starter Kit. An [end-to-end with Polymer](https://www.youtube.com/watch?v=1f_Tj_JnStA) and Polymer Starter Kit talk is also available.

#### Updating from previous version

If you've previously downloaded a copy of the full Starter Kit and would like to update to the latest version, here's a git workflow for doing so:

```sh
git init
git checkout -b master
git add .
git commit -m 'Check-in 1.0.1'
git remote add upstream https://github.com/StartPolymer/polymer-starter-kit-plus.git
git fetch upstream
git merge upstream/master # OR git merge upstream/lite
# resolve the merge conflicts in your editor
git add . -u
git commit -m 'Updated to 1.0.2'
```

### 2. Install dependencies

#### Quick-start (for experienced users)

With Node.js installed, run the following one liner from the root of your Polymer Starter Kit Plus download:

```sh
npm run install:complete # Alias for "sudo npm install -g npm && sudo npm install -g bower gulp && npm install && bower install"

gulp init # Initialize your app - download fonts from Google Fonts and analytics.js
```

#### Prerequisites (for everyone)

The full starter kit requires the following major dependencies:

- Node.js, used to run JavaScript tools from the command line.
- npm, the node package manager, installed with Node.js and used to install Node.js packages.
- gulp, a Node.js-based build tool.
- bower, a Node.js-based package manager used to install front-end packages (like Polymer).

**To install dependencies:**

1)  Check your Node.js version.

```sh
node --version
```

The version should be at or above 5.x. [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/)

2)  If you don't have Node.js installed, or you have a lower version, go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

3)  Install `gulp` and `bower` globally.

```sh
npm install -g gulp bower
```

This lets you run `gulp` and `bower` from the command line.

4)  Install the starter kit's local `npm` and `bower` dependencies.

```sh
cd polymer-starter-kit-plus && npm install && bower install
```

This installs the element sets (Paper, Iron, Platinum) and tools the starter kit requires to build and serve apps.

If you get a browser console error indicating that an element you know you have installed is missing, try deleting the bower_components folder, then run `bower cache clean` followed by `bower install` to reinstall. This can be especially helpful when upgrading from a prior version of the Polymer Starter Kit Plus. 

If the issue is to do with a failure somewhere else, you might find that due to a network issue
a dependency failed to correctly install. We recommend running `npm cache clean` and deleting the `node_modules` directory followed by
`npm install` to see if this corrects the problem. If not, please check the [issue tracker](https://github.com/StartPolymer/polymer-starter-kit-plus/issues) in case
there is a workaround or fix already posted.

### 3. Development workflow

#### Check out the variables

- Gulp variables -  [config.js](https://github.com/StartPolymer/polymer-starter-kit-plus/blob/master/config.js)
- Theme variables -  [variables.css](https://github.com/StartPolymer/polymer-starter-kit-plus/blob/master/app/themes/default-theme/variables.css) and [variables.js](https://github.com/StartPolymer/polymer-starter-kit-plus/blob/master/app/themes/default-theme/variables.js)
- HTML metadata -  [metadata.js](https://github.com/StartPolymer/polymer-starter-kit-plus/blob/master/app/metadata.js)
