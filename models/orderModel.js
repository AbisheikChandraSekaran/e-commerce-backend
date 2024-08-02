const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    cust_name: {
        type: String,
        required: true
    },
    cust_PhNo: {
        type: String,
        required: true
    },
    cust_address: {
        type: String,
        required: true
    },
    orderId:{
        type: String,
        required: true,
        unique: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    products: [
        {
            product_id: String,
            quantity: Number,
            price: Number,
            image: String,
            title: String,
            category: String,
        }],
    totalAmount:{
        type: Number,
        required: true
    },
    orderStatus:{
        type: String,
        default: 'Pending'
    },
    est_DeliveryDate:{
        type: Date,
        required: true
    }

});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
