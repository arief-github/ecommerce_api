import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

/**
    @desc    Create new Coupon
    @route   POST /api/v1/coupons
    @access  Private/Admin
 * 
**/

export const createCouponController = asyncHandler(async (req, res) => {
    const { code, discount } = req.body;

    const startDateParts = req.body.startDate.split('-');
    const startDate = new Date(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`);
    
    const endDateParts = req.body.endDate.split('-');
    const endDate = new Date(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`);
   
    //check if coupon already exists
    const couponsExists = await Coupon.findOne({
      code,
    });
    if (couponsExists) {
      throw new Error("Coupon already exists");
    }
    //check if discount is a number
    if (isNaN(discount)) {
      throw new Error("Discount value must be a number");
    }
    //create coupon
    const coupon = await Coupon.create({
      code: code,
      startDate,
      endDate,
      discount,
      user: req.userAuthId,
    });
    //send the response
    res.status(201).json({
      status: "success",
      message: "Coupon created successfully",
      coupon,
    });
});

/**
    @desc    GET all coupons
    @route   GET /api/v1/coupons
    @access  Private/Admin
 * 
**/

export const getAllCouponsController = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();

    res.status(201).json({
        status: 'success',
        message: 'All Coupons',
        coupons,
    });
})

/**
    @desc    GET single coupon
    @route   GET /api/v1/coupon/:code
    @access  Private/Admin
 * 
**/

export const getCouponController = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findOne({ code: req.query.code });

    // check if coupon not found
    if (coupon === null) {
        throw new Error("Coupon not found")
    }

    // check if coupon is expired
    if (coupon.isExpired) {
        throw new Error("Coupon is Expired")
    }

    res.status(201).json({
        status: "success",
        message: "Coupon Detail",
        coupon
    });
});

/**
    @desc    Edit Existing Coupon
    @route   PUT /api/v1/coupons/:code
    @access  Private/Admin
 * 
**/

export const updateCouponController = asyncHandler(async (req, res) => {
    const { code, discount } = req.body;

    const startDateParts = req.body.startDate.split('-');
    const startDate = new Date(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`);
    
    const endDateParts = req.body.endDate.split('-');
    const endDate = new Date(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`);
   
    //create coupon
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
    }, {
        new: true
    });
    //send the response
    res.status(201).json({
      status: "success",
      message: "Coupon updated successfully",
      coupon,
    });
});

/**
    @desc    Delete Coupon
    @route   DELETE /api/v1/coupons/:code
    @access  Private/Admin
 * 
**/

export const deleteCouponController = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Coupon deleted successfully",
        coupon
    });
})