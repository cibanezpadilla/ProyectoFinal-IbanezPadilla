import {manager} from '../src/DAL/dao/products.dao.js'
import {expect} from 'chai' //importo el validador
import mongoose from 'mongoose'
import "./db.js"


describe("Create product", function() {    
    const prodMock0= { 
        title: 'Your first product',
        description: 'Welcome to your first product',    
        price: '2',     
        thumbnail: 'www.thefirst.com',
        code: 'abc1',
        stock: 5,
        category: 'dresses'
    }
    after(async function() {
        await mongoose.connection.collection('products').deleteOne({code: prodMock0.code})
    })      
    
    it('should return null', async function() { //cada una de estos it es una prueba individual        
        const result = await manager.createOne(prodMock0)        
        /* console.log('result', result) */
        expect(result).to.be.an("object")
        expect(result).to.include.property('_id');        
    })
})



describe("Find all products", function() {  
    const prodMock1= { 
        title: 'TheProduct',
        description: 'The most beautiful product you´ve ever seen',    
        price: '5000',     
        thumbnail: 'www.thepic.com',
        code: 'abc60',
        stock: 20,
        category: 'tops'
    } 
    const prodMock2= { 
        title: 'TheOtherProduct',
        description: 'Another beautiful product of Divinorum Shop',    
        price: '7000',     
        thumbnail: 'www.theotherpic.com',
        code: 'abc70',
        stock: 10,
        category: 'skirts'
    }
    before(async function() {
        await manager.createOne(prodMock1)
        await manager.createOne(prodMock2)
    })
    after(async function() {
        await mongoose.connection.collection('products').deleteOne({code: prodMock1.code})
        await mongoose.connection.collection('products').deleteOne({code: prodMock2.code})
    })  
    it('should return an array', async function() { //cada una de estos it es una prueba individual
        const result = await manager.findAll({limit: 1}) //hasta aca todo normal, lo que veniamos haciendo en el dao        
        expect(result.payload).to.be.an("array") //y esto es la validacion de mi prueba
        expect(result.payload).to.have.lengthOf(1)         
    })
    it('should include page, limit, order, query', async function() {
        const result = await manager.findAll({})
        expect(result).to.include.keys('page', 'limit', 'order');
    })
    it('should show the right page', async function() {
        const result = await manager.findAll({page:1})
        expect(result.page).to.be.be.equal(1)  
    })
    it('should show the right price order', async function() {
        const result = await manager.findAll({order: "asc"})
        /* console.log("result ====>", result) */
        expect(result.order).to.be.be.equal("asc")
        for (let i = 0; i < result.payload.length - 1; i++) {
            expect(result.payload[i].price).to.be.at.most(result.payload[i + 1].price); 
        } 
    })
    it('should show the right category', async function() {
        const selectedCategory = "tops"
        const result = await manager.findAll({category: selectedCategory})
        /* console.log("result ====>", result)   */      
        for (let i = 0; i < result.payload.length - 1; i++) {
            expect(result.payload[i].category).to.be.equal(selectedCategory); 
        } 
    })    
})



describe("Find product by Id", function() {    
    const prodMock3= { 
        title: 'TheSearchedProduct',
        description: 'The amazing product you are looking for',    
        price: '4000',     
        thumbnail: 'www.thesearchedpic.com',
        code: 'abc490',
        stock: 5,
        category: 'pants'
    }
    after(async function() {
        await mongoose.connection.collection('products').deleteOne({code: prodMock3.code})        
    })       
    
    it('should return the product', async function() { //cada una de estos it es una prueba individual        
        const productCreated = await manager.createOne(prodMock3)
        const result = await manager.findById(productCreated._id)
        /* console.log('result findById',result) */
        expect(result).to.be.an("object") 
        expect(result).to.include.property('code');      
    })
})




describe("Delete product by Id", function() {    
    const prodMock4= { 
        title: 'ProductToDelete',
        description: 'The product you want to delete',    
        price: '1000',     
        thumbnail: 'www.thedeleted.com',
        code: 'abc500',
        stock: 12,
        category: 'tshirts'
    }
    after(async function() {
        await mongoose.connection.collection('products').deleteOne({code: prodMock4.code})        
    })       
    
    it('should return null', async function() { //cada una de estos it es una prueba individual        
        const productCreated = await manager.createOne(prodMock4)
        const result = await manager.deleteOne({_id: productCreated._id})
        /* console.log('result deleted',result) */
        expect(result).to.be.an("object") 
        expect(result.deletedCount).to.be.equal(1); 
        const find = await manager.findById(productCreated._id)
        expect(find).to.be.null
    })
})




describe("Update product", function() {    
    const original= { 
        title: 'Your original product',
        description: 'Your first product',    
        price: '2',     
        thumbnail: 'www.original.com',
        code: 'abc1',
        stock: 5,
        category: 'dresses'
    }
    const updated= { 
        title: 'Your updated product',
        description: 'Welcome to your updated product',    
        price: '8000',     
        thumbnail: 'www.updated.com',
        code: 'abc1',
        stock: 27,
        category: 'dresses'
    }
    after(async function() {
        await mongoose.connection.collection('products').deleteOne({code: updated.code})
    })       
    
    it('should update the product', async function() { //cada una de estos it es una prueba individual        
        const result = await manager.createOne(original)
        const updating = await manager.updateOne({ _id: result._id }, updated)        
        /* console.log('updating', updating) */
        expect(updating).to.be.an("object")
        expect(updating.modifiedCount).to.be.equal(1);          
    })
})