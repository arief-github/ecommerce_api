import Category from "../models/Category.js";
import asyncHandler from "express-async-handler";
import {createError} from "../helpers/createError.js";

/**
 * @desc   Create new category
 * @route  POST /api/v1/categories
 * @access Private/Admin
 **/

export const createCategoryController = asyncHandler(async(req, res) => {
    const { name } = req.body;

//     check if category exists

    const categoryFound = await Category.findOne({ name });

    if(categoryFound) {
        throw createError('Category Existed', 400);
    }

//     create
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req.file.path,
    });

    res.status(201).json({
        status: "success",
        message: "Category created successfully",
        category,
    })
})

/**
 * @desc   Get All Categories
 * @route  POST /api/v1/categories
 * @access Public
 **/

export const getAllCategoriesController = asyncHandler(async(req, res) => {
    const categories = await Category.find();

    res.status(201).json({
        status: "success",
        message: "Category Shows",
        categories
    })
})

/**
 * @desc   Get Single Categories
 * @route  POST /api/v1/categories/:id
 * @access Public
 **/

export const getSingleCategoriesController = asyncHandler(async(req, res) => {
    const category = await Category.findById(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Category Show",
        category
    })
})

/**
 * @desc   Update Category
 * @route  POST /api/v1/categories/:id/update
 * @access Private/Admin
 **/

export const updateCategoryController = asyncHandler(async(req, res) => {
    const { name } = req.body;

//     update
    const category = await Category.findByIdAndUpdate(
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
        category
    })
})

/**
 * @desc   Delete Category
 * @route  POST /api/v1/categories/:id/delete
 * @access Private/Admin
 **/

export const deleteCategoryController = asyncHandler(async(req, res) => {
    await Category.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Category deleted successfully"
    })
});
