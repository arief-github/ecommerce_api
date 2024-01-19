import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { createError } from "../helpers/createError.js";
import Product from "../models/Product.js";
import dotenv from 'dotenv';
import Stripe from "stripe";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_KEY); 

/**
 * @desc   Create orders
 * @route  POST /api/v1/orders
 * @access Private/Admin
 **/

export const createOrderController = asyncHandler(async (req, res) => {
    // Get the payload (customer, orderItems, shippingAddress, totalPrice)
    const { orderItems, shippingAddress, totalPrice } = req.body;
    // find the user that do order
    const user = await User.findById(req.userAuthId);    
    
    // Check if user has Shipping Address
    if(!user?.hasShippingAddress) {
        throw createError('Please provide shipping address', 400);
    }
    
    // Check if order isn't empty
    if (orderItems?.length <= 0) {
        throw createError("No Order Items", 400);
    }
    // Place/Create Order => Save into db
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice
    });
 
    // update the product qty and product sold
    const products = await Product.find({ _id: { $in: orderItems } });

    orderItems?.map(async (order) => {
        const product = products?.find((product) => {
            return product?._id.toString() === order?._id?.toString();
        });

        if(product) { 
            // order total sold will increase as long as user buying the product
            product.totalSold += order.qty;
        }

        await product.save()
    })

     // user logged in can see their order
     user.orders.push(order?._id);
     await user.save();  

    // make payment (stripe)
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: 'Hats',
                    description: 'Best Hats Minimalist'
                },
                unit_amount: 10 * 100
            },
            quantity: 2,
        }],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancle'
    })

    res.send({ url: session.url })

    // payment webhook
    
    // res.status(201).json({
    //     success: true,
    //     message: "Order Successfully Created",
    //     order,
    //     user
    // })
});