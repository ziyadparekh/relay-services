// Nonce Services - express compatible API router for Nonce Relay services
var bodyParser = require('body-parser'),
  express = require('express'),
  middlewares = require('./src/middlewares'),
  PromiseRouter = require('libutil').PromiseRouter,
  Cache = require('libutil').Cache,
  Config = require('./src/Config');

function NonceService(args) {

  var api = express();

  var config = new Config(args);

  Cache.setConfig(config);

  api.use(bodyParser.json({ 'type': '*/*' }));
  api.use(middlewares.allowCrossDomain);
  api.use(middlewares.allowMethodOverride);

  var router = new PromiseRouter();
  router.merge(require('./src/nonce-routes'));

  router.mountOnto(api);

  api.use(middlewares.handleNonceErrors);

  return api;
}

module.exports = {
  NonceService: NonceService
};
