const express= require("express");
const app= express();
const connection = require("../config/db");
const User = require("./Models/userModel");
const bcrypt = require("bcrypt");
const {signUpValidator}=require("../utils/Validator")

app.use(express.json());

app.post("/signup",async(req,res)=>{
    const {firstName,lastName,age,email,password,photoUrl,skills}=req.body;
    try {
        signUpValidator(req);
        const hashedPassword= await bcrypt.hash(password,10);
        const user=new User({
            firstName,
            lastName,
        
            email,
            password:hashedPassword,
          
        })
        await user.save();
        res.status(201).send({msg:"User created successfully",user});

    } catch (error) {
        res.status(400).send({msg:error.message});
    }
})

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
try {
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).send({msg:"User not found"});
    }
    const  verified= await bcrypt.compare(password,user.password);
    if(!verified){
        return res.status(401).send({msg:"Invalid credentials"});
    }else{
        res.status(200).send({msg:"Login successful",user});
    }
    
} catch (error) {
    res.status(400).send({msg:"Error in login"});
}
})

app.get("/users",async(req,res)=>{
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

app.get("/users/:id",async(req,res)=>{
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

app.delete("/users/:id",async(req,res)=>{
    const {id}=req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).send({msg:"User deleted successfully"});
    } catch (error) {
        res.status(400).send({msg:"Error in deleting user"});
    }
})

app.patch("/users/:id",async(req,res)=>{
    const {id}=req.params;
    const data=req.body;
    const ALLOWED_KEYS=["name","photoUrl","skills","gender","about"]

    const Check=Object.keys(data).every((key)=>ALLOWED_KEYS.includes(key));
    if(!Check){
        return res.status(400).send({msg:"Update is not Allowed"});
    }
    try {
      const user=  await User.findByIdAndUpdate(id,data,{returnDocument:"before"});
        if(!user){
            return res.status(404).send({msg:"User not found"});
        }
        res.status(200).send({msg:"User updated successfully",user});
    } catch (error) {
        res.status(400).send({msg:"Error in updating user"});
    }
})


const PORT=process.env.PORT || 3001;
connection().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Database connection failed",err);
})

