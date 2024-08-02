const express = require('express');
const app = express();
const Productroutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const cors = require('cors');

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const Port = process.env.Port;
app.use(cors());
const mongoose = require('mongoose');


mongoose.connect(MONGO_URI).then(()=>{
    console.log("MongoDB Connected");
});

app.set('view engine',"ejs");
app.use(express.json());
app.use("/",Productroutes)
app.use("/",userRoutes)
app.use("/",cartRoutes)
app.use("/",orderRoutes)
app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
});