const mongoose = require('mongoose')


const UserSchemam = new mongoose.Schema({

firstname:{
    type:String
},

lastname:{
    type:String
},

email:{
    type:String,
},

phone:{
    type:Number
},

password:{
    type:String
},

dob:{
    type:Date
},

doj:{
    type:Date
},
role:{
    type:String,
    enum:['admin','developer']
},
status:{
    type:Boolean
},
image:{
    type:String
},
// image_id:{
//     type:String
// }

})

module.exports= mongoose.model('user',UserSchemam);