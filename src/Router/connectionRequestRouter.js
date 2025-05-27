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



module.exports=ConnectionRequestRouter