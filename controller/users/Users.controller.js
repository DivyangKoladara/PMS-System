const Validator = require('validatorjs')
const { fail, httpCode, success } = require('../../services/helper')
const User = require('../../models/Users.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const cloudinary = require('../../services/imageupload/cloudinary');




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
    let imagedata
    if(req.file){
         imagedata = await cloudinary.uploader.upload(req.file.path,params= {folder: "pms_user_image"})
    }
    const filename = req.file ? imagedata.url : "";
    const adduser =  new User({
        firstname:data.firstname,
        lastname:data.lastname,
        email:data.email,
        phone:data.phone,
        password:await(bcrypt.hash(data.password, 10)),
        dob:data.dob,
        doj:data.doj,
        role:data.role,
        status:data.status,
        image:filename,
        // image_id:imagedata.public_id
    })
    await adduser.save();
    return success(res,{"message":"User add successfully..."})
    } catch (error) {
        return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }
    
}


exports.deleteUser=async(req,res)=>{   
    try {
        let data = req.body
        let rules = {}
        rules.id ="required";
        let validation = new Validator(data,rules)
        if (validation.fails()){
            return fail(req,validation.errors.all(),httpCode.BAD_REQUEST)
        } 
        const deleteuserdetails = await User.findById({_id:data.id})
        if(!deleteuserdetails){
            return fail(res,{message:["User not found..."]},httpCode.BAD_REQUEST)
        }
        if(deleteuserdetails.image){
            const imagename = deleteuserdetails.image.substring(deleteuserdetails.image.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "");
            let image_id = "pms_user_image/"+imagename ;
            await cloudinary.uploader.destroy(image_id);            
        }
        const deleteuser = await User.findByIdAndRemove(data.id)
        return success(res,{"message":"User deleted Successfully..."})
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
    
        if(!userdata){
            return fail(res,{message:["User not found..."]},httpCode.BAD_REQUEST)
        }
        const ismatch = await bcrypt.compare(data.password,userdata.password)
        if(ismatch){
            const token = jwt.sign({
                email:userdata.email,
                password:userdata.password
            },
            'this is usermanagement access key',
            {
                expiresIn:"24h"
            }
            )
            const userdetails = await User.findOne({email:userdata.email}).select({"password":0});
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
        let rules={
            "userId":"required"
        }
        let update = {};
        if(data.firstname){
            update["firstname"]=data.firstname
            rules["firstname"]="required"
        }
        if(data.lastname){
            update["lastname"]=data.lastname
            rules["lastname"]="required"
        }
        if(data.email){
            update["email"]=data.email
            rules["email"]="required|email"
            
        }
        if(data.phone){
            update['phone']=data.phone
        }
        if(data.password){
            update['password']=await(bcrypt.hash(data.password,10))
            rules["password"]="required"
    
        }if(data.dob){
            update['dob']=data.dob
        }if(data.doj){
            update['doj']=data.doj
        }
        if(data.role){
            update['role']=data.role
            rules["role"]="required"
        }
        if(data.status){
            update['status']=data.status
            rules["status"]="required|boolean"
            
        }
        if(req.file){
            const imageremove = await User.findById(data.userId)
            if(imageremove.image){
                const imagename = imageremove.image.substring(imageremove.image.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "");
                let image_id = "pms_user_image/"+imagename ;
                await cloudinary.uploader.destroy(image_id);
            }
            const imagedata = await cloudinary.uploader.upload(req.file.path,params={folder: "pms_user_image"})
            if(imagedata){
                update['image']=imagedata.url
            }
        }
        let validation = new Validator(data,rules)
        if(validation.fails()){
            return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
        }
        let updateStage  = await User.findByIdAndUpdate(data.userId,update,{runValidators: true})
        if(updateStage){
            return success(res,{"message":"Update data successfully..."})
        }  
        if(!updateStage){
            return fail(res,{message:["nathing to be change"]})
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
                if(decode.password != displaydata.password){
                    return fail(res,{"message":["Incorrect Password..."]},httpCode.NOT_FOUND)

                }
                req.user = displaydata ;
                next();
        } catch (error) {
            return fail(res,{"message":[error.message]},httpCode.BAD_REQUEST)
        }
    }
}


exports.authUserDetails=async(req,res)=>{
    try {
        let data = req.user
        const userdata = await User.findOne({email:data.email}).exec()
            if(userdata.length < 1){
                return fail(res,{message:["User not found..."]},httpCode.NOT_FOUND)
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
                const userdetails = await User.findOne({email:userdata.email}).select({"password":0})
                
                return success(res,userdetails,{"token":token})
            }
            else{
                return fail(res,{message:["Incorrect Password..."]},httpCode.NOT_FOUND)
        }
    } catch (error) {
        return fail(res,{"message":[error.message]},httpCode.BAD_REQUEST)
    }
}

exports.changepassword=async(req,res)=>{
    try{
       let data = req.body
       let rules={
           currentpassword:"required",
           newpassword:"required",
       }
       const validation = new Validator(data,rules)
       if(validation.fails()){
           return fail(res,validation.errors.all(),httpCode.BAD_REQUEST)
       }
       const ismatch = await bcrypt.compare(data.currentpassword,req.user.password)
       if(!ismatch){
           return fail(res,{message:["current passsword does not match..."]})
       }
       let update={
           password:await(bcrypt.hash(data.newpassword,10))
       }
        await User.findByIdAndUpdate(req.user._id,update)
       return success(res,{message:["Password Change successfully..."]})
    } catch (error) {   
        return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }
}


exports.userDetails=async(req,res)=>{
    try {
        const userdetails = await User.find()
        return success(res,userdetails);
    } catch (error) {
        return fail(res,{message:[error.message]},httpCode.BAD_REQUEST)
    }
}