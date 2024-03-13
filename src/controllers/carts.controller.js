import { cartsService, productsService } from "../repositoryServices/index.js";
import mongoose from "mongoose";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages, ErrorName } from "../errors/errors.enum.js";
import { logger } from "../utils/logger.js";


export const createACart = (req, res) => {
    try{
        const cart = cartsService.createNewCart();
        res.status(200).json({ message: "Cart created" });
    }catch (error){
        res.status(500).json({message: error.message})
    }
};


export const findCart = async (req, res, next) => {
    try{
        const { cid } = req.params;
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            logger.warning("Invalid Mongoose ObjectID format")
            return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
        }
        const cart = await cartsService.findCartById(cid);
        if (!cart) {      
            logger.warning("Cart not found with the id provided")      
            return CustomError.generateError(ErrorMessages.CART_NOT_FOUND,404, ErrorName.CART_NOT_FOUND);
        }
        res.status(200).json({ message: "Cart found", cart, payload : cart.products });
    }catch (error) {
        logger.error(error)
        next(error)        
        // res.status(500).json({ message: error.message });
        
    }        
};



export const addProductToCart =  async (req, res) => {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid) ) {
        logger.warning("Invalid Mongoose ObjectID format")
        return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
    }    
    try {
        const productAdded = await cartsService.addProduct(cid, pid);        
        if (!productAdded) {     
            logger.warning("Cart or product not found with the ids provided")       
            return CustomError.generateError(ErrorMessages.CART_OR_PRODUCT_NOT_FOUND,404, ErrorName.CART_OR_PRODUCT_NOT_FOUND);
        }
        const product = await productsService.findProdById(pid)
    res.status(200).json({ message: "Product added to Cart", cart : productAdded, payload: product });
    }catch (error){
        logger.error(error)
        next(error) 
        /* res.status(500).json({ message: error.message }); */
    }    
};


export const deleteFromCart =  async (req, res, next) => {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid) ) {
        logger.warning("Invalid Mongoose ObjectID format")
        return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
    }
    try {
        const productDeleted= await cartsService.deleteOneFromCart(cid, pid);
        if (!productDeleted) {         
            logger.warning("Cart or product not found with the ids provided")    
            return CustomError.generateError(ErrorMessages.CART_OR_PRODUCT_NOT_FOUND,404, ErrorName.CART_OR_PRODUCT_NOT_FOUND);
        }       
    res.status(200).json({ message: "Product deleted from Cart", cart: productDeleted, payload: productDeleted.product});
    }catch (error){
        logger.error(error)
        next(error) 
        // res.status(500).json({ message: error.message });
    }    
};


export const updateProducts = async (req, res) => {
    const { cid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        logger.warning("Invalid Mongoose ObjectID format")
        return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
    }     
    try {
        const { products } = req.body
        if (!products) {      
            logger.warning("Some data is missing")      
            return CustomError.generateError(ErrorMessages.MISSING_DATA,400, ErrorName.MISSING_DATA);
        }
        const cartProds = await cartsService.updateAllProducts(cid, products);       
        if (!cartProds) {
            logger.warning("Cart not found with the id provided")             
            return CustomError.generateError(ErrorMessages.CART_NOT_FOUND,404, ErrorName.CART_NOT_FOUND);
        }
        res.status(200).json({ message: "Products updated", cartProds });
    }catch (error) {
        logger.error(error)
        next(error) 
        // res.status(500).json({ message: error.message });
    }
}

export const updateProdQuantity = async (req, res) => {    
    try {
        const {cid, pid} = req.params
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid) ) {
            logger.warning("Invalid Mongoose ObjectID format")
            return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
        }        
        const { quantity } = req.body  
        if (!quantity) {
            logger.warning("Some data is missing")             
            return CustomError.generateError(ErrorMessages.MISSING_DATA,400, ErrorName.MISSING_DATA);
        }      
        const response = await cartsService.updateQuantity(cid, pid, +quantity);       
        if (!response) {
            logger.warning("Cart or product not found with the ids provided")            
            return CustomError.generateError(ErrorMessages.CART_OR_PRODUCT_NOT_FOUND,404, ErrorName.CART_OR_PRODUCT_NOT_FOUND);
        }
        const cart = await cartsService.findCartById(cid);        
        res.status(200).json({ message: "Product updated", response, payload: cart.products });
    }catch (error) {
        logger.error(error)
        next(error) 
        // res.status(500).json({ message: error.message });
    }
}


export const deleteAllProductsCart = async (req, res, next) => {    
    try {
        const {cid} = req.params
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            logger.warning("Invalid Mongoose ObjectID format")
            return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
        }              
        const response = await cartsService.deleteAllProductsInCart(cid);
        if (!response) {
            logger.warning("Cart not found with the id provided")     
            return CustomError.generateError(ErrorMessages.CART_NOT_FOUND,404, ErrorName.CART_NOT_FOUND);
        }       
        res.status(200).json({ message: "Products deleted", response });
    }catch (error) {
        logger.error(error)
        next(error) 
        // res.status(500).json({ message: error.message });
    }
}

export const thePurchase = async (req, res, next) => {    
    try {
        const {cid} = req.params
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            logger.warning("Invalid Mongoose ObjectID format")
            return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
        }              
        const response = await cartsService.purchase(cid);
        if (!response) {
            logger.warning("Cart not found with the id provided")            
            return CustomError.generateError(ErrorMessages.CART_NOT_FOUND,404, ErrorName.CART_NOT_FOUND);
        }
        if (response.ticket){
            res.status(200).json({ payload: response });            
            
        } else {
            res.status(200).json({ /* message: "Purchase",  */payload: response });
        }
        
    }catch (error) {
        logger.error(error)
        next(error) 
        // res.status(500).json({ message: error.message });
    }
}