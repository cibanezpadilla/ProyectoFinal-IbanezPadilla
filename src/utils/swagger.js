import swaggerJSDoc from "swagger-jsdoc";
import {__dirname} from "../utils/utils.js"

const swaggerOptions = { 
    definition: {
        openapi : "3.0.0",
        info: {
            title: "Divinorum API documentation",
            version: "1.0.0",
            description:"Documentation"
        },
    },
    apis: [`${__dirname}/docs/*.yaml`], 
}

export const swaggerSetup = swaggerJSDoc(swaggerOptions)