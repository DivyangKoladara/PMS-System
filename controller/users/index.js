const express = require("express");
const router = express.Router();
const user = require('./Users.controller')
const upload = require('../../services/imageupload/multer')





router.route('/users/add').post(upload.single('image'),user.addUser); 

router.route('/users/login').post(user.loginUser);

router.route('/users/delete').post(user.tokenVerify,user.deleteUser);

router.route('/users/edit').put(upload.single('image'),user.tokenVerify,user.edituser);

router.route('/users/updateProfile').put(upload.single('image'),user.tokenVerify,user.updateUserProfile);


router.route('/auth/verify').get(user.tokenVerify,user.authUserDetails);

router.route('/userlist').get(user.tokenVerify,user.userDetails);

router.route('/users/forgotpassword').put(user.tokenVerify,user.changepassword);




module.exports = router;