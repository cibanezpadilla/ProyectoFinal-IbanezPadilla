import { Router } from "express";
import { createACart, findCart, addProductToCart, deleteFromCart, updateProducts, updateProdQuantity, deleteAllProductsCart, thePurchase } from "../controllers/carts.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { avoidAddToCart } from "../middlewares/avoidAddToCart.middleware.js";


const router = Router();

/* CREATE CART */
router.post('/', createACart)


/* GET CART */
router.get('/:cid', findCart) 



/* ADD PRODUCT TO CART */
router.post('/:cid/products/:pid', authMiddleware(["USER", "PREMIUM"]), avoidAddToCart(),  addProductToCart)



//DELETE PRODUCT FROM CART
router.delete('/:cid/products/:pid', deleteFromCart)



//UPDATE CART PRODUCTS ARRAY
router.put('/:cid', updateProducts)



//UPDATE PRODUCT QUANTITY
router.put('/:cid/products/:pid', updateProdQuantity)



//DELETE ALL PRODUCTS
router.delete('/:cid', deleteAllProductsCart)



//PURCHASE
router.get('/:cid/purchase', thePurchase)


export default router