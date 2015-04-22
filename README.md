# sssnap API

REST JSON API for sssnap

## Installation

```bash
npm install
```

## Requirements

* MongoDB installed and running

## Fundament

After running `npm start` the server is accessible on `https://localhost:3000`.

The API is versioned to avoid problems with an updated API and a not-updated client. The version number is the first part of the URL path and takes the form X.Y, whereas the trailing zero is omitted.  
Examples: `https://localhost:3000/1/`, `https://localhost:3000/1.1/`

## Structure

- **server.js**  
Base setup of the application. Initialize the database, express and the server here.

- **config/**  
Configuration of modules and other key-value based configurations.

- **routes/**  
The versioned routes, which will redirect to the appropriate controller.

- **controllers/**  
Controllers – are connected with the routes.


## Models

To be always and everywhere up-to-date with the database schema, the models are a separate node module and can be found in [51seven/sssnap-models](https://github.com/51seven/sssnap-models). You can work with them like normal mongoose models.

```js

var User = require('sssnap-models').Users;

Users.findOne({ email: 'test@test.com '}, function (err, user) {
    ...
});
```

## Included Methods

There's a global Logging-Method accessible in all files. It's the [winston logger](https://preview.npmjs.com/package/winston) with a predefined console output.

- `Log.d()`  
  Log on debug level

- `Log.v()`  
  Log on verbose level

- `Log.i()`  
  Log on info level

- `Log.w()`  
  Log on warn level

- `Log.e()`  
  Log on error level


The Console output will log all levels with a timestamp and a color for each level.
