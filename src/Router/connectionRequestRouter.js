const express=require("express");
const connectionRequestModel = require("../Models/connectionRequestModel");
const userModel = require("../Models/userModel");
const ConnectionRequestRouter=express.Router();

ConnectionRequestRouter.post("/request/send/:status/:toUserId",async(req,res)=>{
    const {status,toUserId}=req.params
    console.log(status,toUserId,"yo yo")
 try {
 const user=  await userModel.findOne({_id:toUserId})
 const fromUserId= req.user._id
 console.log(fromUserId,user,"id")
 if(!user){
    throw new Error("User not found")
 }
 const exsistingUser= await connectionRequestModel.findOne({
    $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
    ]
 })
 if(req._id===toUserId){
    res.status(400).send("You can not send connection request yourself")
}
 if(exsistingUser){
    res.status(200).send({msg:"Connection Request is already exsist"})
 }
 const data =  new connectionRequestModel({
    toUserId,
    fromUserId,
    status
 })
await data.save()
 res.status(200).send({"msg":`${req.user.firstName} ${status} in ${user.firstName}`})
 } catch (error) {
    res.status(400).send("error   "+ error.msg)||"An error occurred while sending connection request"
 }




})

ConnectionRequestRouter.post("/request/review/:status/:requestId",async(req,res)=>{
   try {
      const {status,requestId}=req.params
      if(!status||!requestId){
         return res.status(400).send("Status and requestId are required")
      }
      const allowedStatus=["accepted","rejected"];
      if(!allowedStatus.includes(status)){
         return res.status(400).send("Invalid status type")
      }
      const request=await connectionRequestModel.findOne({_id:requestId,
         toUserId:req.user._id,
         status:"intrested"
      })
      if(!request){
         return res.status(404).send("Connection request not found or already processed")
      }
      request.status=status;
      await request.save();
      res.status(200).send({msg:`Connection request ${status} successfully`})
   } catch (error) {
      res.status(500).send("An error occurred while processing the connection request: " + error.message)
   }
})



module.exports=ConnectionRequestRouter