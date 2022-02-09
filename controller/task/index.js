const express = require('express')
const router = express.Router();
const user = require('./TaskReport.controller')
const authontication = require('../users/Users.controller')


router.route('/add').post(authontication.tokenVerify,user.addtaskreport)

router.route('/delete').post(authontication.tokenVerify,user.deletetaskreport)

router.route('/edit').put(authontication.tokenVerify,user.edittaskreport)

router.route('/filterdata').post(user.filterdata);

router.route('/taskwithprojectdetails').get(user.taskWithProjectDetails)

module.exports = router;