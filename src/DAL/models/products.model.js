import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true, 
    unique: true,   
  },
  stock: {
    type: Number,
    required: true,    
  },
  category: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId, 
    ref: "Users"     
  }
});

productsSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model("Products", productsSchema);