var Promise   = require('bluebird')

// Helper
var google    = require('../helper/GoogleAuthHelper');
var Response  = require('../helper/ResponseHelper');

// Models
var Users     = require('sssnap-models').Users;

// Other
var env       = process.env.NODE_ENV || "development";



module.exports.read = function (req, res, next) {
  Users.read(req.user._id)
  .then(function (user) {
    req.response = new Response.ok(user);
    return next();
  })
  .catch(Response.NOT_FOUND, function () {
    return next(new Response.error('NOT_FOUND', 'User not found.'));
  })
  .catch(function (err) {
    L.e(err);
    return next(new Response.error('INTERNAL_SERVER_ERROR', err));
  });
}

module.exports.update = function (req, res, next) {
  return next(new Response.error('NOT_IMPLEMENTED', 'Stay tuned!'));
}

/*
function getUser(user) {
  return new Promise(function(resolve, reject) {
    // istanbul ignore else
    if(env === 'devaelopment' || env === 'test') {
      resolve(user);
    }
    else {
      var tokenInfo = user.token_info;
      var access_token = user.access_token;

      google.callAPI('/plus/v1/people/' + tokenInfo.user_id, access_token)
      .then(function(userInfo) {
        if(userInfo.error) {
          console.log("callAPI google error");
          reject(status.Forbidden('Google API Error', userInfo.error.message));
        }

        // save image url
        var imageUrl = userInfo.image.url;
        imageUrl = imageUrl.substring(0, imageUrl.length - 6);

        resolve(new Users({
          imageUrl: imageUrl,
          email: tokenInfo.email,
          externalId: tokenInfo.user_id,
          //name: userInfo.displayName,
          provider: 'google'
        }));
      })
      .catch(function(err) {
        reject(err);
      });
    }
  });
}*/
