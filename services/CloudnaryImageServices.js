const multer = require("multer");
const path = require("path");
const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary"); 


cloudinary.config({ 
  cloud_name: 'dzk5cklnn', 
  api_key: '553593565395133', 
  api_secret: 'Jc_XwlcT1uVbevcoHh4wa-5MXjo' 
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pms_image",
  },})

const upload = multer({ storage: storage });
exports.upload = multer({ storage: storage });







exports.singleImageDelete = async function () {
  
  try {
    let options = storage;
    // cloudinary.uploader.destroy(Image, function (result) { console.log("result", result) });
     
    await cloudinary.uploader.destroy("rprvi4i7xyvelboad4pe", (error, result) => {
      console.log("result",result); // { result: 'ok' }
      console.log(error);  
});
  } catch (error) {
    console.log("Error",error.message);
  }
  
}