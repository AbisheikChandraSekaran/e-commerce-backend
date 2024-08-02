const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    id:{
        type: String,
        required : true,
        unique: true
    },
    title:{
        type: String,
        required : [true,'Title is required'],
       
    },
    description:{
        type: String,
        required : [true,'Description is required']
    },
    category:{
        type: String,

    },
    image:{
        type: String
    },
    price:{
        type: Number,
        required : [true,'Price is required']
    },
    rating:
        {
            rate:{
                type: Number    
            },
            count:{
                type: Number
        }
    }
    
});

const Product = mongoose.model("products",productSchema);
module.exports = Product;