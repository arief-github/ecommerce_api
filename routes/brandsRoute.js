import express from "express";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

import {
    createBrandController,
    getSingleBrandController,
    getAllBrandsController,
    updateBrandController,
    deleteBrandController
} from "../controllers/brandsController.js";


const brandRouter = express.Router();

brandRouter.post("/", isLoggedIn, isAdmin, createBrandController);
brandRouter.get("/", getAllBrandsController);
brandRouter.get("/:id", getSingleBrandController);
brandRouter.put("/:id/update", isLoggedIn, isAdmin, updateBrandController);
brandRouter.delete("/:id/delete", isLoggedIn, isAdmin, deleteBrandController);

export default brandRouter;