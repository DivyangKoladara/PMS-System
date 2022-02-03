const express = require("express");
const router = express.Router();
const user = require('./Users.controller')

router.route('/users/add').post(user.addUser); 

router.route('/users/login').post(user.loginUser);

router.route('/users/delete').get(user.tokenVerify,user.deleteUser);

router.route('/users/edit').put(user.tokenVerify,user.edituser);

router.route('/auth/verify').get(user.tokenVerify,user.userDetails);

router.route('/userlist').get(user.userDetails);

router.route('/users/forgotpassword').put(user.tokenVerify,user.changepassword);

module.exports = router;