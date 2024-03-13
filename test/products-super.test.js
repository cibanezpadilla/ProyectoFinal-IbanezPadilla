import supertest from "supertest" 
import {expect} from "chai" 
import mongoose from 'mongoose'
const requester = supertest("http://localhost:8080")

describe("Test Products Router", function() {
    const roleUser = {
        first_name: "Juan",
        last_name:"Martinex",
        age: 19,
        email: "jhoyos@gmail.com",
        password: "12345",
        role: "USER"
    } 
    const rolePremium = {
        first_name: "Marce",
        last_name:"MarcePagaPremium",
        age: 28,
        email: "marcesepusocheto@gmail.com",
        password: "12345",
        role: "PREMIUM"
    } 
    const rolePremium2 = {
        first_name: "Tito",
        last_name:"TitoPagaPremium",
        age: 9,
        email: "titosepusocheto@gmail.com",
        password: "12345",
        role: "PREMIUM"
    }

    const roleAdmin = {
        first_name: "LunitaEsAdmin",
        last_name:"LaPropiaAdmin",
        age: 30,
        email: "quebienmesientosiendoadmin@gmail.com",
        password: "12345",
        role: "ADMIN"
    }
    const userLogin = {
        email: "jhoyos@gmail.com",
        password: "12345"
    }
    const premiumLogin = {
        email: "marcesepusocheto@gmail.com",
        password: "12345"
    }
    const premium2Login = {
        email: "titosepusocheto@gmail.com",
        password: "12345"
    }
    const adminLogin = {
        email: "quebienmesientosiendoadmin@gmail.com",
        password: "12345"
    }

    const productByUser = {
        title: 'Product by User',
        description: 'Welcome to your first product',    
        price: '2',     
        thumbnail: 'www.thefirst.com',
        code: 'abc10',
        stock: 5,
        category: 'dresses'
    }

    const productByPremium = {
        title: 'Product by Premium',
        description: 'Welcome to your first product',    
        price: '2',     
        thumbnail: 'www.thefirst.com',
        code: 'abc11',
        stock: 5,
        category: 'dresses'
    }

    let cookie; 
    let responseCreatedP
    let premium1signedup
    let premium2signedup
    let adminSignedUp

    before(async function () {
        await mongoose.connect('mongodb+srv://cibanez:JUiXF4gBSbSulLkt@cluster0.21urnbo.mongodb.net/ecommerce?retryWrites=true&w=majority')             
        await mongoose.connection.collection('users').deleteOne({email: roleUser.email})
        await mongoose.connection.collection('users').deleteOne({email: rolePremium.email})
        await mongoose.connection.collection('products').deleteOne({code: productByUser.code})
        await mongoose.connection.collection('products').deleteOne({code: productByPremium.code})            
    }) 

    describe("POST, '/api/products'", ()=> {  
        /* before(async function () {
            await mongoose.connect('mongodb+srv://cibanez:JUiXF4gBSbSulLkt@cluster0.21urnbo.mongodb.net/ecommerce?retryWrites=true&w=majority')             
            await mongoose.connection.collection('users').deleteOne({email: roleUser.email})
            await mongoose.connection.collection('users').deleteOne({email: rolePremium.email})
            await mongoose.connection.collection('products').deleteOne({code: productByUser.code})
            await mongoose.connection.collection('products').deleteOne({code: productByPremium.code})            
        })  */ 
          
        it('should create a product', async ()=>{
            premium1signedup = await requester.post('/api/sessions/signup').send(rolePremium)                 
            const login = await requester.post('/api/sessions/login').send(premiumLogin)            
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }                     
            responseCreatedP = await requester
                .post('/api/products')
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(productByPremium)            
            expect(responseCreatedP.statusCode).to.be.equal(200)
            expect(responseCreatedP._body.product).to.have.property('owner')
            /* console.log(responseCreatedP._body.product) */ //ACA PARA VER LAS PROP DEL PRODUCT CREADO
        })  

        it('should not create a product because its role user', async ()=>{
            await requester.post('/api/sessions/signup').send(roleUser)        
            const login = await requester.post('/api/sessions/login').send(userLogin)            
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }            
            const responseUserP = await requester
                .post('/api/products')
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(productByUser)
            /* console.log('responseUserP', responseUserP) */
            expect(responseUserP.statusCode).to.be.equal(403)
        })
        
    })


    describe("GET, '/api/products'", ()=> {          
        it('should get all products', async ()=>{                         
            const response = await requester.get('/api/products')
            /* console.log(response._body.prods) */ 
            expect(response._body.prods).to.have.all.keys('info', 'page', 'payload', 'limit', 'order', 'query')
            expect(response._body.prods.payload).to.be.an('array') 
            expect(response._body.prods.info).to.have.property('count')
            expect(response._body.prods.info).to.have.property('totalPages')
            expect(response.statusCode).to.be.equal(200)
        })
        it('should show the accurate number of products defined by the limit query', async ()=>{ 
            const numLimit = 10                        
            const response = await requester
                .get('/api/products')
                .query({limit: numLimit, page: 2})
            // console.log(response._body.prods)  
            expect(response._body.prods.payload).to.have.lengthOf(numLimit)
        })        
    })


    describe("GET, '/api/products/:id'", ()=> {          
        it('should get the selected product', async ()=>{  
            const productId = responseCreatedP._body.product._id                        
            const response = await requester.get('/api/products/' + productId)
            /* console.log(response._body)   */          
            expect(response._body.prod).to.be.an('object') 
            expect(response.statusCode).to.be.equal(200)
            expect(response._body.prod).to.have.property('owner')
        })               
    })


    describe("PUT, '/api/products/:id'", ()=> {
        const updateObject = {
            title: 'My updated Product',
            description: 'Totally updated',    
            price: '666',     
            thumbnail: 'www.theupdateishere.com',
            code: 'abc11',
            stock: 5,
            category: 'dresses'
        }
        
        it('should update a product', async ()=>{
            adminSignedUp = await requester.post('/api/sessions/signup').send(roleAdmin)                 
            const login = await requester.post('/api/sessions/login').send(adminLogin)            
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productId = responseCreatedP._body.product._id                        
            const updated = await requester
                .put('/api/products/' + productId)
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(updateObject)            
            /* console.log('updated ===>', updated) */           
            expect(updated.statusCode).to.be.equal(200)             
        })  

        it('should not update a product because its role user', async ()=>{
            await requester.post('/api/sessions/signup').send(roleUser)                 
            const login = await requester.post('/api/sessions/login').send(userLogin)            
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productId = responseCreatedP._body.product._id                        
            const updated = await requester
                .put('/api/products/' + productId)
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(updateObject)            
            /* console.log('updated ===>', updated) */           
            expect(updated.statusCode).to.be.equal(403)            
        })             
    })



    describe("DELETE, '/api/products/:id'", ()=> {
        const anotherCreatedP = {
            title: 'another Created Product',
            description: 'Product to be deleted by Owner',    
            price: '2',     
            thumbnail: 'www.thefirst.com',
            code: 'abc25000',
            stock: 5,
            category: 'dresses'
        }
        
        it('a premium user should delete a product that he/she owns', async ()=>{
            /* await requester.post('/api/sessions/signup').send(rolePremium)  */                
            const login = await requester.post('/api/sessions/login').send(premiumLogin) //se logea Marce
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productByPremium = await requester 
                .post('/api/products') //Marce crea un nuevo producto
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])
                .send(anotherCreatedP)
            const productId = productByPremium._body.product._id                        
            const deleted = await requester
                .delete('/api/products/' + productId) //Marce borra ese nuevo producto suyo
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])                         
            /* console.log('deleted ===>', deleted._body) */           
            expect(deleted.statusCode).to.be.equal(200) // Eliminacion exitosa
            expect(deleted._body.message).to.be.equal('Product deleted')

            const searchProduct = await requester.get('/api/products/' + productId) //busco por _id el producto eliminado          
            expect(searchProduct.statusCode).to.be.equal(404) //corroboro que el producto no existe mas
        })  

        it('a premium user should not delete a product that he/she doesnt own', async ()=>{
            premium2signedup = await requester.post('/api/sessions/signup').send(rolePremium2) //se registra Tito
            const login = await requester.post('/api/sessions/login').send(premium2Login) //se logea Tito
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productId = responseCreatedP._body.product._id //Busco el _id del producto original de Marce
            console.log(responseCreatedP._body.product)                       
            const deleted = await requester
                .delete('/api/products/' + productId) //Tito intenta borrar el viejo producto de Marce
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])            
            /* console.log('deleted ===>', deleted) */
            expect(deleted.statusCode).to.be.equal(403) //corroboro que no lo puede borrar
        })
        
        it('an admin user should delete any product', async ()=>{
            /* await requester.post('/api/sessions/signup').send(roleAdmin)      */            
            const login = await requester.post('/api/sessions/login').send(adminLogin) //se logea Lunita Admin
            cookie = {
                name:login.headers['set-cookie'][0].split("=")[0],
                value: login.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            const productId = responseCreatedP._body.product._id//Lunita intenta borrar el viejo producto de Marce               
            const deleted = await requester
                .delete('/api/products/' + productId)
                .set('Cookie', [`${cookie.name} = ${cookie.value}`])                         
            /* console.log('deleted ===>', deleted) */           
            expect(deleted.statusCode).to.be.equal(200)
            
            const searchProduct = await requester.get('/api/products/' + productId) //busco por _id el producto eliminado          
            expect(searchProduct.statusCode).to.be.equal(404) //corroboro que el producto no existe mas            
        })
    })

    

   
})






//guardo lo de antes por las dudas
/* describe("Test Products Router", function() {
    const userRegisterMock = {
        first_name: "Juan",
        first_name:"Hoyos",
        email: "jhoyos@gmail.com",
        password: "12345"
        } //acá creo un usuario
    const userLoginMock = {
        email: "jhoyos@gmail.com",
        password: "12345"
        }
    let cookie; //declaro la variable cookie sin mas nada

    describe("POST', '/api/sessions/login'", ()=> {         
        it('should return a cookie with token', async ()=>{            
            const response = await requester.post('/api/sessions/login').send(userLoginMock)     
            console.log(response) //esto lo hago para ver qué tiene dentro response y donde esta guardada la cookie
            //está guardada en headers, en la propiedad set-cookie pero viene con todo un script y vamos a tener
            //que separarlo: (ya declare let cookie afuera de este describe para despues usarlo en el de current)
            console.log(response.headers['set-cookie'][0].split("=")[1].split(";")[0]) //esto lo hago para quedarme con la posicion 0 del array y separar el elemento cuando haya un signo = y quedarme con la posicion 1, y luego separo por ; y me quedo con la 0, por ejemplo asi para el token 
            cookie = {
                name:response.headers['set-cookie'][0].split("=")[0],
                value: response.headers['set-cookie'][0].split("=")[1].split(";")[0]
            }
            expect(response._body.statusCode).to.be.be.equal(200) //este lo dejo, para ver que sea exitoso
            expect(cookie.name).to.be.be.equal('coderCookie') //este mira el nombre de la cookie que yo habia definido en el sessions controller en el login
    })
})
    before(async function(){
        const response = await requester.post("/api/user/login").send(user)
        const cookie = response.headers["set-cookie"][0]
        cookieData = {
            name: cookie.split("=")[0],
            calue: cookie.split("=")[1].split(";")[9]
        }
    })
}) */