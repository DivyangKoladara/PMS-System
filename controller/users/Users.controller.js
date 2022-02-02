const Validator = require('validatorjs')
const { fail, httpCode, success } = require('../../services/helper')
const User = require('../../models/Users.model')
const jwt = require('jsonwebtoken')

exports.addUser=async(req,res)=>{

    try {
        let data = req.body
        let rules = {
        firstname:"required",
        lastname:"required",
        email:"required|email",
        phone:"required",
        password:"required",
        dob:"required",
        doj:"required",
        role:"required",
        status:"required|boolean"
    }
    
    let validation = new Validator(data,rules)
    if(validation.fails()){
        return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
    }
    const adduser = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password,
        dob:req.body.dob,
        doj:req.body.doj,
        role:req.body.role,
        status:req.body.status,
    })
    await adduser.save();
    return success(res,{"message":"User add successfully..."})
    } catch (error) {
        return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }
    
}


exports.deleteUser=async(req,res)=>{   
    try {
        const deleteuser = await User.findByIdAndRemove(req.user._id)
        if(!deleteuser){
            return fail(res,{message:["User not found..."]},httpCode.BAD_REQUEST)
        }
        return success(res,{"message":"User delete Successfully..."})
    } catch (error) {
        return fail(res,{"message":[error.message]},httpCode.BAD_REQUEST)
    }

}

exports.loginUser= async(req,res)=>{

try {
    let data = req.body;
    let rules = {
        email:"required|email",
        password:"required"
    }
    let validation = new Validator(data,rules);
    if(validation.fails()){
        return fail(res,validation.errors.all(),httpCode.BAD_REQUEST);
    }
    const userdata = await User.findOne({email:data.email}).exec()
   
        if(userdata.length < 1){
            return fail(res,{message:["User not found..."]},httpCode.BAD_REQUEST)
        }
        if(userdata.password === data.password){
            const token = jwt.sign({
                email:userdata.email,
                password:userdata.password
            },
            'this is usermanagement access key',
            {
                expiresIn:"24h"
            }
            )
            const userdetails = await User.aggregate([
                {$match:{email:userdata.email}},
                {$project:{'password':0}}
            ])
            return success(res,userdetails,{"token":token})
        }
        else{
            return fail(res,{message:["Password does not match..."]},httpCode.NOT_FOUND)
    }
} catch (error) {
    return fail(res,{"message":[error.message]},httpCode.BAD_REQUEST)
}
}

exports.edituser=async(req,res)=>{

    try {
        const data = req.body
        let rules={}
        let update = {};
        if(req.body.firstname){
            update["firstname"]=req.body.firstname
            rules["firstname"]="required"
        }
        if(req.body.lastname){
            update["lastname"]=req.body.lastname
            rules["lastname"]="required"
        }
        if(req.body.email){
            update["email"]=req.body.email
            rules["email"]="required|email"
            
        }
        if(req.body.phone){
            update['phone']=req.body.phone
        }
        if(req.body.password){
            update['password']=req.body.password
            rules["password"]="required"
    
        }if(req.body.dob){
            update['dob']=req.body.dob
        }if(req.body.doj){
            update['doj']=req.body.doj
        }
        if(req.body.role){
            update['role']=req.body.role
            rules["role"]="required"
        }
        if(req.body.status){
            update['status']=req.body.status
            rules["status"]="required|boolean"
            
        }
        let validation = new Validator(data,rules)
        if(validation.fails()){
            return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
        }
        let updateStage  = await User.findByIdAndUpdate(req.user._id,update)
    
        if(updateStage){
            return success(res,{"message":"Update data successfully..."})
        }           
    } catch (error) {
        return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }
    
}

exports.tokenVerify=async(req,res,next)=>{

    if(!req.headers.authorization){
        return fail(res,{message:["Token Not found"]},httpCode.NOT_FOUND)
    }
    else{
        try {
            const headerToken =req.headers.authorization.split(' ')[0]
            const decode =  jwt.verify(headerToken,'this is usermanagement access key')
            if(!decode){
                return fail(res,{message:["Token invalid..."]})
            }
                const displaydata = await User.findOne({email:decode.email})
                if(!displaydata){
                    return fail(res,{"message":["User not found..."]},httpCode.NOT_FOUND)
                }
                req.user = displaydata ;
                next();
        } catch (error) {
            return fail(res,{"message":[error.message]},httpCode.BAD_REQUEST)
        }
    }
}
