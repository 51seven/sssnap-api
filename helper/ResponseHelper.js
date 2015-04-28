var _ = require('lodash');

// Error Codes
var codes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INVALID_ACCESS_TOKEN: 401,
  NO_AUTHENTICATION_PROVIDER: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  UNSUPPORTED_MEDIA_TYPE: 415,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501
}

// Exposed Module
var ResponseHelper = {
  ok: SuccessResponse,
  error: FailureResponse
}

// ResponseHelper.ok()
function SuccessResponse(payload) {
  this.status = "ok";
  this.payload = payload || [];
}

// ResponseHelper.error()
function FailureResponse(error, message) {

  if(error === undefined) {
    error = 500
  }
  if(message === undefined) {
    message = '';
  }

  this.name = error;

  this.status = "error";
  this.error = error;
  this.message = message;
  this.code = codes[error] || 500;
}

FailureResponse.prototype = Object.create(Error.prototype);
FailureResponse.prototype.constructor = FailureResponse;

FailureResponse.prototype.toJSON = function () {
  return {
    status: this.status,
    error: this.error,
    message: this.message
  }
}

// Generated and appended check functions
_.forEach(codes, function (code, name) {
  ResponseHelper[name] = function (e) {
    return (e.name === name) || (e === name);
  }
});

module.exports = ResponseHelper;
