
const  Mongoose = require("mongoose");


const UserItemSchema = Mongoose.Schema({
    userId: { type: Mongoose.Schema.Types.ObjectId,ref: 'user' , required: true }
})
const CreateProjectSchema = new Mongoose.Schema({
    name:{
        type:String
    },
    status:{
        type:Boolean
    },
    image:{
        type:String
    },
    user_id:{type:Mongoose.Schema.Types.ObjectId,ref:'user'},

    assignUsers :[UserItemSchema]
})



module.exports = Mongoose.model('project',CreateProjectSchema);