import {Router} from "express"
import { signup, login, current, signout, restart, restore } from "../controllers/sessions.controller.js";
import passport from "passport"
import "../passport.js"
import config from "../config/config.js"
const SECRET_KEY_JWT = config.secret_jwt



const router = Router();


router.post('/signup', passport.authenticate('signup'), signup)

router.post('/login', passport.authenticate('login', {failureMessage: true, failureRedirect: "/login"}), login)

router.get('/current', passport.authenticate('jwt', {session: false}), current)

router.get('/signout', signout)

router.post('/restart/:id', restart)

router.post('/restore', restore)





export default router