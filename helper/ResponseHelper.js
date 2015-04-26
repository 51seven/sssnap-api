exports.ok = function(payload) {
  var response = {
    status: "ok",
    payload: payload
  }

  return response;
}

var codes = {
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INVALID_ACCESS_TOKEN: 401,
  NO_AUTHENTICATION_PROVIDER: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  UNSUPPORTED_MEDIA_TYPE: 415,
  INTERNAL_ERROR: 500
}

exports.error = function(error, message) {

  var response = {
    status: "error",
    error: error,
    error_message: message
  }

  if(codes[error] !== undefined) {
    response.code = codes[error];
  }
  else {
    response.code = 400;
  }

  return response;
}
