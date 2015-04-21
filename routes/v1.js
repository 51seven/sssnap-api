var express = require('express');

var UploadsController        = require('../controllers/UploadsController');
var AuthenticationController = require('../controllers/AuthenticationController');

var router = express.Router();

// ROUTE: /1/
// =========================================================

router.use(AuthenticationController.someMethod);

router.route('/uploads/:upload_id')
.get(UploadsController.read)
.put(UploadsController.update)
.delete(UploadsController.delete);

router.route('/uploads/')
.get(UploadsController.list)
.post(UploadsController.create);


module.exports = router;