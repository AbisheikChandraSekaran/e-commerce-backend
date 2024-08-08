const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name is required"]
    },
    email:{
        type: String,
        required : [true,"Email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true,"Password is required"]
    }
});

// Hash password before saving user to database
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();  // it is used to indicate that the current middleware is done and ready to move to another middleware
})

const User = mongoose.model("users",userSchema);
module.exports = User;