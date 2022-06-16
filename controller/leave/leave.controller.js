const mongoose = require('mongoose');
const  Validator  = require('validatorjs');
const { fail, httpCode, success } = require('../../services/helper')
const Leave = require('../../models/leave.model')

exports.createLeave = async(req,res) =>{
    try {
       
        let data = req.body;
        let user = req.user;
        let rules = {
            subject:'required',
            description:'required',
            startDate:'required',
            endDate:'required',
        }
    
        let validation = new Validator(data,rules)

        if(validation.fails()){
            return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
        }
        
        let createLeave = new Leave({
            userId:user._id,
            subject:data.subject,
            description:data.description,
            startDate:data.startDate,
            endDate:data.endDate
        })

        await createLeave.save();

        return success(res,'Leave generated successfully...')

    } catch (error) {
        console.log("error",error)
        return fail(res,httpCode.BAD_REQUEST);
    }
}

exports.listOfLeave = async(req,res)=>{
    try {
        let user = req.user;
        let listOfLeave;
        if(user.role === 'admin'){
             listOfLeave = await Leave.aggregate([
                {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userDatils'
                }
            },
            {
                $sort:{
                    "createdAt":-1
                }
            }
        ])
        }
        else{
            listOfLeave = await Leave.find({userId:user._id}).sort({'createdAt': -1})
        }
        if(listOfLeave.length){
            return success(res,listOfLeave,{message:'List of Leave get successfully...'})
        }else{
            return fail(res,'No recored found!',httpCode.NOT_FOUND)
        }
       
    } catch (error) {
        return fail(res,error.message,httpCode.BAD_REQUEST)
    }
}



exports.updateLeave = async (req, res) => {
    try {
        const data = req.body;
        let rules = {
            id: 'required'
        }
        let user = req.user
        let update = {}
        console.log("role",user)
       
        if(user.role === 'admin'){
            rules['approval_status'] = 'required',
            update['approval_status'] = data.approval_status
        }else{
            if (data.subject) {
                update["subject"] = data.subject
                rules["subject"] = "required"
            }
            if (data.description) {
                update["description"] = data.description
                rules["description"] = "required"
            }
            if (data.startDate) {
                update['startDate'] = data.startDate
                rules['startDate'] = 'required'
            }
            if (data.endDate) {
                update['endDate'] = data.endDate
                rules['endDate'] = 'required'
            }
            if (data.approval_status) {
                update['approval_status'] = data.approval_status
                rules['approval_status'] = 'required'
            }
        }
       
        const validation = new Validator(data, rules)
        if (validation.fails()) {
            return fail(res, validation.errors.all(), httpCode.BAD_REQUEST)
        }
        const findproject = await Leave.findById({ _id: data.id })
        if (!findproject) {
            return fail(res, { message: ["Leave not found!"] }, httpCode.BAD_REQUEST)
        }
        const editProject = await Leave.findByIdAndUpdate(data.id, update,{runValidators: true,new:true})
        return success(res, 'Leave application Upadated successfully...' )
    } catch (error) {
        return fail(res,error.message, httpCode.BAD_REQUEST)
    }

}

exports.deleteLeave = async(req,res)=>{
    try {
        let data = req.body
        let rules = {
            id:"required"
        }
        let validation = new Validator(data,rules)
        if(validation.fails()){
            return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
        }
        let deleteLeave = await Leave.findOneAndRemove({_id:data.id})
        if(deleteLeave){
            return success(res,"Leave deleted successfully...")
        }else{
            return fail(res,'Leave not found!',httpCode.NOT_FOUND)
        }

    } catch (error) {
        return fail(res,error.message,httpCode.BAD_REQUEST)
    }
}