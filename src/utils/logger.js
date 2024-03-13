import winston from "winston"
import config from "../config/config.js"


const customLevels = {
    levels: {
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5
    },
    colors: {
      fatal: "red",
      error: "magenta",
      warning: "yellow",
      info: "green",
      http: "blue",
      debug: "cyan"
    },
  };


export let logger;



if (config.environment === "production") {
  logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
              winston.format.colorize({ colors: customLevels.colors }),
              winston.format.simple()
            ),
          }),
      new winston.transports.File({ //aca me va a guardar en archivo estos otros logs
        level: "error", 
        filename: "errors.log",
        format: winston.format.combine(
            winston.format.timestamp(),  //aca me pone fecha y hora
            winston.format.prettyPrint() //y aca cambia la estructura el mensaje del archivo
        )
    })
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevels.colors }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({ //aca me va a guardar en archivo estos otros logs
        level: "error", 
        filename: "errors.log",
        format: winston.format.combine(
            winston.format.timestamp(),  //aca me pone fecha y hora
            winston.format.prettyPrint() //y aca cambia la estructura el mensaje del archivo
        )
    })
    ],
  });
}