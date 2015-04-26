var Uploads = require('sssnap-models').Uploads;
var Response = require('../helper/ResponseHelper');

module.exports.create = function (req, res, next) {
  res.send('POST /uploads/');
}

module.exports.read = function (req, res, next) {
  Uploads.read(req.params.hash)
  .then(function (upload) {
    next(new Response.ok(upload));
  })
  .catch(function (err) {
    next(new Response.error('NOT_FOUND', err));
  });
}

module.exports.update = function (req, res, next) {
  res.send('PUT /uploads/' + res.params.upload_id);
}

module.exports.delete = function (req, res, next) {
  res.send('DELETE /uploads/' + res.params.upload_id);
}

module.exports.list = function (req, res, next) {
  Uploads.list(req.user._id, req.query.limit, req.query.skip)
  .then(function (uploads) {
    next(new Response.ok(uploads));
  })
  .catch(function (err) {
    next(new Response.error('NOT_FOUND', err));
  });
}
