import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({  
  /* first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  }, */
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart:{     
      type: mongoose.SchemaTypes.ObjectId, 
      ref: "Carts",    
  },  
  role: {
    type: String,
    enum: ["ADMIN", "USER", "PREMIUM"],
    default: "USER"
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
  last_connection:{
    type: Date,
  }
});

export const usersModel = mongoose.model("Users", usersSchema);