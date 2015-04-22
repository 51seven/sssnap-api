var express = require('express');

var UploadsController        = require('../controllers/UploadsController');
var AuthenticationController = require('../controllers/AuthenticationController');

var router = express.Router();

// ROUTE: /1/
// =========================================================

router.use(AuthenticationController.someMethod);

// Uploads
router.route('/uploads/:upload_id')
	.get(UploadsController.read)
	.put(UploadsController.update)
	.delete(UploadsController.delete);

router.route('/uploads/')
	.get(UploadsController.list)
	.post(UploadsController.create);


// Users
router.route('/users/:user_id')
	.get(UserController.read) // Get user information
	.put(UserController.update) // Update a user

router.route('/users/')
	.post(UserController.create) // Create a user


module.exports = router;
