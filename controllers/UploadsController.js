// Includes
var Uploads   = require('sssnap-models').Uploads;
var Users   = require('sssnap-models').Users;
var Promise   = require('bluebird');
var fs        = require('fs');
var uuid      = require('uuid');
var file_move = require('mv');
var mongoose  = require('mongoose');

// Helper
var Response  = require('../helper/ResponseHelper');

// Constants
var UPLOAD_DESTINATION  = __coreDir+"uploads/";
var INCOMING_DIR        = __coreDir+"incoming/";

module.exports.create = function (req, res, next) {

  // Check if only one field with file is given
  var file_uploads_keys = [];

  // Getting all req.files keys
  for(var key in req.files) {
    file_uploads_keys.push(key);
  }

  // determinates if we got a valid form-data request
  // just ONE field named "file" and no other fields
  if(file_uploads_keys.length !== 1 || !req.files.file) {

    // deleting all files in the incoming dir
    file_uploads_keys.forEach(function (file_key) {
      fs.unlink(__coreDir+req.files[file_key].path, function (err) {
        if(err) {
          Log.e(err);
        }
      });
    });

    return next(new Response.error('NOT_ACCEPTABLE', 'Use only \'file\' as the key in your multipart/form-data request.'));
  }

  // we can assume, that we have only 1 file named 'file' as req.files.file
  var file = req.files.file;

  // Bad Request when wrong mimetype was uploaded and delete the file
  if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
    fs.unlink(__coreDir+file.path, function (err) {
      if(err) {
        Log.e(err);
      }
    });

    return next(new Response.error('UNSUPPORTED_MEDIA_TYPE', 'Invalid mimetype - Only image/png and image/jpeg are allowed.'));
  }

  Users.findOne({ _id: req.user._id }, function (err, user) {
    if(!user) {
      Log.e("Creat", err);
      return next(new Response.error('BAD_REQUEST', 'Something went wrong - Try to renew your Session.'));
    }
    else {
      // Check if the user has neough space left
      if((user.quota.used + file.size) > user.quota.total) {
        return next(new Response.error('FORBIDDEN', 'Plan limit reached - Not enough space left to upload this file.'));
      }

      var new_filename = uuid.v4();

      Uploads.findOne({ filename: new_filename }, function (err, result) {
        if(result || err) {
          console.w('🙀 UUID DUPLICATE FOUND: '+new_filename);
          return next(new Response.error('INTERNAL_SERVER_ERROR', 'Something went wrong.'));
        }
        else {
          // Splitting the filename (uuid) into folder sections.
          // We want a no performance lag and clear vision to the root folders so we seperate the first 2 digits 2 times.
          // Described as follows:
          // -- 74738ff5-5367-5958-9aee-98fffdcd1876
          // --         splitting...
          // -- [74] [73] 8ff5-5367-5958-9aee-98fffdcd1876
          // --         turns into
          // -- ./74/73/8ff5-5367-5958-9aee-98fffdcd1876

          var firstfolder   = new_filename.substring(0, 2)+"/";
          var secondfolder  = new_filename.substring(2, 4)+"/";

          console.log(UPLOAD_DESTINATION);

          var new_dir = UPLOAD_DESTINATION+firstfolder+secondfolder;

          new_filename += "."+file.extension;

          // Create upload Object
          var upload = new Uploads({
            _user: user._id,
            title: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            filename: new_filename,
            destination: new_dir,
            decryptionkey: uuid.v4()
          });

          var file_move_promise = Promise.promisify(require('mv'));

          file_move_promise(__coreDir+file.path, new_dir+new_filename, {mkdirp: true})
          .then(function () {
            // Saving the upload
            Uploads.create(upload)
            .then(function (upload) {
              // Appending the upload to the user.uploads array
              user.uploads.push(upload);
              user.quota.used += upload.size;
              user.save();

              req.response = new Response.ok(upload);
              return next();
            })
            .catch(function (err) {
              Log.e(err);
              return next(new Response.error('INTERNAL_SERVER_ERROR', err));
            });
          })
          .catch(function (err) {
            // remove the file from 'incoming' dir if an error occured
            fs.unlink(__coreDir+file.path, function (err) {
              if(err) {
                Log.e(err);
              }
            });

            return next(new Response.error('INTERNAL_SERVER_ERROR', err));
          });
        }
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


