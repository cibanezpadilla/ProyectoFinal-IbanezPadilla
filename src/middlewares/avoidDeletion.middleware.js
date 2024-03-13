import { productsService } from "../repositoryServices/index.js";

export const avoidDeletion = () => {
  // Necesito el return para indicar que estoy devolviendo una función, porque es una funcion flecha
    return async (req, res, next) => {      
          
      try {      
        const { pid } = req.params
        const product = await productsService.findProdById(pid)

        
        if ((req.user.role === 'PREMIUM') && (product.owner != req.user._id)) {
            return res.status(403).json({message: 'You cant delete a product that you dont own'})
        }                        
        next();
        
      } catch (error) {
        return res.status(401).json({ message: 'Unauthorized error' });
      }
    };
  };





  /* const authorize = (allowedRoles) => {
    return (req, res, next) => {
      const user = req.user; // Asume que el objeto de usuario está presente en req
  
      if (!user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
  
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Acceso no permitido' });
      }
  
      // Si el usuario es admin, o si es premium y la acción es sobre sus propios productos
      if (user.role === 'ADMIN' || (user.role === 'PREMIUM' && req.params.ownerId === user.id)) {
        next();
      } else {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
      }
    };
  };
  
  module.exports = authorize; */