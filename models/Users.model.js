const mongoose = require('mongoose')


const UserSchemam = new mongoose.Schema({

firstname:{
    type:String
},

lastname:{
    type:String
},

email:{
    type:String
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
    enum:['admin','devloper']
},
status:{
    type:Boolean
}

})

module.exports= mongoose.model('user',UserSchemam);