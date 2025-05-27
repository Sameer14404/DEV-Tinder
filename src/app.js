const express= require("express");
const app= express();
const connection = require("../config/db");
const User = require("./Models/userModel");
const bcrypt = require("bcrypt");
const {signUpValidator}=require("../utils/Validator")

const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const { auth } = require("../utils/auth");
const userRouter = require("./Router/userRouter");
const authRouter = require("./Router/authRouter");
const ConnectionRequestRouter = require("./Router/connectionRequestRouter");

app.use(express.json());
app.use(cookieParser())
app.use("/auth",authRouter)
app.use("/profile",auth,userRouter)
app.use("/connections",auth,ConnectionRequestRouter)




const PORT=process.env.PORT || 3001;
connection().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Database connection failed",err);
})

