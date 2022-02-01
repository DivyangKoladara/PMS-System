const Mongoose  = require("mongoose");
const Validator = require("validatorjs");
const Project = require("../../models/CreateProject.model");
const { fail, httpCode, success } = require("../../services/helper");
const UserSchemam = require('../../models/Users.model')


exports.createProject = async (req,res)=>{
    try{
        let data = req.body;
        let rules= {
            name:"required",
            icon:"required",
            status:"required|boolean"
        }
        let validation = new Validator(data,rules)
        if(validation.fails()){
            return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
        }
        const createProject =  new Project({
            name:req.body.name,
            icon:req.body.icon,
            status:req.body.status,
        })
        await createProject.save();
        return success(res,{"message":"Project created successfully..."})
    } catch (error) {
        return fail(res,{"message":[error.massage]},httpCode.BAD_REQUEST)
    }
}

exports.deleteProject = async(req,res)=>{
    try {
        if(!req.body.projectId){
            return fail(res,{message:["Id not found..."]},httpCode.BAD_REQUEST)
        }
        const projectId = Mongoose.Types.ObjectId(req.body.projectId);
        const deleteproject = await Project.findByIdAndRemove({_id:projectId})
        if(!deleteproject){
            return fail(res,{message:["Project not found..."]})
        }
        return success(res,{"message":"Project deleted successfully..."})

    } catch (error) {
        return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }
}

exports.editproject = async(req,res)=>{
    try {
        const data = req.body;   
        let rules={}
        let update={}
        if(!data.projectId){
            return fail(res,"ProjectId not found...",httpCode.NOT_FOUND)
        }
        if(data.name){
            update["name"]=data.name
            rules["name"]="required"
        }
        if(data.icon){
            update["icon"]=data.icon
            rules["icon"]="required"
        }
        if(data.status){
            update['status']=data.status
            rules['status']='required|boolean'
        }
        const validation = new Validator(data,rules)
        if(validation.fails()){
            return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
        }
        const findproject = await Project.findById({_id:data.projectId})
        if(!findproject){
            return fail(res,{message:["Project not found..."]},httpCode.BAD_REQUEST)
        }
        const editProject = await Project.findByIdAndUpdate(data.projectId,update)
        return success(res,{message:"Data Upadated successfully..."})
    } catch (error) {   
        return fail(res,{message:[error.massage]},httpCode.BAD_REQUEST)
    }
}



exports.assignProject=async(req,res)=>{
    let data = req.body;
    try {
        const projectId = Mongoose.Types.ObjectId(data.projectId);
        const userId = Mongoose.Types.ObjectId(data.userId);
        const findProject = await Project.findById({_id:projectId})
        if(!findProject){
        return fail(res,"Project Not Found...",httpCode.BAD_REQUEST)
        }
        const findUser = await UserSchemam.findById({_id:userId})
        if(!findUser){
        return fail(res,{message:["User not found..."]},httpCode.BAD_REQUEST)
        }
        if(data.user === 'add'){
        const addelement = await Project.findByIdAndUpdate({_id:projectId},{$push:{
        assignUsers:[{userId:userId}]
        }})
        return success(res,{message:"user assign successfully..."})
        }
          
        // const removeuser = await Project.findById(_id)
        // let arr = removeuser.assignUsers
        // const removeelement =  arr.filter(i=>i._id != data.userId);
        // if(!removeelement){
        //     return fail(res,{message:["User not login..."]},httpCode.NOT_FOUND)
        // }
        // const deleteddata1 = await Project.findByIdAndUpdate(_id,{assignUsers:removeelement})

        if(data.user === 'remove'){
        const deleteuser = await Project.updateOne(
            { _id: projectId },
            {
              $pull: { assignUsers:{userId} }
            }
          );
        return success(res,{message:"retain user successsfull..."})
    }
    } catch (error) {
        return fail(res,{message:[error.massage]},httpCode.BAD_REQUEST)   
    }
}


exports.projectAssignDetails=async(req,res)=>{

    try {
    //unwind data 

    let userAggree  = await  Project.aggregate([
        // {
        //     $match:{_id:projectid}
        // },
        // arry divided into only one object arry 
        { 
            $unwind: '$assignUsers'
        },

        // find the in Projecct Schema by using userid and join table by using foreign key relationship 
        {   
            $lookup:
            {
                from: "users",
                localField: "assignUsers.userId",
                foreignField: "_id",
                as: "UserDetails",
            }
        },
        // connvert array object to simple object 
        {
            $unwind: '$UserDetails'
        },
        // // grouping to same data using push opration
        {
            $group:{
                _id:"$_id",
                root:{ $mergeObjects: '$$ROOT' },
                UserDetails: {$push:"$UserDetails" } 
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ['$root', '$$ROOT']
                }
            }
        },
        {
            $project:{
               "root":0,
               "assignUsers":0,
               "UserDetails.password":0,
               "UserDetails.dob":0,
               "UserDetails.doj":0,
               "UserDetails.role":0,
               "UserDetails.status":0,
            }
        }
        ])
        if(userAggree.length <= 0 ){
            return fail(res,{message:["user not assign in any project..."]})
        }
       if(userAggree){
           return success(res,userAggree)
       }
    } catch (error) {
        return fail(res,{message:[error.message]})
    }
}   



