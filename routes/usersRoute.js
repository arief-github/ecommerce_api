import express from 'express';
import { registerUserController, loginUserController, getUserProfileController, updateShippingAddressController } from '../controllers/userController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router();

userRoutes.post("/register", registerUserController);
userRoutes.post("/login", loginUserController);
userRoutes.get("/profile", isLoggedIn ,getUserProfileController);
userRoutes.put("/update/shipping", isLoggedIn, updateShippingAddressController);

export default userRoutes;