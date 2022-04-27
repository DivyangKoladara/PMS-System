const express = require("express");
const router = express.Router();
const user = require('./CreateProject.controller')

// image
const imageindex = require('../../services/imageupload/index')

const upload = require('../../services/imageupload/multer')

const authontication = require('../users/Users.controller')



router.route('/createproject').post(upload.single('image'),authontication.tokenVerify,user.createProject);

router.route('/deleteproject').post(authontication.tokenVerify,user.deleteProject);

router.route('/editproject').put(upload.single('image'),authontication.tokenVerify,user.editproject);

router.route('/assignproject').post(authontication.tokenVerify,user.assignProject);

router.route('/projectassigndetails').get(authontication.tokenVerify,user.projectAssignDetails);

router.route('/projectlist').get(authontication.tokenVerify,user.projectList)



//image delete
// router.route('/imagedelete').get(imageindex.imagedelete);

//image upload
// router.route('/imageupload').post(upload.single('image'),imageindex.imageupload);


module.exports =router;   