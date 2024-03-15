import express from 'express';

import {
    createCouponController, 
    getAllCouponsController,
    getCouponController,
    updateCouponController,
    deleteCouponController
} from "../controllers/couponsController.js";
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';

const couponsRouter = express.Router();

couponsRouter.post('/', isLoggedIn, isAdmin, createCouponController);
couponsRouter.get('/', getAllCouponsController);
couponsRouter.get('/single', getCouponController);
couponsRouter.put('/:id/update', isLoggedIn, isAdmin, updateCouponController);
couponsRouter.delete('/:id/delete', isLoggedIn, isAdmin, deleteCouponController);

export default couponsRouter;
