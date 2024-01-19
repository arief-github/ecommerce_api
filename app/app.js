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
import { globalErrorHandler, notFound } from '../middlewares/globalErrorHandler.js';
import logger from "../lib/logger.js";
import orderRouter from "../routes/orderRoute.js";

// load env to memory
dotenv.config();

// connecting to database
dbConnect();

const app = express();

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
app.use("/api/v1/orders/", orderRouter)

// error handler
app.use(globalErrorHandler)
app.use(notFound);

export default app;
