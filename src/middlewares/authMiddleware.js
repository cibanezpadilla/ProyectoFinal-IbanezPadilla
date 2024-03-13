import { logger } from "../utils/logger.js";


import jwt from "jsonwebtoken";
import config from "../config/config.js"
const SECRET_KEY_JWT = config.secret_jwt

export const authMiddleware = (roles) => {
  return (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]; // Verifica el header Authorization
    
    if (!token && req.cookies) {
      token = req.cookies.token; // Verifica las cookies en busca del token
    }

    if (!token) {
      return res.status(401).json({ message: 'Not user logged, you must log in' });
    }

    try {      
      const decoded = jwt.verify(token, SECRET_KEY_JWT);      
      req.user = decoded;      
      
      
      if (roles && !roles.includes(req.user.role)) {
        return res.redirect('/forbidden')
        /* return res.status(403).json({ message: 'Forbidden route' }); */
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized error' });
    }
  };
};