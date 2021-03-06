/**
 * Authorization provider switch
 */
var mongoose  = require('mongoose');

var Users     = require('sssnap-models').Users;

var Response  = require('../helper/ResponseHelper');

//var env       = process.env.NODE_ENV || "development";

/**
 * Authenticates the user
 */
module.exports.authentication = function (req, res, next) {
  var provider = req.get('x-auth-provider') || req.query.provider;

  /* istanbul ignore else  */
  /*if(env === 'development' || env === 'test') {
    var testuser = new User({
      name: {
        first: "John",
        last: "Doe"
      },
      email: "johndoe@gmail.com",
      oauth: {
        google: 113540964082774764753
      },
    });

    Users.create(testuser)
    .then(function (user) {
      console.log("Creating test user");
      req.user = user;
      return next();
    })
    .catch(function (err) {
      if(err && err.code === 11000) {
        console.log("Testuser already exists. We dont need to create him.");
      }

      Users.findOne({ email: testuser.email }, function (err, user) {
        if(user) {
          console.log("Read Testuser ("+user._id+") from database.");
          req.user = user;
          return next();
        }
        else if(!err) {
          console.log("No user found or an error happened");
          return next();
        }
        else {
          console.log(err);
          return next();
        }
      });
    });
  }*/

  // I don't know how to test the authentication process
  //else {
  // Get your tokens: https://developers.google.com/oauthplayground

    switch(provider) {
      case 'google':
        return require('./auth/GoogleAuthController')(req, res, next);
        break;
      /*case: 'facebook':
        return next(new Response.error('AUTHENTICATION_PROVIDER_NOT_SUPPORTED_YET'));
        break;*/
      default:
        return next(new Response.error('NO_AUTHENTICATION_PROVIDER', 'You have to send the name of your provider in the HTTP header \'x-auth-provider\' or in the URL query as \'provider\'. Valid values are: google'));
    }

  //}

  //next();
}
