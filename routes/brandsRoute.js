import express from "express";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import {
    createBrandController,
    getSingleBrandController,
    getAllBrandsController,
    updateBrandController,
    deleteBrandController
} from "../controllers/brandsController.js";

const brandRouter = express.Router();

brandRouter.post("/", isLoggedIn,createBrandController);
brandRouter.get("/", getAllBrandsController);
brandRouter.get("/:id", getSingleBrandController);
brandRouter.put("/:id/update", isLoggedIn, updateBrandController);
brandRouter.delete("/:id/delete", isLoggedIn,deleteBrandController);

export default brandRouter;