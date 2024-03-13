import { productsService, usersService } from "../repositoryServices/index.js";
import {generateProduct} from '../faker.js'
import mongoose from "mongoose";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages, ErrorName } from "../errors/errors.enum.js";
import { logger } from "../utils/logger.js";
import { uManager } from "../DAL/dao/users.dao.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js"
import { transporter } from "../utils/nodemailer.js"
const SECRET_KEY_JWT = config.secret_jwt

export const findProds = async (req, res) => {
    try{
        const prods = await productsService.findAllProds(req.query);
        logger.info("prods", prods)
        res.status(200).json({ prods });
    }catch (error){
        logger.error(error)
        res.status(500).json({message: error.message})
    }    
};


export const findProductById = async (req, res, next) => {
    try{
        const { pid } = req.params;
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            logger.warning("Invalid Mongoose ObjectID format")
            return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
        }
        const prod = await productsService.findProdById(pid);
        if (!prod) {            
            logger.warning("Product not found with the id provided")
            return CustomError.generateError(ErrorMessages.PRODUCT_NOT_FOUND,404, ErrorName.PRODUCT_NOT_FOUND);
        }
        return res.status(200).json({ message: "Product found", prod });
    }catch (error) {
        logger.error(error)
        next(error)
        /* res.status(500).json( {message: error.message} ); */
    }        
};


export const createProduct =  async (req, res, next) => {
    const { title, description, price, code, stock, category } = req.body;    
    let token = req.headers.authorization?.split(' ')[1]
    if (!token && req.cookies) {
        token = req.cookies.token; // Verifico las cookies en busca del token
    }
    let user;
    if (token){
        const decoded = jwt.verify(token, SECRET_KEY_JWT);      
        user = decoded;
    }   
    


    if (!title || !description || !price || !code || !stock || ! category) {        
        logger.warning("Some data is missing")
        return CustomError.generateError(ErrorMessages.MISSING_DATA,400, ErrorName.MISSING_DATA);
    }
    try {
        const elAdmin = await uManager.findUserByRole("ADMIN")
        if (!user){
            user = elAdmin
        }
        const createdProduct = await productsService.createProd({ ...req.body, owner: user._id });
    res.status(200).json({ message: "Product created", product: createdProduct });
    }catch (error){
        logger.error(error)
        next(error)
        // res.status(500).json({ message: error.message });
    }
    
};


export const deleteOneProduct = async (req, res) => {
    const { pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        logger.warning("Invalid Mongoose ObjectID format")
        return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
    }
    try {
        const product = await productsService.findProdById(pid)
        const productTitle = product.title        
        const owner = await usersService.findById(product.owner)
        /* console.log(owner) //aca me sale el usuario completo */               

        const prod = await productsService.deleteOneProd(pid);
        if (!prod) {
            logger.warning("Product not found with the id provided")
            return CustomError.generateError(ErrorMessages.PRODUCT_NOT_FOUND,404, ErrorName.PRODUCT_NOT_FOUND);
        }

        await transporter.sendMail({
            from: "internetcosmikfaery@gmail.com",
            to: owner.email,
            subject: "Product deleted",
            html: `<b>Your product ${productTitle} has been deleted</b>`,
        });

        res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        logger.error(error)
        next(error)
        // res.status(500).json({ message: error.message });
    }
}


export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        logger.warning("Invalid Mongoose ObjectID format")
        return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
    }
    try {
        const prod = await productsService.updateProd(pid, req.body);
        if (!prod) {
            logger.warning("Product not found with the id provided")
            return CustomError.generateError(ErrorMessages.PRODUCT_NOT_FOUND,404, ErrorName.PRODUCT_NOT_FOUND);
        }
        res.status(200).json({ message: "Product updated", prod });
    }catch (error) {
        logger.error(error)
        next(error)
        // res.status(500).json({ message: error.message });
    }
}


export const productMocks = (req, res) => {
    try{
        const products = generateProduct()
        return res.json({ products })        
    }catch (error){
        logger.error(error)
        res.status(500).json({message: error.message})
    }    
};

