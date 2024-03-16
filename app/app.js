import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/usersRoute.js';
import productsRoutes from '../routes/productsRoute.js';
import categoriesRouter from "../routes/categoriesRoute.js";
import brandRouter from "../routes/brandsRoute.js";
import colorsRouter from "../routes/colorsRoute.js";
import reviewsRouter from "../routes/reviewsRoute.js";
import orderRouter from "../routes/orderRoute.js";
import couponsRouter from '../routes/couponsRoute.js';

import { globalErrorHandler, notFound } from '../middlewares/globalErrorHandler.js';
import logger from "../lib/logger.js";
import Stripe from 'stripe';
import Order from '../models/Order.js';


// load env to memory
dotenv.config();

// connecting to database
dbConnect();

const app = express();
const stripe = new Stripe(process.env.STRIPE_KEY)

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_07e0d1dc580a56b8119fba8203a9768501e1f8bfb2f00b7350871467d28cab05";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    // update the order
    const session = event.data.object;
    const { orderId } = session?.metadata;
    const paymentStatus = session?.payment_status;
    const paymentMethod = session?.payment_method_types[0];
    const totalAmount = session?.amount_total;
    const currency = session?.currency;

    // then find the order
    const order = await Order.findByIdAndUpdate(
      JSON.parse(orderId),
      {
        totalPrice: totalAmount / 100,
        currency,
        paymentMethod,
        paymentStatus
      },
      {
        new: true,
      }
    )

    console.log(order);
  } else {
    return;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// cors
app.use(cors());
// logger
app.use(logger); 
// pass incoming data
app.use(express.json());

// routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRoutes)
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandRouter);
app.use("/api/v1/colors/", colorsRouter);
app.use("/api/v1/reviews/", reviewsRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/coupons", couponsRouter);

// error handler
app.use(globalErrorHandler)
app.use(notFound);

export default app;
