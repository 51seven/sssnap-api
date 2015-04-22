module.exports.read = function (req, res, next) {
  res.send('GET /users/' + res.params.user_id);
}

module.exports.update = function (req, res, next) {
  res.send('PUT /users/' + res.params.user_id);
}
