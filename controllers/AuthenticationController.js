module.exports.someMethod = function (req, res, next) {
  // Some Authentication going on...
  // Google and stuff, yeah?
  
  next();
}