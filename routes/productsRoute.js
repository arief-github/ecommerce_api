import express from 'express';
import { createProductController,
     getProductsController, 
     getProductController, 
     updateProductController,
     deleteProductController
    } from '../controllers/productsController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productsRoutes = express.Router();

productsRoutes.post("/", isLoggedIn, createProductController)
productsRoutes.get("/", getProductsController)
productsRoutes.get("/:id", getProductController)
productsRoutes.put("/:id/update", isLoggedIn, updateProductController)
productsRoutes.delete("/:id/delete", isLoggedIn, deleteProductController)

export default productsRoutes;