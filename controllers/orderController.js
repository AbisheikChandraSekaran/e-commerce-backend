// const Order = require('../models/orderModel');
// const Product = require('../models/productModel');
// const Cart = require('../models/cartModel');
// const User = require('../models/userModel');


// // const createOrder = async (req, res) => {
// //     const user_id = req.user;
// //     const { cust_name, cust_PhNo, cust_address } = req.body;
// //     const user = await User.findOne({ _id: user_id})
    

// //     try {
        
// //         const cart = await Cart.findOne({ user_id });
// //         if (!cart) {
// //             return res.status(404).send({ message: "Cart not found" });
// //         }

// //         if (cart.products.length <= 0) {
// //             return res.status(400).send({ message: "Cart is empty" });
// //         }

        
// //         const productDetails = await Promise.all(cart.products.map(async (product) => {
// //             const productInfo = await Product.findOne({ id: product.product_id });
// //             if (!productInfo) {
// //                 return null; 
// //             }
// //             return {
// //                 product_id: product.product_id,
// //                 quantity: product.quantity,
// //                 title: productInfo.title,
// //                 description: productInfo.description,
// //                 image: productInfo.image,
// //                 price: productInfo.price,
// //                 rating : productInfo.rating
// //             };
// //         }));

// //         const filteredProductDetails = productDetails.filter(details => details !== null);
// //         const totalPrice = filteredProductDetails.reduce((acc, curr) => {
// //             return acc + (curr.price * curr.quantity);
// //         }, 0);

        
// //         const newOrder = new Order({
// //             user_id,
// //            cust_name,
// //             cust_PhNo,
// //             user_email: user.email,
// //             cust_address,
// //             products: productDetails,
// //             totalAmount: totalPrice,
// //             orderDate:new Date(),
// //             est_DeliveryDate:new Date(new Date()+7*24*60*60*1000),
// //             orderId:uuidV4()
// //         });

// //         await newOrder.save();

        
// //         await Cart.findByIdAndDelete(cart._id);

// //         return res.status(201).send(newOrder);
// //     } catch (error) {
// //         console.error(error);
// //         return res.status(500).send({ message: error.message });
// //     }
// // };

const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
    const user_id = req.user;
    const { cust_Name, cust_Address, cust_PhNo } = req.body;

    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        const user = await User.findById(user_id);
        const { email } = user;

        const products = cart.products.map((product) => {
            return {
                product_id: product.product_id,
                quantity: product.quantity,
            };
        });

        const subtotal = await Promise.all(products.map(async (product) => {
            const productInfo = await Product.findOne({ id: product.product_id });
            if (!productInfo) {
                return null;
            }
            return productInfo.price * product.quantity;
        }));

        const totalAmount = subtotal.reduce((acc, amount) => acc + amount, 0);

        const order = new Order({
            id: uuidv4(),
            user_id,
            user_email: email,
            cust_Name,
            cust_Address,
            cust_PhNO: cust_PhNo,
            products,
            totalAmount,
            // orderStatus: "Pending", 
            orderDate: new Date(),
            est_DeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        });

        await order.save();

        await Cart.findOneAndDelete({ user_id });

        res.status(201).send(order);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getOrders = async(req, res) => {
    const user_id = req.user;
    try {
        const orders = await Order.find({ user_id }, { cust_Name: 0, cust_Address: 0, cust_PhNO: 0 });
        const ordersWithProductDetails = await Promise.all(orders.map(async (order) => {
            const productsWithDetails = await Promise.all(order.products.map(async (product) => {
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
                    price: productInfo.price
                };
            }));
            return {
                Orderid: order.id,
                products: productsWithDetails,
                totalAmount: order.totalAmount,
                orderDate: order.orderDate,
                est_DeliveryDate: order.est_DeliveryDate,
                Status: order.orderStatus 
            };
        }));
        res.send(ordersWithProductDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = { createOrder, getOrders };

