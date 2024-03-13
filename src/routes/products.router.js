import { Router } from "express";
import { findProds, findProductById, createProduct, deleteOneProduct, updateProduct, productMocks } from '../controllers/products.controller.js';
import { productsService } from "../repositoryServices/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { avoidDeletion } from "../middlewares/avoidDeletion.middleware.js";
import passport from "passport"

const router = Router();


/* GET PRODUCTS */
router.get("/", findProds);


/* MOCKING PRODUCTS */
router.get("/mockingproducts", productMocks);


/* GET PRODUCTS BY ID */
router.get('/:pid', findProductById)


/* ADD PRODUCT */
router.post("/", /* passport.authenticate('jwt', {session: false}), */ authMiddleware(["PREMIUM", "ADMIN"]), createProduct);


/* DELETE PRODUCT */
router.delete("/:pid", authMiddleware(["ADMIN", "PREMIUM"]), avoidDeletion(), deleteOneProduct);


/* UPDATE PRODUCT */
router.put("/:pid", authMiddleware(["ADMIN"]), updateProduct);






export default router