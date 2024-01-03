import express from 'express';
import { registerUserController, loginUserController, getUserProfileController } from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router();

userRoutes.post("/register", registerUserController);
userRoutes.post("/login", loginUserController);
userRoutes.get("/profile", isLoggedIn ,getUserProfileController);

export default userRoutes;