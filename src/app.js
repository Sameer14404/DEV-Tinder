const express= require("express");
const app= express();
const connection = require("../config/db");
app.use("/",(req,res)=>{
res.send("Hello World");
})

const PORT=process.env.PORT || 5000;
connection().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Database connection failed",err);
})

