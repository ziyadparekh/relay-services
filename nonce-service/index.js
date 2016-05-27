'use strict';

// Express application adding the router to expose Nonce Services 
// Api routes.
var express = require('express');
var NonceService = require('libnonce').NonceService;
var https = require('https');
var config = require("./config/config");
var credentials = config.ssl;

var api = new NonceService({
  // TODO: Replace these options with pubkey path, privkey path etc
  nonceSecret: config.nonceSecret,
  nonceDuration: config.nonceDuration,
  dbConfig: config.db,
  encrypt: config.encrypt,
  core: config.core,
});

var app = express();

// Serve the Nonce API on the /api URL prefix
var mounthPath = process.env.NONCE_MOUNT || '/api';
app.use(mounthPath, api);

// Nonce services play nicely with the rest of the routes
// Incase we need them later on

var port = process.env.PORT || config.httpsPort;
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, function () {
  console.log('nonce-service running on port ' + port + '.');
});
