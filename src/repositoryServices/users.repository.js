import { uManager } from "../DAL/dao/users.dao.js";
import { cManager } from "../DAL/dao/carts.dao.js";
import UsersRequestDto from "../DAL/dtos/users-request.dto.js";
import UsersResponseDto from "../DAL/dtos/users-response.dto.js";
import { hashData } from "../utils/utils.js";

export default class UsersRepository {
    
    async findAll() {
      const allUsers = uManager.findAllInDao();      
      return allUsers
    }

    async findManyUsers(query) {
      const manyUsers = uManager.findMany(query);      
      return manyUsers
    }

    async deleteManyUsers(query) {
      const manyUsers = uManager.deleteMany(query);      
      return manyUsers
    }
  
    async findById(id) {
        const user = uManager.findUserByID(id);        
        return user;
    }

    async findByEmail(id) {
        const user = uManager.findUserByEmail(id);
        const userDTO = new UsersResponseDto(user);
        return userDTO;
    }

    async createOne(user) {
      const hashPassword = await hashData(user.password);
      const createdCart = await cManager.createCart()
      const userDto = new UsersRequestDto(
        { ...user, 
          cart: createdCart._id,
          password: hashPassword });
      
      const createdUser = await uManager.createUser(userDto);
      return createdUser;
    }    
    
    async updateUser (id, obj) {
      const result = await uManager.updateUser(id, obj);
      return result
    }

    
    async deleteOld() {
      const allUsers = uManager.deleteAllInDao();      
      return allUsers
    }


    async deleteUser(id){
      const result = await uManager.deleteU(id);
      return result
    }


    async saveUserDocumentsService ({ id, dni, address, bank }) {
      const savedDocuments = await uManager.updateUser(id, {
        documents: [
          ...dni?[{
              name: "dni",
              reference: dni[0].path,
          }]:[],
          ...address?[{
              name: "address",
              reference: address[0].path,
          }]:[],
          ...bank?[{
              name: "bank",
              reference: bank[0].path,
          }]:[],
        ],
      });
      return savedDocuments;
    }


}