const express = require("express")
const mongodb = require('mongodb')
const bcrypt = require('bcryptjs')
// const client = require('./db')


const app = express()
const port = process.env.PORT
const MongoClient = mongodb.MongoClient
const MongoURL = process.env.MONGODB_URL
const options = { useNewUrlParser : true, useUnifiedTopology : true}
const database = "buu"
const collection = "users"

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

    const client = await require('./db')
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


app.listen(port, () => {
    console.log(`API start at port ${port}`)
})