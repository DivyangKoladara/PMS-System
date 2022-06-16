const express = require('express');
const router = express.Router();
const authontication = require('../users/Users.controller')
const Leave = require('./leave.controller')

router.route('/createleave').post(authontication.tokenVerify,Leave.createLeave);

router.route('/listofleave').get(authontication.tokenVerify,Leave.listOfLeave);

router.route('/updateleave').post(authontication.tokenVerify,Leave.updateLeave);

router.route('/deleteleave').post(authontication.tokenVerify,Leave.deleteLeave);


module.exports = router