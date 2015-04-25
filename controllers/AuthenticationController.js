/**
 * Authorization provider switch
 */
var mongoose  = require('mongoose');
var status    = require('../helper/StatusHelper');

var User      = mongoose.model('User');

var env       = process.env.NODE_ENV || "development";
env = "live";

/**
 * Authenticates the user
 */
module.exports.authentication = function (req, res, next) {
  var provider = req.get('x-auth-provider') || req.query.provider;

  /* istanbul ignore else  */
  if(env === 'development' || env === 'test') {
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

    User.create(testuser)
    .then(function (user) {
      console.log("Creating test user");
      req.user = user;
      return next();
    })
    .catch(function (err) {
      if(err && err.code === 11000) {
        console.log("Testuser already exists. We dont need to create him.");
      }

      User.findOne({ email: testuser.email }, function (err, user) {
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
  }

  // I don't know how to test the authentication process
  else {

    switch(provider) {
      case 'google':
        return require('./auth/GoogleAuthController')(req, res, next);
        break;
      default:
        return next(status.Forbidden('No authentication provider', 'You have to send the name of your provider in the HTTP header \'x-auth-provider\' or in the URL query as \'provider\'. Valid values are: google'));
    }

  }

  //next();
}
