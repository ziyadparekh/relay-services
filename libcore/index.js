// Core Services - express compatible API router for Core Relay services
var bodyParser = require('body-parser'),
  cache = require('./cache'),
  express = require('express'),
  middlewares = require('./middlewares'),
  multer = require('multer'),
  PromiseRouter = require('./PromiseRouter'),
  request = require('request');

function CoreService(args) {
  if (!args.appId || !args.masterKey) {
    throw 'You must provide an appId and masterKey!';
  }

  if (args.databaseAdapter) {
    // Create database adapter
  }
  if (args.databaseURI) {
    // Set database URI on adapter
  }

  cache.apps[args.appId] = {
    masterKey: args.masterKey,
    collectionPrefix: args.collectionPrefix || '',
    clientKey: args.clientKey || '',
    restAPIKey: args.restAPIKey || '',
    fileKey: args.fileKey || 'invalid-file-key'
  };

  var api = express();

  // File handling needs to be before default middlewares are applied
  // TODO:: implement file router
  // api.use('/', require('./files').router);

  api.use(bodyParser.json({ 'type': '*/*' }));
  api.use(middlewares.allowCrossDomain);
  api.use(middlewares.allowMethodOverride);
  api.use(middlewares.handleCoreHeaders);

  var router = new PromiseRouter();

  router.merge(require('./classes'));

  router.mountOnto(api);

  api.use(middlewares.handleCoreErrors);

  return api;

};

module.exports = {
  CoreService: CoreService
};