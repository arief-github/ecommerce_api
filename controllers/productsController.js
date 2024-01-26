import { createError } from "../helpers/createError.js";
import Product from "../models/Product.js";
import asyncHandler from 'express-async-handler';
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";

/**
 * @desc   Create new product
 * @route  POST /api/v1/products
 * @access Private/Admin
 **/

export const createProductController = asyncHandler(async(req, res) => {
    try {
        console.log(req.files);

        const { name, description, category, sizes, colors, brand,price, totalQty } = req.body;
    
        // handling for upload
        const convertedImages = req.files.map((file) => file?.path);
    
        // Checking product exists
        const productExists = await Product.findOne({ name });
    
        if (productExists) {
            throw createError('Product Already Exists', 400);
        }
    
        // find the category
        const categoryFound = await Category.findOne({
            name: category,
        })
    
        // find the brand
        const brandFound = await Brand.findOne({
            name: brand.toLowerCase()
        })
    
        if(!categoryFound) {
            throw createError("Category not found, please create category first or check category name", 400)
        } else if (!brandFound) {
            throw createError("Brand not found", 400);
        }
    
        // create the product
        const product = await Product.create({
            name,
            description,
            category,
            sizes,
            colors,
            brand,
            user: req.userAuthId,
            price,
            totalQty,
            images: convertedImages
        });
    
        // push the product into category and brand
        categoryFound.products.push(product._id);
        brandFound.products.push(product._id);
    
        // re-save
        await categoryFound.save()
        await brandFound.save()
    
        // send response
        res.status(201).json({
            status: "success",
            msg: "Product Created Successfully",
            product,
        });
    
    } catch(error) {
        console.log(error)
    }
   
});

/**
 * @desc   Get All Products
 * @route  GET /api/v1/products
 * @access Public
 **/

export const getProductsController = asyncHandler(async(req, res) => {
    // query product
    let productQuery = Product.find();

    // search by name
    if (req.query.name) {
        productQuery = productQuery.find({
            name: {
                $regex: req.query.name,
                $options: "i"
            }
        })
    }

    // filter by brand
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: {
                $regex: req.query.brand,
                $options: "i"
            }
        })
    }
    
    // filter by category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: {
                $regex: req.query.category,
                $options: "i"
            }
        })
    }

    // filter by size
    if (req.query.sizes) {
        productQuery = productQuery.find({
            sizes: {
                $regex: req.query.sizes,
                $options: "i"
            }
        })
    }

    // filter by color
    if (req.query.colors) {
        productQuery = productQuery.find({
            colors: {
                $regex: req.query.colors,
                $options: "i"
            }
        })
    }

    // filter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-");

        // gte => greater than equal
        // lte => less than equal

        productQuery.find({
            price: { $gte: priceRange[0], $lte: priceRange[1] }
        })
    }

    // pagination

    /**
     * @usage
     * /products?page=2&limit=3 it means page 2 with limit show data 3
     *
     */

    // page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

    // limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 5;
    
    // start index page
    const startIndex = (page - 1) * limit;

    // end index page
    const endIndex = page * limit;

    // total product
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit)

    // pagination results
    const paginationResult = {};

    if (endIndex < total) {
        paginationResult.next = {
            page: page + 1,
            limit,
        }
    } else if (startIndex > 0) {
        paginationResult.prev = {
            page: page - 1,
            limit
        }
    }

    // await the query
    const products = await productQuery.populate("reviews");

    res.status(201).json({
        status: "success",
        products,
        results: products.length,
        total,
        paginationResult,
    })
})

/**
 * @desc   Get Single Products
 * @route  GET /api/v1/products/:id
 * @access Public
 **/

export const getProductController = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id).populate("reviews");

    if(product === null) {
        createError('Product Not Found', 400);
    }

    res.status(201).json({
        status: "success",
        msg: "Product Fetched Successfully",
        product,
    })
})

/**
 * @desc   Edit Single Product
 * @route  PUT /api/v1/products/:id/update
 * @access Private/Admin
 **/

export const updateProductController = asyncHandler(async(req, res) => {
    const { name, description, category, sizes, colors, user, brand,price, totalQty, totalSold } = req.body;

    const product = await Product.findByIdAndUpdate(req.params.id, {
        name,
        description,
        category,
        sizes,
        colors,
        user,
        price,
        totalQty,
        brand
    }, {
        new: true
    });

    res.status(201).json({
        status: "success",
        msg: "Product Updated Successfully",
        product
    });
})

/**
 * @desc   Delete Single Product
 * @route  DELETE /api/v1/products/:id/delete
 * @access Private/Admin
 **/

export const deleteProductController = asyncHandler(async(req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        msg: "Product Deleted Successfully",
    })
})
