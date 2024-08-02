
const Product = require("../models/productModel")
const { v4: uuidv4 } = require('uuid');

const getAllProducts = async(req,res)=>{
    console.log(req.user);
    try{
    const products = await Product.find();
    res.send(products);
    }
    catch(err){
        console.error(err)
    }
};

const postAllProducts = async(req,res)=>{
    try{
    const {id,title,description,category,image,price,rating}= req.body;
    const newProduct = new Product({
        id:uuidv4(),
        title,
        description,
        category,
        image,
        price,
        rating
    });
    await newProduct.save();
    res.send(newProduct);
    }
    catch(err){
        console.error(err)
    }
}



const updateProducts = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedProduct = await Product.findOneAndUpdate(
            {id:id}, 
            req.body,
            {new:true}
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
};

const deleteProduct = async(req,res)=>{
    try{
        const {id} = req.params

        await Product.findOneAndDelete({id:id},req.body);
        res.send("Product deleted successfully");
    }
    catch(err){
        console.error(err)
    }
 
};
module.exports = {getAllProducts,postAllProducts,updateProducts,deleteProduct};