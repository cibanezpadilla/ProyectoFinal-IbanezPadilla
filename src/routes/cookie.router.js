import { Router } from "express";
import { logger } from "../utils/logger.js";

const router = Router();

//cookie
// router.post("/", (req, res) => {
//   const { email } = req.body;
//   res.cookie("user", email, { maxAge: 10000 }).send("Cookie created");
// });

//session
router.post("/", (req, res) => {
  const { name, email } = req.body;
  req.session.name = name;
  req.session.email = email;
  res.send("session");
});

router.get("/view", (req, res) => {
  logger.debug(req);
  res.send("View cookie");
});
export default router;