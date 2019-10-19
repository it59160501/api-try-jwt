const express = require("express")
const bcrypt = require("bcryptjs")
const mongodb = require('mongodb')
const auth = require("./auth")

const app = express()
const port = process.env.PORT
const database = "buu"
const collection = "users"
const connectDb = "./db"

app.use(express.json())

app.post('/register', async (req, res)=>{
    let name = req.body.name
    let email = req.body.email
    let studentId = req.body.studentId
    let encryptedPwd = await bcrypt.hash(req.body.password, 8)

    const o = {
        name:name,
        email:email,
        studentId:studentId,
        password:encryptedPwd
    }

    const client = await require(connectDb)
    // const client = await MongoClient.connect( MongoURL, options ).catch((err) => {
    //     console.log(`Cannot connect to Mongo  ${err}`)
    //     res.status(500).json({error:err})
    //     return
    // })

    let db = client.db(database)
    let result = await db.collection(collection).insertOne(o).catch(err => {
        console.log(`Cannot insert data to users collection : ${err}`)
        res.status(500).json({error:err})
        return
    })
    
    let r = {
        _id:o._id, 
        name:o.name, 
        email:o.email, 
        studentId:o.studentId
    }
    res.status(201).json(r)
})

app.post('/sign-in', async (req, res)=>{
    let email = req.body.email
    let password = req.body.password

    const client = await require(connectDb)

    let db = client.db(database)
    let user = await db.collection(collection).findOne( { email:email } ).catch(err => {
        console.log(`Cannot find user with email : ${err}`)
        res.status(500).send({error:err})
        return
    })

    if(!user){
        res.status(401).json({error:`Your given email has not been found`})
        return
    }
    
    let passwordisValid = await bcrypt.compare(password, user.password)
    if(!passwordisValid){
        res.status(401).json({error:`Username/Password is not match`})
        return
    }
    //payload
    let token = await jwt.sign({email:user.email, id: user._id},jwtKey)

    res.status(200).json({token: token})
})

app.get('/me', auth, async (req,res)=>{
    // let token = req.header('Authorization')
    // let decoded

    // try{
    //     decoded = await jwt.verify(token, jwtKey)
    // }catch(err){
    //     console.log(`Invalid token : ${err}`)
    //     res.status(401).send({error:err})
    //     return
    // }

    let decoded = req.decoded
    const client = await require(connectDb)
    let db = client.db(database)
    let user = await db.collection(collection).findOne({ _id:mongodb.ObjectID(decoded.id)}).catch(err => {
        console.log(`Cannot get user by id in /me : ${err}`)
        res.status(500).send({error:err})
        return
    })

    if(!user){
        res.status(401).json({error:`User was not found`})
        return
    }

    delete user.password

    res.json(user)
})

app.listen(port, () => {
    console.log(`API start at port ${port}`)
})