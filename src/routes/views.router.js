import { Router } from "express";
import { login, signup, documents, home, productDetail, restore, restoreEmailSent, restart, passwordUpdated, errores, forbiddenView, usersManagement, chat, cartDetail, successfulPurchase} from "../controllers/views.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";



const router = Router();



router.get('/login', login)

router.get('/signup', signup)

router.get('/documents', documents)

router.get('/home', home)

router.get('/home/:id', productDetail)

router.get('/restore', restore)

router.get('/restoreEmailSent', restoreEmailSent)

router.get('/restart/:id', restart)

router.get('/passwordUpdated', passwordUpdated)

router.get('/error', errores)

router.get('/forbidden', forbiddenView)

router.get('/users', usersManagement)

router.get('/chat', authMiddleware(["USER", "PREMIUM"]), chat)

router.get('/cart/:cid', cartDetail)

router.get('/successfulPurchase', successfulPurchase)




export default router;