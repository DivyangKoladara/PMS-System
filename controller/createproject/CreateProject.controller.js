const Mongoose  = require("mongoose");
const Validator = require("validatorjs");
const Project = require("../../models/CreateProject.model");
const { fail, httpCode, success } = require("../../services/helper");
const UserSchemam = require('../../models/Users.model')
const cloudinary = require('../../services/imageupload/cloudinary')


exports.createProject =  async (req,res)=>{  
    try{
        
        let user = req.user
        let data = req.body;
        let rules= {
            name:"required",
            status:"required|boolean",
        }
        let validation = new Validator(data,rules)
        if(validation.fails()){
            return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
        }
        let imagedata;
        if(req.file){
             imagedata = await cloudinary.uploader.upload(req.file.path,params= {folder: "pms_project_image"}) 
        }
        const filename = req.file ? imagedata.url : "";   
                const createProject =  new Project({
                name:req.body.name,
                status:req.body.status,
                image:filename,
                user_id:user._id
            }) 
            await createProject.save();
            return success(res,{"message":"Project created successfully..."})    
    } catch (error) {
        return fail(res,{"message":[error.massage]},httpCode.NOT_FOUND)
    }
}

exports.deleteProject = async(req,res)=>{
    try {
        if(!req.body.projectId){
            return fail(res,{message:["Id not found..."]},httpCode.BAD_REQUEST)
        }
        const projectId = Mongoose.Types.ObjectId(req.body.projectId);
        const deletProjectDetails = await Project.findById({_id:projectId})
      
        if(!deletProjectDetails){
            return fail(res,{message:["Project not found..."]})
        }
        if(deletProjectDetails.image){
            const imagename = deletProjectDetails.image.substring(deletProjectDetails.image.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "");
            let image_id = "pms_project_image/"+imagename ;
            await cloudinary.uploader.destroy(image_id);
        }
        const deleteproject = await Project.findByIdAndRemove({_id:projectId})
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
            return fail(res,{message:["ProjectId not found..."]},httpCode.NOT_FOUND)
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
        if(req.file){
            const imageremove = await Project.findById(data.projectId)
            const imagename = imageremove.image.substring(imageremove.image.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "");
            let image_id = "pms_project_image/"+imagename ;
            if(imageremove.image){
                await cloudinary.uploader.destroy(image_id);    
            }
            const imagedata = await cloudinary.uploader.upload(req.file.path,params={folder: "pms_project_image"})
            if(imagedata){
                update['image']=imagedata.url
            }
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
        // const userId = Mongoose.Types.ObjectId(data.userId);

        const findProject = await Project.findById({_id:projectId})
        if(!findProject){
        return fail(res,{message:["Project Not Found..."]},httpCode.BAD_REQUEST)
        }
        // const findUser = await UserSchemam.findById({_id:userId})
        // if(!findUser){
        // return fail(res,{message:["User not found..."]},httpCode.BAD_REQUEST)
        // }
        if(data.user === 'add'){
                data.userId.map(async(user)=>{
                    
                        const addelement = await Project.findByIdAndUpdate({_id:projectId},{$push:{
                        assignUsers:[{userId:user}]
                        }})
                })
        return success(res,"user assign successfully...")
        }
          

        if(data.user === 'remove'){

            data.userId.map(async(user)=>{
                    
                let userId = Mongoose.Types.ObjectId(user);

                const deleteuser = await Project.updateOne(
                    { _id: projectId },
                    {
                      $pull: {assignUsers:{userId}}
                    }
                  );
            })
       
        return success(res,"retain user successsfull...")
    }
    } catch (error) {
        return fail(res,{message:["dksdfhhjfhs"]},httpCode.BAD_REQUEST)   
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
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ['$root', '$$ROOT']
                }
            }
        },
        {
            $group:{
                _id:"$_id",
                root:{ $mergeObjects: '$$ROOT' },
                UserDetails: {$push:"$UserDetails" } 
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
               "UserDetails._id":0,
               "UserDetails.email":0,
               "UserDetails.image_id":0,
               "UserDetails.phone":0
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


exports.projectList=async(req,res)=>{

    try {
        const data = await Project.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"assignUsers.userId",
                    foreignField:"_id",
                    as:"assignUsers"
                }
            },
            {
                $project:{
                    // "assignUsers._id":0,
                    "assignUsers.image_id":0,
                    "assignUsers.status":0,
                    "assignUsers.role":0,
                    "assignUsers.doj":0,
                    "assignUsers.dob":0,
                    "assignUsers.password":0,
                    "assignUsers.phone":0,
                    "assignUsers.email":0,
                }
            }
        ])
        if(!data){
            return fail(res,{message:["Project not found..."]},httpCode.NOT_FOUND)
        }
        return success(res,data)
    } catch (error) {
        return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }
}
