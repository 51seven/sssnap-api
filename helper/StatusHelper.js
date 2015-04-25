/**
 * Error with statuscode helper
 */


/**
 * Forbidden Error
 * @param {Integer} code Internal Error Code
 * @param {String} message Message to pass to error
 * @param {String} info More infos for that error
 * @return {Error}  Error Object with status 403
 */
exports.Forbidden = function(message, info) {
  var err = new Error(message);
  err.status = 403;
  err.info = info;
  return err;
}

/**
 * Bad Request Error
 * @param {Integer} code Internal Error Code
 * @param {String} message Message to pass to error
 * @param {String} info More infos for that error
 * @return {Error}  Error Object with status 400
 */
exports.BadRequest = function(message, info) {
  var err = new Error(message);
  err.status = 400;
  err.info = info;
  return err;
}
