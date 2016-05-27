// A Config object provides information about how a specific app is configured.
// mount is the URL for the root of the API; includes http, domain, etc.

function Config(args) {
  
  this.nonceSecret = args.nonceSecret;
  this.nonceDuration = args.nonceDuration;
  this.dbConfig = args.dbConfig;
  this.encrypt = args.encrypt;
  this.core = args.core;

}

module.exports = Config;