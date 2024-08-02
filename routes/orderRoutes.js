const express = require('express');
const Router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth.js");

Router.post("/createOrder", auth, orderController.createOrder);

module.exports = Router;