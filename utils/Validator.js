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

module.exports={
    signUpValidator
}