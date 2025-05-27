const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({
fromUserId:{
type:mongoose.Schema.Types.ObjectId,
require:true
},
toUserId:{
    type:mongoose.Schema.Types.ObjectId ,
    require:true
},
status:{
type:String,
enum:{
    values:["ignored","intrested","accepted","rejected"],
    message:`{Value} is incorrected status type`
}
}
})

connectionRequestSchema.index({fromUserId:1,toUserId:1})
const connectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports=connectionRequestModel;