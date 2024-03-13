import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({  
  products: { 
    type: [
      {      
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number  
        },
        _id: false     
      }
    ],
    default: []
  }
});

export const cartsModel = mongoose.model("Carts", cartsSchema);

