import { usersService } from "../repositoryServices/index.js";
import passport from "passport";
import mongoose from "mongoose";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages, ErrorName } from "../errors/errors.enum.js";
import { logger } from "../utils/logger.js";
import UsersResponseDto from "../DAL/dtos/users-response.dto.js";
import { transporter } from "../utils/nodemailer.js"


export const getAllUsers = async (req, res) => {
    try {              
        const users = await usersService.findAll();
        if (!users) {            
            logger.warning("Users not found")
            return CustomError.generateError(ErrorMessages.USER_NOT_FOUND,404, ErrorName.USER_NOT_FOUND);
        }
        
        const usersMapDTO = users.map(user => UsersResponseDto.fromModel(user))        
        res.status(200).json({ message: "Users found", payload: usersMapDTO });

    } catch (error) {
        logger.error(error)
        next(error)
    }
    
};



export const findUserById = async (req, res, next) => {    
        try{
            const { idUser } = req.params;
            const user = await usersService.findById(idUser)            
            if (!user) {                    
                    logger.warning("User not found with the id provided")   
                    return CustomError.generateError(ErrorMessages.USER_NOT_FOUND,404, ErrorName.USER_NOT_FOUND);
                }
            
            res.status(200).json({ message: "User found", payload: user });
        }catch (error){
            logger.error(error)
            next(error)
        }        
};

export const findUserByEmail = async (req, res) => {
    try {
        const { UserEmail } = req.body;        
        const user = await usersService.findByEmail(UserEmail);
        if (!user) {
            // return res.status(404).json({ message: "There is no user found with this email" });
            logger.warning("User not found with the email provided")
            return CustomError.generateError(ErrorMessages.USER_NOT_FOUND,404, ErrorName.USER_NOT_FOUND);
        }
        res.status(200).json({ message: "User found", user });
    } catch (error) {
        logger.error(error)
        next(error)
    }
    
};

export const createUser =  async (req, res) => {
    try{
        const { name, lastName, email, password } = req.body;
        if (!name || !lastName || !email || !password) {            
            logger.warning("Some data is missing")
            return CustomError.generateError(ErrorMessages.MISSING_DATA,400, ErrorName.MISSING_DATA);
        }
        const createdUser = await usersService.createOne(req.body);
        res.status(200).json({ message: "User created", user: createdUser });
    }catch (error){
        logger.error(error)
        next(error)
    }    
};


export const roleSwapper = async (req, res, next) => {
    const {uid} = req.params    
    try {
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            logger.warning("Invalid Mongoose ObjectID format")
            return CustomError.generateError(ErrorMessages.OID_INVALID_FORMAT,404, ErrorName.OID_INVALID_FORMAT);
        }

        const user = await usersService.findById(uid)        
        logger.debug({message: "user antes de update", user})

        if (!user) {
            logger.warning("User not found with the email provided")
            return CustomError.generateError(ErrorMessages.USER_NOT_FOUND,404, ErrorName.USER_NOT_FOUND);
        }

        let roleChange;
        if (user.role === 'PREMIUM') {            
            roleChange = { role: 'USER' }
        } else if (user.role === 'USER' ){
            if (!user.documents[0] || !user.documents[1] || !user.documents[2]) {
                return res.status(400).json({ message: "Please update your documentation first" });
            }            
            roleChange = { role: 'PREMIUM' }
        }        
        await usersService.updateUser(user._id, roleChange) // lo cambio porque cambie en el dao
        const updatedUser = await usersService.findById(uid); // Obtengo el usuario actualizado desde la base de datos porque si no me lo mostraba sin la actualizacion        
        logger.debug({message: "user updated", updatedUser})        
        res.json({ message: "Role updated", payload: updatedUser });
        
    } catch (error) {
        logger.error(error)
        next(error)
    }
}





export const deleteInactiveUsers = async (req, res, next) => {
try {
    const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);    
    const timingParameter = {
        last_connection: { $lt: twoDaysAgo },
    }
        
    // TESTING DE 2 MINUTOS
    /* const twoMinAgo = new Date();
    twoMinAgo.setMinutes(twoMinAgo.getMinutes() - 2);
    const timingParameter = {
        last_connection: { $lt: twoMinAgo },
    } */

    const usersToDelete = await usersService.findManyUsers(timingParameter)
    
    if (usersToDelete.length == 0) {      
        return res.status(404).json({ message: "No Users to delete" });
    }

    await usersService.deleteManyUsers(timingParameter)

    usersToDelete.forEach( async user => {
        await transporter.sendMail({
            from: "internetcosmikfaery@gmail.com",
            to: user.email,
            subject: "Account deleted",
            html: `<b>Your account ${user.email} has been deleted for inactivity</b>`,
        });
    });   
    return res.status(200).json({ message: "Users deleted" });    
} catch (error) {
    logger.error(error)
    next(error)
} 
};




export const deleteUser = async (req, res) => {
    try {              
        const { idUser } = req.params;    
        const userToDelete = await usersService.findById(idUser)
        const response = await usersService.deleteUser(idUser)        
        res.status(200).json({ payload: userToDelete });
    } catch (error) {
        logger.error(error)
        next(error)
    }    
};

  

export const saveUserDocuments = async (req, res) => {
  const { id } = req.params;
  /* console.log(req.files); //en el obj request guarda la info de los archivos */
  const { dni, address, bank } = req.files;
  const response = await usersService.saveUserDocumentsService({ id, dni, address, bank });
  res.json({ response });
};