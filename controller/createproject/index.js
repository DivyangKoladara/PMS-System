const express = require("express");
const router = express.Router();
const user = require('./CreateProject.controller')


router.route('/createproject').post(user.createProject);

router.route('/deleteproject').post(user.deleteProject);

router.route('/editproject').post(user.editproject);

router.route('/assignproject').post(user.assignProject);

router.route('/projectassigndetails').get(user.projectAssignDetails);

module.exports =router;