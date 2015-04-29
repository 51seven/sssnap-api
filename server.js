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
var mongoose          = require('mongoose');
var Response          = require('./helper/ResponseHelper');

var env               = process.env.NODE_ENV || "development";
var secrets           = require('./config/secrets');

global.Log            = require('./config/logger');
global.__coreDir      = __dirname+"/";

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
app.use(multer({ dest: './incoming/' })); // Multipart uploads are moved in this directory
app.use(expressValidator());
app.use(methodOverride());


// ROUTES
// =========================================================

var api1 = require('./routes/v1');

app.use('/1', api1);


// ERROR HANDLING
// =========================================================
app.use(function (err, req, res, next) {
  if(err) {
    res.status(err.code);
    res.json(err);
  }
  else {
    next();
  }
});

app.use(function (req, res, next) {

  //if(req.response !== undefined) {
    if(typeof(req.response) === "object") {
      res.json(req.response);
    }
    else {
      res.send(req.response);
    }
  /*}
  else {
    res.status(404);
    res.json(new Response.error('NOT_FOUND', "'"+req.hostname+req.originalUrl + "' not found."));
  }*/
});


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
