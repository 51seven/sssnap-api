/**
 * Google Authentication Controller
 */
var _ = require('lodash')
var Promise = require('bluebird');
var mongoose = require('mongoose');

// Helper
var google = require('../../helper/GoogleAuthHelper');

var User = mongoose.model('User');


module.exports = function(req, res, next) {
  var access_token;
  var tokenInfo;
  var scopes;
  var headerAuth = req.get('Authorization');

  // Get access token from HTTP Header or from URL parameter
  if(headerAuth) {
    access_token = headerAuth.substring(7);
  }
  else {
    access_token = req.param('access_token');
  }

  if (access_token === undefined) {
    throw new status.Forbidden('Access token not found - You have to send an access token from a supported provider in the HTTP Authorization Header or in the URL.');
  }

  google.callAPI('/oauth2/v1/tokeninfo?access_token=' + access_token, access_token)
  .then(function (token) {

    tokenInfo = token;
    scopes = tokenInfo.scope.split(' ');

    // Restrict clients
    if(tokenInfo.audience ==! '407408718192.apps.googleusercontent.com' || tokenInfo.audience ==! '947766948-22hqf8ngu94rmepn5m0ucp5a6mo4jsak.apps.googleusercontent.com') {
      throw new status.Forbidden('Client not authorized', 'The client you use is not authorized to access the API. You have to use an authorized client.');
    }

    // Check correct scopes
    if(scopes.indexOf('https://www.googleapis.com/auth/plus.me') === -1 || scopes.indexOf('https://www.googleapis.com/auth/userinfo.email') === -1) {
      throw new status.Forbidden('Access token with wrong scopes', 'userinfo.email and plus.me scope is required when using Google as OAuth2.0 provider.');
    }

    // Search the user related to the AccessToken in the database
    return User.findOne({ oauth: { google: tokenInfo.user_id } });
  })
  .then(function (user) {

    // Saving the user in the current request
    if(user) {
      req.user = user;
    }
    else {
      throw new status.Forbidden('User not found', 'Authorization was successful but the user isnt registered yet.');
    }

    req.user.token_info = tokenInfo;
    req.user.access_token = access_token;

    // if no user is found and won't be created as next step,
    // no further action can be performed
    /*if(req.originalUrl !== '/api/user/me' && req.user === undefined) {
      //throw new status.Forbidden('User not in database', 'Authorization was successful but the user is not yet in the database. Call /api/user to authenticate the user and register him.');
      throw 'User not in database - Authorization was successful but the user is not yet in the database. Call /api/user to authenticate the user and register him.';
    }*/

    return next();
  })
  .catch(function(err) {
    return next(err);
  });
}
