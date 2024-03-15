import express from "express";
import {
    createColorController,
    getSingleColorController,
    getAllColorsController,
    updateColorController,
    deleteColorController
} from "../controllers/colorsController.js";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";

const colorsRouter = express.Router();

colorsRouter.post('/', isLoggedIn, isAdmin, createColorController);
colorsRouter.get("/", getAllColorsController);
colorsRouter.get("/:id", getSingleColorController);
colorsRouter.put("/:id/update", isLoggedIn, isAdmin, updateColorController);
colorsRouter.delete("/:id/delete", isLoggedIn,isAdmin,deleteColorController);

export default colorsRouter;