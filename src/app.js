const express= require("express");
const app= express();
const connection = require("../config/db");
const cors=require("cors")
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const { auth } = require("../utils/auth");
const userRouter = require("./Router/userRouter");
const authRouter = require("./Router/authRouter");
const ConnectionRequestRouter = require("./Router/connectionRequestRouter");
const { harmainiRouter } = require("./Router/harmainiRouter");
require('dotenv').config();

app.use(cors({
    origin: "http://13.60.229.163", // Your React app URL
    credentials: true // Important for cookies
  }));


// .....
app.use(express.json());
app.use(cookieParser())
app.use("/auth",authRouter)
app.use("/profile",auth,userRouter)
app.use("/connections",auth,ConnectionRequestRouter)
app.use("/harmaini",auth,harmainiRouter)




const PORT=process.env.PORT || 5001;
connection().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    
    })
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Database connection failed",err);
})

