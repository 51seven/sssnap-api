var express = require('express');

var AuthenticationController = require('../controllers/AuthenticationController');
var UploadsController        = require('../controllers/UploadsController');
var UsersController          = require('../controllers/UsersController');

var router = express.Router();


// ROUTE: /1/
// =========================================================
router.use(AuthenticationController.authentication);

// Uploads
router.route('/uploads/:hash')
	.get(UploadsController.read)
	.put(UploadsController.update)
	.delete(UploadsController.delete);

router.route('/uploads/')
	.get(UploadsController.list)
	.post(UploadsController.create);


// Users
// We recieve the current user from the Provider's AccessToken
router.route('/users/')
  .put(UsersController.update); // Update a user

router.route('/users/me')
  .get(UsersController.read); // Get user information

module.exports = router;
