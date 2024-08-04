const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  password: {
    type: String,
    required: true
  },
  role: { 
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  otp: {
    type: String,
    required: false
  },
  otpExpiry: {
    type: Date, // Change to Date type for accurate comparison
    required: false
  },
  contact: { // Add contact field
    type: String,
    required: false
  },
});

module.exports = mongoose.model("User", userSchema);
