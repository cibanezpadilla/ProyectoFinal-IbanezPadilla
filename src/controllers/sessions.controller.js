import { uManager } from "../DAL/dao/users.dao.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js"
const SECRET_KEY_JWT = config.secret_jwt
import { hashData, compareData } from "../utils/utils.js";
import { generateToken } from "../utils/utils.js"
import UsersResponseDto from "../DAL/dtos/users-response.dto.js";
import { transporter } from "../utils/nodemailer.js"





export const signup = (req, res) => {
    try{
        res.redirect('/login')     
    }catch (error){
        res.status(500).json({message: error.message})
    }
};



export const login = (req, res) => {
    try{
        const {_id, name, email, age, role, carts} = req.user   
        const token = generateToken({ _id, name, email, age, role, carts})           
        res.cookie('token', token, { maxAge: 900000, httpOnly: true })        
        return res.redirect('/home')
        // console.log("req.user del login de session router", req.user)     
    }catch (error){
        res.status(500).json({message: error.message})
    }
};



export const current = (req, res) => {
    try{
        const userDTO = new UsersResponseDto(req.user);        
        res.status(200).json({message: 'User logged', user: userDTO})
    }catch (error){
        res.status(500).json({message: error.message})
    }
};



export const signout = async (req, res) => {
    try{
        if(!req.session.passport){
            return res.redirect('/login')
        }     
        if(req.cookies.token){
        const token = req.cookies.token;
        const user = jwt.verify(token, SECRET_KEY_JWT)        
        const userDate = await uManager.updateUser(
            { _id: user._id },
            { last_connection: new Date() } 
        );
        req.session.destroy(()=> {       
        res.redirect('/login')
        })
        }    
        // res.clearCookie('token');
        // res.redirect("/api/views/login");
    }catch (error){
        res.status(500).json({message: error.message})
    }
};



export const restore = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await uManager.findUserByEmail(email);      
      if (!user) {        
        return res.send("User does not exist with the email provided");
      }
      await transporter.sendMail({
        from: "internetcosmikfaery@gmail.com",
        to: email,
        subject: "Recovery instructions",
        html: `<b>Please click on the link below</b>
              <a href="http://localhost:8080/restart/${user._id}">Restore password</a>
        `,
      });
  
      const tokencito = generateToken({email}) 
         
      res.cookie('tokencito', tokencito, { maxAge: 3600000, httpOnly: true })
      console.log("tokencito", tokencito)
      
      /* res.status(200).json({ message: "Recovery email sent" }); */
      res.redirect('/restoreEmailSent')
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};






export const restart = async (req, res) => {
    const { pass, repeat } = req.body;
    const { id } = req.params  
    const user = await uManager.findUserByID(id);  
       
    if(req.cookies.tokencito){
        try {    
        
          if (pass !== repeat){
            res.cookie('errorMessage', "Passwords must match", { maxAge: 3000 }); // Guardo en la cookie el mensaje de error y lo recupero en el views controller para renderizarlo en la vista
            return res.redirect(`/restart/${id}`); // Redirige de vuelta a la página de inicio de sesión           
          }
          const isPassRepeated = await compareData(pass, user.password)
          if(isPassRepeated){
            res.cookie('errorMessage', "This password is not allowed", { maxAge: 3000 }); 
            return res.redirect(`/restart/${id}`);
          }     
          const newHashedPassword = await hashData(pass);    
          user.password = newHashedPassword;
          await user.save();
          /* res.status(200).json({ message: "Password updated", user }); //aca que renderice vista password updatd succesfuly */
          res.redirect('/passwordUpdated')
        } catch (error) {
          res.status(500).json({ error });
        }
    } else {
      /* console.log("No hay token en las cookies. Redirigiendo manualmente a /restore"); */
      return res.redirect("/restore")
    }
};









