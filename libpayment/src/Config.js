'use strict';
// A Config object provides information about how a specific app is configured.
// mount is the URL for the root of the API; includes http, domain, etc.

function Config(args) {
  let DatabaseAdapter = require('./DatabaseAdapter');
  // Set payment specific configuration
  // properties here.
  this.encrypt = args.encrypt;
  this.core = args.core;
  this.secret = args.secret;
  this.database = DatabaseAdapter.getDatabaseConnection();
  

}

module.exports = Config;