const express = require("express");
const router = express.Router();
const user = require('./Users.controller')

router.route('/add').post(user.addUser); 

router.route('/login').post(user.loginUser);

router.route('/delete').get(user.tokenVerify,user.deleteUser);

router.route('/edit').post(user.tokenVerify,user.edituser);

router.route('/userdetails').get(user.tokenVerify,user.userDetails);

module.exports = router;