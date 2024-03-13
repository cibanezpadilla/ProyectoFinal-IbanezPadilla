import { usersModel } from "../models/users.model.js"

class UsersManager  {

    async findAllInDao() {
        const allUsersinDao = await usersModel.find();
        return allUsersinDao
    }

    async findMany(query) {
        const users = await usersModel.find(query);
        return users.map(user => user.toObject());
    }

    async deleteMany(query) {
        const result = await usersModel.deleteMany(query);
        return result
    }    

    async findUserByID(id) {
        const result = await usersModel.findById(id)
        return result
    }

    async findUserByEmail(email){
        const result = await usersModel.findOne({ email })
        return result
    }

    async createUser(obj){
        const result = await usersModel.create(obj)
        return result
    }

    async findUserByCart(cart){        
        return await usersModel.findOne({cart})                                       
    }

    async updateUser (id, update) {        
        const result = await usersModel.updateOne( { _id: id } , update)
        return result;        
    }

    async deleteU(id) {
        const result = await usersModel.deleteOne({ _id: id })
        return result
    }

    async findUserByRole(role) {
        const result = await usersModel.findOne({role})
        return result
    }
}

export const uManager = new UsersManager()