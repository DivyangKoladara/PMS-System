const Task_ReposrtSchema = require("../../models/Task_Report.model");
const Mongoose = require('mongoose')
const Validator = require('validatorjs')
const { fail, httpCode, success } = require("../../services/helper");
const { send } = require("express/lib/response");



exports.addtaskreport=async(req,res)=>{
    try{
        let data = req.body;
        let rules= {
            title:"required",
            description:"required",
            minutes:"required",
            date:"required|date",
            createdat :"required|date",
            updatedat:"required|date"
        }
        let validation = new Validator(data,rules)
        if(validation.fails()){
            return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
        }
        // const findProject = await Project.findById({_id:data.project_id})
        // if(!findProject){
        // return fail(res,"Project Not Found...",httpCode.BAD_REQUEST)
        // }
        // const findUser = await UserSchemam.findById({_id:req.user._id})
        // if(!findUser){
        // return fail(res,{message:["User not found..."]},httpCode.BAD_REQUEST)
        // }
        const createtaskreport =  new Task_ReposrtSchema({
            user_id:req.user._id,
            project_id:data.project_id,
            title:data.title,
            description:data.description,
            minutes:data.minutes,
            date:data.date,
            createdat:data.createdat,
            updatedat:data.updatedat
        })
        await  createtaskreport.save();
        return success(res,{"message":"task report created successfully..."})
    } catch (error) {
        return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }

}
exports.deletetaskreport=async(req,res)=>{
    let data = req.body;
    let rules={
        taskreportId:'required'
    }
    const validation = new Validator(data,rules)
    if(validation.fails()){
        return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
    }
    try {
        const taskreportId = Mongoose.Types.ObjectId(data.taskreportId);
        const taskreportdata  =  await Task_ReposrtSchema.findById({_id:taskreportId})
        if(!taskreportdata){
            return fail(res,{message:["Taskreport not found"]})
        }
     if(String(taskreportdata.user_id)===String(req.user._id)){
         await Task_ReposrtSchema.findByIdAndRemove({_id:taskreportId})
        return success(res,{message:"Taskreport deleted successfully..."})
     }
    else{
            return fail(res,{message:["You are not authorized user for delete this task report"]})   
        }
    } catch (error) {
        return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }
}


exports.edittaskreport=async(req,res)=>{
    try {
        let data = req.body;   
        let rules={}
        rules["taskreportId"]='required'
        let update={}
        if(data.user_id){
            update["user_id"]=data.user_id
            rules["user_id"]="required"
        }
        if(data.project_id){
            update["project_id"]=data.project_id
            rules["project_id"]="required"
        }
        if(data.title){
            update["title"]=data.title
            rules["title"]="required"
        }
        if(data.description){
            update['description']=data.description
            rules['description']='required'
        }if(data.minutes){
            update["minutes"]=data.minutes
            rules["minutes"]="required"
        }
        if(data.date){
            update["date"]=data.date
            rules["date"]="required"
        }
        if(data.createdat){
            update["createdat"]=data.createdat
            rules["createdat"]="required"
        }
        if(data.updatedat){
            update["updatedat"]=data.updatedat
            rules["updatedat"]="required"
        }
        const validation = new Validator(data,rules)
        if(validation.fails()){
            return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
        }
        const taskreportId = Mongoose.Types.ObjectId(data.taskreportId);
        const taskreportdata  =  await Task_ReposrtSchema.findById({_id:taskreportId})
        if(!taskreportdata){
            return fail(res,{message:["Taskreport not found"]})
        }
        if(String(taskreportdata.user_id)===String(req.user._id)){
         await Task_ReposrtSchema.findByIdAndUpdate({_id:taskreportId},update)
        return success(res,{message:"Taskreport updated successfully..."})
        }
        else{
            return fail(res,{message:["You are not authorized user for update this task report"]})
        }
    } catch (error) {   
       return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }
}