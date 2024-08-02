const express = require('express');
const Router = express.Router();
const cartController = require("../controllers/cartController.js");
const auth = require("../middleware/auth.js")

Router.post("/addToCart",auth,cartController.addToCart);
Router.get("/getCartItems",auth,cartController.getCartItems);
Router.delete("/deleteCartItem",auth,cartController.deleteCartItem);
// Router.delete("/deleteEntireCart",auth,cartController.deleteEntireCart);



module.exports = Router;