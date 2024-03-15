import express from 'express';
import { createProductController,
     getProductsController, 
     getProductController, 
     updateProductController,
     deleteProductController
    } from '../controllers/productsController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const productsRoutes = express.Router();

productsRoutes.post("/", isLoggedIn, isAdmin, upload.array('files') ,createProductController)
productsRoutes.get("/", isLoggedIn, getProductsController)
productsRoutes.get("/:id", getProductController)
productsRoutes.put("/:id/update", isLoggedIn, isAdmin, updateProductController)
productsRoutes.delete("/:id/delete", isLoggedIn, isAdmin, deleteProductController)

export default productsRoutes;