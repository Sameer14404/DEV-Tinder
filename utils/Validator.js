const  validator = require('validator');

const signUpValidator = (req)=>{
    const { firstName,lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        throw new Error('All fields are required');
    }

    if(!validator.isEmail(email)){
        throw new Error('Invalid email format');
    }
    if(!validator.isLength(password, { min: 6 })){
        throw new Error('Password must be at least 6 characters');
    }
    if(!validator.isStrongPassword(password)){
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

}


// Profile update validator

const profileUpdateValidator=(req)=>{
    const ALLOWED_KEYS=["gender","skills","about","firstName","lastName"]
    const verified=Object.keys(req.body).every((key)=>ALLOWED_KEYS.includes(key))
    return verified
}

module.exports={
    signUpValidator,
    profileUpdateValidator
}