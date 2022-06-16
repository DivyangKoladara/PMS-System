const Mongoose = require('mongoose')
const moment = require('moment')

const leaveSchema = new Mongoose.Schema({
    userId:{type:Mongoose.Types.ObjectId ,ref:'users'},
    subject:{type:String,required:true},
    description:{type:String,required:true},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    approval_status :{
        type:String,
        enum:['Approved','Pending','Rejected'],
        default:'Pending'
    }
},{
    timestamps:true
})

module.exports = Mongoose.model('leave',leaveSchema)