const express = require("express")
const bcrypt = require("bcryptjs")
// const client = require('./db')


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
        res.status(401).json({error:`your given email has not been found`})
        return
    }
    
    let passwordisValid = await bcrypt.compare(password, user.password)
    if(!passwordisValid){
        res.status(401).json({error:`username/password is not match`})
        return
    }

    res.status(200).json({token: '123'})
})

app.listen(port, () => {
    console.log(`API start at port ${port}`)
})