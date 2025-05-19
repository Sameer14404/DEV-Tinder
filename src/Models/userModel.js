const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [4, 'First name must be at least 4 characters'],
    maxlength: [12, 'First name cannot exceed 12 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [4, 'Last name must be at least 4 characters'],
    maxlength: [12, 'Last name cannot exceed 12 characters'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Age must be at least 18'],
    max: [75, 'Age cannot exceed 75'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    minlength: [4, 'Email must be at least 4 characters'],
    maxlength: [50, 'Email cannot exceed 50 characters'],
    match: [/.+\@.+\..+/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minlength: [6, 'Password must be at least 6 characters'],
  },
  photoUrl: {
    type: String,
    default: 'https://www.w3schools.com/howto/img_avatar.png',
    trim: true,
  },
  skills: {
    type: [String],
    
    validate: {
      validator: function (value) {
        return  value.length <= 10;
      },
      message: 'Skills must be between 1 and 5 items',
    },
  },

  
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    validate: {
      validator: function (value) {
        return ['male', 'female', 'others'].includes(value.toLowerCase());
      },
      message: 'Gender must be either "male", "female", or "others"',
    },
  },
  about: {
    type: String,
    trim: true,
    minlength: [10, 'About must be at least 10 characters'],
    maxlength: [200, 'About cannot exceed 200 characters'],
  },
});

// ✅ Automatically set photoUrl based on gender
userSchema.pre('save', function (next) {
  if (!this.isModified('gender')) return next();

  const gender = this.gender.toLowerCase();
  if (gender === 'male') {
    this.photoUrl = 'https://randomuser.me/api/portraits/men/1.jpg';
  } else if (gender === 'female') {
    this.photoUrl = 'https://randomuser.me/api/portraits/women/1.jpg';
  } else {
    this.photoUrl = 'https://www.w3schools.com/howto/img_avatar.png';
  }

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
