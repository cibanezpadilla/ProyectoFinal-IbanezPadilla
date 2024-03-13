import { productsService, usersService } from "../repositoryServices/index.js";

export const avoidAddToCart = () => {
    return async (req, res, next) => {      
      const {pid}  = req.params
      const product = await productsService.findProdById(pid)      
            
      try {                           
          
        if ((req.user.role === 'PREMIUM') && (product.owner.toString() === req.user._id)) {
            return res.status(401).json({message: 'You cant add your own product to your cart'})
        }            
        
        next();
      } catch (error) {        
        return res.status(401).json({ message: 'Unauthorized error' });        
      }
    };
  };