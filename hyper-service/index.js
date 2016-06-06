'use strict';

// Express application adding the router to expose Payment Services 
// Api routes.
var HyperService = require('libhyper').HyperService;
var express = require('express');
var http = require('http');

var api = new HyperService({
  // TODO: Replace these options with pubkey path, privkey path etc
  // encrypt: config.encrypt,
  // core: config.core,
  // secret: config.secret
});

var app = express();

// Serve the Nonce API on the /api URL prefix
var mounthPath = process.env.HYPER_MOUNT || '/api';
app.use(mounthPath, api);

app.get('/status', function (req, res) {
  res.json({status: 'good'});
});

var port = process.env.PORT || 3030;
var httpServer = http.createServer(app);
httpServer.listen(port, function () {
  console.log('hyper-service running on port ' + port + '.');
});
