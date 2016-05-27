# Frontend boilerplate

### Installation

Install the javascript task runner globally

```npm install -g gulp```

Clone the repository into a new directory called hack and install some packages.

```
git clone https://github.com/peanutlabs/es6-babel-webpack-react-boilerplate frontend-starter
cd frontend-starter
npm install
```
### Directory structure
```sh
app/ #server side code (node.js express stuff)
public/ #public directory for transpiled and static stuff (prod js files, prod css files)
views/ #HTML that is generated server side when the page is loaded
node_modules #3rd party libraries
Gulpfile.js #Configuration for the task runner
webpack.config.js #Base configuration file for Webpack module loader
prod.config.js #Webpack configuration for production
dev.config.js #Webpack configuration for development
index.js #spins up a basic express server
package.json #list of all dependecies and meta-data
README.md #README.md
```
### Features
* React
* Babel for es6 es7 javascript development
* Express (Node.js server)
* Webpack for bundling
* Webpack Dev Server
* Webpack Hot Module Middleware for awesome HMR (hot module replacement)
* ESLint
* Sass loader for styling
* npm-shrinkwrap for dependency management

### Getting it working
* Type `npm run start-server` and press enter. This starts an express server listening at `http://localhost:3030`. So you can copy that and paste it in your browser.
 
* In another terminal window in the same directory, type `npm run start-dev` and press enter. This does a few things:
	* It takes every `.js` file located in `src/js/entries` and every `.scss` file inside `src/scss/entries`, compiles them and then dumps the minified versions inside of their respective compiled directories `public/compiled/js` and `public/compiled/css` (along with sourcemaps)
	* It starts a development (webpack-dev-server)
* To Be Continued...
