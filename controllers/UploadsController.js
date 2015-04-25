var Uploads = require('sssnap-models').Uploads;



module.exports.create = function (req, res, next) {
  res.send('POST /uploads/');
}

module.exports.read = function (req, res, next) {
  Uploads.read(req.params.hash)
  .then(function (upload) {
    res.send(upload);
  })
  .catch(function (err) {
    res.send(err);
  });
}

module.exports.update = function (req, res, next) {
  res.send('PUT /uploads/' + res.params.upload_id);
}

module.exports.delete = function (req, res, next) {
  res.send('DELETE /uploads/' + res.params.upload_id);
}

module.exports.list = function (req, res, next) {
  Uploads.list(req.user._id)
  .then(function (uploads) {
    res.send(uploads);
  })
  .catch(function (err) {
    res.send(err);
  });
}
