import { manager } from "../DAL/dao/products.dao.js";
import { cManager } from "../DAL/dao/carts.dao.js";
import { logger } from "../utils/logger.js";
import { transporter } from "../utils/nodemailer.js"
import { uManager } from "../DAL/dao/users.dao.js";
import { ticketsDao } from "../DAL/dao/tickets.dao.js";



export const login = (req, res) => {
    try{
        if (req.session.passport){
            return res.redirect('/home')
          }      
          const allMessages = req.session.messages; // aca traigo el array completo de mensajes
          if(allMessages){
            const messages = allMessages[allMessages.length - 1]
            return res.render("login", {messages, style: "login"});
          }
          return res.render("login", {style: "login"});        
    }catch (error){
        res.status(500).json({message: error.message})
    }
};


export const signup = (req, res) => {
    try{
        if (req.session.passport){
            return res.redirect('/home')
          }   
          res.render("signup", {style: "signup"});    
    }catch (error){
        res.status(500).json({message: error.message})
    }
};


export const documents = (req, res) => {
    try{
        if (!req.session.passport){
            return res.redirect('/login')
        }
        const { name, email, role} = req.user;
        res.render("documents", {user: { name, email, role}, id: req.user._id, style: "documents"}); //ME RNDERIZA MI DOCUMENTS.HANDLEBARS, EL FORMULARIO y le paso el id, que va a ser dinamico
    }catch (error){
        res.status(500).json({message: error.message})
    }
};




export const home = async (req, res) => {
    try{
        const products = await manager.findAll(req.query)
        const {payload, info, page, limit, order, query} = products
        const { nextPage, prevPage } = info
        const {category} = query      
        const productObject = payload.map(doc => doc.toObject()); 
        if (!req.session.passport){
          return res.redirect('/login')
        }
        const { name, email, role, cart } = req.user;
        logger.debug("req.user", req.user)
        
        let isAdmin = false
        if (req.user.role === 'ADMIN') {
            isAdmin = true
        }        
        res.render('home', { user: { name, email, role, cart }, isAdmin, productList: productObject, category, page, limit, order, nextPage, prevPage, style: "home" });
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};



export const productDetail = async (req, res) => {
    try{
        if (!req.session.passport){
            return res.redirect('/login')
          }
          const { id } = req.params
          const product = await manager.findById(id)
          const { name, email, role, cart } = req.user;                   
          res.render('productDetail', { product: product.toObject(), user: { name, email, role, cart }, style: "productDetail" });
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};





export const restore = (req, res) => {
    try{
        res.render("restore", {style: "restore"});
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};


export const restoreEmailSent = (req, res) => {
    try{        
        res.render("restoreEmailSent", {style: "restore"});
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};


export const restart = (req, res) => {
    try{
        if (req.cookies.tokencito){
            const {id} = req.params
            let errorMessage = req.cookies.errorMessage;
            res.render("restart", {style: "restart", id, errorMessage});
          } else {
            /* console.log("No hay token en las cookies. Redirigiendo manualmente a /restore"); */
            return res.redirect("/restore")
          }
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};


export const passwordUpdated = (req, res) => {
    try{        
        res.render("passwordUpdated", {style: "passwordUpdated"});
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};




export const errores = (req, res) => {
    try{
        const allMessages = req.session.messages; // aca traigo el array completo de mensajes
        const messages = allMessages[allMessages.length - 1]
        logger.debug('req.session', req.session)
        res.render("error", {messages, style: "error"});
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};



export const forbiddenView = (req, res) => {
    try{
        res.render("forbidden", {style: "error"});
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};



export const usersManagement = (req, res) => {
    try{
        if (!req.user || req.user.role != "ADMIN"){
            res.redirect('/forbidden')
          }
        res.render('users', { style: "users", email: req.user.email })
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};


export const chat = (req, res) => {
    try{
        res.render("chat", {style: "chat"});
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};



export const cartDetail = async (req, res) => {
    try{
        if (!req.session.passport){
            return res.redirect('/login')
        }
        const { cid } = req.params
        const { name, email, role, cart } = req.user;
        const response = await cManager.getCartProducts(cid)
        const array = response.products.map(doc => doc.toObject());    
        res.render('cart', {cartProductList: array, cid, user: { name, email, role, cart }, style: "cart" })
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};




export const successfulPurchase = async (req, res) => {
    try{
        if (!req.session.passport){
            return res.redirect('/login')
        }
        const { name, email, role, cart } = req.user;
        const tickets = await ticketsDao.findTicket(email)
        let lastTicket = tickets[tickets.length - 1];

        const dateToParse = lastTicket.purchase_datetime
        const day = dateToParse.getDate();
        const month = dateToParse.getMonth() + 1;
        const year = dateToParse.getFullYear();      
        const GMTtime = dateToParse.toTimeString().split(' ')[0];
        const parsedDate = `${day}/${month}/${year}`;
        /* console.log("fecha Formateada", parsedDate, "y hora", GMTtime) */
        res.render('successful', {user: { name, email, role, cart }, code: lastTicket.code, amount : lastTicket.amount, parsedDate, GMTtime, style: "successful" })
    }catch (error){
        res.status(500).json({ message: error.message })
    }
};

