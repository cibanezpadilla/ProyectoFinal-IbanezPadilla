import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { usersModel } from "./DAL/models/users.model.js";
import UsersRequestDto from "./DAL/dtos/users-request.dto.js"
import UsersResponseDto from "./DAL/dtos/users-response.dto.js";
import { uManager } from "./DAL/dao/users.dao.js";
import { cManager } from "./DAL/dao/carts.dao.js";
import { hashData, compareData } from "./utils/utils.js";



const admin = {
  first_name: 'Admin',
  last_name: 'Coder',
  email: 'adminCoder@coder.com',  
  password: 'adminCod3r123',
  role: 'ADMIN'
}

passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  //como necesito el objeto request pongo el passReqToCallback en true
  passReqToCallback: true
  //y ya a la funcion async le paso tambien el objeto req
}, async(req, email, password, done)=>{  
  const {first_name, last_name, age/* , role */} = req.body
  if (!first_name || !last_name || !age || /* !role || */ !email || !password){
      return done(null, false)
  }
  try{
      const hashedPassword = await hashData(password);      
      const createdCart = await cManager.createCart()
      const userDto = new UsersRequestDto(
        { ...req.body, 
          cart: createdCart._id,
          password: hashedPassword });
      
      let createdUser
      if (email === admin.email) {
        createdUser = await uManager.createUser({
          ...userDto,          
          role: "ADMIN"
        })
        return done(null, createdUser);
      }
      createdUser = await uManager.createUser(userDto);      
      const userDate = await uManager.updateUser(
        { _id: createdUser._id },
        { last_connection: new Date() } 
    );
      done(null, createdUser);
  }catch (error){
      done(error)
  }
}))



passport.use('login', new LocalStrategy({
  usernameField: 'email',    
}, async(email, password, done)=>{
  //y aca creo mi estrategia de login    
  if (!email || !password){      
      return done(null, false, {message: 'All fields are required'})
  }
  try{
      let user;
      const isAdminPassValid = await compareData(password, admin.password)
      if (email === admin.email && isAdminPassValid) {
      user = admin
      }else{
        user = await uManager.findUserByEmail(email)
        
        if(!user){
            return done(null, false, {message: 'You need to sign up first'})
            }
        const isPassValid = await compareData(password, user.password)
        if(!isPassValid){
            return done(null, false, {message: 'Incorrect username or password'})
        }
        const userDate = await uManager.updateUser(
          { _id: user.id },
          { last_connection: new Date() } 
      );
      }      
      done(null, user)      
  }catch (error){
      done(error)
  }
}))



const fromCookies = (req) => {
  return req.cookies.token;
};// esta funcion va al req.cookies y va a sacar token de ahi


//esto lo hago para identificar al usuario
passport.use(
  "jwt",
  new JWTStrategy(
    {
      /* jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), */
      jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
      secretOrKey: "secretJWT",
    },
    async function (jwt_payload, done) {
      done(null, jwt_payload);
    }
  )
);




passport.serializeUser((user, done) => {
  // _id
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await uManager.findUserByID(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});