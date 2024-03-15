import express from "express";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import {createOrderController,getOrdersStatisticsController, getAllOrdersController} from "../controllers/orderController.js";
import isAdmin from "../middlewares/isAdmin.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderController);
orderRouter.get("/", isLoggedIn, isAdmin, getAllOrdersController);
orderRouter.get("/sales/stats", isLoggedIn, getOrdersStatisticsController);

export default orderRouter;