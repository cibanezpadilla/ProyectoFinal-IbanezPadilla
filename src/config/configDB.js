import mongoose from "mongoose";
import config from "./config.js"
import {logger} from "../utils/logger.js"
const URI = config.mongo_uri


mongoose
  .connect(URI)
  .then(() => logger.info("Conectado a la DB"))
  .catch((error) => logger.error(error));