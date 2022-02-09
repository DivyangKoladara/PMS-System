const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;



exports.imageupload=async(req,res)=>{
    try {
        const data = await cloudinary.uploader.upload(req.file.path)
        req.imagedata = data
    } catch (error) {
        res.send(error)
    }
}


exports.imagedelete= async(req,res)=>{    
    try {
        const public_id = "capvu3yfrpv9ikrp7hvp"
        await cloudinary.uploader.destroy(public_id)
        res.send("Deleted successfully...")
    } catch (error) {
        res.send(error)
    }
}