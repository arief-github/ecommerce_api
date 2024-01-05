import { checkRequiredFields } from "../helpers/checkRequiredFields.js";
import { createError } from "../helpers/createError.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';

import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

/**
 * @desc   Register User
 * @route  POST /api/v1/users/register
 * @access Private
 **/

export const registerUserController = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    // Check if email user is existing on the database
    // if exist, thrown an error

    const userExist = await User.findOne({ email });

    if (userExist) {
        // thrown error message
        throw createError("User already exists", 400)
    }

    // Check for empty fields
    const reqFields = [
        { name: 'fullname', value: fullname },
        { name: 'email', value: email },
        { name: 'password', value: password }
    ];

    const missingFields = checkRequiredFields(reqFields);

    if (missingFields.length > 0) {
        throw createError(`Please Provide all required fields: ${missingFields.join(", ")}`, 400);
    }

    // Check for type email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw createError("Please provide a valid email address", 400);
    }

    // Check for minimum length of inputs
    const minLength = 6;
    if (fullname.length < minLength || email.length < minLength || password.length < minLength) {
        throw createError(`Please provide inputs with a minimum length of ${minLength}`, 400);
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
        fullname,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        status: 'Success',
        message: 'User Created Successfully',
        data: user
    });

})

/**
 * @desc   Login User
 * @route  POST /api/v1/users/login
 * @access Public
 **/

export const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for empty fields
    const reqFields = [
        { name: 'email', value: email },
        { name: 'password', value: password }
    ];

    const missingFields = checkRequiredFields(reqFields);

    if (missingFields.length > 0) {
        throw createError(`Please provide all required fields: ${missingFields.join(', ')}`, 400);
    }

    // Check for type email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw createError("Please provide a valid email address", 400);
    }

    // Check for minimum length of inputs
    const minLength = 6;
    if (email.length < minLength || password.length < minLength) {
        throw createError(`Please provide inputs with a minimum length of ${minLength}`, 400);
    }

    // Find the user in db by email only
    const userFound = await User.findOne({
        email,
    });

    // comparing username and password hashed with actual password user
    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
        res.status(201).json({
            code: 201,
            status: 'success',
            msg: 'User Logged In Successfully',
            userFound,
            token: generateToken(userFound?._id)
        })
    } else {
        throw createError("Invalid Login Credentials", 400);
    }
})

/**
 * @desc   GET user profile
 * @route  GET /api/v1/users/profile
 * @access Private
 **/

export const getUserProfileController = asyncHandler(async(req, res) => {
    // find the user
    const user = await User.findById(req.userAuthId).populate("orders");

    res.status(201).json({
        msg: "User Profile Fetched Successfully",
        user
    })
})

/**
 * @desc   Update user shipping address
 * @route  PUT /api/v1/users/update/shipping
 * @access Private
 **/

export const updateShippingAddressController = asyncHandler(async(req, res) => {
    const { firstName, 
        lastName, 
        address, 
        city, 
        postalCode, 
        province, 
        country,
        phone } = req.body;

    // find the user by id
    // and then update the shipping address
    const user = await User.findByIdAndUpdate(req.userAuthId, {
        shippingAddress: {
            firstName, 
            lastName, 
            address, 
            city, 
            postalCode, 
            province, 
            country,
            phone
        },
        hasShippingAddress: true,
    }, {
        new: true
    });

    // send response
    res.status(201).json({
        status: "success",
        msg: "User shipping address updated successfully",
        user,
    })
})

