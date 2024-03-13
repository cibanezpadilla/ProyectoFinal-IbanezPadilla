
import { manager } from "../DAL/dao/products.dao.js";
import { cManager } from "../DAL/dao/carts.dao.js"
import { uManager } from "../DAL/dao/users.dao.js";

import UsersRepository from "./users.repository.js";
import ProductsRepository from "./products.repository.js";
import CartsRepository from "./carts.repository.js";


export const usersService = new UsersRepository(uManager);
export const productsService = new ProductsRepository(manager);
export const cartsService = new CartsRepository(cManager);
