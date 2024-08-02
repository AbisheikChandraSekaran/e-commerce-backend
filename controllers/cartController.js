
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const CartServices = require('../services/cartServices')

const addToCart = async (req, res) => {
    const user_id = req.user; // Extracted user ID from the JWT token
    const { products } = req.body;

    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            const newCart = new Cart({ user_id, products });
            await newCart.save();
            return res.status(201).send(newCart);
        }

        for (const product of products) {
            const { product_id, quantity } = product;
            const productExists = cart.products.find(p => p.product_id === product_id);

            if (productExists) {
                productExists.quantity = quantity;
            } else {
                cart.products.push({ product_id, quantity });
            }
        }

        await cart.save();
        return res.send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const getCartItems = async (req, res) => {
    const user_id = req.user; 
    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        const productDetails = await Promise.all(cart.products.map(async (product) => {
            const productInfo = await Product.findOne({ id: product.product_id });
            if (!productInfo) {
                return null; 
            }
            return {
                product_id: product.product_id,
                quantity: product.quantity,
                title: productInfo.title,
                description: productInfo.description,
                image: productInfo.image,
                price: productInfo.price,
                rating : productInfo.rating
            };
        }));

        
        const filteredProductDetails = productDetails.filter(details => details !== null);
        const subtotal =  filteredProductDetails.reduce((acc, curr) => {
            return acc + (curr.price * curr.quantity);
        }, 0);
        res.send({filteredProductDetails,subtotal});
        
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};



const deleteCartItem = async(req,res)=>{
   const result = await CartServices.deleteCartItem(req.user,req.body.product_id);
   res.send(result);
};

const deleteEntireCart = async(req,res)=>{
    const user_id = req.user;
    try {
        const cart = await Cart.findOneAndDelete({ user_id });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }
        res.send(cart);
        
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

module.exports = { addToCart, getCartItems, deleteCartItem, deleteEntireCart};



