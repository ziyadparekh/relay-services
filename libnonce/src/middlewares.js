'use strict';

var CoreError = require('libutil').Errors;

var handleNonceHeaders = function (req, res, next) {

}

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

var allowMethodOverride = function(req, res, next) {
  if (req.method === 'POST' && req.body._method) {
    req.originalMethod = req.method;
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

var handleNonceErrors = function (err, req, res, next) {
  if (err instanceof CoreError) {
    var httpStatus;

    // TODO: fill out this mapping
    switch (err.code) {
    case CoreError.INTERNAL_SERVER_ERROR:
      httpStatus = 500;
      break;
    case CoreError.OBJECT_NOT_FOUND:
      httpStatus = 404;
      break;
    default:
      httpStatus = 400;
    }

    res.status(httpStatus);
    res.json({code: err.code, error: err.message});
  } else {
    console.log('Uncaught internal server error.', err, err.stack);
    res.status(500);
    res.json({code: CoreError.INTERNAL_SERVER_ERROR,
              message: 'Internal server error.'});
  }
};

function invalidRequest(req, res) {
  res.status(403);
  res.end('{"error":"unauthorized"}');
};

module.exports = {
  allowCrossDomain: allowCrossDomain,
  allowMethodOverride: allowMethodOverride,
  handleNonceErrors: handleNonceErrors
};