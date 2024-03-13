import { Router } from "express";
import {  findUserById, findUserByEmail, createUser, roleSwapper, saveUserDocuments, getAllUsers, deleteInactiveUsers, deleteUser} from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.middleware.js";


const router = Router();


router.get("/", getAllUsers);


router.get("/:idUser", findUserById);


router.post("/", async (req, res) => {
  const user = req.body
  const createdUser = await createUser(user)
  res.json({ createdUser })
})


router.delete("/", authMiddleware(["ADMIN"]), deleteInactiveUsers);


router.delete("/:idUser", authMiddleware(["ADMIN"]), deleteUser);


router.post("/:id/documents",
  upload.fields([
    { name: "dni", maxCount: 1 },
    { name: "address", maxCount: 1 },
    { name: "bank", maxCount: 1 },
  ]),
  saveUserDocuments
);


router.put('/premium/:uid', authMiddleware(["ADMIN"]), roleSwapper)


export default router;