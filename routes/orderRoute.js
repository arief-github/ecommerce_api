import express from "express";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import {createOrderController, updateOrderController, getOrdersStatisticsController, getAllOrdersController, getSingleOrderController} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderController);
orderRouter.put("/update/:id", isLoggedIn, updateOrderController);
orderRouter.get("/", isLoggedIn, getAllOrdersController);
orderRouter.get("/:id", isLoggedIn, getSingleOrderController);
orderRouter.get("/sales/stats", isLoggedIn, getOrdersStatisticsController);

export default orderRouter;