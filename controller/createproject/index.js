const express = require("express");
const router = express.Router();
const user = require('./CreateProject.controller')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'./upload');
    },
    filename:function(req,file,cb){
        cb(null, file.originalname)
    }
})



const upload = multer({storage:storage}).single('projectImage')


router.route('/createproject').post(upload,user.createProject);

router.route('/deleteproject').post(user.deleteProject);

router.route('/editproject').put(user.editproject);

router.route('/assignproject').post(user.assignProject);

router.route('/projectassigndetails').get(user.projectAssignDetails);

module.exports =router;   