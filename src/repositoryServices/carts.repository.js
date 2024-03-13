import { cManager } from "../DAL/dao/carts.dao.js";
import { uManager } from "../DAL/dao/users.dao.js";
import { ticketsDao } from "../DAL/dao/tickets.dao.js";
import { v4 as uuidv4 } from 'uuid'
import { logger } from "../utils/logger.js";

export default class CartsRepository {
    
    async createNewCart() {
        const carts = cManager.createCart();
        return carts;
    }

    async findCartById(id) {
        const cart = await cManager.getCartProducts(id);              
        return cart
    }

    async addProduct(cid, pid) {
        const prod = cManager.addProductToCart(cid,pid);
        return prod;
    }

    async deleteOneFromCart(cid, pid) {
        const cart = cManager.deleteProduct(cid,pid);
        return cart;
    }

    async updateAllProducts(cid, arr) {
        const prods = cManager.updateAllProducts(cid, arr);
        return prods;
    }

    async updateQuantity(cid, pid, quantity) {
        const prod = cManager.updateProductQuantity(cid, pid, quantity);
        return prod;
    }

    async deleteAllProductsInCart(cid) {
        const cart = cManager.deleteAllProducts(cid);
        return cart;
    }

    async purchase(cid){        
        const cart = await cManager.getCartProducts(cid)
        const user = await uManager.findUserByCart(cid)
        const products = cart.products
        /* logger.info(user) */
        let availableProducts = []
        let unavailableProducts = []
        let totalAmount = 0
        for(let item of products) {
            logger.info(item)
            if(item.product.stock >= item.quantity){
                availableProducts.push(item)
                item.product.stock -= item.quantity
                await item.product.save()
                totalAmount += item.quantity * item.product.price
            }else{
                unavailableProducts.push(item)
            }
        }
        
        cart.products = unavailableProducts
        await cart.save()
        
        logger.info("available", availableProducts)
        logger.info("unavailable", unavailableProducts)
        if(availableProducts.length){
            const ticket = {
                code:uuidv4(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: user.email
            }
            await ticketsDao.createTicket(ticket)            
            return { availableProducts, totalAmount, ticket }
        }        
        return { unavailableProducts }
    }
}