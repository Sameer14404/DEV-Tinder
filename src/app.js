const express= require("express");
const app= express();
const connection = require("../config/db");
const User = require("./Models/userModel");

app.use(express.json());

app.post("/signup",async(req,res)=>{
   const user= new User(req.body);
   console.log("req-->",req.body);
    try {
     await user.save();
        res.status(201).json({
            message:"User created successfully",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"User creation failed",
            error
        })
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

