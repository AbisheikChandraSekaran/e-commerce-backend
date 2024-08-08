const express = require('express');
const Router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth.js")

Router.get("/products",productController.getAllProducts);
Router.post("/products",auth,productController.postAllProducts);
Router.put("/products/:id",auth,productController.updateProducts);
Router.delete("/products/:id",auth,productController.deleteProduct);
module.exports = Router;