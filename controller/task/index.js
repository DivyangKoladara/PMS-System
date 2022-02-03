const express = require('express')
const router = express.Router();
const user = require('./TaskReport.controller')
const authontication = require('../users/Users.controller')


router.route('/add').post(authontication.tokenVerify,user.addtaskreport)

router.route('/delete').post(authontication.tokenVerify,user.deletetaskreport)

router.route('/edit').post(authontication.tokenVerify,user.edittaskreport)

router.route('/filterdata').post(user.filterdata);

module.exports = router;