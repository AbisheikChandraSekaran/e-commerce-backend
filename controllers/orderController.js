const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');


// const createOrder = async (req, res) => {
//     const user_id = req.user;
//     const { products } = req.body;
    
//     try {
//         const cart = await Cart.findOne({ user_id });
//         if (!cart) {
//             return res.status(404).send({ message: "Cart not found" });
//         }
        
//         if(cart.products.length<=0){
//             return res.status(400).send({ message: "Cart is empty" });
//         }
        
//         const productDetails = await Promise.all(cart.products.map(async (product) => {
//             const productInfo = await Product.findOne({ id: product.product_id });
//             if (!productInfo) {
//                 return null;
//             }
//             return {
//                 product_id: product.product_id,
//                 quantity: product.quantity,
//                 price: productInfo.price
//             };
//         }));
        
//         const filteredProductDetails = productDetails.filter(details => details!== null);
        
//         if(filteredProductDetails.length<=0){
//             return res.status(404).send({ message: "Some products not found in the database" });
//         }
        
//         const totalPrice = filteredProductDetails.reduce((acc, curr) => {
//             return acc + (curr.price * curr.quantity);
//         }, 0);
        
//         const newOrder = new Order({
//             user_id,
//             products: filteredProductDetails,
//             totalPrice
//         });
        
//         await newOrder.save();
        
//         await Cart.findByIdAndDelete(cart._id);
        
//         return res.status(201).send(newOrder);  
//         } catch (error) {
//             console.error(error);
//             return res.status(500).send({ message: error.message });
    
//     }
// }

const createOrder = async (req, res) => {
    const user_id = req.user;
    const { cust_name, cust_PhNo, cust_address } = req.body;
    const user = await User.findOne({ _id: user_id})
    

    try {
        
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        if (cart.products.length <= 0) {
            return res.status(400).send({ message: "Cart is empty" });
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
        const totalPrice = filteredProductDetails.reduce((acc, curr) => {
            return acc + (curr.price * curr.quantity);
        }, 0);

        
        const newOrder = new Order({
            user_id,
           cust_name,
            cust_PhNo,
            user_email: user.email,
            cust_address,
            products: productDetails,
            totalAmount: totalPrice,
            orderDate:new Date(),
            est_DeliveryDate:new Date(new Date()+7*24*60*60*1000)
        });

        await newOrder.save();

        
        await Cart.findByIdAndDelete(cart._id);

        return res.status(201).send(newOrder);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
};


module.exports = {createOrder}