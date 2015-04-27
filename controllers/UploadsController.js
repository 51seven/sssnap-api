var Uploads = require('sssnap-models').Uploads;
var Response = require('../helper/ResponseHelper');

module.exports.create = function (req, res, next) {
  return next(new Response.error('NOT_IMPLEMENTED', 'Stay tuned!'));
}

module.exports.read = function (req, res, next) {
  Uploads.read(req.params.hash)
  .then(function (upload) {
    req.response = new Response.ok(upload);
    return next();
  })
  .catch(Response.NOT_FOUND, function () {
    return next(new Response.error('NOT_FOUND', 'Upload not found.'));
  })
  .catch(function (err) {
    return next(new Response.error('INTERNAL_SERVER_ERROR', err));
  });
}

module.exports.list = function (req, res, next) {
  Uploads.list(req.user._id, req.query.limit, req.query.skip)
  .then(function (uploads) {
    req.response = new Response.ok(uploads);
    return next();
  })
  .catch(function (err) {
    return next(new Response.error('INTERNAL_SERVER_ERROR', err));
  });
}

module.exports.update = function (req, res, next) {
  return next(new Response.error('NOT_IMPLEMENTED', 'Stay tuned!'));
}

module.exports.delete = function (req, res, next) {
  return next(new Response.error('NOT_IMPLEMENTED', 'Stay tuned!'));
}


