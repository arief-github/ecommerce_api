import express from "express";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import {createReviewController} from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productId", isLoggedIn, createReviewController);

export default reviewsRouter;