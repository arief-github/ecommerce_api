import express from "express";
import {createCategoryController, getAllCategoriesController, getSingleCategoriesController, updateCategoryController, deleteCategoryController} from "../controllers/categoriesController.js";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";


const categoriesRouter = express.Router();

categoriesRouter.post('/', isLoggedIn, createCategoryController);
categoriesRouter.get("/", getAllCategoriesController);
categoriesRouter.get("/:id", getSingleCategoriesController);
categoriesRouter.put("/:id/update", isLoggedIn ,updateCategoryController);
categoriesRouter.delete("/:id/delete", isLoggedIn , deleteCategoryController);
export default categoriesRouter;