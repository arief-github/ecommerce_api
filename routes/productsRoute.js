import express from 'express';
import { createProductController,
     getProductsController, 
     getProductController, 
     updateProductController,
     deleteProductController
    } from '../controllers/productsController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';

const productsRoutes = express.Router();

productsRoutes.post("/", isLoggedIn, upload.array('files') ,createProductController)
productsRoutes.get("/", getProductsController)
productsRoutes.get("/:id", getProductController)
productsRoutes.put("/:id/update", isLoggedIn, updateProductController)
productsRoutes.delete("/:id/delete", isLoggedIn, deleteProductController)

export default productsRoutes;