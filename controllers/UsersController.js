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
    next(new Response.ok(user));
  })
  .catch(function (err) {
    next(new Response.error('NOT_FOUND', err));
  });
}

module.exports.update = function (req, res, next) {
  res.send('PUT /users/' + res.params.user_id);
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
