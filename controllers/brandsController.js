import asyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";
import { createError } from "../helpers/createError.js";

/**
 * @desc   Create new brand
 * @route  POST /api/v1/brands
 * @access Private/Admin
 **/

export const createBrandController = asyncHandler(async (req, res) => {
    const { name } = req.body;

    //     check if brand exists
    const brandFound = await Brand.findOne({ name });

    if (brandFound) {
        throw createError("Brand already exists")
    }

    if (!name) {
        throw createError("Please provide brand name", 400);
    }

    //     create brand
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId
    });

    res.status(201).json({
        status: "success",
        msg: "Brand created succesfully",
        brand
    })
})

/**
 * @desc   Get All Brands
 * @route  POST /api/brands
 * @access Public
 **/

export const getAllBrandsController = asyncHandler(async (req, res) => {
    const brands = await Brand.find();

    res.status(201).json({
        status: "success",
        msg: "Brands fetched successfuly",
        brands
    })
})

/**
 * @desc   Get Single Brand
 * @route  POST /api/v1/brands/:id
 * @access Public
 **/

export const getSingleBrandController = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);

    res.status(201).json({
        status: "success",
        msg: "Brand Show",
        brand
    })
})

/**
* @desc   Update Brand
* @route  POST /api/v1/brands/:id/update
* @access Private/Admin
**/

export const updateBrandController = asyncHandler(async (req, res) => {
    const { name } = req.body;

    //     update
    const brand = await Brand.findByIdAndUpdate(
        req.params.id, {
        name
    },
        {
            new: true
        }
    );

    res.status(201).json({
        status: "success",
        message: "category updated successfully",
        brand
    })
})

/**
 * @desc   Delete Brand
 * @route  POST /api/v1/brands/:id/delete
 * @access Private/Admin
 **/

export const deleteBrandController = asyncHandler(async (req, res) => {
    await Brand.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Category deleted successfully"
    })
});

