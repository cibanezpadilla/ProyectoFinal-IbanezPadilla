import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://cibanez:JUiXF4gBSbSulLkt@cluster0.21urnbo.mongodb.net/ecommerce?retryWrites=true&w=majority')
.then(()=>console.log("conectado a db"))
.catch(error=>console.log(error))