import express from "express";
import {
    createColorController,
    getSingleColorController,
    getAllColorsController,
    updateColorController,
    deleteColorController
} from "../controllers/colorsController.js";
import {isLoggedIn} from "../middlewares/isLoggedIn.js";

const colorsRouter = express.Router();

colorsRouter.post('/', isLoggedIn, createColorController);
colorsRouter.get("/", getAllColorsController);
colorsRouter.get("/:id", getSingleColorController);
colorsRouter.put("/:id/update", isLoggedIn ,updateColorController);
colorsRouter.delete("/:id/delete", isLoggedIn , deleteColorController);

export default colorsRouter;