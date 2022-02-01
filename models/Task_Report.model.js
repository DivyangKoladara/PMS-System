const  mongoose = require("mongoose");

const Task_ReposrtSchema = new mongoose.Schema({
   user_id:{type:mongoose.Schema.Types.ObjectId, ref:'user'}, 
   project_id:{type: mongoose.Schema.Types.ObjectId, ref: 'project'},
   title:{
       type:String
   },
   description:{
       type:String
   },
   minutes:{
       type:String
   },
   date:{
       type:Date
   },
   createdat:{
       type:Date
   },
   updatedat:{
       type:Date
   }
})

module.exports = mongoose.model('task',Task_ReposrtSchema);