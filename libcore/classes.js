// These methods handle the 'classes' routes.
// Methods of the form 'handleX' return promises and are intended to
// be used with the PromiseRouter.

var CoreError = require('./errors'),
    rest = require('./rest'),
    PromiseRouter = require('./PromiseRouter');

var router = new PromiseRouter();

function handleFind(req) {
  console.log('headers: ', req.headers);
  console.log('params: ', req.params);

  return Promise.resolve().then(() => {
    return {response: {}};
  });
};

// Returns a promise for a {status, response, location} object.
function handleCreate(req) {
  return rest.create(req.config, req.auth,
                      req.params.className, req.body);
};

function handleGet(req) {

};

function handleDelete(req) {

};

function handleUpdate(req) {

};

router.route('GET', '/classes/:className', handleFind);
router.route('POST', '/classes/:className', handleCreate);
router.route('GET', '/classes/:className/:objectId', handleGet);
router.route('DELETE', '/classes/:className/:objectId', handleDelete);
router.route('PUT', '/classes/:className/:objectId', handleUpdate);

module.exports = router;