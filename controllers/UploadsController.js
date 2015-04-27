var Uploads   = require('sssnap-models').Uploads;
var Response  = require('../helper/ResponseHelper');

var fs        = require('fs');
var uuid      = require('uuid');

var UPLOAD_DESTINATION = __dirname;

module.exports.create = function (req, res, next) {

  var file = req.files.file;

  console.log(__dirname);

  // Check if a file is given
  if(!file) {
    return next(new Response.error('BAD_REQUEST', 'Use \'file\' as the key in your multipart/form-data request.'));
  }

  // Bad Request when wrong mimetype was uploaded
  if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
    return next(new Response.error('BAD_REQUEST', 'Invalid mimetype - Only image/png and image/jpeg are allowed.'));
  }

  var uuid_filename = uuid.v4();

  Uploads.findOne({ filename: uuid_filename }, function (err, result) {
    if(result || err) {
      console.log('🙀 UUID DUPLICATE FOUND: '+uuid_filename);
      return next(new Response.error('INTERNAL_SERVER_ERROR', 'Something went wrong.'));
    }
    else {
      // Splitting the filename (uuid) into folder sections.
      // We want a clear vision to the root folders so we seperate the first 2 digits 2 times.
      // Described as follows:
      // -- 74738ff5-5367-5958-9aee-98fffdcd1876
      // --         splitting...
      // -- [74] [73] 8ff5-5367-5958-9aee-98fffdcd1876
      // --         turns into
      // -- ./74/73/8ff5-5367-5958-9aee-98fffdcd1876

      var firstfolder   = uuid_filename.substring(0, 2);
      var secondfolder  = uuid_filename.substring(2, 4);

      var path = firstfolder+"/"+secondfolder+"/";
      uuid_filename += "."+file.extension;

      // Create upload Object
      var upload = new Uploads({
        _user: req.user._id,
        title: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        filename: uuid_filename,
        destination: path,
        decryptionkey: uuid.v4()
      });

      // Creating directory if it doesnt already exists
      //fs.mkdirSync(firstfolder);

      // do the image stuff

      Uploads.create(upload)
      .then(function (upload) {
        req.response = new Response.ok(upload);
        return next();
      })
      .catch(function (err) {
        return next(new Response.error('INTERNAL_SERVER_ERROR', err));
      });
    }
  });
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


