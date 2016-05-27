// A router that is based on promises rather than req/res/next.
// This is intended to replace the use of express.Router to handle
// subsections of the API surface.

function PromiseRouter () {
  // Each entry should be an object with:
  // path: the path to route, in express format
  // method: the HTTP method that this route handles.
  //  Must be one of: POST, GET, PUT, DELETE
  // handler: a function that takes request, and returns a promise.
  //  Successful handlers should resolve to an object with fields:
  //    status: optional. the http status code. defaults to 200
  //    response: a json object with the content of the response
  //    location: optional. a location header
  this.routes = [];
}

PromiseRouter.verbose = process.env.VERBOSE || false;

// Merge the routes into this one
PromiseRouter.prototype.merge = function(router) {
  for (var route of router.routes) {
    this.routes.push(route);
  }
};

PromiseRouter.prototype.route = function(method, path, handler) {
  switch(method) {
    case 'POST':
    case 'GET':
    case 'PUT':
    case 'DELETE':
      break;
    default:
      throw 'cannot route method: ' + method;
  }

  this.routes.push({
    path: path,
    method: method,
    handler: handler
  });
};

// A helper function to make an express handler out of a promise
// handler.
// Express handlers should never throw; if a promise handler throws we
// just treat it like it resolved to an error.
function makeExpressHandler (promiseHandler) {
  return function (req, res, next) {
    try {
      if (PromiseRouter.verbose) {
        console.log(req.method, req.originalUrl, req.headers,
                    JSON.stringify(req.body, null, 2));
      }
      promiseHandler(req).then((result) => {
        if (!result.response) {
          console.log('BUG: the handler did not include a "response" field');
          throw 'control should not get here';
        }
        if (PromiseRouter.verbose) {
          console.log('response: ', JSON.stringify(result.response, null, 2));
        }
        var status = result.status || 200;
        res.status(status);
        if (result.location) {
          res.set('Location', result.location);
        }
        res.json(result.response);
      }, (e) => {
        if (PromiseRouter.verbose) {
          console.log('error: ', e);
        }
        next(e);
      });
    } catch (e) {
      if (PromiseRouter.verbose) {
        console.log('error: ', e);
      }
      next(e);
    }
  }
}

PromiseRouter.prototype.mountOnto = function(expressApp) {
  for (var route of this.routes) {
    switch(route.method) {
      case 'POST':
        expressApp.post(route.path, makeExpressHandler(route.handler));
        break;
      case 'GET':
        expressApp.get(route.path, makeExpressHandler(route.handler));
        break;
      case 'PUT':
        expressApp.put(route.path, makeExpressHandler(route.handler));
        break;
      case 'DELETE':
        expressApp.delete(route.path, makeExpressHandler(route.handler));
        break;
      default:
        throw 'unexpected code branch';
    }
  }
};

module.exports = PromiseRouter;
