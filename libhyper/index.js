'use strict';

var bodyParser = require('body-parser'),
  express = require('express'),
  middlewares = require('./src/middlewares'),
  PromiseRouter = require('libutil').PromiseRouter,
  Cache = require('libutil').Cache;

function HyperService(args) {

  var api = express();

  //var config = new Config(args);

  //Cache.setConfig(config);

  api.use(bodyParser.urlencoded({ extended: false }))
  api.use(bodyParser.json({ 'type': '*/*' }));
  api.use(middlewares.allowCrossDomain);
  api.use(middlewares.allowMethodOverride);

  var router = new PromiseRouter();
  router.merge(require('./src/Routes'));

  router.mountOnto(api);

  api.use(middlewares.handleErrors);

  return api;
}

module.exports = {
  HyperService: HyperService
};

