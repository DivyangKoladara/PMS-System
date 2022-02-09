const express = require("express");
const router = express.Router();
const user = require('./CreateProject.controller')

const image = require('../../services/CloudnaryImageServices')

// image
const imageindex = require('../../services/imageupload/index')

const upload = require('../../services/imageupload/multer')




router.route('/createproject').post(upload.single('image'),user.createProject);

router.route('/deleteproject').post(user.deleteProject);

router.route('/editproject').put(user.editproject);

router.route('/assignproject').post(user.assignProject);

router.route('/projectassigndetails').get(user.projectAssignDetails);

router.route('/projectlist').get(user.projectList)



//image delete
router.route('/imagedelete').get(imageindex.imagedelete);

//image upload
router.route('/imageupload').post(upload.single('image'),imageindex.imageupload);


module.exports =router;   