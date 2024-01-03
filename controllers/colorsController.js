import asyncHandler from "express-async-handler";
import {createError} from "../helpers/createError.js";
import Color from "../models/Color.js";

/**
 * @desc   Create new color
 * @route  POST /api/v1/colors
 * @access Private/Admin
 **/

export const createColorController = asyncHandler(async(req, res) => {
    const { name } = req.body;

//     check if color exists
    const colorFound = await Color.findOne({ name });

    if (colorFound) {
        throw createError("Color already exists")
    }

//     create color
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId
    });

    res.status(201).json({
        status: "success",
        msg: "Color created succesfully",
        color
    })
})

/**
 * @desc   Get All Colors
 * @route  POST /api/colors
 * @access Public
 **/

export const getAllColorsController = asyncHandler(async(req, res) => {
    const colors = await Color.find();

    res.status(201).json({
        status: "success",
        msg: "Colors fetched successfuly",
        colors
    })
})

/**
 * @desc   Get Single Color
 * @route  POST /api/v1/colors/:id
 * @access Public
 **/

export const getSingleColorController = asyncHandler(async(req, res) => {
    const color = await Color.findById(req.params.id);

    res.status(201).json({
        status: "success",
        msg: "color Show",
        color
    })
})

/**
 * @desc   Update Color
 * @route  POST /api/v1/colors/:id/update
 * @access Private/Admin
 **/

export const updateColorController = asyncHandler(async(req, res) => {
    const { name } = req.body;

//     update
    const color = await Color.findByIdAndUpdate(
        req.params.id, {
            name
        },
        {
            new: true
        }
    );

    res.status(201).json({
        status: "success",
        message: "color updated successfully",
        color
    })
})

/**
 * @desc   Delete Color
 * @route  POST /api/v1/colors/:id/delete
 * @access Private/Admin
 **/

export const deleteColorController = asyncHandler(async(req, res) => {
    await Color.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "color deleted successfully"
    })
});

