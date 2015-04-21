// BASE API SERVER SETUP
// =========================================================

var https = require('https');
var fs    = require('fs');

var express           = require('express');
var bodyParser        = require('body-parser');
var multer            = require('multer');
var methodOverride    = require('method-override');
var morgan            = require('morgan');
var expressValidator  = require('express-validator');
var errorhandler      = require('errorhandler');
var mongoose          = require('mongoose');

var env       = process.env.NODE_ENV || "development";
var secrets   = require('./config/secrets');

global.Log    = require('./config/logger');


// DATABASE CONNECTION
// =========================================================

mongoose.connect(secrets[env].mongodb);

var connected = false;
mongoose.connection
  .on('connected', function () {
    connected = true;
    Log.i('MongoDB connection open to', secrets[env].mongodb);
  })
  .on('error', function (err) {
    Log.e('MongoDB connection error: ', err);
  })
  .on('disconnected', function () {
    if (connected) {
      Log.w('MongoDB connection disconnected');
      connected = false;
    }
  });

function gracefullyExit() {
  mongoose.connection.close(function () {
    Log.i('MongoDB connection closed due to app termination');
    process.exit(0);
  });
}

// TODO: Initialize Models


// EXPRESS SETUP
// =========================================================

var app = express();

app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');

if (env !== 'test')
  app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './incoming/' }));
app.use(expressValidator());
app.use(methodOverride());


// ROUTES
// =========================================================

var api1 = require('./routes/v1');

app.use('/1', api1);


// ERROR HANDLING
// =========================================================

if ('development' === env)
  app.use(errorhandler());


// WEBSERVER
// =========================================================

var options = {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.cert')
};

var server = https.createServer(options, app);
server.listen(app.get('port'), function () {
  Log.i('Server running on port ' + app.get('port'));
});