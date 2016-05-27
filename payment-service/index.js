'use strict';

// Express application adding the router to expose Payment Services 
// Api routes.
var express = require('express');
var PaymentService = require('libpayment').PaymentService;
var https = require('https');
var config = require("./config/config");
var credentials = config.ssl;

var api = new PaymentService({
  // TODO: Replace these options with pubkey path, privkey path etc
  encrypt: config.encrypt,
  core: config.core,
  secret: config.secret
});

var app = express();

// Serve the Nonce API on the /api URL prefix
var mounthPath = process.env.PAYMENT_MOUNT || '/api';
app.use(mounthPath, api);

// Payment services play nicely with the rest of the routes
// Incase we need them later on
app.get('/status', function (req, res) {
  res.json({status: 'good'});
});

var port = process.env.PORT || config.httpsPort;
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, function () {
  console.log('payment-service running on port ' + port + '.');
});
