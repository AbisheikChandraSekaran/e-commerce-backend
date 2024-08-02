const express = require('express');
const Router = express.Router();
const userController = require("../controllers/userController.js");


Router.post("/signup",userController.signupUser);
Router.post("/login",userController.loginUser);

module.exports = Router;