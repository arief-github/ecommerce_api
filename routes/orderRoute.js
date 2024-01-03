import express from "express";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import {createOrderController} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderController);

export default orderRouter;