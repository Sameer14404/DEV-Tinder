const express = require("express");
const bcrypt = require("bcrypt");
const {signUpValidator}=require("../../utils/Validator");
const User = require("../Models/userModel");
const authRouter = express.Router();

authRouter.post("/signup",async(req,res)=>{
    const {firstName,lastName,age,email,password,photoUrl,skills}=req.body;
    try {
        signUpValidator(req);
        const hashedPassword= await bcrypt.hash(password,10);
        const user=new User({
            firstName,
            lastName,
            age,
            photoUrl,
            skills,
            email,
            password:hashedPassword,
          
        })
        await user.save();
        res.status(201).send({msg:"User created successfully",user});

    } catch (error) {
        res.status(400).send({msg:error.message});
    }
})


authRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;


try {
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).send({msg:"User not found"});
    }
const varifiedPassword= user.validatePassword(password);
if(varifiedPassword){
    const token=  await user.getJWT();
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,  // 👈 dev env pe false rakho, production me true
        sameSite: "lax" // 👈 'none' bhi rakh sakte ho if cross-domain
      });
    res.status(200).send({msg:"Login successful",user});
}
else{
    res.status(401).send({msg:"Invalid credentials"});
}
    
} catch (error) {
    res.status(400).send({msg:"Error in login"});
}
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null)
    res.status(200).send({msg:"Logout Successfull !!"})
})


module.exports=authRouter;