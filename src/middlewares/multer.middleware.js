import multer from "multer";
import { __dirname } from "../utils/utils.js";
const storage = multer.diskStorage({ //DEFINO DESTINATION(DONDE VA A GUARDAR LOS ARCHIVOS), Y FILENAME (BAJO QUE NOMBRE GUARDARA)
  destination: function (req, file, cb) {
    if (file.fieldname === "profiles") {  //CON LA PROPIEDAD FIELDNAME YO PUEDO RECUPERAR SI ES DNI, ADRESS, BANK, PROFIL4E, PORQUE COINCIDE CON EL NAME DEL CAMPO DEL INPUT
      return cb(null, `${__dirname}/docs/profiles`);
    } else if (file.fieldname === "products") {
      return cb(null, `${__dirname}/docs/products`);
    } else {
      return cb(null, `${__dirname}/docs/documents`);
    }
  },
  filename: function (req, file, cb) {  //ESTA ES LA FUNCION PARADEFINIR COMO SE VA A LLAMAR EL ARCHIVO
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    //cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export default upload;