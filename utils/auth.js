const User = require("../src/Models/userModel");
const jwt = require("jsonwebtoken");

const auth=async(req,res,next)=>{

try {
    const token=req.cookies.token;
    console.log("token--->",token);
    if(!token){
        res.status(401).send({msg:" token Unauthorized"});
    }
    const verified= jwt.verify(token,"devTinder@123");
    if(!verified){
        res.status(401).send({msg:"Unauthorized"});
    }
    const user= await User.findById(verified._id)
    if(!user){
        res.status(401).send({msg:"Unauthorized"});
    }
    if(user){
        req.user=user;
        next();
    }
} catch (error) {
    res.status(401).send({msg:"error in authentication  "+error});
}

}


module.exports={auth};