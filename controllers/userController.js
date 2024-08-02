const jwt = require("jsonwebtoken")
const User = require("../models/userModel.js")

const bcrypt = require('bcryptjs');
require('dotenv').config();
const JWT = process.env.JWT_Secret

const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password
    });
     await newUser.save();

    res.status(201).json({ newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ error: 'User not found' });
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
      
      const token = jwt.sign({ userId: user._id},JWT,{
        expiresIn:'1h',
      });
      res.json({token})
      
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


module.exports={signupUser,loginUser};
