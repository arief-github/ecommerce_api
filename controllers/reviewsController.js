import Review from "../models/Review.js";
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import {createError} from "../helpers/createError.js";

/**
 * @desc   Create new review
 * @route  POST /api/v1/reviews
 * @access Public
 **/

export const createReviewController = asyncHandler(async(req, res) => {
    const { message, rating } = req.body;

    //     find the product id
    const { productId } = req.params;
    const productFound = await Product.findById(productId).populate("reviews");

    if (!productFound) {
        throw createError("Product not found", 400)
    }

    //     check if user already reviewed this product
    const hasReviewed = productFound?.reviews?.find((review) => {
        return review?.user.toString() === req?.userAuthId.toString()
    });

    if(hasReviewed) {
        throw createError("You have already reviewed this product", 400);
    }

    // create review
    const review = await Review.create({
        message,
        rating,
        product: productFound?._id,
        user: req.userAuthId,
    })

    // push review into product found
    productFound.reviews.push(review?._id);

    // resave
    await productFound.save();

    res.status(201).json({
        success: true,
        message: "Review created successfully",
    });
});

