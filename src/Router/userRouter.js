const express = require("express");
const userRouter = express.Router();
const User = require("../Models/userModel");
const { profileUpdateValidator } = require("../../utils/Validator");


userRouter.get("/",async(req,res)=>{


try {
    if(req.user){
        res.status(200).send({user:req.user});
    }
    else{
        res.status(401).send({msg:"Unauthorized"});
    }
} catch (error) {
    res.status(400).send({msg:"Error in fetching profile"});
}
   
})

userRouter.get("/feed",async(req,res)=>{
 try {
    const users= await User.find({});
    if(users.length===0){
        return res.status(404).send({msg:"No users found"});
    }
    res.status(200).send(users);
 } catch (error) {
    res.status(400).send({msg:"Error in fetching users"});
 }
})

userRouter.get("/:id",async(req,res)=>{
    const {id}=req.params;
    console.log("id-->",id);
    try {
        const user= await User.find({_id:id});
        if(!user){
            return res.status(404).send({msg:"User not found"});
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({msg:"Error in fetching user"});
    }
})

userRouter.delete("/:id",async(req,res)=>{
    const {id}=req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).send({msg:"User deleted successfully"});
    } catch (error) {
        res.status(400).send({msg:"Error in deleting user"});
    }
})

userRouter.patch("/update",async(req,res)=>{
    const id=req.user._id;
    const data=req.body;
    console.log(id)
    

    // const Check=profileUpdateValidator(req)
    const loggedInUser=req.body;
    // if(!Check){
    //     return res.status(400).send({msg:"Update is not Allowed"});
    // }
    try {
      const user=  await User.findByIdAndUpdate(id,data,{returnDocument:"before"});
       
        
        if(!user){
            return res.status(404).send({msg:"User not found"});

        }

        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key])
        await user.save()
        res.status(200).send({msg:"User updated successfully",user});
    } catch (error) {
        res.status(400).send({msg:"Error in updating user"});
    }
})

userRouter.get("/filter/:type/:value",async(req,res)=>{
    const {type,value}=req.params;
    console.log(type,value);
    try {
        if(!type || !value){
            return res.status(400).send({msg:"Type and value are required"});
        }
        const users= await User.find({[type]:value});
        if(users.length===0){
            return res.status(404).send({msg:"No users found"});
        }
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({msg:"Error in fetching users"});
    }
})

userRouter.get("/search/:query",async(req,res)=>{
    const {query}=req.params;
    console.log(query);
    try {
        if(!query){
            return res.status(400).send({msg:"Query is required"});
        }
        const users= await User.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });
        if(users.length===0){
            return res.status(404).send({msg:"No users found"});
        }
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({msg:"Error in searching users"});
    }
})




module.exports = userRouter;