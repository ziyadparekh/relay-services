// Express application adding the router to expose Core Services 
// Api routes.

var express = require('express');
var CoreService = require('libcore').CoreService;
var http = require('http');

if (!process.env.DATABASE_URI) {
  console.log("DATABASE_URI not specified, falling back to localhost");
}

var api = new CoreService({
  databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/dev',
  appId: 'myAppId',
  masterKey: 'myMasterKey'
});

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Core API on the /core URL prefix
var mounthPath = process.env.CORE_MOUNT || '/core';
app.use(mounthPath, api);

// Core services play nicely with the rest of the routes
// Incase we need them later on

var port = process.env.PORT || 3000;
var httpServer = http.createServer(app);
httpServer.listen(port, function () {
  console.log('core-service running on port ' + port + '.');
});