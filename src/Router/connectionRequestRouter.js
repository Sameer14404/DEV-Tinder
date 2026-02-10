const express=require("express");
const connectionRequestModel = require("../Models/connectionRequestModel");
const userModel = require("../Models/userModel");
const User = require("../Models/userModel");
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
   const {status,requestId}=req.params
   if(!status||!requestId){
      res.status(400).send("status and requestId is not correct !!!")
   }
   try {
      const ALLOWED_STATUS=['accepted','rejected'];
      if(!ALLOWED_STATUS.includes(status)){
         res.status(400).send("This status is not valid !!")
      }

      const connection= await connectionRequestModel.findOne({
         status:"intrested" ,//status must be intrested to loggedInuser
         _id:requestId,
         toUserId:req.user._id
      })
      if(!connection){
         res.status(400).send("User not found !!")
      }
      connection.status=status;
      connection.save()
      res.status(200).send({msg:`connection request ${status}`,connection})
   } catch (error) {
      
   }
})

ConnectionRequestRouter.get("/pendingRequests",async(req,res)=>{
   try {
      const ConnectionRequest= await connectionRequestModel.find({
         status:"intrested",
         toUserId:req.user._id
      }).populate(
         "fromUserId",
         ["firstName","lastName","photoUrl"]
       
      )
      res.send(ConnectionRequest)
   } catch (error) {
      
   }

})

ConnectionRequestRouter.get('/accepted/',async(req,res)=>{

   try {
      const connection= await connectionRequestModel.find({
         $or:[
            {toUserId:req.user_id ,status:"accepted"},
            {
               fromUserId:req.user_id ,status:"accepted"
            }
         ]
      }).populate("fromUserId",["firstName, lastName,photoUrl"]).populate("toUserId",["firstName, lastName,photoUrl"]);
   
      res.status(200).send(connection)
   } catch (error) {
      res.status(400).send({msg:error.msg})
   }


  
   
})

ConnectionRequestRouter.get("/feed",async(req,res)=>{
   const page = parseInt(req.query.page) || 1;
   let limit = parseInt(req.query.limit) || 10;
   limit=limit>50?50:limit; // Limit to a maximum of 50
   const skip = (page - 1) * limit;
   const loggedInuserId=req.user._id;
   try {
 const ConnectionRequest=await connectionRequestModel.find({
   $or:[
      {fromUserId:loggedInuserId},
      {toUserId:loggedInuserId}
   ]
 }).select("fromUserId toUserId")
 const hideUsersFromFeed=new Set();
 ConnectionRequest.forEach((el)=>{
   hideUsersFromFeed.add(el.fromUserId.toString())
   hideUsersFromFeed.add(el.toUserId.toString())
 })

 const users= await User.find({
 $and: [ {_id:{$nin:Array.from(hideUsersFromFeed)}},
   {_id:{$ne:loggedInuserId}}
 ]
 }).select("firstName lastName photoUrl ").skip(skip).limit(limit);
 res.send(users)
   } catch (error) {
      res.status(400).send({msg:error.msg})
   }
})



module.exports=ConnectionRequestRouter